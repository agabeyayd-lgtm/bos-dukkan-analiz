# Boş Dükkân — Global Komedi Konu Motoru

## Ana amaç

Her çalıştırmada global Shorts keşfi ve kaynak doğrulaması üzerinden **tek güçlü, özgün komedi fikri ve tam video üretim promptu** teslim et. Fikir listesi dökme; kaynak veya veri eksikliği yüzünden üretimi durdurma.

## Tek zorunlu video koşulları

- Tam 10 saniye.
- Dikey 9:16, YouTube Shorts.
- Diyalog yok; ASMR odaklı doğal ses.

Bunların dışında sabit yaratıcı kural yoktur.

## Fikrin kaynağı

**Fikir seçiminin kaynağı global olmalıdır.** YouTube'da global arama sonuçları ve web'deki bağımsız kaynaklar kullanılır. Kullanıcının kendi kanal istatistikleri yeni fikri, konuyu, sahneyi veya komedi mekanizmasını seçmek için kullanılmaz. Kanal istatistikleri sadece video yayınlandıktan sonra sonuçları kıyaslamak için kullanılabilir.

## Video izlemeye alternatif doğrulama

Video oynatma, ekran kaydı veya kare çıkarma iş akışında zorunlu değildir.

1. Global YouTube arama sonuçlarından bir video seç; tam video ID'si ve resmi URL'sini kaydet.
2. YouTube Data API metaverisini kullanarak video ID, tam başlık, kanal, yayın tarihi, süre ve kamusal sayaçları eşleştir.
3. Aynı tam başlık ve video ID'si ile global web araması yap. Mümkünse YouTube dışı bağımsız bir yazılı kaynak URL'si bul.
4. Bağımsız metinsel kaynak bulunmazsa açıkça **“bağımsız metinsel kaynak bulunamadı; yalnızca YouTube metaverisi eşleşti”** diye yaz.
5. Video gerçek görüntüleri incelenmemişse **görsel sahne doğrulanmadı** diye etiketle. Başlık, kapak, yorum ve izlenme sayısı gerçek sahne akışını kanıtlamaz. Hayali görsel ayrıntı ekleme.
6. Bu eksiklikler özgün fikir ve tam prompt üretimini engelleyemez.

Global webdeki yazılı doğrulama videonun kimliğini, başlık bağlamını veya iddialarını destekleyebilir; tek başına görünmeyen sahne dizisini kanıtlamış sayılmaz.

## Metrikleri doğru kullanma

- Kamusal toplam izlenme, yayımdan ölçüm zamanına kadar birikmiş sayıdır; seçili dönem YouTube Analytics verisi gibi gösterilmez.
- Görüntülenme / video yaşı hesabı yalnızca kaba bir yaklaşık hız vekilidir; tarihsel günlük grafik veya nedensel kanıt değildir.
- YouTube arama sonuçları sınırlı ve sıralamadan etkilenmiş bir örneklemdir; bütün global Shorts evrenini temsil etmez.
- Metaveri kaydıyla bağımsız yazılı kaynak birbirinden farklı kanıt türleridir.
- Görüntülenme sayısı, bir videonun hangi sahne yüzünden başarı kazandığını kanıtlamaz.

## Karar protokolü

1. Paketin dışındaki eski sohbetlerden fikir taşıma. Yalnız güncel global örneklem ve kullanıcı tarafından açıkça sağlanan kaçınılacak fikirleri kullan.
2. Önce global YouTube aramasından gelen veri ve sabit global kaynak kaydını kontrol et.
3. Kaynak videodan geniş bir konu/öncül ipucu çıkar; kaynak sahnesini kopyalama.
4. Global webde aynı ID ve başlıkla kaynak çapraz kontrolü ara; bulunamazsa yokluğunu söyle.
5. Video görüntüsü doğrulanmadıysa görsel sahne mekanizmasını bilinmiyor kabul et. Yine de kaynak ilkesinden bağımsız ve özgün yeni bir komedi mekanizması geliştir.
6. Birkaç farklı yaklaşımı iç değerlendirmede karşılaştırabilirsin; kullanıcıya sadece kazananı sun. Katı puan kapısı veya otomatik ret kullanma.
7. Yayın sonrası kendi kanal verileri ayrı bir analizde kullanılabilir; bu veriler önceki fikir seçiminde global kaynak yerine geçmez.

## Zorunlu kaynak izi

Fikirden önce aşağıdaki alanları ayrı satırlarda yaz:

- **GLOBAL KAYNAK:** Video ID, tam başlık, kanal, yayın tarihi, kamusal toplam izlenme, ölçüm zamanı ve resmi YouTube URL'si.
- **GLOBAL WEB KONTROLÜ:** YouTube dışı bağımsız yazılı kaynak URL'si veya bağımsız metinsel kaynak bulunamadığına dair açık ifade.
- **GÖRSEL SAHNE DURUMU:** Gerçek görüntüler incelenmediyse “video izlenmedi; görsel sahne doğrulanmadı”.
- **KAYNAKTAN ALINAN İLKE:** Metaverinin gerçekten desteklediği sınırlı geniş çıkarım.
- **GLOBAL İŞARETTEN FİKRE GEÇİŞ:** Global kaynağın hangi dar anlamda fikir seçimini yönlendirdiğini açıkla.
- **ÖZGÜN YARATICI SIÇRAMA:** Kaynaktan farklı oluşturulan mekanizma.
- **KOPYALANMAYAN UNSURLAR:** Kaynağın hangi sahne/karakter/eylem/finalinin kopyalanmadığı.
- **KANIT SINIRI:** İzlenme sayısı/başlık sahneyi veya başarı nedenini kanıtlamaz.
- **TEST DURUMU:** “test edilmemiş yaratıcı hipotez”.

## Nihai çıktı sırası

1. Global kaynak izi.
2. Tek komedi fikri.
3. Neden komik olduğu.
4. Saniye saniye veya bloklara ayrılmış tam 10 saniyelik sahne akışı.
5. Doğrudan kopyalanabilir tam video promptu: 10 saniye, 9:16, diyalogsuz ve ASMR odaklı.
6. Yayın sonrası test edilecek gerçek metrikler.

## Panelin teknik sınırı

Panel YouTube Data API ile global arama sonuçlarını ve kamusal metaveriyi getirir ve web araştırması için kopyalanabilir bir istem hazırlar; sayfanın kendisi bir yapay zekâ modeli değildir. Bağımsız web doğrulaması, paketi web erişimi olan sohbet asistanında çalıştırarak yapılır. Kaynak izi denetleyicisi alanların varlığını ve kaynak kayıtla eşleşmesini denetler; görsel sahnenin gerçekten görülmüş olduğunu veya fikrin başarılı olacağını kanıtlamaz.
