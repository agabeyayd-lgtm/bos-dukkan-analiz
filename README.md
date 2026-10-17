# Boş Dükkân Global Komedi Motoru ve Veri Analizi

**Canlı panel:** https://agabeyayd-lgtm.github.io/bos-dukkan-analiz/

## Amaç
Her çalıştırmada global içerik ve global kaynak araştırmasından yararlanarak tek, yeni komedi fikri ve doğrudan kullanılabilir tam video promptu üretmek. Video izleme veya ekran kaydı mümkün olmadığında fikir üretimi durmamalı.

## Tek zorunlu video koşulları
- Tam 10 saniye.
- Dikey 9:16 YouTube Shorts.
- Diyalogsuz, ASMR odaklı doğal ses.

Bunun dışında sabit mizah türü, fizik/gerçekçilik şartı, oyunculuk stili, puan eşiği veya otomatik ret listesi yoktur.

## Üç bölümlü komedi öğrenme ve konu sistemi

1. **Komedi psikolojisi & ustalar:** Psikoloji ilkeleri ve uluslararası komedi repertuvarı; yeni ve daha az tanınan isimleri URL kaynaklarıyla araştıran bir istem.
2. **Global konu motoru:** Global YouTube kaynak kaydı, komedi dersleri, önceki fikir geçmişi ve (varsa) telefonda/tarayıcıda saklanan gerçek kanal Analytics ölçümleriyle tek özgün fikir istemi. Kanal verisi kaynak videonun yerine geçmez; fikri yönlendiren ayrı performans bağlamıdır.
3. **Yayın sonrası ölçüm:** Yalnızca yayımlanmış videoları değerlendirir.

Kaynaklı başlangıç dersleri — Pierre Étaix'in görsel gag ilkeleri, Keaton'ın fiziksel nedenselliği, Tati'nin mekân/ses komedisi, Stephen Chow'un farce-pathos birlikteliği, Kishore Kumar'ın fiziksel ritmi ve Totò'nun mimik/survival farcesi — not eklenmemiş olsa bile her global fikir istemine varsayılan olarak dahil edilir. Kaydedilen kişisel komedi araştırma notları bunlara eklenir; temel derslerin yerini almaz.

Komedi öğrenme katmanı canlı Wikipedia özetlerini, `knowledge.json` içindeki URL'li bulguları ve araştırma notlarını global fikir paketine ekler. Ana panelin **Trend keşfi** araması, kullanıcının YouTube Data API anahtarıyla getirdiği gerçek global video örneklemini kullanır; paket sabit kaynak videosunu ve erişilebilen storyboard karelerini ilişkilendirir. Bağımsız web çapraz kontrolünü paketin yapıştırıldığı web erişimli sohbet asistanı yürütür; panel bunu kendisi yapmış gibi göstermez. Panel bir yapay zekâ modeli eğitmez ve videoyu baştan sona otomatik izlemez.

Önceki fikirleri tekrar etmeme kontrolü, yalnızca `knowledge.json` içinde (varsa) ve bu telefonda/tarayıcıda yerel saklanan konu geçmişinde bulunan kayıtları kapsar. Yerel geçmiş açık depoda yayımlanmaz. Kaydedilmemiş eski konuların otomatik olarak bilindiği varsayılmamalıdır.

## Kaynak ve öğrenme verisini ayrı tutma
- Yeni fikir için kaynaklar global YouTube araması ve global web araştırmasıdır.
- Kendi kanal Analytics verileri, global kaynağın yerine geçmeden geçmiş performansı anlamak ve yeni fikri yönlendirmek için ayrı bağlam olarak kullanılabilir. Bunlar kopyalanacak şablon veya neden-sonuç kanıtı değildir.
- Panel, ölçümlü video başlıklarını ve ayrı ayrı ölçülen metrikleri kompakt bir özet halinde yalnızca bu tarayıcıda saklar. Özet repoya yüklenmez; yeni konu paketi oluşturulunca isteme eklenir. OAuth erişim jetonu ve yorum metinleri bu öğrenme önbelleğine kaydedilmez.
- Global YouTube arama örneklemi en fazla 50 video gibi arama/sıralama sınırlamalarına sahiptir; tüm Shorts evrenini temsil etmez.
- Her kaynak tam video ID'si ve resmi YouTube URL'si ile sabitlenir.

