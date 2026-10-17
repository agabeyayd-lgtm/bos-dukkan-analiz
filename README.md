# Boş Dükkân — Bağımsız Komedi Senaryo Motoru + Veri Analizi

**Canlı panel:** https://agabeyayd-lgtm.github.io/bos-dukkan-analiz/

## Amaç
Her çalıştırmada canlı komedi ustası ve mizah psikolojisi araştırmasından öğrenerek tek yeni 10 saniyelik senaryo ve doğrudan kullanılabilir video promptu hazırlamak. Varsayılan motor bağımsızdır: YouTube trendi, kaynak video, kanal Analytics verisi veya konu tohumu gerektirmez.

## Tek zorunlu video koşulları
- Tam 10 saniye.
- Dikey 9:16 YouTube Shorts.
- Diyalogsuz, ASMR odaklı doğal ses.

Bunun dışında sabit mizah türü, fizik/gerçekçilik şartı, oyunculuk stili, puan eşiği veya otomatik ret listesi yoktur.

## Üç bölümlü komedi öğrenme ve konu sistemi

1. **Canlı komedi araştırması:** Ücretsiz Wikipedia araması ve Europe PMC akademik literatür API'si üzerinden farklı ülke/dönem komedi ustaları, mizah psikolojisi yayınları ve erişilebilen özetler URL'leriyle toplanır.
2. **Bağımsız senaryo motoru:** YouTube API anahtarı, trend videosu veya kanal istatistiği gerektirmeden araştırma verisinden komedi teknikleri öğrenme paketi oluşturur ve tek 10 saniyelik senaryo görevine bağlar. Trend akışı isteğe bağlıdır.
3. **Acımasız hakem + yayın sonrası ölçüm:** Aday senaryoyu gerekçeli biçimde değerlendirir ve gerekirse bir güçlü nihai sürüm yazma görevi oluşturur; ayrı bölümde yayımlanan videoların gerçek Analytics ölçümleri korunur.

Kaynaklı başlangıç dersleri — Pierre Étaix'in görsel gag ilkeleri, Keaton'ın fiziksel nedenselliği, Tati'nin mekân/ses komedisi, Stephen Chow'un farce-pathos birlikteliği, Kishore Kumar'ın fiziksel ritmi ve Totò'nun mimik/survival farcesi — not eklenmemiş olsa bile her global fikir istemine varsayılan olarak dahil edilir. Kaydedilen kişisel komedi araştırma notları bunlara eklenir; temel derslerin yerini almaz.

Komedi öğrenme katmanı bilinen ustaların canlı Wikipedia özetlerini, farklı ülke/dönem komedi ustaları için yapılan yeni Wikipedia aramalarını, Europe PMC akademik yayın kayıtlarını/erişilebilen özetlerini, knowledge.json bulgularını ve telefonda kaydedilen öğrenme notlarını birleştirir. Kaynak alınamazsa başarısızlık açıkça yazılır; erişilmiş gibi gösterilmez. Bağımsız motor YouTube Data API anahtarı, global trend videosu veya kanal Analytics verisi istemez. Panel kaynakları gerçekten getirir ama dil modeli çalıştırmaz; senaryoyu paketi yapıştırdığın ChatGPT yazar.

Önceki fikirleri tekrar etmeme kontrolü, yalnızca `knowledge.json` içinde (varsa) ve bu telefonda/tarayıcıda yerel saklanan konu geçmişinde bulunan kayıtları kapsar. Yerel geçmiş açık depoda yayımlanmaz. Kaydedilmemiş eski konuların otomatik olarak bilindiği varsayılmamalıdır.

## Kalıcı komedi öğrenme protokolü

