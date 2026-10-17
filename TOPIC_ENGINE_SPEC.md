# Boş Dükkân — Global Komedi Konu Motoru

## Ana amaç

Her çalıştırmada global Shorts keşfi ve kaynak doğrulaması üzerinden **tek güçlü, özgün komedi fikri ve tam video üretim promptu** teslim et. Fikir listesi dökme; kaynak veya veri eksikliği yüzünden üretimi durdurma.

## Tek zorunlu video koşulları

- Tam 10 saniye.
- Dikey 9:16, YouTube Shorts.
- Diyalog yok; ASMR odaklı doğal ses.

Bunların dışında sabit yaratıcı kural yoktur.

## Bağımsız senaryo yazarı modu

Panele, global konu keşfinden ayrı çalışan bir **bağımsız senaryo yazarı istemi** eklendi. Bu modda yeni senaryonun girdisi global YouTube örneklemi, rakip videolar, bağımsız web kaynakları, kendi kanal Analytics'i, görüntülenme sayıları veya API anahtarı değildir. Model, genel görsel komedi dramaturjisi ve davranış psikolojisi ilkelerini kullanarak konuyu kendi başına kurar.

- Tek çıktı: bir özgün fikir, kısa komedi mantığı, tam 10 saniyelik zaman çizelgesi ve doğrudan üretim aracına verilecek eksiksiz İngilizce video promptu.
- Sabit teknik koşullar: tam 10 saniye, dikey 9:16, fotogerçekçi, diyalogsuz, müziksiz, doğal ASMR sesi.
- 0–0,3 saniyede görsel kanca; davranış ve fiziksel neden-sonuç zinciri; 10 saniyeye kadar somut ve tamamlanmış final.
- Model, birkaç yaklaşımı kendi içinde değerlendirebilir ancak kullanıcıya yalnızca en güçlü olanı verir; puan eşiği koymaz ve üretimi durdurmaz.
- Bu GitHub Pages paneli statik JavaScript'tir ve kendi içinde bir dil modeli barındırmaz. Düğme yalnızca bağımsız yazar talimatını hazırlar/kopyalar; senaryonun kendisini üretmek için bu talimat ChatGPT gibi bir dil modeline gönderilmelidir.
- Global araştırma modu ayrı olarak korunur. Kullanıcı bağımsız senaryo modu seçtiğinde global kaynak izi veya Analytics özeti senaryo talimatına eklenmez.

## Komedi psikolojisi ve usta öğrenme çekirdeği

Panel üç bölüme ayrılmıştır:

1. **Komedi psikolojisi & ustalar:** Beklenti uyumsuzluğu, statü, karakter hedefi, yüzünü kurtarma, nedensel tırmanış, zamanlama, görsel okunurluk ve somut final gibi mercekleri gösterir. Başlangıç atlasında Chaplin, Keaton, Harold Lloyd, Laurel & Hardy, Tati, Mr Bean, Lucille Ball, Peter Sellers, Jerry Lewis, Louis de Funès, Cantinflas, Norman Wisdom, Jackie Chan, Marx Kardeşler, Mel Brooks, Sacha Baron Cohen, Chespirito ve Roberto Benigni bulunur. Ayrıca yeni dünya komedi ustalarını araştıracak bir istem üretir.
2. **Global konu motoru:** Global YouTube örneklemini ve sabit dış kaynak kaydını kullanır. Usta atlası, psikoloji ilkeleri, kaydedilmiş dersler, önceki fikir geçmişi ve (varsa) kompakt yerel kanal Analytics özeti fikir istemine eklenir. Kanal metrikleri kaynak video olarak gösterilmez.
3. **Yayın sonrası ölçüm:** Yayımlanmış videoları ayrı raporlar; rapor düğmesi fikir üretmez. Gerçek ölçümler alındığında, sade bir yerel kopya sonraki fikir paketinde performans bağlamı olarak kullanılabilir.

### Öğrenme nasıl kalıcı olur?

