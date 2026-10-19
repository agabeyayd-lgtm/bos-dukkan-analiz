# Boş Dükkân — Bağımsız Komedi Senaryo Motoru

## Ana amaç

Her çalıştırmada canlı komedi araştırması ve davranış psikolojisi öğrenmesinden yararlanarak **tek özgün 10 saniyelik senaryo ve tam video promptu** hazırla. Varsayılan mod bağımsızdır: trend videosuna, kullanıcı kanalına veya önceden verilmiş konuya bağlanma. Fikir listesi dökme; kaynak eksikliği yüzünden üretimi durdurma.

## Tek zorunlu video koşulları

- Tam 10 saniye.
- Dikey 9:16, YouTube Shorts.
- Diyalog yok; ASMR odaklı doğal ses.

Bunların dışında zorunlu bir mizah mekanizması, duygu, gerçekçilik, kamera dili veya final türü yoktur. Yaratıcı pusula için aşağıdaki “Dikkat ritmi ve komedi ödülü” bölümüne bak.

## Varsayılan bağımsız araştırma → senaryo → hakem akışı

Bağımsız senaryo motoru varsayılandır. **YouTube trendi, kaynak video, kanal Analytics verisi veya kullanıcı tarafından önceden seçilmiş konu gerektirmez.** Bunlar yalnızca isteğe bağlı ayrı trend/ölçüm iş akışlarıdır.

- Tarayıcı, ücretsiz Wikipedia API'sinden farklı ülkeler/dönemlerden komedi ustası adaylarını; Europe PMC'den mizah psikolojisi ve görsel komedi konulu yayın kayıtlarını ve sunuluyorsa özetlerini canlı arar. Gerekirse Crossref yayın metaverisini yedek olarak arar.
- Kaynak bağlantısı ve kanıt türü korunur: tam abstract, kısa Wikipedia özeti, arama sonucu veya yalnızca yayın künyesi birbirinden ayrılır. Başarısız istekler açıkça yazılır; kaynağın açılmadığı durumda okunmuş gibi davranılmaz.
- İlk panel bölümü canlı komedi araştırması ve öğrenme notları içindir. İkinci bölüm bu malzemeyi kullanarak kanal/trend verisinden bağımsız tek senaryo görevi hazırlar. Üçüncü bölüm aday senaryoyu acımasızca eleştirme ve gerekiyorsa tek bir daha güçlü nihai sürüm oluşturma görevini hazırlar; aynı bölümde yayın sonrası Analytics aracı da korunur.
- Tek zorunlu çıktı koşulları: **tam 10 saniye, dikey 9:16, diyalogsuz, doğal ASMR odaklı ses**. Diğer tüm mizah türleri ve yaratıcı yaklaşımlar serbesttir; sabit mekanizma, gerçekçilik, oyunculuk, konu veya puan eşiği dayatılmaz (duygu ilkesi mekanizma değil, kanal kuralıdır).
- Motor kullanıcıya fikir listesi değil bir tek yeni senaryo, tam 0–10 saniye akışı ve üretim aracına doğrudan verilecek İngilizce promptu hazırlayan bir görev verir. Çıktının komik olup olmadığı garanti edilmez; yayın sonrası gerçek verilerle test edilmelidir.
- GitHub Pages statik bir JavaScript sayfasıdır: açık kaynak araştırması gerçekten tarayıcıdan yapılır, ancak sayfanın içinde dil modeli çalışmaz. Kopyalanan görev web erişimli ChatGPT'ye gönderildiğinde senaryo üretimi ve hakemlik dil modeli tarafından yapılır.

## Dikkat ritmi ve komedi ödülü — yaratıcı DNA

Bu bölüm, tek bir komedi fikrinin 10 saniyelik dikkat akışına nasıl dönüştürüleceğini tanımlar. Amaç, izleyiciyi yalnızca meraklandırmak değil, her yeni anda izlemeye devam etmesi için gerçek bir neden sunmaktır.

