# Boş Dükkân Komedi Motoru ve Veri Analizi

**Canlı panel:** https://agabeyayd-lgtm.github.io/bos-dukkan-analiz/

## Amaç
Konu motorunun temel görevi komediyi kendisinin üretip kullanıcıya vermesidir. Kanal verisi ve trendler destekleyici sinyallerdir; fikir üretimini daraltan şartlar veya veto kapıları değildir.

## Yalnızca üç zorunlu video koşulu
- Tam 10 saniye.
- Dikey 9:16, YouTube Shorts.
- Diyalogsuz, ASMR odaklı ses.

Bunun dışında sabit mizah türü, fizik/gerçekçilik şartı, tek duygu veya davranış şartı, oyunculuk stili, puan eşiği ya da otomatik ret listesi yoktur.

## Panel akışı
1. **Trend keşfi:** YouTube Data API v3 ile seçili arama penceresindeki videoların erişilebilir sayaçlarını toplar. Bu sınırlı bir örneklemdir.
2. **Kendi kanal verim:** Google OAuth ve YouTube Analytics API ile seçili dönem performansı alınır.
3. **Komedi üretimi:** Veri paketi trend ve kanal sinyallerini yardımcı bağlam olarak iletir. Model her çalıştırmada tek güçlü komedi fikri, 10 saniyelik akış ve kopyalanabilir tam video promptu üretmelidir.

## Yaratıcı özgürlük
Deadpan, doğal veya abartılı oyunculuk, absürt/gerçeküstü komedi, fiziksel gag, nesne değişimi, beklenmedik kurgu ve diğer yaratıcı yollar otomatik olarak yasaklanamaz. Önceki fikirler, veri eksikliği veya üretim riski komedi üretimini durduramaz.

## Veri doğruluğu
Ölçülmeyen metrikleri uydurma; korelasyonu neden-sonuç diye sunma; bir videonun sahnesi görülmediyse onu gözlemlenmiş gibi anlatma. Bu sınırlar yeni kurmaca komedi fikri üretmeye engel değildir. Panel kendi başına yapay zekâ sonucu üretmez; kopyalanan paket sohbet içinde kullanılır.

## Dosyalar
- `index.html`: GitHub Pages ana paneli.
- `bos-dukkan-analiz.html`: panelin ikinci kopyası.
- `TOPIC_ENGINE_SPEC.md`: komedi üretim motorunun temel talimatı.
- `HUMOR_RUBRIC.md`: komedi üretim rehberi; puanlama kapısı veya otomatik ret listesi içermez.
- `.github/workflows/pages.yml`: GitHub Pages dağıtımı.