- `knowledge.json` artık kaynaklı bulgular yanında `learningProtocol` kurallarını ve kanıt durumu açıkça işaretlenmiş `artistResearchCandidates` araştırma adaylarını taşır.
- Protokol, bağımsız senaryo paketine, komedi ustaları/psikoloji araştırma görevine, isteğe bağlı global-trend görevine ve acımasız hakem istemine otomatik olarak eklenir; her seferinde elle kopyalamak gerekmez.
- Arama sonucu/biyografi sahne incelemesi sayılmaz; akademik yayın künyesi abstract'ın veya tam metnin okunduğunu göstermez.
- Psikoloji teorileri ayrı mercekler olarak kullanılır; amaçtan başlayan, nedensel eylemlerle ilerleyen ve somut tamamlanmış finali olan tek özgün senaryo seçilir.
- Yeni adaylar doğrulanmış teknik gibi öğretilmez. Kayıt, kaynak/kanıt düzeyi ve test sonrası performansla güncellenir. Sayfa kendi başına dil modeli eğitmez; protokolü ve kaynakları üretim/hakem görevlerine bağlar.

## Kaynak ve öğrenme verisini ayrı tutma
- Yeni fikir için kaynaklar global YouTube araması ve global web araştırmasıdır.
- Kendi kanal Analytics verileri, global kaynağın yerine geçmeden geçmiş performansı anlamak ve yeni fikri yönlendirmek için ayrı bağlam olarak kullanılabilir. Bunlar kopyalanacak şablon veya neden-sonuç kanıtı değildir.
- Panel, ölçümlü video başlıklarını ve ayrı ayrı ölçülen metrikleri kompakt bir özet halinde yalnızca bu tarayıcıda saklar. Özet repoya yüklenmez; yeni konu paketi oluşturulunca isteme eklenir. OAuth erişim jetonu ve yorum metinleri bu öğrenme önbelleğine kaydedilmez.
- Global YouTube arama örneklemi en fazla 50 video gibi arama/sıralama sınırlamalarına sahiptir; tüm Shorts evrenini temsil etmez.
- Her kaynak tam video ID'si ve resmi YouTube URL'si ile sabitlenir.

## İsteğe bağlı trend kipinde video oynatmaya alternatif doğrulama
1. Global konu paketini oluşturduğunda panel aynı global arama içinden ilk üç uygun kayıtta otomatik storyboard/kare sayfası arar. Bulursa kare sayfalarının URL'lerini prompta ekler ve önizlemesini gösterir.
2. Bu bağlantılar, web erişimli görsel asistanın kaynak videoyu oynatmadan kareleri incelemesi için hazırlanır. Kullanıcının videoyu açması, izlemesi veya ekran kaydı alması gerekmez.
3. Storyboard bulunamazsa panel yine tam global kaynak paketini üretir. Asistan aynı video ID'sini/tam başlığını global webde çapraz kontrol etmeli; mümkünse YouTube dışı bağımsız yazılı kaynak vermelidir.
4. Yazılı kaynak bulunamazsa bu açıkça söylenir. Storyboard veya kaynak metinleri görünmeyen sahne dizisini kanıtlamaz. Görseller gerçekten incelenemiyorsa “görsel sahne doğrulanmadı” yazılır; başlıktan/izlenmeden eylem uydurulmaz.
5. Hiçbir eksik üretimi durdurmaz: sonuç yine tek özgün fikir ve tam 10 saniyelik 9:16 diyalogsuz, ASMR odaklı prompttur.

Storyboard otomatik görsel kontrol için bir alternatiftir; bağımsız web araması kimlik ve bağlam doğrulamasıdır. İkisi de başarısız olursa sahne doğrulanmaz sayılır ama fikir üretimi devam eder.

## Sayaç ve örneklem sınırları
- Kamusal toplam izlenme, yayımdan ölçüm zamanına kadar birikmiş sayıdır; seçili dönem Analytics metriği değildir.
- Toplam izlenme/video yaşı hesabı kaba hız vekilidir; geçmişteki günlük görüntülenme grafiği değildir.
- Başlık ve metaveri konu ipucudur; sahnenin ne olduğunu veya neden izlendiğini kanıtlamaz.
- Eksik veri sıfır değildir; metrikler ve ölçüm dönemleri birbirine karıştırılmaz.

