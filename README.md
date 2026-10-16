# Boş Dükkân Komedi Motoru ve Veri Analizi

**Canlı panel:** https://agabeyayd-lgtm.github.io/bos-dukkan-analiz/

## Amaç
Her çalıştırmada tek, yeni komedi fikri ve doğrudan kullanılabilir tam video üretim promptu üretmek. Veri, fikrin seçiminde gerçek bir rol oynar; ama veri eksikliği üretimi durdurmaz.

## Yalnızca üç zorunlu video koşulu
- Tam 10 saniye.
- Dikey 9:16, YouTube Shorts.
- Diyalogsuz, ASMR odaklı ses.

Bunun dışında sabit mizah türü, fizik/gerçekçilik şartı, tek duygu veya davranış şartı, oyunculuk stili, puan eşiği ya da otomatik ret listesi yoktur.

## Konu seçiminin kalıcı çalışma sırası
1. **Paket dışı sohbeti sıfırla.** Önceki konuşmalardaki asistan fikirlerini yeni fikir diye yeniden kullanma. Yalnızca yeni paketteki kanal verisi, trend sinyali, gözle doğrulanmış notlar ve açıkça girilmiş fikir geçmişini kullan.
2. **Ölçümleri ayır.** Panel her pakette kodla farklı metrik liderlerini hesaplar: dönem görüntülenmesi, gözlenen gün başına görüntülenme hızı, ortalama izleme saniyesi, ortalama izlenen yüzde, mutlak abone kazanımı, 1000 görüntülenme başına abone kazanımı ve beğeni oranı. Bunlar tek bir puana karıştırılmaz.
3. **Veriyi konu seçimine bağla.** Görüntülenme hacmi ana hedeftir; diğer metrikler farklı performans yönlerini gösteren ayrı yardımcı sinyallerdir. Video başlığı yalnızca konu/öncül ipucudur, gerçek sahne kanıtı değildir. Başlıktan görülmemiş sahne uydurma.
4. **Özgün fikir seç.** Birkaç farklı yaklaşımı kendi içinde değerlendir, tek fikri sun. Yüksek performanslı videonun aynısını ya da yalnızca nesnesi değiştirilmiş kopyasını üretme. Veriden ilham al, fakat ölçümlerin kanıtlamadığı bir başarı nedeni iddia etme.
5. **Kanıt türünü etiketle.** Ölçülmüş bulgu; başlık/metadata ipucu; gerçekten izlenmiş sahne notu; test edilmemiş yaratıcı hipotez birbirinden ayrı tutulur.\n6. **Her fikrin kaynağını açıkla.** Paket, kodla hesaplanan metrik liderlerini ayrıca `A3. Fikir Seçiminde Kullanılabilecek Gerçek Kanıt Haritası` bölümüne koyar. Çıktı, fikri seçmeden önce ilgili video başlığını/ID'sini, ölçüm değerini ve dönemini; ölçümün desteklediği sınırlı çıkarımı; yaratıcı sıçramayı; verinin kanıtlamadığı kısmı yazmalıdır. Veri fikrin mekanizmasını göstermiyorsa “bu mekanizma veriden çıkmadı; yaratıcı deney olarak seçildi” demelidir.

## Fikir kaynağı izi
Fikir seçimi önce ölçülmüş kanal sinyali, sonra yaratıcı geliştirme sırasıyla yapılır. Her çıktıda ilgili video ID'si/başlığı, metrik değeri ve ölçüm penceresi gösterilir; ölçümün desteklediği sınırlı çıkarım, yaratıcı sıçrama ve verinin kanıtlamadığı noktalar ayrı yazılır. Somut komedi mekanizması ölçümden çıkmadıysa açıkça “Bu mekanizma veriden çıkmadı; yaratıcı sıçrama olarak eklendi” denir. Rastgele fikri sonradan metrikle haklı gösterme yasaktır.

## Veri kaynağı ve sınırlar
- Trend keşfi: YouTube Data API v3 aramasından gelen sınırlı bir örneklemdir; YouTube'un tamamını temsil etmez.
- Kendi kanalın: Google OAuth ve YouTube Analytics API ile seçili dönem performansı.
- Yorumlar, tam video ID'sine göre eşleştirilen küçük örneklerdir; tüm izleyicileri temsil etmez ve sahne kanıtı değildir.
- Eksik metrikler sıfır sayılmaz. Farklı ölçüm dönemleri ve ömür boyu sayaçlar birbirine karıştırılmaz.
- Dış video görsel olarak izlenmediyse gerçek sahne mekanizması bilinmiyor olarak kalır.

## Kaynak izi için programatik kontrol
Konu Motoru, fikirden önce gerçek YouTube Analytics ölçümleri arasından bir kaynak kaydını kodla sabitler (öncelik: seçili dönemde en çok izlenen video; gerekirse günlük hız; son çare olarak ayrı etiketlenmiş kamusal ömür boyu izlenme). Bu kayıt pakete açık video ID'si, başlık, metrik, değer ve ölçüm penceresiyle eklenir.

Model yanıtı geri yapıştırıldığında **Kaynak izini kontrol et** düğmesi bu alanların tümünü, ayrı bir **“VERİDEN FİKRE GEÇİŞ”** açıklamasını, yaratıcı sıçramayı ve kanıt sınırı etiketlerini denetler. Zorunlu alanlardan biri eksikse sonuç geçmez ve doğrulanmış sayılmaz. Kontrol kaynak kaydına doğru atıf yapıldığını ve açıklamanın gerekli alanlarını içerdiğini garanti eder; modelin iç düşünce sırasını, semantik bağın kusursuzluğunu veya videonun başarıya ulaşacağını garanti edemez. Panel kendi başına yapay zekâ modeli çalıştırmaz.

## Dosyalar
- `index.html`: GitHub Pages ana paneli.
- `bos-dukkan-analiz.html`: panelin ikinci kopyası.
- `TOPIC_ENGINE_SPEC.md`: motorun veri-karar ve yaratıcılık sözleşmesi.
- `HUMOR_RUBRIC.md`: zorunlu biçim şartları ve kanıt rehberi; puanlama kapısı içermez.
- `.github/workflows/pages.yml`: JavaScript sözdizimi ve motor talimatları için regresyon kontrolü ile dağıtım.
