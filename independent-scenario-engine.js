/* Boş Dükkân — independent 10-second comedy scenario engine.
   Free live research sources: Wikipedia API + Europe PMC; gracefully degrades if unavailable.
   The static page collects evidence and packages the task; a language model still writes the scenario. */
(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const CACHE_KEY = "bd_live_comedy_research_v1";
  const RESEARCH_QUERIES = [
    "silent film comedians physical comedy",
    "women comedians silent film history",
    "Indian film comedians physical comedy",
    "Japanese physical comedy comedians",
    "Latin American film comedy performers",
    "African comedy film comedians"
  ];
  const PAPER_QUERIES = [
    'TITLE_ABS:(humor OR humour) AND TITLE_ABS:(psychology OR theory)',
    'TITLE_ABS:"benign violation" AND OPEN_ACCESS:Y',
    'TITLE_ABS:(visual comedy OR slapstick) AND OPEN_ACCESS:Y'
  ];

  function clean(value, max) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, max || 500);
  }
  function uniqueBy(items, keyFn) {
    const seen = new Set();
    return items.filter(item => {
      const k = clean(keyFn(item), 300).toLowerCase();
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }
  async function fetchJSON(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs || 8000);
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }
  async function wikiSearch(query) {
    const url = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=5&srsearch=" + encodeURIComponent(query);
    const json = await fetchJSON(url, 7000);
    return (json.query && json.query.search || []).map(item => ({
      title: clean(item.title, 180),
      snippet: clean(String(item.snippet || "").replace(/<[^>]*>/g, " "), 260),
      url: "https://en.wikipedia.org/wiki/" + encodeURIComponent(String(item.title || "").replace(/ /g, "_"))
    }));
  }
  async function wikiSummary(title) {
    const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title.replace(/ /g, "_"));
    const json = await fetchJSON(url, 6500);
    return {
      title: clean(json.title || title, 180),
      summary: clean(json.extract, 360),
      url: json.content_urls && json.content_urls.desktop && json.content_urls.desktop.page ||
        "https://en.wikipedia.org/wiki/" + encodeURIComponent(title.replace(/ /g, "_"))
    };
  }
  async function searchWorldComedy() {
    const results = await Promise.allSettled(RESEARCH_QUERIES.map(wikiSearch));
    const leads = [];
    const failedQueries = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        result.value.forEach(item => leads.push(Object.assign({ query: RESEARCH_QUERIES[index] }, item)));
      } else {
        failedQueries.push(RESEARCH_QUERIES[index] + " (" + clean(result.reason && result.reason.message || result.reason, 100) + ")");
      }
    });
    const uniqueLeads = uniqueBy(leads, item => item.title).slice(0, 15);
    const known = new Set();
    const baseline = window.BosDukkanComedyLearning;
    if (baseline && typeof baseline.loadResearchBundle === "function") {
      try {
        const bundle = await baseline.loadResearchBundle();
        (bundle.masters && bundle.masters.ok || []).forEach(item => known.add(clean(item.title, 180).toLowerCase()));
      } catch (_) {}
    }
    const newLeads = uniqueLeads.filter(item => !known.has(item.title.toLowerCase()));
    const summaries = await Promise.allSettled(newLeads.slice(0, 6).map(item => wikiSummary(item.title)));
    const discoveries = [];
    summaries.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.summary) discoveries.push(result.value);
      else if (newLeads[index]) discoveries.push({
        title: newLeads[index].title,
        summary: newLeads[index].snippet || "Arama sonucu bulundu; makale özeti alınamadı.",
        url: newLeads[index].url,
        evidenceType: "Wikipedia arama sonucu; derin inceleme doğrulanmadı"
      });
    });
    return { leads: uniqueLeads, discoveries, failedQueries };
  }
  async function searchEuropePMC(query) {
    const url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&pageSize=5&resultType=core&query=" + encodeURIComponent(query);
    const json = await fetchJSON(url, 8000);
    const results = json.resultList && json.resultList.result || [];
    return results.map(item => {
      const doi = clean(item.doi, 180);
      const pmcid = clean(item.pmcid, 80);
      const pmid = clean(item.pmid, 80);
      let sourceUrl = doi ? "https://doi.org/" + doi : "";
      if (pmcid) sourceUrl = "https://europepmc.org/articles/" + pmcid;
      else if (!sourceUrl && pmid) sourceUrl = "https://europepmc.org/article/MED/" + pmid;
      return {
        title: clean(item.title, 240),
        authors: clean(item.authorString, 180),
        year: clean(item.firstPublicationDate || item.pubYear, 20),
        journal: clean(item.journalTitle, 120),
        abstract: clean(item.abstractText, 850),
        url: sourceUrl || "https://europepmc.org/search?query=" + encodeURIComponent(item.title || query),
        openAccess: item.isOpenAccess === "Y",
        pmid: pmid || null,
        pmcid: pmcid || null,
        evidenceType: item.abstractText ? "Europe PMC metadata + abstract returned by API" : "Europe PMC publication metadata; abstract unavailable"
      };
    }).filter(item => item.title);
  }
  async function searchCrossref(query) {
    const params = new URLSearchParams({
      "query.bibliographic": query,
      rows: "4",
      select: "DOI,title,author,published,URL,container-title,abstract,type"
    });
    const json = await fetchJSON("https://api.crossref.org/works?" + params.toString(), 8000);
    return (json.message && json.message.items || []).map(item => ({
      title: clean((item.title || [])[0], 240),
      authors: clean((item.author || []).slice(0, 3).map(a => [a.given, a.family].filter(Boolean).join(" ")).join(", "), 180),
      year: clean((((item.published || {})["date-parts"] || [])[0] || []).join("-"), 20),
      journal: clean((item["container-title"] || [])[0], 120),
      abstract: clean(String(item.abstract || "").replace(/<[^>]*>/g, " "), 600),
      url: item.DOI ? "https://doi.org/" + item.DOI : item.URL || "",
      evidenceType: "Crossref publication metadata; abstract may be absent"
    })).filter(item => item.title);
  }
  async function searchAcademicEvidence() {
    const results = await Promise.allSettled(PAPER_QUERIES.map(searchEuropePMC));
    let papers = [];
    const failedQueries = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") papers.push.apply(papers, result.value.map(item => Object.assign({ query: PAPER_QUERIES[index] }, item)));
      else failedQueries.push(PAPER_QUERIES[index] + " (" + clean(result.reason && result.reason.message || result.reason, 100) + ")");
    });
    papers = uniqueBy(papers, item => item.url || item.title).slice(0, 8);
    if (papers.length < 3) {
      const backups = await Promise.allSettled([
        searchCrossref("humor psychology incongruity theory"),
        searchCrossref("visual comedy physical comedy slapstick")
      ]);
      backups.forEach((result, index) => {
        if (result.status === "fulfilled") papers.push.apply(papers, result.value.map(item => Object.assign({
          query: index === 0 ? "humor psychology incongruity theory" : "visual comedy physical comedy slapstick"
        }, item)));
        else failedQueries.push("Crossref fallback " + (index + 1) + " (" + clean(result.reason && result.reason.message || result.reason, 100) + ")");
      });
      papers = uniqueBy(papers, item => item.url || item.title).slice(0, 8);
    }
    return { papers, failedQueries };
  }
  function getCachedResearch() {
    try {
      const value = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      return value && typeof value === "object" ? value : null;
    } catch (_) { return null; }
  }
  function saveResearch(value) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(value)); } catch (_) {}
  }
  function getLearningBundle() {
    const api = window.BosDukkanComedyLearning;
    if (api && typeof api.loadResearchBundle === "function") return api.loadResearchBundle();
    return Promise.resolve({
      masters: { ok: [], failed: ["comedy-learning.js did not expose its research bundle"] },
      psych: { ok: [], failed: ["comedy-learning.js did not expose its research bundle"] },
      knowledge: { ok: false, findings: [], topics: [] }
    });
  }
  function shortBundle(bundle) {
    const masters = (bundle.masters && bundle.masters.ok || []).slice(0, 12).map(x => ({
      title: clean(x.title, 120), summary: clean(x.summary, 260), url: x.url || ""
    }));
    const psychology = (bundle.psych && bundle.psych.ok || []).slice(0, 4).map(x => ({
      title: clean(x.title, 120), summary: clean(x.summary, 300), url: x.url || ""
    }));
    const knowledge = bundle.knowledge && bundle.knowledge.findings || [];
    return {
      masters,
      psychology,
      learnedFindings: knowledge.slice(0, 8).map(x => ({
        source: clean(x.source, 150), finding: clean(x.finding, 300), url: x.url || ""
      })),
      failedStaticLookups: (bundle.masters && bundle.masters.failed || []).concat(bundle.psych && bundle.psych.failed || []).slice(0, 18)
    };
  }
  async function performLiveResearch() {
    const status = $("#independentResearchStatus");
    if (status) status.textContent = "Ücretsiz açık kaynaklar aranıyor: farklı ülkelerden komedi ustaları + psikoloji literatürü…";
    const results = await Promise.allSettled([getLearningBundle(), searchWorldComedy(), searchAcademicEvidence()]);
    const bundle = results[0].status === "fulfilled" ? results[0].value : null;
    const world = results[1].status === "fulfilled" ? results[1].value : { discoveries: [], leads: [], failedQueries: ["Wikipedia search failed"] };
    const academic = results[2].status === "fulfilled" ? results[2].value : { papers: [], failedQueries: ["Europe PMC / Crossref search failed"] };
    const payload = {
      fetchedAt: new Date().toISOString(),
      sourceMethod: "Browser-fetched public Wikipedia REST/API and Europe PMC/Crossref APIs; each source below identifies what was actually returned.",
      baseLearning: shortBundle(bundle || { masters: {ok:[],failed:[]}, psych:{ok:[],failed:[]}, knowledge:{findings:[]} }),
      worldDiscoveries: world.discoveries.slice(0, 6),
      worldSearchLeads: world.leads.slice(0, 12).map(x => ({
        title: clean(x.title, 140), snippet: clean(x.snippet, 220), query: clean(x.query, 120), url: x.url
      })),
      academicSources: academic.papers.slice(0, 8),
      failedLookups: (world.failedQueries || []).concat(academic.failedQueries || [])
    };
    saveResearch(payload);
    window.bosLiveComedyResearch = payload;
    renderResearchSources(payload);
    if (status) {
      status.textContent = "Canlı araştırma tamamlandı: " + payload.worldDiscoveries.length +
        " yeni keşif adayı, " + payload.academicSources.length + " akademik yayın kaydı, " +
        payload.baseLearning.masters.length + " temel usta özeti. Başarısız istekler varsa paket içinde açıkça işaretlendi.";
    }
    return payload;
  }
  function renderResearchSources(payload) {
    const target = $("#independentResearchSources");
    if (!target) return;
    target.textContent = "";
    const title = document.createElement("strong");
    title.textContent = "Bu çalıştırmada gerçekten alınan kaynaklar";
    target.appendChild(title);
    const list = document.createElement("ul");
    list.style.cssText = "margin:8px 0;padding-left:18px";
    const items = [];
    (payload.worldDiscoveries || []).forEach(item => items.push({
      title: "Yeni komedi keşfi: " + item.title,
      url: item.url,
      detail: item.summary
    }));
    (payload.academicSources || []).forEach(item => items.push({
      title: "Araştırma: " + item.title,
      url: item.url,
      detail: item.year + (item.journal ? " · " + item.journal : "") + (item.abstract ? " · Özet alındı" : " · Yalnızca künye alındı")
    }));
    if (!items.length) {
      const li = document.createElement("li");
      li.textContent = "Canlı kaynaklara erişilemedi. Pakette başarısız istekler belirtilir; erişilmiş gibi kaynak uydurulmaz.";
      list.appendChild(li);
    } else {
      items.slice(0, 14).forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = item.title;
        li.appendChild(a);
        if (item.detail) {
          const detail = document.createElement("div");
          detail.className = "note";
          detail.textContent = clean(item.detail, 260);
          li.appendChild(detail);
        }
        list.appendChild(li);
      });
    }
    target.appendChild(list);
  }
  function learningNotes() {
    let notes = "";
    try { notes = localStorage.getItem("bd_comedy_research_notes") || ""; } catch (_) {}
    return clean(notes, 5000);
  }
  function ideaHistory() {
    const api = window.BosDukkanComedyLearning;
    let history = [];
    try { history = api && api.readHistory ? api.readHistory() : JSON.parse(localStorage.getItem("bd_topic_history") || "[]"); } catch (_) {}
    return (Array.isArray(history) ? history : []).slice(-20).map(item => ({
      title: clean(item.title, 100), summary: clean(item.summary, 160)
    }));
  }
  function scenarioPrompt(research) {
    const notes = learningNotes();
    const past = ideaHistory();
    const manualAvoid = clean($("#avoidIdeas") && $("#avoidIdeas").value, 2400);
    return [
      "ROLÜN: Bağımsız görsel komedi senaryo yazarı + komedi psikolojisi araştırmacısı + kendi çıktısını sertçe yeniden düşünen yaratıcı yönetmen.",
      "AMAÇ: Her seferinde kendi başına yeni bir konu keşfet ve tek bir güçlü 10 saniyelik ASMR video senaryosu üret. Bu, trend videosu uyarlama aracı değildir.",
      "BAĞIMSIZLIK: Bir YouTube trend videosu, kullanıcının kanal istatistikleri, rakip başlığı, kaynak sahne, popüler nesne, sabit konu ailesi veya önceden tanımlanmış başarı formülü seçmek zorunda değilsin. Bunlardan hiçbiri konu kaynağı değildir. Araştırma verileri yalnızca komedinin nasıl çalıştığını öğrenmek içindir; konuyu kendi yaratıcı yargınla seç.",
      "TEK ZORUNLU FORMAT: Tam 10 saniye; dikey 9:16; diyalog ve konuşma yok; doğal ASMR odaklı ses. Başka tür, konu, oyunculuk, gerçekçilik, kurgu, fizik veya komedi mekanizması filtresi koyma. Gerçekçi, absürt, fiziksel, deadpan, karakter odaklı, nesne odaklı veya başka herhangi bir yaratıcı biçim serbesttir.",
      "ARAŞTIRMA VERİSİNİ GERÇEKTEN KULLAN: Aşağıdaki canlı Wikipedia keşiflerini, psikoloji/komedi sayfası özetlerini ve erişilebilen akademik özetleri incele. Kaynak URL'siyle desteklenmeyen teknik iddiasını doğrulanmış diye sunma. Metadata/künye ile okunan abstract'ı birbirinden ayır. Araştırma başarısızsa bunu açıkça belirt; fikir üretimini durdurma.",
      "ÖĞRENME → YENİ MEKANİZMA: Kaynaklardaki yöntemleri karakter motivasyonu, beklenti, statü, ritim, görsel okunurluk, nesne/ortam kullanımı, sürpriz, absürtlük veya başka bir üretken ilke olarak çıkar. Ustanın karakterini, bilinen sahnesini veya bitişini kopyalama. Tek bir mekanizmaya mahkûm olma; bu ilkeler sadece olası araçlardır.",
      "KENDİ KARARIN: Önce kendi içinde farklı yaratıcı yönleri dene, klişe veya sıradan kalanları at ve en iyi tek sonucu seç. Alternatif fikir listesi kullanıcıya gösterme. Sabit puan eşiği ya da zorunlu checklist yüzünden yeni bir fikri otomatik reddetme.",
      "SONUÇ: Bitmiş, çekilebilir ve tek başına anlaşılır bir senaryo üret. Tam 0–10 saniye akışı, görsel eylemler ve doğal ASMR seslerini yaz. Sonunda doğrudan video üretim aracına yapıştırılacak İngilizce prompt ver. Prompt 10 saniye, 9:16, diyalogsuz ve doğal ASMR ses koşullarını açıkça içersin.",
      "KAYNAK ARAŞTIRMA PAKETİ (bu çalıştırmada alınan; kaynağın durumu ve URL'si korunmalı):",
      JSON.stringify(research, null, 2),
      "ÖNCEKİ ÖĞRENME NOTLARI (varsa; mekanizma öğrenmek içindir, yeni konuyu kısıtlamak için değil):",
      notes || "Henüz kaydedilmiş özel araştırma notu yok.",
      "BU CİHAZDA KAYITLI ESKİ FİKİRLER (yalnızca tekrar etmemeye yardımcı bağlam):",
      JSON.stringify(past),
      "KULLANICININ AÇIKÇA KAÇINILMASINI İSTEDİĞİ FİKİRLER / MEKANİZMALAR (varsa):",
      manualAvoid || "Belirtilmedi.",
      "ÇIKTI SIRASI: (1) Tek fikir başlığı. (2) Neden çalışabileceği — kısa ve somut. (3) Tam 10 saniyelik zaman çizelgesi. (4) Doğrudan kopyalanabilir tam İngilizce video promptu. (5) Kullanılan 2–4 araştırma kaynağı ve her birinden çıkarılan somut teknik; kaynakları gerçekten inceleyemediysen bunu belirt. Fikir başarısı garanti değildir; fikir test edilmemiş yaratıcı hipotezdir."
    ].join("\n\n");
  }
  function studyPrompt(research) {
    return [
      "ROL: Uluslararası komedi tarihçisi + mizah psikolojisi araştırmacısı. GÖREV: Sadece isim listesi değil, yeni öğrenilebilir teknikleri çıkar.",
      "Aşağıdaki canlı kaynak paketini gerçekten kullan. Farklı ülkelerden/dönemlerden daha az tanınan görsel komedi ustalarını yeni kaynaklarla keşfet; önceki bilinen isimleri tekrar ederek alan doldurma. Psikoloji kaynaklarında uyumsuzluk, statü/üstünlük, benign violation ve gerilim-boşalma gibi teorilerin kanıt sınırını incele; tek teori bütün mizahı açıklıyor deme.",
      "Her usta için: ülke/dönem, kaynak, gerçek incelenen materyal türü, komedi mekanizması, karakter motivasyonu/seyirci psikolojisi, 10 saniyelik özgün kurguya aktarılabilecek soyut teknik ve kopyalanmaması gereken özgün ifade/sahne. En sonunda 5–8 uygulanabilir ders ve motorun öğrenme notlarına doğrudan eklenebilecek kısa madde listesi üret.",
      "Erişilmeyen sayfaları okunmuş gibi gösterme. Sadece arama sonucuyla görülen bilgiye derin analiz muamelesi yapma. Kaynak URL'lerini ekle.",
      "CANLI ARAŞTIRMA PAKETİ:\n" + JSON.stringify(research, null, 2),
      "Mevcut özel öğrenme notları:\n" + (learningNotes() || "Yok.")
    ].join("\n\n");
  }
  async function copyOutput(text, area, status, label) {
    area.value = text;
    area.style.display = "block";
    area.focus();
    area.select();
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (_) {
      try { copied = document.execCommand("copy"); } catch (_) {}
    }
    if (status) status.textContent = copied
      ? label + " hazır ve kopyalandı. Aynı ChatGPT sohbetine yapıştırıp gönder."
      : label + " hazır ve seçili. Kopyala ile alıp aynı ChatGPT sohbetine yapıştır.";
  }
  function addResearchEnginePanel() {
    const gen = $("#gen");
    if (!gen || $("#independentScenarioPanel")) return;
    const oldHeading = gen.querySelector("h2");
    if (oldHeading) oldHeading.textContent = "2. Bağımsız 10 saniyelik senaryo motoru";
    const intro = gen.querySelector(":scope > p.note");
    if (intro) intro.textContent = "Bu motor YouTube API anahtarı, trend videosu veya kendi kanal verisini GİRDİ olarak istemez. Ücretsiz açık kaynaklardan komedi araştırması toplar ve tek özgün senaryo için paketi hazırlar.";
    const panel = document.createElement("div");
    panel.className = "msg";
    panel.id = "independentScenarioPanel";
    panel.innerHTML =
      '<h2 style="margin-top:0">Bağımsız senaryo üret</h2>' +
      '<p class="note">1 tıkla ücretsiz canlı kaynakları tara; öğrenilen komedi tekniklerini ve psikoloji araştırmasını tek bir senaryo görevine bağla. Kaynaklar okunamadıysa başarısızlık açıkça belirtilir. Kanal analizine veya trend seçimine gerek yoktur.</p>' +
      '<div class="bar" style="padding:0;border:0;background:transparent"><button type="button" id="createIndependentScenario">Canlı araştır + tek senaryo paketini oluştur ve kopyala</button><button type="button" class="ghost" id="refreshIndependentResearch">Araştırmayı yenile</button></div>' +
      '<p id="independentResearchStatus" class="note" aria-live="polite">Henüz canlı araştırma yapılmadı.</p>' +
      '<div id="independentResearchSources" class="note"></div>' +
      '<textarea id="independentScenarioPrompt" rows="10" readonly style="display:none;width:100%;max-width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink)"></textarea>' +
      '<p class="note">Dürüst sınır: GitHub Pages kendi başına bir dil modeli çalıştırmaz. Bu düğme web kaynaklarını gerçekten getirir ve üretim görevini kopyalar; sen görevi bu ChatGPT sohbetine yapıştırınca senaryoyu dil modeli yazar.</p>';
    const firstBar = gen.querySelector(".bar");
    if (firstBar) gen.insertBefore(panel, firstBar);
    else gen.appendChild(panel);
    const optionalHeading = $("#globalIdeaPanel") && $("#globalIdeaPanel").querySelector("h2");
    if (optionalHeading) optionalHeading.textContent = "İsteğe bağlı: global trend kaynaklı üretim";
    const optionalText = $("#globalIdeaPanel") && $("#globalIdeaPanel").querySelector("p.note");
    if (optionalText) optionalText.textContent = "Bu eski akış, global YouTube örneklemi ve kaynak izi isteyenler içindir. Bağımsız senaryo üretmek için gerekli değildir; yeni motor trend aramasından bağımsız çalışır.";
    const sourceSummary = $("#globalIdeaSourceSummary");
    if (sourceSummary) sourceSummary.textContent = "İsteğe bağlı trend modu: henüz global kaynak seçilmedi.";
    const btn = $("#createIndependentScenario");
    const area = $("#independentScenarioPrompt");
    const status = $("#independentResearchStatus");
    let running = false;
    async function run(makeScenario) {
      if (running) return;
      running = true;
      const mainButton = $("#createIndependentScenario");
      const refreshButton = $("#refreshIndependentResearch");
      if (mainButton) mainButton.disabled = true;
      if (refreshButton) refreshButton.disabled = true;
      try {
        const payload = await performLiveResearch();
        if (makeScenario) {
          await copyOutput(scenarioPrompt(payload), area, status, "Bağımsız senaryo paketi");
        } else if (status) {
          status.textContent = "Araştırma yenilendi. " + (payload.worldDiscoveries.length + payload.academicSources.length) + " yeni kaynak kaydı hazır; senaryo düğmesi aynı araştırmayı kullanabilir.";
        }
      } catch (error) {
        const fallback = getCachedResearch() || {
          fetchedAt: new Date().toISOString(),
          baseLearning: { masters: [], psychology: [], learnedFindings: [] },
          worldDiscoveries: [], worldSearchLeads: [], academicSources: [],
          failedLookups: ["Araştırma çalıştırılamadı: " + clean(error && error.message || error, 250)]
        };
        window.bosLiveComedyResearch = fallback;
        if (makeScenario) await copyOutput(scenarioPrompt(fallback), area, status, "Yedek bağımsız senaryo paketi");
        else if (status) status.textContent = "Bazı canlı kaynaklar açılmadı; mevcut önbellek/yedekle devam edilebilir. " + clean(error && error.message || error, 180);
        renderResearchSources(fallback);
      } finally {
        running = false;
        if (mainButton) { mainButton.disabled = false; mainButton.textContent = "Canlı araştır + tek senaryo paketini oluştur ve kopyala"; }
        if (refreshButton) refreshButton.disabled = false;
      }
    }
    btn.addEventListener("click", () => run(true));
    $("#refreshIndependentResearch").addEventListener("click", () => run(false));
    const existing = getCachedResearch();
    if (existing) {
      window.bosLiveComedyResearch = existing;
      renderResearchSources(existing);
      status.textContent = "Bu cihazda önceki canlı araştırma kaydı var (" + clean(existing.fetchedAt, 40) + "). Yeni senaryo düğmesi çalıştırıldığında kaynaklar tekrar aranır.";
    }
  }
  function addJudgePanel() {
    const own = $("#own");
    if (!own || $("#independentJudgePanel")) return;
    const title = own.querySelector("h2");
    if (title) title.textContent = "3. Acımasız hakem + yayın sonrası ölçüm";
    const panel = document.createElement("div");
    panel.className = "msg";
    panel.id = "independentJudgePanel";
    panel.style.marginBottom = "16px";
    panel.innerHTML =
      '<h2 style="margin-top:0">Acımasız senaryo hakemi</h2>' +
      '<p class="note">Üretilen senaryoyu buraya yapıştır. Hakem şablon puanına bağlanmaz: komik değilse gerekçesini söyler ve yalnızca bir düzeltilmiş nihai sürüm verir. Sadece video formatı sabittir.</p>' +
      '<textarea id="independentJudgeCandidate" rows="7" placeholder="Senaryo veya video promptunu buraya yapıştır..." style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink)"></textarea>' +
      '<div class="bar" style="padding:0;border:0;background:transparent"><button type="button" id="createIndependentJudgePrompt">Hakem görevini oluştur ve kopyala</button></div>' +
      '<p id="independentJudgeStatus" class="note" aria-live="polite"></p>' +
      '<textarea id="independentJudgePrompt" rows="10" readonly style="display:none;width:100%;max-width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink)"></textarea>';
    own.insertBefore(panel, own.firstChild);
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
      if (tab.dataset.p === "learn") tab.textContent = "1. Komedi araştırması";
      if (tab.dataset.p === "gen") tab.textContent = "2. Bağımsız senaryo";
      if (tab.dataset.p === "own") tab.textContent = "3. Hakem + ölçüm";
    });
    $("#createIndependentJudgePrompt").addEventListener("click", async () => {
      const candidate = clean($("#independentJudgeCandidate").value, 12000);
      const status = $("#independentJudgeStatus");
      const output = $("#independentJudgePrompt");
      if (!candidate) {
        status.textContent = "Önce değerlendirilmesini istediğin senaryoyu kutuya yapıştır.";
        return;
      }
      const research = window.bosLiveComedyResearch || getCachedResearch();
      const task = [
        "ROL: Acımasız ama yaratıcı görsel komedi dramaturgu; kalitesiz fikri savunma, kişisel zevki evrensel yasa gibi sunma.",
        "SADECE ŞU KOŞULLAR DEĞİŞMEZ: tam 10 saniye, dikey 9:16, diyalogsuz, doğal ASMR sesleri. Diğer bütün yaratıcı yaklaşımlar serbesttir. Sabit mizah tekniği, gerçekçilik, hook, tema, oyunculuk veya fizik kuralı dayatma.",
        "GÖREV: Aşağıdaki senaryoyu izleyicinin gözünden değerlendir. Komedi gerçekten olaydan mı doğuyor, yoksa sadece beklenmedik bir görüntü mü? Karakter/nesne/ortam eylemi kendiliğinden anlaşılır mı, ritim doğru mu, 10 saniyede tamamlanıyor mu, ses görüntüyü güçlendiriyor mu, fikir ezber/tekrar hissi veriyor mu? Bu sorular düşünme mercekleridir, mekanik puan listesi değil.",
        "ÖNCE KISA TEŞHİS: En fazla üç somut cümle; neresi işlemiyor veya neden çalışabilir? Sonra karar ver. Fikir zayıfsa aynı fikri yamamakla yetinme; gerektiğinde yeni bir yaratıcı mekanizma seçerek yalnızca bir daha güçlü nihai sürüm yaz. Fikir güçlüyse gereksiz yere değiştirme. Alternatif fikir listesi, yüzdelik başarı tahmini veya süslü övgü verme.",
        "NİHAİ ÇIKTI: Tek düzeltilmiş/korunmuş fikir, saniye saniye 10 saniyelik akış ve doğrudan kopyalanabilir tam İngilizce video promptu. Prompt exact 10 seconds, vertical 9:16, no dialogue, natural ASMR audio içermeli.",
        "Güncel öğrenme notları:\n" + learningNotes(),
        "İlgili canlı araştırma kaydı (varsa; desteklemediği iddiaları buradan çıkarma):\n" + JSON.stringify(research || {}),
        "DEĞERLENDİRİLECEK ADAY:\n" + candidate
      ].join("\n\n");
      await copyOutput(task, output, status, "Acımasız hakem görevi");
    });
  }
  function overrideStudyButton() {
    const button = $("#createComedyStudyPrompt");
    if (!button) return;
    button.onclick = async () => {
      button.disabled = true;
      const status = $("#comedyStudyPromptStatus");
      const area = $("#comedyStudyPrompt");
      if (status) status.textContent = "Ücretsiz açık kaynaklarda yeni komedi ustaları ve akademik mizah araştırması aranıyor…";
      try {
        const payload = await performLiveResearch();
        await copyOutput(studyPrompt(payload), area, status, "Komedi ustaları ve psikoloji araştırma görevi");
      } catch (error) {
        const payload = getCachedResearch() || { failedLookups: [clean(error && error.message || error, 200)] };
        await copyOutput(studyPrompt(payload), area, status, "Yedek komedi araştırma görevi");
      } finally {
        button.disabled = false;
      }
    };
  }
  function start() {
    addResearchEnginePanel();
    addJudgePanel();
    overrideStudyButton();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();