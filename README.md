# Boş Dükkân Global Komedi Motoru ve Veri Analizi

**Canlı panel:** https://agabeyayd-lgtm.github.io/bos-dukkan-analiz/

## Amaç
Her çalıştırmada global içerik ve global kaynak araştırmasından yararlanarak tek, yeni komedi fikri ve doğrudan kullanılabilir tam video promptu üretmek. Video izleme veya ekran kaydı mümkün olmadığında fikir üretimi durmamalı.

## Tek zorunlu video koşulları
- Tam 10 saniye.
- Dikey 9:16 YouTube Shorts.
- Diyalogsuz, ASMR odaklı doğal ses.

Bunun dışında sabit mizah türü, fizik/gerçekçilik şartı, oyunculuk stili, puan eşiği veya otomatik ret listesi yoktur.

## Kaynak kuralı: global, kendi kanalın değil
- Yeni fikir için kaynaklar global YouTube araması ve global web araştırmasıdır.
- Kendi kanalının ölçümleri yeni konuyu, sahneyi veya komedi mekanizmasını seçmez; yalnızca yayın sonrası kıyaslama içindir.
- Global YouTube arama örneklemi en fazla 50 video gibi arama/sıralama sınırlamalarına sahiptir; tüm Shorts evrenini temsil etmez.
- Her kaynak tam video ID'si ve resmi YouTube URL'si ile sabitlenir.

## Video izlemeye alternatif doğrulama
1. YouTube Data API kaydından video ID'si, tam başlığı, kanal, yayın tarihi, süre ve kamusal sayaçları kontrol et.
2. Aynı video ID'si ve tam başlığı global webde ara.
3. Mümkünse YouTube dışı bağımsız yazılı kaynak URL'si ekle. Kaynak bulunamazsa bunu açıkça yaz.
4. Video gerçek görüntüleri incelenmediyse “görsel sahne doğrulanmadı” diye belirt. Başlık, kapak görseli, yorum veya sayaçtan görülmeyen eylem uydurma.
5. Bu sınırlama komedi fikrinin ve tam promptun üretilmesini durdurmaz.

Global webde yazılı kaynak bulmak, videonun kimliğini veya geniş öncülünü çapraz kontrol etmeye yarar; görülmeyen görsel sahne dizisini kanıtlamış sayılmaz.

## Sayaç ve örneklem sınırları
- Kamusal toplam izlenme, yayımdan ölçüm zamanına kadar birikmiş sayıdır; seçili dönem Analytics metriği değildir.
- Toplam izlenme/video yaşı hesabı kaba hız vekilidir; geçmişteki günlük görüntülenme grafiği değildir.
- Başlık ve metaveri konu ipucudur; sahnenin ne olduğunu veya neden izlendiğini kanıtlamaz.
- Eksik veri sıfır değildir; metrikler ve ölçüm dönemleri birbirine karıştırılmaz.

## Global kaynak izi kontrolü
Konu Motoru paketi, global YouTube aramasından seçilmiş kaydı sabitler. Yanıt geri yapıştırıldığında **Global Kaynak İzi Kontrolü** video ID'si, tam başlık, kanal, yayın tarihi, kamusal toplam izlenme, ölçüm zamanı ve resmi URL'nin aynı kaynakla eşleşmesini; global web çapraz kontrolünün URL'sini veya bulunamadığı bilgisini; görsel sahnenin doğrulanmadığı sınırını ve özgün yaratıcı geçiş alanlarını denetler.

Kontrol, kaynak atfının yapısını doğrular; videonun sahnesinin gerçekten izlenmiş olduğunu veya fikrin başarılı olacağını kanıtlamaz.

## Kullanım akışı
1. Panelde **Trend keşfi** bölümüne YouTube Data API anahtarını gir.
2. Global odaklı bir arama yap ve sonuçları getir.
3. **Global konu paketini oluştur ve kopyala** düğmesine bas. Kendi kanalına OAuth ile bağlanmak gerekmez.
4. Kopyalanan istemi web erişimi olan sohbet asistanına yapıştır. Asistanın aynı global kaydı aramasını, bağımsız yazılı kaynak bulamazsa bunu söylemesini ve tek tam prompt üretmesini iste.
5. Dönen yanıtı paneldeki global kaynak izi kontrolüne yapıştırıp alanları denetle.
6. Video yayınlandıktan sonra ayrı kanal analiziyle gerçek performansı değerlendir; bu performansı yeni fikrin global kaynağıymış gibi kullanma.

Panelin kendisi bir yapay zekâ modeli çalıştırmaz; global paket üretir ve kaynak izi denetler. İçerik üretimi/bağımsız web araştırması, paketi yapıştırdığın web erişimli sohbet asistanında gerçekleşir.

## Dosyalar
- `index.html`: GitHub Pages ana paneli.
- `bos-dukkan-analiz.html`: panelin ikinci kopyası.
- `TOPIC_ENGINE_SPEC.md`: global kaynak izinin ve komedi üretim akışının sözleşmesi.
- `source-trace-guard.js`: kaynak izi doğrulaması.
- `tests/source-trace-guard.test.cjs`: global kaynak şeması testleri.
- `.github/workflows/pages.yml`: dağıtım iş akışı.
