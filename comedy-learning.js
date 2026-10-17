/* Boş Dükkân — konu motoru (YouTube aramasız, birikimli).
   Paket otomatik oluşur:
   - Wikipedia özetleri (ustalar + mizah teorileri, canlı)
   - knowledge.json: birikmiş kaynaklı bulgular + önceki konular (repodan canlı okunur)
   - Bu tarayıcıdaki konu geçmişi (isteğe bağlı kayıt)
   Bu sayfa model eğitmez; çıktı paketi web erişimli sohbete yapıştırılır. */
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

  // Eski YouTube aramasına dayalı arayüzü gizle ve metinleri güncelle.
  (function reshapeGenSection() {
    const gen = $('#gen');
    if (!gen) return;
    const searchBar = gen.querySelector('.bar');
    if (searchBar) searchBar.style.display = 'none';
    ['#outGen', '#globalIdeaTraceGate'].forEach((sel) => { const el = $(sel); if (el) el.style.display = 'none'; });
    const intro = gen.querySelector(':scope > p.note');
    if (intro) intro.textContent = 'Konu paketi otomatik oluşur: ustalar ve mizah teorileri canlı kaynaktan çekilir, birikmiş kaynaklı bulgular ve önceki konular eklenir. YouTube araması, trend verisi veya izleme gerekmez.';
    const panel = $('#globalIdeaPanel');
    if (panel) {
      const h = panel.querySelector('h2');
      if (h) h.textContent = 'Ustalar + mizah psikolojisi → tek yeni komedi konusu';
      const p = panel.querySelector('p.note');
      if (p) p.textContent = 'Düğme kaynak özetlerini ve birikmiş bilgiyi otomatik çeker, paketi hazırlar ve kopyalar. Paketi sohbete yapıştırınca 10 sn, 9:16, ASMR, diyalogsuz konu üretilir.';
    }
    const summary = $('#globalIdeaSourceSummary');
    if (summary) summary.textContent = 'Kaynak: Wikipedia özetleri (canlı) + birikmiş bilgi (knowledge.json). YouTube araması yok.';
  })();

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
  // Hazır usta araştırma istemi kaldırıldı: butonu ve alanını gizle.
  ['#createComedyStudyPrompt', '#comedyStudyPrompt', '#comedyStudyPromptStatus'].forEach((sel) => {
    const el = $(sel);
    if (el) el.style.display = 'none';
  });

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

  // Otomatik konu paketi (YouTube'suz, birikimli).
  if (btn) {
    btn.textContent = 'Konu paketini otomatik oluştur ve kopyala';
    btn.onclick = async () => {
      const status = $('#globalIdeaPromptStatus'), area = $('#globalIdeaPrompt');
      btn.disabled = true;
      status.textContent = 'Kaynak özetleri ve birikmiş bilgi çekiliyor…';
      try {
        const [masters, psych, know] = await Promise.all([fetchAll(MASTER_PAGES), fetchAll(PSYCH_PAGES), loadKnowledge()]);
        const localTopics = readHistory();
        const topics = know.topics.concat(localTopics);
        const parts = [
          "ÜRETİLECEK: 10 saniyelik, dikey 9:16, ASMR odaklı doğal sesli, diyalogsuz bir komedi videosu için tek konu ve tam video promptu. Mevcut videolara, trendlere veya izlenme verilerine bakma; dünyadaki ilk komedi videosunu üretiyormuşuz gibi, aşağıdaki ustaların yaptıklarından ve mizah psikolojisinden yola çıkarak sıfırdan düşün.",
          "USTALAR (Wikipedia özetleri, otomatik çekildi, " + masters.ok.length + "/" + MASTER_PAGES.length + "): " + JSON.stringify(masters.ok),
          "MİZAH PSİKOLOJİSİ VE TÜRLER (Wikipedia özetleri, otomatik çekildi, " + psych.ok.length + "/" + PSYCH_PAGES.length + "): " + JSON.stringify(psych.ok),
          "BİRİKMİŞ KAYNAKLI BULGULAR (" + (know.ok ? "knowledge.json, güncelleme " + know.updated : "knowledge.json okunamadı, asgari yedek") + "; her biri URL'li): " + JSON.stringify(know.findings)
        ];
        if (topics.length) parts.push("DAHA ÖNCE ÜRETİLEN / ÖNERİLEN KONULAR (bunları ve çok benzerlerini kurma): " + JSON.stringify(topics));
        const failed = masters.failed.concat(psych.failed);
        if (failed.length) parts.push("ÇEKİLEMEYEN KAYNAKLAR: " + failed.join(", "));
        const userNotes = readNotes();
        if (userNotes) parts.push("KULLANICININ EK NOTLARI:\n" + userNotes);
        area.value = parts.join("\n");
        area.style.display = 'block';
        area.focus(); area.select();
        const summary = $('#globalIdeaSourceSummary');
        if (summary) summary.textContent = 'Paket hazır: ' + masters.ok.length + ' usta + ' + psych.ok.length + ' teori/tür + ' + know.findings.length + ' birikmiş bulgu + ' + topics.length + ' önceki konu. YouTube araması yok.';
        try {
          await navigator.clipboard.writeText(area.value);
          status.textContent = 'Paket kopyalandı. Sohbete yapıştır.' + (failed.length ? ' (' + failed.length + ' kaynak çekilemedi.)' : '') + (know.ok ? '' : ' (knowledge.json okunamadı.)');
        } catch (e) {
          status.textContent = 'Paket aşağıda hazır ve seçili; Kopyala ile al.' + (failed.length ? ' (' + failed.length + ' kaynak çekilemedi.)' : '');
        }
      } catch (e) {
        status.textContent = 'Paket oluşturulamadı: ' + (e && e.message || e);
      } finally {
        btn.disabled = false;
      }
    };
  }

  // Eski kodun hata vermemesi için boş uyumluluk nesnesi.
  window.BosDukkanComedyLearning = {COMEDY_CORE_PRINCIPLES: [], COMEDY_MASTERS: [], buildComedyStudyPrompt: function () { return ''; }};
})();
