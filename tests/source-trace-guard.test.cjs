const test = require("node:test");
const assert = require("node:assert/strict");
const SourceTraceGuard = require("../source-trace-guard.js");
const evidence = { metricLeaders: { highestWindowViews: {
  videoId: "wEA-VZhxq6Y", title: "Not Every Ice Cream Container Has Ice Cream",
  metric: "viewsInWindow", value: 27569
}, highestObservedDailyViewPace: null } };
const anchor = SourceTraceGuard.chooseAnchor(evidence, [], 28, "YouTube Analytics API v2");
const validOutput = [
  "## BU FİKİR NEREDEN ÇIKTI?",
  "Ölçülmüş bulgu: Not Every Ice Cream Container Has Ice Cream (video ID wEA-VZhxq6Y).",
  "Seçili dönem izlenmesi: 27,569. Son 28 günlük YouTube Analytics ölçüm dönemi.",
  "ÖLÇÜLMÜŞ BULGU: Not Every Ice Cream Container Has Ice Cream (video ID wEA-VZhxq6Y); seçili dönem izlenmesi 27,569; son 28 günlük YouTube Analytics ölçüm dönemi.",
  "VERİDEN FİKRE GEÇİŞ: Bu ölçüm başlığın genel öncülünü fikir seçimine yönlendirdi; bu bağlantıyı sınırlı tutuyorum.",
  "BAĞIN GÜCÜ: dolaylı/zayıf bağ; izlenme sayısı sahnenin neden tuttuğunu kanıtlamaz.",
  "YARATICI SIÇRAMA: Bu mekanizma veriden çıkmadı; yaratıcı deney olarak eklendi.",
  "VERİNİN KANITLAMADIĞI: Ölçüm, önerilen görsel sahnenin başarılı olacağını veya izlenme nedenini kanıtlamaz.",
  "TEST DURUMU: test edilmemiş yaratıcı hipotez."
].join("\n");

test("selects measured period reach leader as locked source", () => {
  assert.equal(anchor.videoId, "wEA-VZhxq6Y");
  assert.equal(anchor.value, 27569);
  assert.equal(anchor.metricLabel, "Seçili dönem izlenmesi");
  assert.equal(anchor.measurementWindow, "Son 28 günlük YouTube Analytics ölçüm dönemi");
});
test("accepts a response only when source ID, title, metric, value, window and caveats are present", () => {
  const result = SourceTraceGuard.validate(validOutput, anchor);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});
test("rejects metric values copied elsewhere when the measured-finding source line is incomplete", () => {
  const incomplete = validOutput
    .replace("seçili dönem izlenmesi 27,569; son 28 günlük YouTube Analytics ölçüm dönemi", "seçili dönem izlenmesi yok; dönem belirsiz")
    .replace("27,569", "0");
  const result = SourceTraceGuard.validate(incomplete, anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("ÖLÇÜLMÜŞ BULGU satırında")));
});
test("rejects responses that omit the locked source ID", () => {
  const result = SourceTraceGuard.validate(validOutput.replace(/wEA-VZhxq6Y/g, "another-video-id"), anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("ID")));
});
test("rejects a case-changed source video ID", () => {
  const incomplete = validOutput.replace(/wEA-VZhxq6Y/g, "wea-VZhxq6Y");
  const result = SourceTraceGuard.validate(incomplete, anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("birebir")));
});
test("rejects the right metric value when it appears after unrelated text", () => {
  const incomplete = validOutput.replace(
    "seçili dönem izlenmesi 27,569;",
    "seçili dönem izlenmesi bilinmiyor; 27,569;"
  );
  const result = SourceTraceGuard.validate(incomplete, anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("hemen yanında")));
});
test("accepts a dot-grouped count format as the same measured value", () => {
  const localized = validOutput.replace(/27,569/g, "27.569");
  const result = SourceTraceGuard.validate(localized, anchor);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});
test("rejects a source citation without a clear data-to-idea bridge", () => {
  const incomplete = validOutput.replace(/VERİDEN FİKRE GEÇİŞ:.*/, "");
  const result = SourceTraceGuard.validate(incomplete, anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("GEÇİŞ")));
});
test("rejects a response that does not label the data-idea link as indirect or weak", () => {
  const incomplete = validOutput.replace(/BAĞIN GÜCÜ:.*/, "");
  const result = SourceTraceGuard.validate(incomplete, anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("BAĞIN GÜCÜ")));
});
test("rejects missing creative leap, limitation, or hypothesis labels", () => {
  const incomplete = validOutput.replace(/YARATICI SIÇRAMA:.*/, "")
    .replace(/VERİNİN KANITLAMADIĞI:.*/, "")
    .replace(/TEST DURUMU:.*/, "");
  const result = SourceTraceGuard.validate(incomplete, anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.length >= 3);
});
test("uses public lifetime counters only as a labelled fallback", () => {
  const fallback = SourceTraceGuard.chooseAnchor({ metricLeaders: {} },
    [{ id: "public123", title: "Public counter example", publicLifetimeViews: 1234 }], 28, "YouTube Data API v3");
  assert.equal(fallback.sourceType, "public-lifetime-counter-fallback");
  assert.equal(fallback.value, 1234);
  assert.match(fallback.measurementWindow, /seçili Analytics dönemi değildir/i);
});
test("does not fabricate a source anchor when no usable metrics exist", () => {
  assert.equal(SourceTraceGuard.chooseAnchor({ metricLeaders: {} }, [], 28, "test"), null);
  assert.equal(SourceTraceGuard.validate(validOutput, null).ok, false);
});
