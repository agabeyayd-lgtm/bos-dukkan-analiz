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
  "Bu ölçüm yalnızca erişim düzeyini gösterir; sahne mekanizmasını veya başarının nedenini kanıtlamaz.",
  "Başlığın genel öncülü fikir seçimini yönlendirdi; somut görsel olay yaratıcı sıçrama olarak eklendi.",
  "Bu fikir test edilmemiş yaratıcı hipotezdir."
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
test("rejects responses that omit the locked source ID", () => {
  const result = SourceTraceGuard.validate(validOutput.replace("wEA-VZhxq6Y", "another-video-id"), anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => e.includes("ID")));
});
test("rejects missing creative leap, limitation, or hypothesis labels", () => {
  const incomplete = validOutput.replace("yaratıcı sıçrama", "yeni bölüm")
    .replace("kanıtlamaz", "gösterir").replace("test edilmemiş yaratıcı hipotez", "kesin sonuç");
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