Panel kendi başına bir yapay zekâ modeli eğitmez. Kullanıcı **Trend keşfi** bölümünde YouTube Data API anahtarıyla global arama yapar; panel bu gerçek arama örneklemini ve sabitlenen video kaydını global konu paketine bağlar. Komedi öğrenme katmanı Wikipedia'dan seçilmiş usta ve mizah türü özetlerini, `knowledge.json` içindeki kaynaklı bulguları ve bu telefonda kaydedilen araştırma notlarını aynı pakete ekler. Paket ayrıca web erişimli sohbet asistanından aynı video ID'sini bağımsız web kaynaklarıyla çapraz kontrol etmesini ister; bu bağımsız web araştırması panelin kendi yaptığı bir işlem gibi gösterilmez. Panel filmi otomatik baştan sona izlemez; storyboard karelerini erişilebildiğinde dener ve görünmeyen sahneler konusunda kesinlik iddia etmez. 

Önceki konu tekrarı yalnızca bu telefondaki/tarayıcıdaki kayıtlar ve kullanıcı tarafından açıkça sağlanan önceki fikir notları için yapılabilir. Yerel geçmiş ve Analytics özeti depoda tutulmaz. Kaydedilmemiş eski konuların kendiliğinden hatırlandığı varsayılmamalıdır.

Kanal sahibi OAuth ile ölçümleri getirdiğinde panel, yorum metinlerini ve erişim jetonunu önbelleğe almadan video başlığı/süresi ile seçili dönemin izlenme, ortalama izleme, ortalama izlenen yüzde, beğeni ve kazanılan abone alanlarının kompakt bir özetini tarayıcı depolamasına yazar. Global konu paketi oluşturulduğunda bu özet dış kaynak kaydını değiştirmez; yalnızca yeni hipotezi yönlendirmeye yardım eder. Eksik metrikler `null` kalır, ömür boyu kamusal sayaçlar dönem Analytics metriklerinden ayrı tutulur.

### Kaynakla desteklenmiş başlangıç dersleri

- Pierre Étaix / Criterion: görsel gag kadrajda açık ve yeterli boşlukla görünmeli; gag karakter ve durumdan çıkmalı, sürpriz sahnenin mantığından doğmalıdır. https://www.criterion.com/current/posts/2746-the-return-of-etaix
- Buster Keaton / BFI: karakterin hedefi ve fiziksel eylemin nedenselliği komedi ile gerilimi birlikte taşıyabilir. https://www.bfi.org.uk/film/136a6211-90d9-5d18-b047-7967deac8bab/the-general
- Jacques Tati / BFI: mekân, mimari, kalabalık ve ses komedi mekanizmasının parçası olabilir. https://www.bfi.org.uk/film/a27e52ca-e6b6-5cd4-a2e0-1e1a30456e56/playtime
- Stephen Chow / hakemli akademik çalışma: farce ve absürtlük duygusal yatırım ve karakter hedefiyle birlikte kurulabilir. https://scholar.nycu.edu.tw/en/publications/farce-pathos-and-absurdity-in-stephen-chows-film-comedies-from-be/
- Kishore Kumar / Indian Express: fiziksel enerji ve karaktere özgü davranış ritmi komik performansın parçasıdır. https://indianexpress.com/article/entertainment/bollywood/kishore-kumar-actor-birth-anniversary-ashok-kumar-pretended-to-be-crazy-8876600/
- Totò / Cinémathèque française: mimik ve gündelik hayatta ayakta kalma farcenin malzemesi olabilir. https://www.cinematheque.fr/article/1959.html
- Mizah psikolojisi / Hewer, Smith ve Fergie: uyumsuzluk, üstünlük ve gerilim-boşalma teorilerini farklı mercekler olarak kullan; tek bir teori bütün mizahı açıklamaz. https://pmc.ncbi.nlm.nih.gov/articles/PMC6350176/

### Başlangıç kaynakları