## Video oynatmaya alternatif doğrulama
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

## Ayrı iş akışları: global fikir / yayın sonrası ölçüm
- **Global fikir paketi** dış YouTube kaynak kaydını ve otomatik storyboard/Web doğrulama alternatifini taşır. Daha önce alınmış kanal Analytics özetini, yalnızca performans bağlamı olarak ayrıca içerir.
- **Yayın sonrası ölçüm raporu** yalnızca kendi kanalının yayımlanmış videolarının ölçümlerini dışa aktarır; komedi fikri, global kaynak veya video promptu oluşturmaz.
- Yayın sonrası rapor kendi başına fikir üretmez; ancak gerçek ölçümler alındığında oluşturulan yerel metrik özeti sonraki global konu paketine performans bağlamı sağlar.

## Otomatik kontroller ve dağıtım

- `.github/workflows/pages.yml` yalnızca JavaScript söz dizimini, global kaynak sözleşmesini ve kaynak izi testlerini kontrol eder; site yayımlamaz.
- Site yayını, GitHub Pages'in mevcut ana dal yayımlama mekanizmasına bırakılır. Böylece ikinci bir özel yayın akışı aynı anda deploy başlatıp hata oluşturmaz.
- `.github/workflows/deploy-pages.yml` kaldırıldı; önceki “deployment in progress” hataları birden fazla yayın akışının çakışmasından kaynaklanıyordu.

## Global kaynak izi kontrolü
Konu Motoru paketi, global YouTube aramasından seçilmiş kaydı sabitler. Yanıt geri yapıştırıldığında **Global Kaynak İzi Kontrolü** video ID'si, tam başlık, kanal, yayın tarihi, kamusal toplam izlenme, ölçüm zamanı ve resmi URL'nin aynı kaynakla eşleşmesini; global web çapraz kontrolünün URL'sini veya bulunamadığı bilgisini; görsel sahnenin doğrulanmadığı sınırını ve özgün yaratıcı geçiş alanlarını denetler.

Kontrol, kaynak atfının yapısını doğrular; videonun sahnesinin gerçekten izlenmiş olduğunu veya fikrin başarılı olacağını kanıtlamaz.

## Kullanım akışı
1. Panelde **Trend keşfi** bölümüne YouTube Data API anahtarını gir.
2. Global odaklı bir arama yap ve sonuçları getir.
3. **Global konu paketini oluştur ve kopyala** düğmesine bas. Global kaynak araması OAuth gerektirmez. Daha önce 3. bölümde kanal Analytics ölçümlerini getirdiysen, tarayıcıda saklanan kompakt özet otomatik eklenir.
4. Kopyalanan istemi web erişimi olan sohbet asistanına yapıştır. Asistanın aynı global kaydı aramasını, bağımsız yazılı kaynak bulamazsa bunu söylemesini ve tek tam prompt üretmesini iste.
5. Dönen yanıtı paneldeki global kaynak izi kontrolüne yapıştırıp alanları denetle.
6. Video yayınlandıktan sonra ayrı kanal analiziyle gerçek performansı değerlendir. Bu veriler sonraki fikri yönlendirebilir, ancak global kaynak yerine geçmez ve tek başına başarı nedeni kanıtlamaz.

Panelin kendisi bir yapay zekâ modeli çalıştırmaz; global paket üretir ve kaynak izi denetler. İçerik üretimi/bağımsız web araştırması, paketi yapıştırdığın web erişimli sohbet asistanında gerçekleşir.

## Dosyalar
- `index.html`: GitHub Pages ana paneli.
- `bos-dukkan-analiz.html`: panelin ikinci kopyası.
- `TOPIC_ENGINE_SPEC.md`: global kaynak izinin ve komedi üretim akışının sözleşmesi.
- `source-trace-guard.js`: kaynak izi doğrulaması.
- `tests/source-trace-guard.test.cjs`: global kaynak şeması testleri.
- `.github/workflows/pages.yml`: dağıtım iş akışı.
