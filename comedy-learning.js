/* Boş Dükkân — konu motoru (YouTube aramasız).
   Paket artık otomatik oluşur: Wikipedia özetleri (ustalar + mizah teorileri, canlı çekilir)
   + kaynak URL'li araştırma bulguları. YouTube araması, trend verisi veya kullanıcı notu gerekmez.
   Bu sayfa model eğitmez; çıktı paketi web erişimli sohbete yapıştırılır. */
(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);

  // Wikipedia sayfa başlıkları (yalnızca veri işaretçisi; içerik canlı çekilir).
  const MASTER_PAGES = ["Buster_Keaton", "Charlie_Chaplin", "Harold_Lloyd", "Jacques_Tati", "Laurel_and_Hardy", "Rowan_Atkinson", "Lucille_Ball", "Peter_Sellers", "Pierre_Étaix", "Stephen_Chow", "Max_Linder", "Roscoe_Arbuckle", "Harry_Langdon", "Louis_de_Funès", "Totò", "Cantinflas", "Kishore_Kumar", "Alberto_Sordi"];
  const PSYCH_PAGES = ["Benign_violation_theory", "Incongruity_theory", "Superiority_theory_of_humor", "Relief_theory", "Physical_comedy", "Slapstick", "Deadpan"];

  // Kaynaklı araştırma bulguları (özetlenmiş; her biri URL'li).
  const SOURCED_FINDINGS = [
    {source: "Kinema / Waterloo — Notes on Buster Keaton's Motion", url: "https://openjournals.uwaterloo.ca/index.php/kinema/article/download/1250/1589",
      finding: "Keaton'da hareketler bir nedensellik zinciri gibi birbirini doğurur; karakter kaçmak yerine fiziksel imkânı yeniden tanımlar; spektaküler olaylar karşısında yüzü ifadesiz kalır."},
    {source: "Filmmaker Magazine — Keaton'ın simetrisi", url: "https://filmmakermagazine.com/?p=93184",
      finding: "Ortalanmış kadraj, şakanın nesne ve mekânla baştan ayağa görünmesini sağlar."},
    {source: "Stanley Nolan — Keaton", url: "https://stanleynolan.substack.com/p/keaton",
      finding: "Keaton'a göre seyirci başkasının başına gelene güler; ifadesiz beden ile kaotik dünya arasındaki uyumsuzluk komik etkiyi taşır."},
    {source: "McGraw & Warren 2010 — Benign Violations", url: "https://leeds-faculty.colorado.edu/mcgrawp/pdf/mcgraw.warren.2010.pdf",
      finding: "Mizah, bir durum aynı anda hem ihlal hem zararsız algılandığında doğar. Zararsızlık: alternatif norm, ihlal edilen kurala zayıf bağlılık veya psikolojik mesafeyle gelir."},
    {source: "McGraw ve ark. 2012 — Distant tragedies, close mishaps", url: "https://leeds-faculty.colorado.edu/mcgrawp/pdf/mcgraw.warren.williams.leonard.2012.pdf",
      finding: "Küçük aksilikler yakınken, felaketler uzakken komiktir; mesafe tehdidi azaltır."},
    {source: "Humor Research Lab — Benign Violation Theory", url: "https://leeds-faculty.colorado.edu/mcgrawp/pdf/Benign_Violation_Theory.html",
      finding: "Oyun kavgası saldırı durunca (ihlal yok) ya da fazla saldırgan olunca (zararsız değil) komikliğini kaybeder."},
    {source: "Univ. of Catania çalışması", url: "https://www.iris.unict.it/handle/20.500.11769/642974",
      finding: "Benign-ihlal kuramı yalnızca kısmen desteklendi; tek bir teori bütün mizahı açıklamaz."}
  ];

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
    const ok = [], failed = [];
    results.forEach((res, i) => {
      if (res.status === 'fulfilled' && res.value.summary) ok.push(res.value); else failed.push(titles[i].replace(/_/g, ' '));
    });
    return {ok, failed};
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
    if (intro) intro.textContent = 'Konu paketi otomatik oluşur: ustalar ve mizah teorileri canlı kaynaktan çekilir, kaynaklı araştırma bulguları eklenir. YouTube araması, trend verisi veya izleme gerekmez.';
    const panel = $('#globalIdeaPanel');
    if (panel) {
      const h = panel.querySelector('h2');
      if (h) h.textContent = 'Ustalar + mizah psikolojisi → tek yeni komedi konusu';
      const p = panel.querySelector('p.note');
      if (p) p.textContent = 'Düğme ustalar ve mizah teorileri için kaynak özetlerini otomatik çeker, paketi hazırlar ve kopyalar. Paketi sohbete yapıştırınca 10 sn, 9:16, ASMR, diyalogsuz konu üretilir.';
    }
    const summary = $('#globalIdeaSourceSummary');
    if (summary) summary.textContent = 'Kaynak: Wikipedia özetleri (canlı) + kaynaklı araştırma bulguları. YouTube araması yok.';
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

  // Otomatik konu paketi (YouTube'suz).
  const btn = $('#createGlobalIdeaPrompt');
  if (btn) {
    btn.textContent = 'Konu paketini otomatik oluştur ve kopyala';
    btn.onclick = async () => {
      const status = $('#globalIdeaPromptStatus'), area = $('#globalIdeaPrompt');
      btn.disabled = true;
      status.textContent = 'Ustalar ve mizah teorileri için kaynak özetleri çekiliyor…';
      try {
        const [masters, psych] = await Promise.all([fetchAll(MASTER_PAGES), fetchAll(PSYCH_PAGES)]);
        const parts = [
          "ÜRETİLECEK: 10 saniyelik, dikey 9:16, ASMR odaklı doğal sesli, diyalogsuz bir komedi videosu için tek konu ve tam video promptu. Mevcut videolara, trendlere veya izlenme verilerine bakma; dünyadaki ilk komedi videosunu üretiyormuşuz gibi, aşağıdaki ustaların yaptıklarından ve mizah psikolojisinden yola çıkarak sıfırdan düşün.",
          "USTALAR (Wikipedia özetleri, otomatik çekildi, " + masters.ok.length + "/" + MASTER_PAGES.length + "): " + JSON.stringify(masters.ok),
          "MİZAH PSİKOLOJİSİ VE TÜRLER (Wikipedia özetleri, otomatik çekildi, " + psych.ok.length + "/" + PSYCH_PAGES.length + "): " + JSON.stringify(psych.ok),
          "KAYNAKLI ARAŞTIRMA BULGULARI (URL'li): " + JSON.stringify(SOURCED_FINDINGS)
        ];
        const failed = masters.failed.concat(psych.failed);
        if (failed.length) parts.push("ÇEKİLEMEYEN KAYNAKLAR: " + failed.join(", "));
        const userNotes = readNotes();
        if (userNotes) parts.push("KULLANICININ EK NOTLARI:\n" + userNotes);
        area.value = parts.join("\n");
        area.style.display = 'block';
        area.focus(); area.select();
        const summary = $('#globalIdeaSourceSummary');
        if (summary) summary.textContent = 'Paket hazır: ' + masters.ok.length + ' usta + ' + psych.ok.length + ' teori/tür özeti + ' + SOURCED_FINDINGS.length + ' kaynaklı bulgu. YouTube araması yok.';
        try {
          await navigator.clipboard.writeText(area.value);
          status.textContent = 'Paket kopyalandı. Sohbete yapıştır.' + (failed.length ? ' (' + failed.length + ' kaynak çekilemedi.)' : '');
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