- **Kanca final değildir.** İlk kare güçlü ve görsel olarak okunabilir bir merak/eylem başlatır; sonucu erkenden tüketmez.
- **Her an yeni değer taşır.** Eylem, bilgi, tepki, karakter ilişkisi veya beklentideki değişim akışı ileri taşır. Her saniyeye zorla şaka sıkıştırılmaz; boş bekleyiş de yaratılmaz.
- **Dozajlı yükseliş:** Orta bölüm merakı sadece uzatmaz; olayın kendisini geliştirir. Karakterlerin kararları ve birbirlerine tepkileri yeni, nedensel gelişmeler doğurur.
- **Final hak edilmiş ödüldür.** Sonuç, önceki birikimin karşılığını veren komik ve anlaşılır bir payoff olmalıdır. Sürpriz tek başına komedi değildir. İkinci komik vuruş veya yeniden izlemeyi ödüllendiren ayrıntı kullanılabilir ama zorunlu değildir.
- **Ritim mekanikleşmez.** Her 1–2 saniyede sabit bir olay olması şart değildir; süre, kesme ve tempo fikrin komedi ritmine göre seçilir. Bekletme ancak beklentiyi veya komik etkiyi artırıyorsa kalır.
- **Kamera ve stil özgürdür.** Kesme, yakın plan, açı değişimi, kamera hareketi, fiziksel komedi, absürtlük ve karakter etkileşimi serbesttir. Tek kamera, gerçekçilik, insan duygusu veya belirli bir final türü zorunlu tutulmaz.
- **Önce komedi, sonra üretim koruması.** Önce en güçlü komik sahne tasarlanır; ardından yalnızca belirli olası üretim hatalarını önleyen açık prompt talimatları eklenir. Guardrail yaratıcı alanı gereksiz yere daraltamaz.
- **Tek güçlü çıktı.** İç değerlendirmede zayıf veya uzatılmış anları düzelt; kullanıcıya tek en güçlü fikir, tam 0–10 saniye akışı ve doğrudan kullanılabilir İngilizce prompt ver.

Bu ilkeler dikkat/retention için yaratıcı tasarım hedefleridir; izleyicinin davranışı veya başarı garantisi olarak sunulmaz. Sonuç yayın sonrası metriklerle test edilir; korelasyon tek başına nedensellik kanıtı değildir.

## Komedi psikolojisi ve usta öğrenme çekirdeği

Panel üç bölüme ayrılmıştır:

1. **Canlı komedi araştırması:** Bilinen ustaların kaynaklı özetlerine ek olarak yeni dünya komedisi adaylarını ve akademik mizah psikolojisi yayınlarını arar.
2. **Bağımsız senaryo:** Araştırma bulguları ile kayıtlı öğrenme notlarından yararlanıp YouTube trend videosu veya kendi kanal verisi olmadan tek yeni senaryo görevi hazırlar.
3. **Acımasız hakem + yayın sonrası ölçüm:** Senaryoyu değerlendirir, gerekirse tek güçlü nihai sürüm ister; gerçek kanal ölçümlerini aynı sekmede ayrı bir özellik olarak korur. Gerçek ölçümler alındığında, sade bir yerel kopya sonraki fikir paketinde performans bağlamı olarak kullanılabilir.

### Kalıcı motor öğrenme protokolü — çalışan sözleşme

- `knowledge.json` içindeki `learningProtocol`, yalnızca arşiv notu değildir: `comedy-learning.js` bunu canlı pakete ekler; bağımsız senaryo motoru, komedi araştırma görevi, trend tabanlı üretim görevi ve hakem görevi aynı kuralları kullanır.
- `artistResearchCandidates` alanı daha az tanınan ustaları yeniden araştırmak için saklar. Her adayın kanıt durumu korunur; aday, sahne tekniği doğrulanmış kişi gibi sunulmaz.
- Kanıt etiketleri: `DOĞRULANMIŞ BİLGİ`, `İNCELENEN SAHNE`, `KURAMSAL AÇIKLAMA`, `YARATICI HİPOTEZ`. Wikipedia snippet'i/özeti, filmografi/katalog tanıtımı, akademik künye ve erişilen abstract farklı kanıt derinlikleridir.
- Komedi mekanizması karakter amacı → karar/varsayım → nedensel eylemler → somut ve tamamlanmış final zinciriyle tasarlanabilir; bu yararlı bir araçtır, her mizah türü için zorunlu şablon değildir. İlk kare güçlü ve anlaşılır bir kanca hedefler; sabit milisaniye kuralı yoktur.
- Uyumsuzluk, statü/üstünlük, benign violation ve gerilim-boşalma ayrı psikolojik merceklerdir. Hiçbiri her sahnede zorunlu kılınmaz; tek teori bütün mizahı açıklıyor diye sunulmaz.
- Kalite hakemi aynı protokolü kullanır ancak sabit puan eşiğiyle yaratıcı üretimi kilitlemez. Tek güçlü öneri seçilir; yayın sonrası metrikler hipotezi sınar, fakat neden-sonuç ispatı sayılmaz.
- Kaynaklar ulaşılamadığında sistem başarısızlığı açıklar ve üretime devam eder. Tam 10 saniye, 9:16, diyalogsuz ve doğal ASMR ses şartları korunur.

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