## Ayrı iş akışları: bağımsız senaryo / trend / yayın sonrası ölçüm
- **Bağımsız senaryo paketi** canlı komedi/psikoloji kaynaklarını ve kayıtlı dersleri taşır; trend videosuna veya kullanıcı kanal ölçümlerine bağlı değildir.
- **İsteğe bağlı trend paketi** dış YouTube kaydını ve otomatik storyboard/bağımsız yazılı kontrol alternatifini taşır; bağımsız senaryo üretimi için gerekli değildir.
- **Yayın sonrası ölçüm raporu** yalnızca kendi kanalının yayımlanmış videolarının ölçümlerini dışa aktarır; kendi başına komedi fikri veya prompt oluşturmaz.
- Yayın sonrası rapor kendi başına fikir üretmez; ancak gerçek ölçümler alındığında oluşturulan yerel metrik özeti sonraki global konu paketine performans bağlamı sağlar.

## Otomatik kontroller ve dağıtım

- `.github/workflows/pages.yml` yalnızca JavaScript söz dizimini, global kaynak sözleşmesini ve kaynak izi testlerini kontrol eder; site yayımlamaz.
- Site yayını, GitHub Pages'in mevcut ana dal yayımlama mekanizmasına bırakılır. Böylece ikinci bir özel yayın akışı aynı anda deploy başlatıp hata oluşturmaz.
- `.github/workflows/deploy-pages.yml` kaldırıldı; önceki “deployment in progress” hataları birden fazla yayın akışının çakışmasından kaynaklanıyordu.

## İsteğe bağlı global trend kaynak izi kontrolü
Konu Motoru paketi, global YouTube aramasından seçilmiş kaydı sabitler. Yanıt geri yapıştırıldığında **Global Kaynak İzi Kontrolü** video ID'si, tam başlık, kanal, yayın tarihi, kamusal toplam izlenme, ölçüm zamanı ve resmi URL'nin aynı kaynakla eşleşmesini; global web çapraz kontrolünün URL'sini veya bulunamadığı bilgisini; görsel sahnenin doğrulanmadığı sınırını ve özgün yaratıcı geçiş alanlarını denetler.

Kontrol, kaynak atfının yapısını doğrular; videonun sahnesinin gerçekten izlenmiş olduğunu veya fikrin başarılı olacağını kanıtlamaz.

## Kullanım akışı
1. **Komedi araştırması** sekmesinde “Usta araştırma paketini oluştur ve kopyala” düğmesiyle canlı kaynakları tara; işe yarayan dersleri öğrenme notlarına kaydedebilirsin.
2. **Bağımsız senaryo** sekmesinde “Canlı araştır + tek senaryo paketini oluştur ve kopyala” düğmesine bas. YouTube API anahtarı, trend araması ve kanal girişi gerekmez.
3. Kopyalanan paketi bu ChatGPT sohbetine yapıştırıp gönder. Tek fikir, tam 10 saniyelik akış ve İngilizce video üretim promptu görevde yer alır.
4. **Hakem + ölçüm** sekmesinde üretilen senaryoyu yapıştırıp hakem görevini kopyala. Aynı sekmede kanalın yayın sonrası Analytics raporu da ayrı işlev olarak kalır.
5. Global YouTube araştırma/kaynak izi akışı istenirse ayrıca kullanılabilir; bağımsız motor için zorunlu değildir.

Panelin kendisi bir yapay zekâ modeli çalıştırmaz; global paket üretir ve kaynak izi denetler. İçerik üretimi/bağımsız web araştırması, paketi yapıştırdığın web erişimli sohbet asistanında gerçekleşir.

## Dosyalar
- `index.html`: GitHub Pages ana paneli.
- `bos-dukkan-analiz.html`: panelin ikinci kopyası.
- `TOPIC_ENGINE_SPEC.md`: global kaynak izinin ve komedi üretim akışının sözleşmesi.
- `source-trace-guard.js`: kaynak izi doğrulaması.
- `tests/source-trace-guard.test.cjs`: global kaynak şeması testleri.
- `.github/workflows/pages.yml`: dağıtım iş akışı.
