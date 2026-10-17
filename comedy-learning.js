/* Boş Dükkân comedy learning module.
   Hazır (ezber) promptlar, ilke listeleri ve usta atlası kaldırıldı.
   Bu dosya ayrıca ana sayfadaki hazır prompt metinlerini devre dışı bırakır:
   - Global konu paketi artık yalnızca veriden oluşur (kaynak, arama örneklemi, durum, storyboard, kullanıcı notları).
   - Eski "rakip keşif / ön analiz istemi" bölümü her analizde kaldırılır.
   Bu modül model eğitmez. */
(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  function readNotes() {
    try { return localStorage.getItem('bd_comedy_research_notes') || ''; } catch (e) { return ''; }
  }
  function readSceneNotes() {
    const el = $('#sceneNotes');
    return el ? String(el.value || '').trim() : '';
  }
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
      if (status) status.textContent = 'Notlar bu tarayıcıya otomatik kaydedildi; sonraki global konu paketine eklenir.';
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

  // Global konu paketi: yalnızca veri. Rol, görev, çıktı şablonu veya hazır komedi talimatı yok.
  window.buildGlobalIdeaPrompt = function (research, anchor, visual) {
    const videos = research && Array.isArray(research.videos) ? research.videos : [];
    const rows = videos
      .filter((v) => v && v.id && v.title).slice()
      .sort((a, b) => (Number(b.viewsPerDay ?? b.vpd) || 0) - (Number(a.viewsPerDay ?? a.vpd) || 0)).slice(0, 20)
      .map((v) => ({
        videoId: v.id, title: v.title, channel: v.channel || null, channelId: v.channelId || null,
        publishedAt: v.publishedAt || (v.date instanceof Date ? v.date.toISOString() : v.date) || null,
        publicLifetimeViews: Number.isFinite(Number(v.views)) ? Number(v.views) : null,
        ageDays: Number.isFinite(Number(v.ageDays)) ? Number(v.ageDays) : null,
        approximateViewsPerDay: Number.isFinite(Number(v.viewsPerDay ?? v.vpd)) ? Number(v.viewsPerDay ?? v.vpd) : null,
        durationSeconds: Number.isFinite(Number(v.seconds ?? v.sec)) ? Number(v.seconds ?? v.sec) : null,
        officialUrl: 'https://www.youtube.com/watch?v=' + v.id
      }));
    let state = null;
    try { if (typeof currentStateSnapshot === 'function') state = currentStateSnapshot(videos); } catch (e) { state = null; }
    const parts = [
      "ARAMA: " + JSON.stringify({
        query: research && research.query || null,
        windowDays: research && research.searchDays || null,
        requestedOrder: research && research.requestedOrder || null,
        windowStart: research && research.searchStartedAt || null,
        windowEnd: research && research.searchEndedAt || null,
        returnedVideoCount: videos.length,
        source: research && research.source || null
      }),
      "SABİTLENMİŞ GLOBAL KAYNAK: " + JSON.stringify(anchor || null),
      "GLOBAL YOUTUBE ARAMA ÖRNEKLEMİ (en fazla 20 sonuç): " + JSON.stringify(rows),
      "ÖRNEKLEMDE İZLENEN / İZLENMEYEN (yaşa göre düzeltilmiş günlük izlenme): " + JSON.stringify(state),
      "STORYBOARD / GÖRSEL PAKET: " + JSON.stringify(visual || { available: false }),
      "ALAN TANIMLARI: publicLifetimeViews = yayından ölçüm zamanına kadar biriken toplam izlenme; approximateViewsPerDay = toplam izlenme ÷ video yaşı (kaba vekil, tarihsel grafik değil)."
    ];
    const sceneNotes = readSceneNotes();
    if (sceneNotes) parts.push("KULLANICININ GERÇEK SAHNE NOTLARI: " + sceneNotes);
    const userNotes = readNotes();
    if (userNotes) parts.push("KULLANICININ KAYDETTİĞİ ARAŞTIRMA NOTLARI:\n" + userNotes);
    return parts.join("\n");
  };

  // Eski hazır "ön analiz istemi" artık hiçbir şey üretmez.
  window.askClaude = function () {};

  // Eski rakip keşif / ön analiz bölümü (hazır talimatlar içerir) her analizde kaldırılır.
  const out = $('#outGen');
  if (out && typeof MutationObserver === 'function') {
    const strip = () => {
      const legacy = $('#legacyResearchTools');
      if (legacy) legacy.remove();
    };
    new MutationObserver(strip).observe(out, { childList: true, subtree: true });
    strip();
  }

  // Eski kodun hata vermemesi için boş uyumluluk nesnesi.
  window.BosDukkanComedyLearning = {COMEDY_CORE_PRINCIPLES: [], COMEDY_MASTERS: [], buildComedyStudyPrompt: function () { return ''; }};
})();
