/* Boş Dükkân — küresel kaynak akışına bağlı komedi öğrenme katmanı.
   Ana panelin Trend keşfi araması, sabit kaynak seçimi ve storyboard doğrulaması korunur.
   Bu modül kaynaklı komedi öğrenmelerini ve kullanıcının yerel konu geçmişini
   mevcut global kaynak paketine ekler; ana üretim düğmesinin işleyişini değiştirmez. */
(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);

  // Wikipedia sayfa başlıkları (yalnızca veri işaretçisi; içerik canlı çekilir).
  const MASTER_PAGES = ["Buster_Keaton", "Charlie_Chaplin", "Harold_Lloyd", "Jacques_Tati", "Laurel_and_Hardy", "Rowan_Atkinson", "Lucille_Ball", "Peter_Sellers", "Pierre_Étaix", "Stephen_Chow", "Max_Linder", "Roscoe_Arbuckle", "Harry_Langdon", "Louis_de_Funès", "Totò", "Cantinflas", "Kishore_Kumar", "Alberto_Sordi"];
  const PSYCH_PAGES = ["Theories_of_humor", "Physical_comedy", "Slapstick", "Deadpan"];

  // knowledge.json okunamazsa kullanılacak asgari yedek.
  const FALLBACK_FINDINGS = [
    {source: "McGraw & Warren 2010 — Benign Violations", url: "https://leeds-faculty.colorado.edu/mcgrawp/pdf/mcgraw.warren.2010.pdf",
      finding: "Mizah, bir durum aynı anda hem ihlal hem zararsız algılandığında doğar."},
    {source: "Kinema / Waterloo — Notes on Buster Keaton's Motion", url: "https://openjournals.uwaterloo.ca/index.php/kinema/article/download/1250/1589",
      finding: "Keaton'da hareketler nedensellik zinciri gibi birbirini doğurur; yüz ifadesiz kalır."}
  ];
  const HISTORY_KEY = 'bd_topic_history';

  async function wikiSummary(title) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title) + '?redirect=true', {headers: {Accept: 'application/json'}, signal: controller.signal});
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      return {
        title: j.title || title.replace(/_/g, ' '),
        url: j.content_urls && j.content_urls.desktop && j.content_urls.desktop.page || null,
        summary: String(j.extract || '').slice(0, 500)
      };
    } finally { clearTimeout(timer); }
  }
  async function fetchAll(titles) {
    const results = await Promise.allSettled(titles.map(wikiSummary));
    const ok = [], failed = [], seen = new Set();
    results.forEach((res, i) => {
      if (res.status === 'fulfilled' && res.value.summary) {
        const key = res.value.url || res.value.title;
        if (!seen.has(key)) { seen.add(key); ok.push(res.value); }
      } else failed.push(titles[i].replace(/_/g, ' '));
    });
    return {ok, failed};
  }
  async function loadKnowledge() {
    try {
      const r = await fetch('./knowledge.json?t=' + Date.now(), {cache: 'no-store'});
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      return {ok: true, updated: j.updated || null, findings: Array.isArray(j.findings) ? j.findings : [], topics: Array.isArray(j.topics) ? j.topics : []};
    } catch (e) {
      return {ok: false, updated: null, findings: FALLBACK_FINDINGS, topics: []};
    }
  }
  function readHistory() {
    try { const v = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  }
  function writeHistory(list) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function readNotes() {
    try { return localStorage.getItem('bd_comedy_research_notes') || ''; } catch (e) { return ''; }
  }

  // Global arama/sonuç ve kaynak izi bölümleri özellikle gizlenmez.

  // 1. sekmedeki sabit ezber içerik: ilke kartları, usta atlası ve psikoloji çekirdeği metni.
  (function stripStaticLearnContent() {
    const learn = $('#learn');
    if (!learn) return;
    const cards = learn.querySelector('.stats');
    if (cards) cards.remove();
    Array.from(learn.querySelectorAll('h2')).forEach((h) => {
      const t = (h.textContent || '').trim();
      if (t.indexOf('Usta komedyen atlası') === 0 || t.indexOf('Psikoloji çekirdeği') === 0) {
        const next = h.nextElementSibling;
        if (next && next.tagName !== 'H2' && next.tagName !== 'BUTTON') next.remove();
        h.remove();
      }
    });
  })();
  // Kaynaklı komedi araştırma istemi arayüzü korunur.

  const notes = $('#comedyResearchNotes');
  if (notes) {
    notes.value = readNotes();
    notes.addEventListener('input', () => {
      try { localStorage.setItem('bd_comedy_research_notes', notes.value); } catch (e) {}
      const status = $('#comedyResearchNotesStatus');
      if (status) status.textContent = 'Notlar bu tarayıcıya kaydedildi (isteğe bağlı; pakete eklenir).';
    });
    const save = $('#saveComedyResearchNotes');
    if (save) save.addEventListener('click', () => {
      try { localStorage.setItem('bd_comedy_research_notes', notes.value); } catch (e) {}
      const status = $('#comedyResearchNotesStatus');
      if (status) status.textContent = 'Notlar kaydedildi.';
    });
    const clear = $('#clearComedyResearchNotes');
    if (clear) clear.addEventListener('click', () => {
      notes.value = '';
      try { localStorage.removeItem('bd_comedy_research_notes'); } catch (e) {}
      const status = $('#comedyResearchNotesStatus');
      if (status) status.textContent = 'Notlar temizlendi.';
    });
  }

  const btn = $('#createGlobalIdeaPrompt');

  // Konu geçmişi arayüzü (bu telefonda saklanır).
  (function buildHistoryBox() {
    if (!btn) return;
    const box = document.createElement('div');
    box.style.cssText = 'margin:10px 0;padding:10px;border:1px solid var(--line);border-radius:8px';
    const title = document.createElement('strong');
    title.textContent = 'Beğendiğin konuyu geçmişe kaydet (sonraki pakette tekrarlanmaz)';
    const inputCss = 'display:block;width:100%;box-sizing:border-box;margin:6px 0;padding:9px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink)';
    const t = document.createElement('input'); t.type = 'text'; t.placeholder = 'Konu adı (örn. Sessiz Hapşırık)'; t.style.cssText = inputCss;
    const s = document.createElement('input'); s.type = 'text'; s.placeholder = 'Tek cümle özet'; s.style.cssText = inputCss;
    const add = document.createElement('button'); add.type = 'button'; add.textContent = 'Geçmişe kaydet';
    const list = document.createElement('ul'); list.style.cssText = 'margin:8px 0 0;padding-left:18px';
    function render() {
      list.textContent = '';
      const items = readHistory();
      if (!items.length) { const li = document.createElement('li'); li.textContent = 'Bu telefonda kayıtlı konu yok.'; list.appendChild(li); return; }
      items.forEach((it, idx) => {
        const li = document.createElement('li');
        li.textContent = it.title + (it.summary ? ' — ' + it.summary : '') + ' ';
        const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'ghost'; rm.textContent = 'Sil'; rm.style.padding = '2px 8px';
        rm.onclick = () => { const cur = readHistory(); cur.splice(idx, 1); writeHistory(cur); render(); };
        li.appendChild(rm); list.appendChild(li);
      });
    }
    add.onclick = () => {
      const title2 = t.value.trim();
      if (!title2) return;
      const cur = readHistory();
      cur.push({title: title2, summary: s.value.trim(), added: new Date().toISOString().slice(0, 10), status: 'kayıtlı'});
      writeHistory(cur); t.value = ''; s.value = ''; render();
    };
    box.append(title, t, s, add, list);
    btn.parentElement.before(box);
    render();
  })();

  // Ana HTML içindeki global YouTube + storyboard konu üreticisini sar; asla ezme.
  const originalGlobalIdeaPromptBuilder = window.buildGlobalIdeaPrompt;
  let cachedResearchBundle = null;
  let researchBundlePromise = null;

  async function loadResearchBundle() {
    const [masters, psych, knowledge] = await Promise.all([
      fetchAll(MASTER_PAGES),
      fetchAll(PSYCH_PAGES),
      loadKnowledge()
    ]);
    return {masters, psych, knowledge};
  }

  function getResearchBundle() {
    if (cachedResearchBundle) return Promise.resolve(cachedResearchBundle);
    if (!researchBundlePromise) {
      researchBundlePromise = loadResearchBundle()
        .then(bundle => { cachedResearchBundle = bundle; return bundle; })
        .catch(() => {
          const bundle = {
            masters: {ok: [], failed: MASTER_PAGES.slice()},
            psych: {ok: [], failed: PSYCH_PAGES.slice()},
            knowledge: {ok: false, updated: null, findings: FALLBACK_FINDINGS, topics: []}
          };
          cachedResearchBundle = bundle;
          return bundle;
        });
    }
    return researchBundlePromise;
  }

  function uniqueTopics(items) {
    const seen = new Set();
    return (Array.isArray(items) ? items : []).filter(item => {
      const title = String(item && (item.title || item.name) || '').trim();
      if (!title) return false;
      const key = title.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  if (typeof originalGlobalIdeaPromptBuilder === 'function') {
    window.buildGlobalIdeaPrompt = function (research, anchor, visual) {
      const basePrompt = originalGlobalIdeaPromptBuilder.apply(this, arguments);
      const bundle = cachedResearchBundle || {
        masters: {ok: [], failed: MASTER_PAGES.slice()},
        psych: {ok: [], failed: PSYCH_PAGES.slice()},
        knowledge: {ok: false, updated: null, findings: FALLBACK_FINDINGS, topics: []}
      };
      const knowledge = bundle.knowledge || {ok: false, updated: null, findings: FALLBACK_FINDINGS, topics: []};
      const previousTopics = uniqueTopics((knowledge.topics || []).concat(readHistory()));
      const userNotes = readNotes();
      const additions = [
        "KOMEDİ USTALARI — CANLI WIKIPEDIA ÖZETLERİ (" + bundle.masters.ok.length + "/" + MASTER_PAGES.length + "): " + JSON.stringify(bundle.masters.ok),
        "MİZAH PSİKOLOJİSİ VE GÖRSEL KOMEDİ BİÇİMLERİ (" + bundle.psych.ok.length + "/" + PSYCH_PAGES.length + "): " + JSON.stringify(bundle.psych.ok),
        "BİRİKMİŞ KAYNAKLI KOMEDİ BULGULARI (" + (knowledge.ok ? "knowledge.json, güncelleme " + knowledge.updated : "knowledge.json okunamadı; sınırlı yedek kullanıldı") + "): " + JSON.stringify(knowledge.findings || FALLBACK_FINDINGS),
        "TEKRAR ETME — ÖNCEKİ KONULAR (yalnızca kaydedilmiş kayıtlar; bunları ve çok benzerlerini önerme): " + JSON.stringify(previousTopics),
        "ARAŞTIRMA KURALI: Global kaynak listesinden örneklenen gerçek videoların yanında, güncel global web aramasıyla bağımsız kaynakları da araştır. Kaynak başlığı veya izlenme sayısından görünmeyen sahneler uydurma. Kaynağın mekanizmasını kopyalama; yalnızca desteklediği geniş ilkeyi çıkar ve özgün yeni bir olay kur. Birden fazla fikir üretme; iç değerlendirmeden sonra yalnızca en güçlü, somut finali olan bir fikir ve tam üretim promptu ver.",
        "KANAL MARKASI: Boş Dükkân yalnızca kanal adıdır; sahne markette veya dükkânda geçmek zorunda değildir.",
        "VİDEO KOŞULLARI: Tam 10 saniye, dikey 9:16, diyalogsuz, doğal ASMR sesleri. İlk 0,3 saniyede anlaşılır görsel kanca ve somut tamamlanmış final olmalı."
      ];
      if (userNotes) additions.push("KULLANICININ KAYITLI ARAŞTIRMA NOTLARI:\n" + userNotes);
      const failed = (bundle.masters.failed || []).concat(bundle.psych.failed || []);
      if (failed.length) additions.push("ÇEKİLEMEYEN WIKIPEDIA ÖZETLERİ: " + failed.join(", ") + ". Eksik kaynaklardan içerik uydurma.");
      return basePrompt + "\n\nKOMEDİ ÖĞRENME VE TEKRAR KONTROLÜ\n" + additions.join("\n");
    };
  }

  // Ana düğmenin önceki işleyicisini sakla; araştırma eklentisi hazırlandıktan sonra aynısını çalıştır.
  const originalGlobalIdeaButton = $('#createGlobalIdeaPrompt');
  const originalGlobalIdeaClickHandler = originalGlobalIdeaButton && originalGlobalIdeaButton.onclick;
  if (originalGlobalIdeaButton && typeof originalGlobalIdeaClickHandler === 'function') {
    originalGlobalIdeaButton.onclick = async function (event) {
      const research = window.bosResearchSnapshot;
      if (!research || !Array.isArray(research.videos) || !research.videos.length) {
        return originalGlobalIdeaClickHandler.call(this, event);
      }
      const status = $('#globalIdeaPromptStatus');
      if (status) status.textContent = 'Global arama korunuyor; komedi ustaları, psikoloji ve kaydedilmiş bulgular hazırlanıyor…';
      await getResearchBundle();
      return originalGlobalIdeaClickHandler.call(this, event);
    };
  }

  window.BosDukkanComedyLearning = {
    version: 2,
    loadKnowledge,
    loadResearchBundle: getResearchBundle,
    readHistory,
    writeHistory
  };
})();
