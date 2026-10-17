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
  const OWN_ANALYTICS_KEY = 'bd_own_analytics_snapshot_v1';

  function finiteNumber(value) {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  // Keep only compact metrics and public video metadata; never cache OAuth tokens or comment text.
  function compactOwnSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object' || !Array.isArray(snapshot.videos)) return null;
    const videos = snapshot.videos.map(v => {
      const analyticsAvailable = Boolean(v && (v.analyticsAvailable !== undefined ? v.analyticsAvailable : v.hasAnalytics));
      return {
        id: String(v && v.id || ''),
        title: String(v && v.title || '').slice(0, 180),
        publishedAt: v && (v.publishedAt || v.published) || null,
        durationSeconds: finiteNumber(v && (v.durationSeconds !== undefined ? v.durationSeconds : v.seconds !== undefined ? v.seconds : v.sec)),
        analyticsAvailable,
        analyticsWindowDays: finiteNumber(v && v.analyticsWindowDays),
        viewsInWindow: analyticsAvailable ? finiteNumber(v && (v.viewsInWindow !== undefined ? v.viewsInWindow : v.views)) : null,
        averageViewSeconds: analyticsAvailable ? finiteNumber(v && (v.averageViewSeconds !== undefined ? v.averageViewSeconds : v.avgSec)) : null,
        averageViewedPercent: analyticsAvailable ? finiteNumber(v && (v.averageViewedPercent !== undefined ? v.averageViewedPercent : v.pct)) : null,
        likesInWindow: analyticsAvailable ? finiteNumber(v && (v.likesInWindow !== undefined ? v.likesInWindow : v.likes)) : null,
        subscribersGainedInWindow: analyticsAvailable ? finiteNumber(v && (v.subscribersGainedInWindow !== undefined ? v.subscribersGainedInWindow : v.subs)) : null,
        publicLifetimeViews: finiteNumber(v && (v.publicLifetimeViews !== undefined ? v.publicLifetimeViews : v.publicViews)),
        publicLifetimeLikes: finiteNumber(v && v.publicLifetimeLikes),
        publicLifetimeComments: finiteNumber(v && v.publicLifetimeComments),
        viewsPerObservedDay: finiteNumber(v && v.viewsPerObservedDay),
        subscribersGainedPer1000WindowViews: finiteNumber(v && v.subscribersGainedPer1000WindowViews),
        likeRateInWindow: finiteNumber(v && v.likeRateInWindow)
      };
    }).filter(v => v.id || v.title).slice(0, 250);

    return {
      source: 'YouTube Analytics API v2 + YouTube Data API v3 metadata',
      reportingWindowDays: finiteNumber(snapshot.reportingWindowDays),
      requestedAt: snapshot.requestedAt || null,
      channelSubscriberCount: finiteNumber(snapshot.channelSubscriberCount),
      totalVideoRows: finiteNumber(snapshot.totalVideoRows) ?? videos.length,
      analyticsVideoRows: finiteNumber(snapshot.analyticsVideoRows) ?? videos.filter(v => v.analyticsAvailable).length,
      videos
    };
  }

  function saveOwnAnalyticsSnapshot(snapshot) {
    const compact = compactOwnSnapshot(snapshot);
    if (!compact) return {ok: false, reason: 'Geçerli kanal ölçümü bulunamadı.'};
    try {
      localStorage.setItem(OWN_ANALYTICS_KEY, JSON.stringify(compact));
      return {ok: true, videos: compact.videos.length, measuredVideos: compact.videos.filter(v => v.analyticsAvailable).length};
    } catch (e) {
      return {ok: false, reason: 'Tarayıcı depolaması kullanılamıyor.'};
    }
  }

  function readOwnAnalyticsSnapshot() {
    try {
      const live = compactOwnSnapshot(window.bosOwnAnalyticsSnapshot);
      if (live && live.videos.length) return live;
    } catch (e) {}
    try {
      return compactOwnSnapshot(JSON.parse(localStorage.getItem(OWN_ANALYTICS_KEY) || 'null'));
    } catch (e) { return null; }
  }

  function readPreviousIdeaNotes() {
    const field = $('#ideaHistory');
    try {
      const live = field && String(field.value || '').trim();
      const saved = String(localStorage.getItem('bd_idea_history') || '').trim();
      return (live || saved).slice(0, 7000);
    } catch (e) {
      return String(field && field.value || '').trim().slice(0, 7000);
    }
  }

  function metricRecord(v) {
    return {
      title: v.title,
      publishedAt: v.publishedAt,
      durationSeconds: v.durationSeconds,
      analyticsWindowDays: v.analyticsWindowDays,
      viewsInWindow: v.viewsInWindow,
      averageViewSeconds: v.averageViewSeconds,
      averageViewedPercent: v.averageViewedPercent,
      likesInWindow: v.likesInWindow,
      subscribersGainedInWindow: v.subscribersGainedInWindow,
      subscribersGainedPer1000WindowViews: v.subscribersGainedPer1000WindowViews,
      viewsPerObservedDay: v.viewsPerObservedDay,
      publicLifetimeViews: v.publicLifetimeViews
    };
  }

  function buildOwnAnalyticsLearning() {
    const snapshot = readOwnAnalyticsSnapshot();
    if (!snapshot) {
      return {
        available: false,
        reason: 'Bu tarayıcıda kaydedilmiş YouTube Analytics ölçümü yok. Kullanıcı kanal ölçümünü henüz getirmemiş veya yerel önbelleği temizlemiş.',
        rule: 'Kanal verisi yok diye metrik uydurma veya fikir üretimini durdurma.'
      };
    }
    const measured = snapshot.videos.filter(v => v.analyticsAvailable);
    const ranking = (key, valid = () => true) => measured
      .filter(v => finiteNumber(v[key]) !== null && valid(v))
      .sort((a, b) => Number(b[key]) - Number(a[key]))
      .slice(0, 4)
      .map(metricRecord);

    return {
      available: measured.length > 0,
      source: snapshot.source,
      requestedAt: snapshot.requestedAt,
      reportingWindowDays: snapshot.reportingWindowDays,
      channelSubscriberCount: snapshot.channelSubscriberCount,
      totalVideoRows: snapshot.totalVideoRows,
      analyticsMeasuredVideos: measured.length,
      metricRules: [
        'Dönem izlenmesi, ortalama izleme saniyesi, ortalama izlenen yüzde, beğeni ve kazanılan abone yalnızca belirtilen Analytics dönemine aittir.',
        'Kamusal toplam izlenme ayrı ömür boyu sayacıdır; dönem izlenmesiyle karıştırma.',
        'Görüntülenme/izlenen gün hesabı kaba ortalamadır; geçmiş günlük grafik veya nedensel açıklama değildir.',
        'Eksik ölçüm null/veri yoktur; sıfır değildir. Farklı metrikler tek puana birleştirilmez.',
        'Kanal verisi global kaynak değildir; yalnızca hangi sonuçların yeniden düşünülmeye değer olduğuna ilişkin bağlamdır. Korelasyon neden-sonuç kanıtı değildir.'
      ],
      leaders: {
        highestAverageViewedPercent: ranking('averageViewedPercent'),
        highestAverageViewSeconds: ranking('averageViewSeconds'),
        highestViewsInWindow: ranking('viewsInWindow'),
        highestSubscribersGainedPer1000Views: ranking('subscribersGainedPer1000WindowViews', v => Number(v.viewsInWindow) > 0),
        highestLikesInWindow: ranking('likesInWindow')
      },
      recentMeasuredVideos: measured.slice(0, 25).map(metricRecord),
      limitations: 'Kendi kanalındaki ölçümler yalnızca sağlanan Analytics dönemi ve dönen video satırlarını kapsar. İzlenen yüzde, görüntülenme ve abone kazanımı farklı sonuçlardır; kısa video döngüleri %100 üstü izlenen yüzde üretebilir fakat tek başına neden göstermez.'
    };
  }

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
      const ownAnalyticsLearning = buildOwnAnalyticsLearning();
      const priorIdeaNotes = readPreviousIdeaNotes();
      const additions = [
        "KOMEDİ USTALARI — CANLI WIKIPEDIA ÖZETLERİ (" + bundle.masters.ok.length + "/" + MASTER_PAGES.length + "): " + JSON.stringify(bundle.masters.ok),
        "MİZAH PSİKOLOJİSİ VE GÖRSEL KOMEDİ BİÇİMLERİ (" + bundle.psych.ok.length + "/" + PSYCH_PAGES.length + "): " + JSON.stringify(bundle.psych.ok),
        "BİRİKMİŞ KAYNAKLI KOMEDİ BULGULARI (" + (knowledge.ok ? "knowledge.json, güncelleme " + knowledge.updated : "knowledge.json okunamadı; sınırlı yedek kullanıldı") + "): " + JSON.stringify(knowledge.findings || FALLBACK_FINDINGS),
        "TEKRAR ETME — ÖNCEKİ KONULAR (yalnızca kaydedilmiş kayıtlar; bunları ve çok benzerlerini önerme): " + JSON.stringify(previousTopics),
        "ARAŞTIRMA KURALI: Global kaynak listesinden örneklenen gerçek videoların yanında, güncel global web aramasıyla bağımsız kaynakları da araştır. Kaynak başlığı veya izlenme sayısından görünmeyen sahneler uydurma. Kaynağın mekanizmasını kopyalama; yalnızca desteklediği geniş ilkeyi çıkar ve özgün yeni bir olay kur. Birden fazla fikir üretme; iç değerlendirmeden sonra yalnızca en güçlü, somut finali olan bir fikir ve tam üretim promptu ver.",
        "KANAL MARKASI: Boş Dükkân yalnızca kanal adıdır; sahne markette veya dükkânda geçmek zorunda değildir.",
        "VİDEO KOŞULLARI: Tam 10 saniye, dikey 9:16, diyalogsuz, doğal ASMR sesleri. İlk 0,3 saniyede anlaşılır görsel kanca ve somut tamamlanmış final olmalı.",
        "KENDİ KANAL ANALYTICS ÖĞRENME BAĞLAMI (yalnızca tarayıcıda kaydedilmiş gerçek ölçümler; global kaynak yerine geçmez): " + JSON.stringify(ownAnalyticsLearning),
        "ÖNCEKİ FİKİR NOTLARI — TEKRAR ETME VE SADECE NESNEYİ DEĞİŞTİREREK KOPYALAMA: " + JSON.stringify(priorIdeaNotes || "Kayıtlı ek fikir notu yok.")
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

  const cachedAnalytics = readOwnAnalyticsSnapshot();
  const analyticsStatus = $('#ownAnalyticsLearningStatus');
  if (analyticsStatus && cachedAnalytics) {
    analyticsStatus.textContent = 'Bu cihazda yerel öğrenme önbelleği var: ' +
      cachedAnalytics.videos.filter(v => v.analyticsAvailable).length +
      ' ölçümlü video. Global konu paketi, yalnızca sen paketi oluşturup kopyaladığında bu özeti içerir.';
  }
  const clearAnalyticsCache = $('#clearOwnAnalyticsLearning');
  if (clearAnalyticsCache) clearAnalyticsCache.addEventListener('click', () => {
    try { localStorage.removeItem(OWN_ANALYTICS_KEY); } catch (e) {}
    try { window.bosOwnAnalyticsSnapshot = null; } catch (e) {}
    if (analyticsStatus) analyticsStatus.textContent = 'Yerel kanal ölçümü önbelleği temizlendi.';
  });

  window.BosDukkanComedyLearning = {
    version: 3,
    loadKnowledge,
    loadResearchBundle: getResearchBundle,
    readHistory,
    writeHistory,
    saveOwnAnalyticsSnapshot,
    readOwnAnalyticsSnapshot,
    buildOwnAnalyticsLearning
  };
})();