## Duygu kullanımı (seçenek, zorunluluk değil)

Gurur, merak, utanç, özlem veya başka bir insani duygu komediyi güçlendirebilir; ancak duygu zorunlu bir kanal kuralı değildir. Nesne odaklı, fiziksel, absürt, mekanik veya başka komedi biçimleri fikir için daha güçlüyse serbestçe kullanılabilir. Hiçbir duygu, gerçekçilik anlayışı ya da mizah mekanizması yaratıcı üretimi otomatik olarak veto etmez.

## Kanal gözlemleri (YARATICI HİPOTEZ — kural değil)

Bu bölüm zorunlu mekanizma dayatmaz; senaryo motoru bunlardan yalnızca ilham olarak yararlanabilir. Kanıt türü: kanalın kendi Analytics görüntüleme ve izlemeye devam edenler verisi; videoların içerik tarifi kanal sahibinden. Abone sayısı kanal sahibinin kendi çevresinden geldiği için sinyal olarak kullanılmaz.

### Gen: Tek Dürtü + Ölçek Finali

- Kaynak: kanalın ilk haftasında en çok izlenen üç video (dondurma kabından yemek çıkması, market arabasıyla dükkânı toplayan adam, dedelerin inşaatı takip edip sonunda içine girmesi). Bu üçünde izlemeye devam edenler oranı yaklaşık %64–74 aralığındaydı.
- Yapı: tek bir insani dürtü (merak, toplama, takip) sonuna kadar götürülür; aynı kural tekrar eder ve her tekrarda büyür; final "tamamen oldu" karesini gösterir (dolu buzdolabı, boş dükkân, kendini içinde bulan izleyici).
- Süzgeç sorusu: İlk karede kural açıklama gerektirmeden anlaşılıyor mu?
- Durum: test edilmemiş yaratıcı hipotez. Örnek sayısı azdır; neden-sonuç kanıtı değildir. Her senaryo bu yapıda olmak zorunda değildir.

### Gözlem: Dedeler motifi

- En çok izlenen dört videonun ikisinde yaşlı figürler var (construction videosundaki dedeler, kurdele tabure videosundaki yaşlı kalabalık).
- Kullanım kuralı: devamlı olmayacak; aralıklı kullanılır ve art arda iki videoda tekrar edilmez.
- Durum: örnek sayısı az; kesin kural değil.

### Referans gen: Kurdele Tabure

- Kaynak video: tek bir plastik tabure için ciddi açılış töreni. Yaşlı adam kurdeleyi gerçekten keser, madalya takılır, eli kalbinde alkış ve davul-zurna; sert kesmeyle sıradaki adam ikinci kurdeleli tabureye yürür. Kanal verisi: yaklaşık 5.100 görüntüleme, izlemeye devam edenler yaklaşık %75.
- Mekanizma: sıradan bir nesne tam bir ciddiyetle yüceltilir; kimse durumun saçmalığını fark etmez. Duygu gururdur (duygu ilkesine uygun). Sert kesme, olayın tek olmadığını gösteren bir sıra/ölçek finaline geçer.
- Süzgeç soruları: (1) Sıradan nesne veya eylem ciddiyetle mi yüceltiliyor ve karakterler bunu doğal mı karşılıyor? (2) Gerçek bir insani duygu görünüyor mu? (3) Final, durumun tek olmadığını veya büyüdüğünü gösteriyor mu? (4) Önemli eylem gerçekten gerçekleşiyor mu (kesilen şey kendiliğinden kesilmiş gibi görünmüyor)?
- Tekrar filtresi: aynı nesne+tören kalıbı art arda iki videoda kullanılmaz; aynı mekân, kalabalık ve yaşlı karakter dizilimi birebir tekrarlanmaz. Kopyalanan şey mekanizmadır, sahne değil.
- Durum: yaratıcı hipotez; tek video örneğine dayanır.

