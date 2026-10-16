const test = require("node:test");
const assert = require("node:assert/strict");
const SourceTraceGuard = require("../source-trace-guard.js");

const research = {
  source: "YouTube Data API v3 global search snapshot",
  query: "global visual comedy",
  searchEndedAt: "2026-10-16T15:00:00.000Z",
  videos: [
    {
      id: "globalAB12345", title: "A Big Everyday Surprise", channel: "World Laughs",
      channelId: "UCglobalchannel", publishedAt: "2026-10-14T10:00:00.000Z",
      ageDays: 2.2, views: 125000, viewsPerDay: 56818, seconds: 12
    },
    {
      id: "globalCD67890", title: "A Smaller Example", channel: "Tiny Comedy",
      publishedAt: "2026-10-15T10:00:00.000Z", ageDays: 1.2, views: 50000, viewsPerDay: 41666, seconds: 15
    }
  ]
};
const anchor = SourceTraceGuard.chooseGlobalAnchor(research, research.searchEndedAt);
const validOutput = [
  "## BU FİKİR NEREDEN ÇIKTI? — GLOBAL KAYNAK İZİ",
  "GLOBAL KAYNAK: \"A Big Everyday Surprise\" | Video ID: globalAB12345 | Kanal: World Laughs | Yayın: 2026-10-14 | Kamusal toplam izlenme: 125.000 | Ölçüm zamanı 2026-10-16; ömür boyu birikimli sayaç, seçili Analytics dönemi değildir | https://www.youtube.com/watch?v=globalAB12345",
  "GLOBAL WEB KONTROLÜ: Başlık/kimlik YouTube kaydıyla eşleşti; bağımsız yazılı açıklama aynı geniş öncülü destekliyor: https://example.org/clip-context",
  "GÖRSEL SAHNE DURUMU: Video izlenmedi; tam görsel sahne doğrulanmadı, bu yüzden eylem gözlenmiş gibi anlatılmıyor.",
  "KAYNAKTAN ALINAN İLKE: Geniş öncül beklenmedik bir gündelik durumdan geliyor; kesin sahne mekanizması kaynak metaverisinden çıkmıyor.",
  "GLOBAL İŞARETTEN FİKRE GEÇİŞ: Global kaynak yalnızca öncül yönü sağlıyor; yeni fikrin karakter ve görsel mekanizması ayrıca geliştirildi.",
  "ÖZGÜN YARATICI SIÇRAMA: Kaynaktan farklı, yeni bir görsel komedi mekanizması kuruldu.",
  "KOPYALANMAYAN UNSURLAR: Kaynağın aynı eylemi, karakterleri, nesne dizilimi ve finali kopyalanmadı.",
  "KANIT SINIRI: Toplam izlenme ve metaveri gerçek sahneyi, izleyicinin neden izlediğini veya yeni fikrin başarısını kanıtlamaz.",
  "TEST DURUMU: test edilmemiş yaratıcı hipotez."
].join("\n");

test("selects a global YouTube source, never the user's own analytics", () => {
  assert.equal(anchor.videoId, "globalAB12345");
  assert.equal(anchor.value, 125000);
  assert.equal(anchor.metricLabel, "Kamusal toplam izlenme");
  assert.equal(anchor.publishedAt, "2026-10-14");
  assert.match(anchor.measurementWindow, /ömür boyu birikimli sayaç/i);
  assert.equal(anchor.videoUrl, "https://www.youtube.com/watch?v=globalAB12345");
});

test("validates global source identity and the no-watching verification alternative", () => {
  const result = SourceTraceGuard.validate(validOutput, anchor);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.label, "GLOBAL KAYNAK İZİ TAM; SAHNE DOĞRULAMASI AYRI");
});

test("rejects an output tied to a different source ID", () => {
  const result = SourceTraceGuard.validate(validOutput.replace(/globalAB12345/g, "wrongsource12"), anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => /video ID|ID'si|YouTube URL/i.test(e)));
});

test("rejects a false view count in the locked global source line", () => {
  const result = SourceTraceGuard.validate(validOutput.replace("125.000", "9.999"), anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => /izlenme değeri/i.test(e)));
});

test("requires a direct global YouTube source URL", () => {
  const result = SourceTraceGuard.validate(validOutput.replace("https://www.youtube.com/watch?v=globalAB12345", "kaynak bağlantısı yok"), anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => /resmi YouTube URL/i.test(e)));
});

test("allows an honest disclosure when no independent written source exists", () => {
  const output = validOutput.replace(
    "Başlık/kimlik YouTube kaydıyla eşleşti; bağımsız yazılı açıklama aynı geniş öncülü destekliyor: https://example.org/clip-context",
    "Başlık/kimlik YouTube kaydıyla eşleşti; bağımsız metinsel kaynak bulunamadı, yalnızca YouTube metaverisi doğrulandı."
  );
  const result = SourceTraceGuard.validate(output, anchor);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test("rejects a source trace that hides the viewing limitation", () => {
  const result = SourceTraceGuard.validate(validOutput.replace(/GÖRSEL SAHNE DURUMU:.*/, ""), anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => /GÖRSEL SAHNE DURUMU/i.test(e)));
});

test("rejects a generic or copied idea without a source-to-idea bridge", () => {
  const result = SourceTraceGuard.validate(validOutput.replace(/GLOBAL İŞARETTEN FİKRE GEÇİŞ:.*/, ""), anchor);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(e => /GLOBAL İŞARETTEN FİKRE GEÇİŞ/i.test(e)));
});

test("does not create a fake global anchor when no trend results exist", () => {
  assert.equal(SourceTraceGuard.chooseGlobalAnchor({ videos: [] }, "2026-10-16"), null);
  assert.equal(SourceTraceGuard.validate(validOutput, null).ok, false);
});