- BFI, Buster Keaton ve *The General*: https://www.bfi.org.uk/features/general-greatest-comedy-all-time
- BFI, Jacques Tati ve *Playtime*: https://www.bfi.org.uk/film/a27e52ca-e6b6-5cd4-a2e0-1e1a30456e56/playtime
- BFI, Harold Lloyd: https://www.bfi.org.uk/lists/10-great-films-1923
- Mizah psikolojisinin teorileri üzerine hakemli inceleme: https://pmc.ncbi.nlm.nih.gov/articles/PMC6350176/
- PBS, Rowan Atkinson ve Mr Bean: https://www.pbs.org/video/happy-birthday-mr-bean-juuuwu/
- Şahan Gökbakar röportajı: https://www.cinedergi.com/2009/03/18/sahan-gokbakar-bana-ivediklestin-diyorlar/

Kaynaklar teknikleri araştırmak içindir; birebir sahne, karakter veya bitiş kopyalanmaz. Psikoloji teorileri kesin ve evrensel komedi formülleri olarak sunulmaz.

## Fikrin kaynağı

**Fikrin dış kaynak kaydı global olmalıdır.** YouTube'da global arama sonuçları ve web'deki bağımsız kaynaklar sabitlenir ve doğrulanır. Kendi kanal istatistikleri dış kaynağın yerine geçmez; yeni fikrin yönünü belirlemeye yardım eden ayrı performans bağlamı olarak kullanılabilir. Bu veriler kopyalanacak şablon veya nedensel başarı formülü değildir.

## Video oynatmaya alternatif doğrulama

Kullanıcının videoyu açması, izlemesi, ekran kaydı alması veya manuel kare çıkarması **zorunlu değildir**. Global kaynak paketi oluşturulurken panel, bulunan adaylardan en fazla üçü için herkese açık storyboard/kare sayfasını otomatik arar.

1. Global YouTube arama sonuçlarından gerçek video ID'si ve resmi URL'si olan bir kayıt sabitlenir.
2. Panel aynı video ID'si için herkese açık storyboard kare sayfasını otomatik dener. Bulursa kare sayfası URL'lerini kopyalanan prompt paketine ve panel önizlemesine ekler; web erişimli görsel asistan kareleri doğrudan açmayı dener.
3. Storyboard yoksa ya da görsel asistan görüntü URL'lerini açamıyorsa kullanıcıya video oynatma/ekran kaydı yaptırılmaz. Sistem global YouTube metaverisini aynı ID/tam başlıkla eşleştirir ve global webde bağımsız yazılı çapraz kontrol ister.
4. Bağımsız yazılı kaynak yoksa **“bağımsız metinsel kaynak bulunamadı; yalnızca YouTube metaverisi eşleşti”** yazılır.
5. Görsel kareler gerçekten açılıp incelenmediyse **“görsel sahne doğrulanmadı”** etiketi korunur. Storyboard eksik/tekrarlı olabilir ve tam video kronolojisini garanti etmez. Başlık, kapak, yorum veya izlenme sayısından görünmeyen eylem uydurulmaz.
6. Hiçbir kaynak yolu fikir ve tam prompt üretimini durduramaz.

Storyboard kareleri görsel kontrol için bir alternatiftir; bağımsız web kaynağı ise kimlik/bağlam çapraz kontrolüdür. Hiçbiri mevcut değilse sahnenin doğrulandığı iddia edilmez; üretim dürüst bir belirsizlik etiketiyle devam eder.

## Metrikleri doğru kullanma

- Kamusal toplam izlenme, yayımdan ölçüm zamanına kadar birikmiş sayıdır; seçili dönem YouTube Analytics verisi gibi gösterilmez.
- Görüntülenme / video yaşı hesabı yalnızca kaba bir yaklaşık hız vekilidir; tarihsel günlük grafik veya nedensel kanıt değildir.
- Kendi kanalının `viewsInWindow`, ortalama izleme, ortalama izlenen yüzde, beğeni ve kazanılan abone ölçümleri seçili Analytics dönemine aittir. `viewsPerObservedDay` kaba ortalamadır; günlük API grafiği değildir. Eksik değerler sıfır olarak doldurulmaz.
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
7. Kanal verilerini ayrı performans raporunda ölç; kompakt yerel Analytics özeti sonraki konu paketine yönlendirici bağlam olarak eklenebilir, ancak hiçbir zaman global kaynak yerine geçmez.

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