### Karşı örnekler (genin sınırı)

- Sanayi ustası videoları tek bir an içerir, tekrar/ölçek yoktur; performansı düşük kaldı.
- Halay videosunda tekrar var (altı kişi tek tek düşüyor) ama ilk 5,5 saatte izlemeye devam edenler oranı yaklaşık %32,5'ti; tekrar tek başına yetmiyor olabilir, ilk kare de belirleyici olabilir. 24–48 saat sonra yeniden ölçülmeli.

## Fikrin kaynağı

Varsayılan bağımsız modda konu, motorun yaratıcı kararından doğar; belirli bir YouTube videosu, trend, kanal metriği veya kaynak sahne konu tohumu değildir. Canlı web araştırması, komedi mekanizması öğrenmek içindir. Kullanıcının kendi kanal istatistikleri de bağımsız fikrin önkoşulu değildir.

Global YouTube örneklemi ve kaynak izi yalnızca kullanıcı isteğe bağlı trend modunu çalıştırdığında kullanılır. Bu kipte video başlığı, sayaç veya yorum görünmeyen sahnelerin kanıtı olarak kullanılmaz.

## İsteğe bağlı trend kipinde video oynatmaya alternatif doğrulama

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

1. Üç teknik koşulu koru: tam 10 saniye, dikey 9:16, diyalogsuz ve doğal ASMR odaklı ses. Ayrıca duygu ilkesini uygula.
2. Canlı komedi ustası keşiflerini, araştırma özetlerini ve akademik yayınları gerçekten gelen kanıt türüne göre incele; salt arama sonucu ile okunan makaleyi eşit tutma.
3. Öğrenilen teknikleri kopyalanacak sahne olarak değil, yeni bir olay veya davranış tasarlamada kullan.
4. YouTube trendi, kendi kanal Analytics verisi veya sabit konu kalıbını bağımsız senaryo için zorunlu girdi yapma.
5. Kendi içinde alternatif yönleri karşılaştır; kullanıcıya tek bir kazanan ve tam prompt ver. Sabit puan kapısı veya otomatik ret formülü uygulama.
6. Kaynaklar başarısızsa bunu söyle ama yine de tek senaryo üretim görevini hazırla.
7. Yayın sonrası metrikleri ayrı değerlendir; korelasyonu nedensellik gibi sunma.

## İsteğe bağlı trend kipinde zorunlu kaynak izi

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

## Çıktı sırası

1. Global kaynak izi.
2. Tek komedi fikri.
3. Neden komik olduğu.
4. Saniye saniye veya bloklara ayrılmış tam 10 saniyelik sahne akışı.
5. Doğrudan kopyalanabilir tam video promptu: 10 saniye, 9:16, diyalogsuz ve ASMR odaklı.
6. Yayın sonrası test edilecek gerçek metrikler.

## Panelin teknik sınırı

Varsayılan bağımsız senaryo düğmesi tarayıcıdan ücretsiz Wikipedia ve Europe PMC/Crossref API'lerine gerçek istek yapar ve araştırma paketini hazırlar; YouTube API anahtarı gerekmez. Sayfanın kendisi bir dil modeli çalıştırmaz: kopyalanan senaryo/hakem görevi bu ChatGPT sohbetine gönderildiğinde dil modeli tarafından işlenir. Global YouTube kaynak izi ayrı ve isteğe bağlı trend kipidir. Kaynak izi denetleyicisi alanların varlığını ve kaynak kayıtla eşleşmesini denetler; görsel sahnenin gerçekten görülmüş olduğunu veya fikrin başarılı olacağını kanıtlamaz.
