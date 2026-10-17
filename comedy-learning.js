/* Boş Dükkân comedy learning module.
   Hazır (ezber) promptlar, ilke listeleri ve usta atlası kaldırıldı.
   Geriye yalnızca kullanıcının kendi eklediği öğrenme notları kaldı; bu notlar
   global konu paketine eklenir. Bu modül model eğitmez. */
(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  function readNotes() {
    try { return localStorage.getItem('bd_comedy_research_notes') || ''; } catch (e) { return ''; }
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
  // Global paketine yalnızca kullanıcının kendi notları eklenir (hazır ilke/usta/ders metni yok).
  const originalBuilder = window.buildGlobalIdeaPrompt;
  if (typeof originalBuilder === 'function') {
    window.buildGlobalIdeaPrompt = function (research, anchor, visual) {
      const packet = originalBuilder(research, anchor, visual);
      const userNotes = readNotes();
      if (!userNotes) return packet;
      const block = "KULLANICININ KAYDETTİĞİ ARAŞTIRMA NOTLARI:\n" + userNotes;
      const marker = "GÖREV: Global kaynaktan geniş bir öncül çıkar";
      return packet.includes(marker) ? packet.replace(marker, block + "\n" + marker) : packet + "\n" + block;
    };
  }
  // Eski kodun hata vermemesi için boş uyumluluk nesnesi.
  window.BosDukkanComedyLearning = {COMEDY_CORE_PRINCIPLES: [], COMEDY_MASTERS: [], buildComedyStudyPrompt: function () { return ''; }};
})();
