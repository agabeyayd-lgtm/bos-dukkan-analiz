/* Boş Dükkân comedy psychology and masters learning module.
   Research prompts plus locally saved notes; this does not train a language model. */
(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const COMEDY_CORE_PRINCIPLES = [
    {name:"Beklenti uyumsuzluğu",use:"İzleyicinin doğal beklentisini kur; anlamlı bir sonuçla değiştir."},
    {name:"Karakterin kendi mantığı",use:"Karakter kendi inancını ciddiye alır; eylemlerini arzusu veya varsayımı başlatır."},
    {name:"Gurur ve yüzünü kurtarma",use:"Karakter küçük bir problemi gizlemeye çalışırken kendi kararlarıyla kendini açığa çıkarır."},
    {name:"Statü tersine dönüşü",use:"Kendini usta veya kontrol sahibi gören karakter durum karşısında kontrolü kaybeder."},
    {name:"Nedensel tırmanış",use:"Her hamle öncekinin sonucudur; gelişmeler rastgele kaza zinciri değildir."},
    {name:"Görsel hedef ve engel",use:"Hedef, engel ve karar ilk karelerden okunur; beden, eşya ve mekân ilişkisi görünürdür."},
    {name:"Zamanlama ve gecikme",use:"Hazırlık, bakış, tepki ve sessiz aralıkları bilinçli kullan."},
    {name:"İzleyici tanıması",use:"Gündelik davranış, sosyal kural veya zaaf izleyicide tanınma hissi uyandırsın."},
    {name:"Somut final",use:"Son görüntü karakterin seçiminin ya da yanlış inancının açık sonucu olsun."},
    {name:"Sesin komik işlevi",use:"Doğal nesne sesleri, ritim ve sessizlik görsel eylemi güçlendirsin."},
    {name:"Empati ve hedef",use:"İzleyici karakterin amacını anlasın; tek başına alay mizahın tamamı değildir."}
  ];
  const COMEDY_MASTERS = [
    {name:"Charlie Chaplin",region:"Britanya/ABD",study:"sempati, onur, statü çatışması, görsel pantomim"},
    {name:"Buster Keaton",region:"ABD",study:"deadpan, mekân geometrisi, fiziksel neden-sonuç"},
    {name:"Harold Lloyd",region:"ABD",study:"net hedef, görsel risk, gerilim"},
    {name:"Laurel & Hardy",region:"ABD/Britanya",study:"mizaç farkı, suçlama, hatanın büyümesi"},
    {name:"Jacques Tati",region:"Fransa",study:"çevre, gündelik hayat, kadraj, ses ve sessizlik"},
    {name:"Rowan Atkinson / Mr Bean",region:"Britanya",study:"kişisel hedef, sosyal kural, beden dili, gecikmiş tepki"},
    {name:"Lucille Ball",region:"ABD",study:"özgüven, fiziksel iş, kontrol kaybı"},
    {name:"Peter Sellers",region:"Britanya",study:"karakter maskesi, rol/statü uyuşmazlığı"},
    {name:"Jerry Lewis",region:"ABD",study:"fiziksel ritim, yüz ifadesi, mahcubiyet"},
    {name:"Louis de Funès",region:"Fransa",study:"kontrol arzusu, sabırsızlık, gurur"},
    {name:"Cantinflas",region:"Meksika",study:"toplumsal statü, dolambaçlı mantık, söz-eylem uyuşmazlığı"},
    {name:"Norman Wisdom",region:"Britanya",study:"iyi niyet, ısrar, beceri ve hedef çatışması"},
    {name:"Jackie Chan",region:"Hong Kong",study:"mekân/nesne koreografisi ve okunur fiziksel mantık"},
    {name:"Marx Kardeşler",region:"ABD",study:"kuralları bozma ve otoriteyle oyun"},
    {name:"Mel Brooks",region:"ABD",study:"tür parodisi ve beklenti tersine çevirme"},
    {name:"Sacha Baron Cohen",region:"Britanya",study:"persona, sosyal normlar, satir"},
    {name:"Chespirito / El Chavo del Ocho",region:"Meksika",study:"karakter zaafı ve mahalle sosyal dinamiği"},
    {name:"Roberto Benigni",region:"İtalya",study:"bedensel ifade ve duygusal yatırım"},
    {name:"Pierre Étaix",region:"Fransa",study:"kadrajda okunurluk, zarif görsel gag ve mantıklı sürpriz"},
    {name:"Stephen Chow",region:"Hong Kong",study:"farce, görsel şaka, absürtlük ve duygusal hedefin birlikteliği"},
    {name:"Kishore Kumar",region:"Hindistan",study:"yüksek fiziksel enerji, karaktere özgü davranış ve komik zamanlama"},
    {name:"Totò",region:"İtalya",study:"mimik, yüz/beden ifadesi, kıtlık ve hayatta kalma farcesi"},
    {name:"Mehmood",region:"Hindistan",study:"yüksek enerjili fiziksel komedi"}
  ];
  const BASELINE_COMEDY_LESSONS = [
    "Pierre Étaix / Criterion: Görsel şaka kadrajda net okunmalı; eylemin boyutu ve çevresindeki boşluk önemlidir. Şaka karakter ve durumdan çıkar; sürpriz dramatik durumdan mantıklı biçimde doğmalıdır. https://www.criterion.com/current/posts/2746-the-return-of-etaix",
    "Buster Keaton / BFI: Karakterin amacı açık kalırken fiziksel hareketler okunur ve nedensel olmalı; komedi ile gerilim birlikte çalışabilir. https://www.bfi.org.uk/film/136a6211-90d9-5d18-b047-7967deac8bab/the-general",
    "Jacques Tati / BFI: Mimari, mekân, kalabalık hareketleri, küçük jestler ve çevresel sesler komedinin parçası olabilir. https://www.bfi.org.uk/film/a27e52ca-e6b6-5cd4-a2e0-1e1a30456e56/playtime",
    "Stephen Chow / akademik çalışma: Farce ve absürtlük, karakterin duygusal hedefi veya pathos ile birleştiğinde daha katmanlı olabilir; absürtlüğü tek başına hedef sayma. https://scholar.nycu.edu.tw/en/publications/farce-pathos-and-absurdity-in-stephen-chows-film-comedies-from-be/",
    "Stephen Chow / Film Comment: Mo lei tau komedisi görsel gag, kelime oyunu ve kültürel referansları karıştırabilir; diyalogsuz kısa videoya yalnızca görsel beklenti kırılması ve fiziksel zamanlama aktarılmalıdır. https://www.filmcomment.com/wp-content/uploads/2025/12/2010s2014VOLUME-50-NUMBER-03-MAY-JUNE-2014.pdf",
    "Kishore Kumar / Indian Express: Komik performansta kendine özgü fiziksel enerji ve sıra dışı davranış ritmi bir araçtır; hareket dili kişiliği taşımalı. https://indianexpress.com/article/entertainment/bollywood/kishore-kumar-actor-birth-anniversary-ashok-kumar-pretended-to-be-crazy-8876600/",
    "Totò / Cinémathèque française: Mimik ve fiziksel ifade, kıtlık ve gündelik hayatta ayakta kalma çabalarını farce'e dönüştürebilir. https://www.cinematheque.fr/article/1959.html",
    "Mizah psikolojisi / Hewer, Smith ve Fergie: Uyumsuzluk, üstünlük ve gerilim-boşalma farklı açıklama mercekleridir; hiçbiri tek başına tüm mizah biçimlerini açıklamaz. https://pmc.ncbi.nlm.nih.gov/articles/PMC6350176/",
    "Yaratıcı kontrol: İzleyici hedefi, engeli, karakterin seçimini ve sonucun nedenini sözsüz anlayabiliyor mu? Bu, ezber bir formül değil, anlaşılabilirlik kontrolüdür.",
    "Nedensellik kontrolü: Sonuç karakterin tercihi veya inancından doğuyor mu? Rastgele kaza da kullanılabilir, ancak sahnenin okunur bir nedeni ve karşılığı olmalı.",
    "Kadraj kontrolü: Önemli hareket tek bakışta görünüyor mu; eylem için yeterli alan var mı? Kaynaktaki hareket dizisini değil, okunurluk ilkesini al.",
    "Final kontrolü: Son kare yeni bilgi, durum değişimi veya karakter kararıyla olayı tamamlıyor mu? Şaşırmış yüze kesmek zorunlu bir final değildir."
  ];
  function compiledLessons() {
    return BASELINE_COMEDY_LESSONS.join("\n") + (readNotes() ? "\n\nKULLANICININ EKLEDİĞİ ARAŞTIRMA NOTLARI:\n" + readNotes() : "");
  }
  function readNotes() {
    try { return localStorage.getItem('bd_comedy_research_notes') || ''; } catch (e) { return ''; }
  }
  function buildComedyStudyPrompt() {
    return [
      "ROL: Mizah psikolojisi araştırmacısı, dünya komedi tarihi uzmanı ve görsel komedi dramaturgu.",
      "AMAÇ: Aşağıdaki ustaları incele; listedekilerin dışında farklı ülkeler/dönemlerden en az 10 dünya komedi ustası keşfet. Uygulanabilir teknik ve psikolojik motor bul; yalnızca isim listesi verme.",
      "PSİKOLOJİ: Beklenti uyumsuzluğu, üstünlük/statü ve gerilim-boşalma merceklerini ayrı ayrı açıkla; kesin evrensel kanun gibi sunma. Karakter arzusu, gurur, yüzünü kurtarma, sosyal kural, tanınabilir davranış, nedensel tırmanış, gecikmiş tepki, mekânsal okunurluk ve somut finali örnekle.",
      "USTA ATLASI: " + JSON.stringify(COMEDY_MASTERS),
      "ÇEKİRDEK İLKELER: " + JSON.stringify(COMEDY_CORE_PRINCIPLES),
      "KAYNAK KURALI: BFI, AFI, Criterion, Britannica, üniversite/hakemli çalışma, müze/film arşivi ve sanatçı röportajlarını önceliklendir. Önemli iddialara doğrudan URL ver ve çapraz kontrol et. Tam filmi izlemediysen izledim deme; kaynak metni, klip veya röportaj incelendiyse kanıt sınırını belirt.",
      "HER USTA İÇİN: ülke/dönem; komedi motoru; olası psikolojik etki; diyalogsuz 10 saniyelik videoya aktarılabilir genel ders; kaynak URL; sahne kopyalamadan özgün fikre uyarlama egzersizi.",
      "ÖNEMLİ: Meşhur sahne, karakter veya final kopyalama. Rastgele absürtlüğü otomatik komedi sayma; ama mizah biçimlerini de baştan yasaklama. Karakter hedefini, seçimini, nedenselliği ve finalin anlaşılabilirliğini değerlendir.",
      "KALICI NOT FORMATI: 10-20 kısa ve uygulanabilir ders ile yeni keşfedilen ustaların listesini hazırla. Kullanıcı sonuçları paneldeki Öğrenilen dersleri sakla alanına yapıştıracak.",
      "BAŞLANGIÇ KAYNAKLARI: BFI Keaton https://www.bfi.org.uk/features/general-greatest-comedy-all-time ; BFI Jacques Tati https://www.bfi.org.uk/film/a27e52ca-e6b6-5cd4-a2e0-1e1a30456e56/playtime ; BFI Harold Lloyd https://www.bfi.org.uk/lists/10-great-films-1923 ; mizah psikolojisi https://pmc.ncbi.nlm.nih.gov/articles/PMC6350176/ ; PBS Mr Bean https://www.pbs.org/video/happy-birthday-mr-bean-juuuwu/ ; Şahan Gökbakar röportajı https://www.cinedergi.com/2009/03/18/sahan-gokbakar-bana-ivediklestin-diyorlar/",
      "ARAŞTIRMA ÇEKİRDEĞİ VE KAYITLI NOTLAR (düzelt veya derinleştir): " + compiledLessons(),
      "SONUÇ: Kaynaklı araştırma özeti, listede olmayan en az 10 yeni isim, farklı mekanizmaları karşılaştıran tablo, uygulama egzersizleri ve araştırma sınırları."
    ].join("\n");
  }
  const notes = $('#comedyResearchNotes');
  if (!notes) return;
  notes.value = readNotes();
  notes.addEventListener('input', () => {
    try { localStorage.setItem('bd_comedy_research_notes', notes.value); } catch (e) {}
    const status = $('#comedyResearchNotesStatus');
    if (status) status.textContent = 'Notlar bu tarayıcıya otomatik kaydedildi; sonraki global konu paketine eklenir.';
  });
  $('#saveComedyResearchNotes').addEventListener('click', () => {
    try { localStorage.setItem('bd_comedy_research_notes', notes.value); } catch (e) {}
    $('#comedyResearchNotesStatus').textContent = 'Öğrenme notları kaydedildi. Global konu motoruna komedi tekniği bağlamı olarak eklenir; kanal Analytics verisi konu seçimine katılmaz.';
  });
  $('#clearComedyResearchNotes').addEventListener('click', () => {
    notes.value = '';
    try { localStorage.removeItem('bd_comedy_research_notes'); } catch (e) {}
    $('#comedyResearchNotesStatus').textContent = 'Ek dersler temizlendi. Temel komedi ilkeleri kullanılmaya devam eder.';
  });
  $('#createComedyStudyPrompt').addEventListener('click', async () => {
    const area = $('#comedyStudyPrompt'), status = $('#comedyStudyPromptStatus');
    area.value = buildComedyStudyPrompt(); area.style.display = 'block'; area.focus(); area.select();
    try {
      await navigator.clipboard.writeText(area.value);
      status.textContent = 'Usta araştırma istemi kopyalandı. Web erişimli sohbete yapıştır; kaynaklı dersleri döndürdüğünde Öğrenilen dersleri sakla alanına kaydet.';
    } catch (e) {
      status.textContent = 'Araştırma istemi aşağıda hazır ve seçili. Kopyalayıp web erişimli sohbete yapıştır.';
    }
  });
  // Add the psychology atlas and accumulated research notes to every global idea packet.
  const originalBuilder = window.buildGlobalIdeaPrompt;
  if (typeof originalBuilder === 'function') {
    window.buildGlobalIdeaPrompt = function (research, anchor, visual) {
      const packet = originalBuilder(research, anchor, visual);
      const block = [
        "KOMEDİ PSİKOLOJİSİ ÇEKİRDEĞİ (mekanik şablon değil, yaratıcı araçlar): " + JSON.stringify(COMEDY_CORE_PRINCIPLES),
        "USTALARIN TEKNİK ATLASI (karakter/sahne taklidi yok; yüksek seviye dersler): " + JSON.stringify(COMEDY_MASTERS),
        "KAYNAKLI BAŞLANGIÇ DERSLERİ + KULLANICININ BU TARAYICIDA KAYDETTİĞİ KOMEDİ DERSLERİ: " + compiledLessons(),
        "ÖĞRENME SINIRI: Saklanan notlar yalnızca komedi tekniği bağlamıdır; kanal Analytics sayıları konu veya kaynak seçimine katılmasın. Global kaynak yalnızca global YouTube/web araştırmasından gelsin.",
        "KALİTE İÇ DENETİMİ: Taslak yalnızca jenerik nesne arızası veya rastgele kaza dizisine dayanıyorsa karakterin somut isteğini/inancını, kendi kararını, nedensel gelişmeyi ve final karşılığını güçlendir. Tek bir komedi motorunu derinleştir; farklı mizah biçimlerini baştan yasaklama."
      ].join("\n");
      const marker = "GÖREV: Global kaynaktan geniş bir öncül çıkar";
      return packet.includes(marker) ? packet.replace(marker, block + "\n" + marker) : packet + "\n" + block;
    };
  }
  window.BosDukkanComedyLearning = {COMEDY_CORE_PRINCIPLES, COMEDY_MASTERS, buildComedyStudyPrompt};
})();