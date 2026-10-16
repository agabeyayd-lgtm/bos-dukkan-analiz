(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SourceTraceGuard = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";
  function normalizeText(value) {
    return String(value == null ? "" : value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("tr-TR").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
  }
  function firstValid(candidates) {
    for (const candidate of candidates) {
      const item = candidate && candidate.item;
      if (!item || !item.videoId || !item.title || !Number.isFinite(Number(item.value))) continue;
      return {
        sourceType: candidate.sourceType, videoId: String(item.videoId), title: String(item.title),
        metricKey: String(item.metric || candidate.metricKey), metricLabel: candidate.metricLabel,
        value: Number(item.value),
        formattedValue: new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(item.value)),
        measurementWindow: candidate.measurementWindow, source: candidate.source || "",
        evidenceBoundary: "This is a measured performance signal; it does not prove what visual scene caused the performance."
      };
    }
    return null;
  }
  function chooseAnchor(evidence, videos, reportingWindowDays, source) {
    const leaders = evidence && evidence.metricLeaders ? evidence.metricLeaders : {};
    const windowText = "Son " + Number(reportingWindowDays || 0) + " günlük YouTube Analytics ölçüm dönemi";
    const measured = firstValid([
      { item: leaders.highestWindowViews, sourceType: "measured-analytics-period", metricKey: "viewsInWindow",
        metricLabel: "Seçili dönem izlenmesi", measurementWindow: windowText, source },
      { item: leaders.highestObservedDailyViewPace, sourceType: "measured-observed-daily-pace", metricKey: "viewsPerObservedDay",
        metricLabel: "Gözlenen gün başına izlenme hızı",
        measurementWindow: windowText + "; günlük hız, dönem izlenmesinin gözlenen gün sayısına bölünmesidir", source }
    ]);
    if (measured) return measured;
    const publicRows = (Array.isArray(videos) ? videos : [])
      .filter(v => v && v.id && v.title && Number.isFinite(Number(v.publicLifetimeViews)))
      .slice().sort((a,b) => Number(b.publicLifetimeViews)-Number(a.publicLifetimeViews));
    if (!publicRows.length) return null;
    const v = publicRows[0];
    return {
      sourceType: "public-lifetime-counter-fallback", videoId: String(v.id), title: String(v.title),
      metricKey: "publicLifetimeViews", metricLabel: "Kamusal ömür boyu toplam izlenme",
      value: Number(v.publicLifetimeViews),
      formattedValue: new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(Number(v.publicLifetimeViews)),
      measurementWindow: "Videonun yayımlandığı tarihten ölçüm anına kadar; seçili Analytics dönemi değildir",
      source: source || "YouTube Data API v3 public video statistics",
      evidenceBoundary: "Public lifetime views are not a period metric and cannot prove which scene caused performance."
    };
  }
  function numberTokenMatches(text, expectedValue) {
    const expected = String(Math.round(Number(expectedValue)));
    const tokens = String(text).match(/\d[\d.,\s]*\d|\d/g) || [];
    return tokens.some(token => token.replace(/\D/g, "") === expected);
  }
  function validate(output, anchor) {
    const raw = String(output == null ? "" : output), normalized = normalizeText(raw);
    const normalizedLines = raw.split(/\r?\n/).map(normalizeText);
    const errors = [], checks = {};
    const test = (name, condition, message) => { checks[name] = Boolean(condition); if (!condition) errors.push(message); };
    test("output-present", raw.trim().length > 0, "Model çıktısını kontrol alanına yapıştır.");
    test("anchor-present", Boolean(anchor && anchor.videoId && anchor.title && Number.isFinite(Number(anchor.value))),
      "Kodun sabitlediği gerçek kaynak kaydı yok; bu çıktı kaynak bakımından doğrulanamaz.");
    if (!anchor || !anchor.videoId || !anchor.title || !Number.isFinite(Number(anchor.value))) {
      return { ok: false, checks, errors, label: "DOĞRULANAMADI" };
    }
    test("source-section", normalized.includes("bu fikir nereden cikti") || normalized.includes("fikrin kaynak izi"),
      "“Bu fikir nereden çıktı?” kaynak bölümü eksik.");
    test("video-id", normalized.includes(normalizeText(anchor.videoId)),
      "Kaynak kaydının tam YouTube video ID'si çıktıda yok veya farklı.");
    test("video-title", normalized.includes(normalizeText(anchor.title)),
      "Kaynak kaydının tam video başlığı çıktıda yok veya farklı.");
    test("metric-label", normalized.includes(normalizeText(anchor.metricLabel)),
      "Doğru ölçüm adı çıktıda yok: " + anchor.metricLabel + ".");
    test("metric-value", numberTokenMatches(raw, anchor.value),
      "Gerçek ölçüm değeri çıktıda görünmüyor: " + anchor.formattedValue + ".");
    test("measurement-window", normalized.includes(normalizeText(anchor.measurementWindow)),
      "Ölçüm penceresi/sayaç sınırı tam belirtilmemiş: " + anchor.measurementWindow + ".");
    test("idea-bridge", normalizedLines.some(line => line.startsWith("veriden fikre gecis ") && /yonlendirdi|cikarim|baglanti/.test(line)),
      "“VERİDEN FİKRE GEÇİŞ:” başlıklı ayrı satırda veri-fikir bağlantısı açıklanmamış.");
    test("link-strength", normalizedLines.some(line => line.startsWith("bagin gucu ") && line.includes("dolayli zayif bag")),
      "“BAĞIN GÜCÜ: dolaylı/zayıf bağ” ayrı satırı eksik.");
    test("creative-leap", normalizedLines.some(line => line.startsWith("yaratici sicrama ") && /veriden cikmadi|yaratici deney/.test(line)),
      "“YARATICI SIÇRAMA:” satırında mekanizmanın veriden çıkmadığı/yaratıcı deney olduğu açık değil.");
    test("limits", normalizedLines.some(line => line.startsWith("verinin kanitlamadigi ") && /sahne|basari|neden/.test(line)),
      "“VERİNİN KANITLAMADIĞI:” satırında verinin sahne/başarı nedenini kanıtlamadığı belirtilmemiş.");
    test("hypothesis", normalizedLines.some(line => line.startsWith("test durumu ") && line.includes("test edilmemis yaratici hipotez")),
      "“TEST DURUMU:” satırında fikir test edilmemiş yaratıcı hipotez olarak etiketlenmemiş.");
    return { ok: errors.length === 0, checks, errors, label: errors.length === 0 ? "KAYNAK İZİ KONTROLLERİ GEÇTİ" : "KAYNAK İZİ EKSİK" };
  }
  return { chooseAnchor, validate, normalizeText };
});
