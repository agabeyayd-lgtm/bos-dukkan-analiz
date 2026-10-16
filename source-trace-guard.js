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

  function formatNumber(value, maximumFractionDigits = 0) {
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits }).format(Number(value));
  }

  // Locks a source from the global YouTube search snapshot, never from the user's channel.
  // viewsPerDay is a rough lifetime-views / age-days proxy, not a historical daily metric.
  function chooseGlobalAnchor(research, capturedAt) {
    const rows = research && Array.isArray(research.videos) ? research.videos : [];
    const valid = rows.filter(v => v && v.id && v.title && Number.isFinite(Number(v.views)));
    if (!valid.length) return null;
    const pace = v => {
      const supplied = Number(v.viewsPerDay);
      if (Number.isFinite(supplied) && supplied > 0) return supplied;
      const age = Math.max(0.5, Number(v.ageDays) || 0.5);
      return Number(v.views) / age;
    };
    valid.sort((a, b) => pace(b) - pace(a) || Number(b.views) - Number(a.views));
    const v = valid[0];
    const timestamp = String(capturedAt || research.searchEndedAt || new Date().toISOString());
    const measuredDate = timestamp.slice(0, 10);
    const publishedDate = v.publishedAt ? String(v.publishedAt).slice(0, 10) : null;
    const id = String(v.id);
    return {
      sourceType: "global-youtube-public-metadata",
      source: research.source || "YouTube Data API v3 global search snapshot",
      query: research.query || null,
      videoId: id,
      title: String(v.title),
      channel: String(v.channel || ""),
      channelId: String(v.channelId || ""),
      publishedAt: publishedDate,
      ageDays: Number.isFinite(Number(v.ageDays)) ? Number(v.ageDays) : null,
      value: Number(v.views),
      formattedValue: formatNumber(v.views),
      metricKey: "publicLifetimeViews",
      metricLabel: "Kamusal toplam izlenme",
      measurementWindow: "Ölçüm zamanı " + measuredDate + "; ömür boyu birikimli sayaç, seçili Analytics dönemi değildir",
      approximateViewsPerDay: Number(pace(v).toFixed(2)),
      approximateViewsPerDayLabel: "Yaklaşık ömür boyu izlenme/gün (toplam izlenme ÷ video yaşı; kaba proxy, tarihsel günlük API metriği değildir)",
      durationSeconds: Number.isFinite(Number(v.seconds)) ? Number(v.seconds) : null,
      videoUrl: "https://www.youtube.com/watch?v=" + id,
      evidenceBoundary: "Global YouTube metadata verifies the public source record and counters, not the exact visual scene or the cause of performance."
    };
  }

  function numberTokenMatches(text, expectedValue) {
    const raw = String(text == null ? "" : text);
    const match = raw.match(/^\s*(?:[:=]\s*)?([-+]?\d[\d.,\s]*)/);
    if (!match) return false;
    const token = match[1].trim().replace(/\s+/g, "");
    const expected = Number(expectedValue);
    const candidates = [
      Number(token),
      Number(token.replace(/\./g, "").replace(",", ".")),
      Number(token.replace(/,/g, "")),
      Number(token.replace(/,/g, "."))
    ].filter(Number.isFinite);
    const tolerance = Number.isInteger(expected) ? 0.000001 : 0.011;
    return candidates.some(value => Math.abs(value - expected) <= tolerance);
  }

  function urlsFrom(text) {
    const matches = String(text || "").match(/https?:\/\/[^\s<>"\])}]+/gi) || [];
    return matches.map(raw => {
      const cleaned = raw.replace(/[.,;!?]+$/, "");
      try { return { raw: cleaned, host: new URL(cleaned).hostname.toLowerCase() }; }
      catch (_) { return { raw: cleaned, host: "" }; }
    });
  }

  function validate(output, anchor) {
    const raw = String(output == null ? "" : output);
    const normalized = normalizeText(raw);
    const rawLines = raw.split(/\r?\n/);
    const normalizedLines = rawLines.map(normalizeText);
    const errors = [], checks = {};
    const test = (name, condition, message) => {
      checks[name] = Boolean(condition);
      if (!condition) errors.push(message);
    };

    test("output-present", raw.trim().length > 0, "Model çıktısını kontrol alanına yapıştır.");
    test("global-anchor-present", Boolean(anchor && anchor.videoId && anchor.title && Number.isFinite(Number(anchor.value)) && anchor.videoUrl),
      "Global YouTube arama kaydından sabitlenmiş kaynak yok. Önce Trend keşfi > Analiz et çalıştır; yine de fikir üretimi durmaz.");
    if (!anchor || !anchor.videoId || !anchor.title || !Number.isFinite(Number(anchor.value)) || !anchor.videoUrl) {
      return { ok: false, checks, errors, label: "GLOBAL KAYNAK KAYDI YOK" };
    }

    test("source-section", normalized.includes("bu fikir nereden cikti") || normalized.includes("global kaynak izi"),
      "“Bu fikir nereden çıktı?” başlıklı global kaynak bölümü eksik.");

    const sourceLineIndex = normalizedLines.findIndex(line =>
      line.startsWith("global kaynak ") &&
      line.includes(normalizeText(anchor.videoId)) &&
      line.includes(normalizeText(anchor.title))
    );
    const sourceLine = sourceLineIndex >= 0 ? normalizedLines[sourceLineIndex] : "";
    const rawSourceLine = sourceLineIndex >= 0 ? rawLines[sourceLineIndex] : "";
    test("global-source-line", Boolean(sourceLine),
      "“GLOBAL KAYNAK:” satırında sabit global video ID'si ve tam başlık birlikte yok.");
    test("global-source-id-case", rawSourceLine.includes(String(anchor.videoId)),
      "Sabitlenmiş global video ID'si GLOBAL KAYNAK satırında birebir bulunmuyor.");
    test("global-source-title", sourceLine.includes(normalizeText(anchor.title)),
      "Sabitlenmiş tam global video başlığı GLOBAL KAYNAK satırında yok.");
    test("global-youtube-url", rawSourceLine.includes(anchor.videoUrl) ||
      (rawSourceLine.includes("youtube.com") && rawSourceLine.includes(String(anchor.videoId))),
      "GLOBAL KAYNAK satırında aynı video ID'sine giden resmi YouTube URL'si yok.");

    const metricLabel = String(anchor.metricLabel || "Kamusal toplam izlenme");
    const metricIndex = rawSourceLine.toLocaleLowerCase("tr-TR").indexOf(metricLabel.toLocaleLowerCase("tr-TR"));
    const valueRemainder = metricIndex >= 0
      ? rawSourceLine.slice(metricIndex + metricLabel.length, metricIndex + metricLabel.length + 45)
      : "";
    test("global-source-metric", metricIndex >= 0,
      "GLOBAL KAYNAK satırında “" + metricLabel + "” sayacı yok.");
    test("global-source-value", numberTokenMatches(valueRemainder, anchor.value),
      "Global YouTube kaydındaki kamusal izlenme değeri metrik adının hemen yanında yok: " + anchor.formattedValue + ".");
    test("global-source-channel", !anchor.channel || sourceLine.includes(normalizeText(anchor.channel)),
      "Global kaynak satırında API kaydındaki kanal adı yok.");
    test("global-source-date", !anchor.publishedAt || sourceLine.includes(normalizeText(anchor.publishedAt)),
      "Global kaynak satırında API kaydındaki yayın tarihi yok.");
    test("global-source-window", sourceLine.includes(normalizeText(anchor.measurementWindow)),
      "GLOBAL KAYNAK satırında sayaç sınırı belirtilmemiş. Bunun ömür boyu toplam ve ölçüm zamanı olduğu açıkça yazılmalı.");

    const webLine = normalizedLines.find(line => line.startsWith("global web kontrolu ")) || "";
    const rawWebLine = rawLines[normalizedLines.indexOf(webLine)] || "";
    const webUrls = urlsFrom(rawWebLine);
    const externalWebUrls = webUrls.filter(u =>
      u.host && !/(^|\.)youtube\.com$/.test(u.host) &&
      !/(^|\.)youtu\.be$/.test(u.host) &&
      !/(^|\.)youtube-browser-api\.netlify\.app$/.test(u.host) &&
      !/(^|\.)ytimg\.com$/.test(u.host)
    );
    const explicitlyUnavailable = /bagimsiz (?:metinsel )?kaynak bulunamadi|ikinci kaynak bulunamadi|bagimsiz dogrulama bulunamadi|ek kaynak bulunamadi|yalnizca metadata dogrulandi|yalnizca youtube metadata/.test(webLine);
    test("global-web-check-stated", Boolean(webLine) && (externalWebUrls.length > 0 || explicitlyUnavailable),
      "“GLOBAL WEB KONTROLÜ:” satırında bağımsız bir yazılı kaynak URL'si veya bulunamadığına dair açık not yok. Video izlemek yerine global web çapraz kontrolü yap; bulamazsan bunu dürüstçe yaz.");

    const visualLine = normalizedLines.find(line => line.startsWith("gorsel sahne durumu ")) || "";
    const visualBoundary = /izlenmedi|izlenemedi|dogrulanmadi|sahne bilinmiyor|metadata.*kanıtlamaz|metaveri.*kanıtlamaz|metaveri.*kanıtlamaz|yalnizca metadata/.test(visualLine);
    test("visual-limit-stated", Boolean(visualLine) && visualBoundary,
      "“GÖRSEL SAHNE DURUMU:” satırı yok veya izlenmeyen/doğrulanmayan sahne sınırı açıkça belirtilmemiş. Video izleme şart değil; bilinmeyeni bilinmiyor diye etiketle.");

    test("source-principle", normalizedLines.some(line => line.startsWith("kaynaktan alinan ilke ") && line.length > 45),
      "Global kaynaktan çıkarılan geniş ilkeyi açıklayan “KAYNAKTAN ALINAN İLKE:” satırı eksik.");
    test("idea-bridge", normalizedLines.some(line => line.startsWith("global isaretten fikre gecis ") && line.length > 55),
      "“GLOBAL İŞARETTEN FİKRE GEÇİŞ:” satırında global kaynak işaretinden yeni fikre geçiş açıklanmamış.");
    test("creative-leap", normalizedLines.some(line => line.startsWith("ozgun yaratici sicrama ") && /ozgun|degisik|farkli|yeni/.test(line)),
      "“ÖZGÜN YARATICI SIÇRAMA:” satırında kaynaktan farklı yeni yaklaşım açıklanmamış.");
    test("not-copied", normalizedizedHasLine(normalizedLines, "kopyalanmayan unsurlar"),
      "Kaynağın hangi öğelerinin kopyalanmadığını belirten “KOPYALANMAYAN UNSURLAR:” satırı eksik.");
    test("evidence-limits", normalizedLines.some(line => line.startsWith("kanit siniri ") && /sahne|basari|neden|metaveri|izlenme/.test(line)),
      "“KANIT SINIRI:” satırı metadata/izlenme sayısının gerçek sahneyi veya başarı nedenini kanıtlamadığını belirtmeli.");
    test("hypothesis", normalizedLines.some(line => line.startsWith("test durumu ") && line.includes("test edilmemis yaratici hipotez")),
      "“TEST DURUMU:” satırında “test edilmemiş yaratıcı hipotez” etiketi yok.");

    return {
      ok: errors.length === 0,
      checks,
      errors,
      label: errors.length === 0 ? "GLOBAL KAYNAK İZİ TAM; SAHNE DOĞRULAMASI AYRI" : "GLOBAL KAYNAK İZİ EKSİK"
    };
  }

  function normalizedizedHasLine(lines, prefix) {
    return lines.some(line => line.startsWith(normalizeText(prefix)) && line.length > normalizeText(prefix).length + 5);
  }

  return { chooseGlobalAnchor, validate, normalizeText };
});
