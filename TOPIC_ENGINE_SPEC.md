# Boş Dükkân — Konu Motoru yöntemi

## Temel karar

**“Boş Dükkân” bir marka adıdır; hikâye mekânı veya konu filtresi değildir.** Fikir markette geçmek, dükkânın boşalması, alışveriş arabası ya da çalışan içermek zorunda değildir. Bu unsurlar ancak fikrin doğal parçasıysa kullanılabilir.

Birincil amaç, diyalogsuz ve dünya çapında anlaşılabilen görsel mizah üretmektir. Doğal ASMR/foley ses tasarımıdır; içerik hedefi değildir.

## Kanıt katmanları

1. **Kendi kanal verisi — birincil performans kanıtı.** Seçili YouTube Analytics dönemindeki görüntülenme, ortalama izleme süresi, ortalama izlenen yüzde, beğeni ve kazanılan abone ayrı alanlarda tutulur. Video ömrü boyunca biriken kamusal sayaçlar ayrı tutulur; farklı zaman pencereleri tek toplam/medyan içine karıştırılmaz.
2. **Harici videolar — keşif örneklemi.** YouTube Data API araması video, süre, tarih, kanal ve kamusal sayaçları bulur. Arama örneklemi evrenin tamamı değildir. Rakiplerin ortalama izleme süresi/yüzdesi bu kaynakta yoksa tahmin edilmez.
3. **Yorumlar — sınırlı izleyici sinyali.** Yorum örnekleri tam video ID ile eşleşir. Az sayıda ve relevance sıralı yorum bütün izleyicileri temsil etmez; yorumlar sahnenin görsel kanıtı sayılmaz.
4. **Sahne kanıtı — yalnızca gerçekten görülen eylem.** Kullanıcının doğruladığı sahne notları video URL/ID ile ilişkilendirilebilir. Not girilmediyse başlık, küçük resim veya yüksek izlenmeden sahne uydurulmaz; mekanizma “bilinmiyor” kalır.
5. **Fikir geçmişi.** Yayımlanmış, denenmiş ve reddedilmiş fikirler yerel tarayıcıda tutulur ve tekrar üretimini engellemek için pakete eklenir.

## Karar sırası

1. Veri penceresini, örneklem sayısını ve eksik alanları raporla.
2. Kendi videolarını kendi aralarında; süre, yaş ve ölçüm penceresini dikkate alarak karşılaştır. Görüntülenme, izleme süresi, izlenen yüzde, beğeni/yorum oranı ve abone dönüşümünü ayrı tut.
3. Harici örnekleri, sahne mekanizmasını bildikleri için değil, daha yakından incelenmeye değer oldukları için seç.
4. Konuyu herhangi bir belirli mekândan değil, insanın gerçek davranışından ve davranışın doğurduğu görünür sonuçtan ara. Önceden hazırlanmış mizah kataloğu, sabit konu aileleri veya keyfî birleşik puan yok.
5. Fikirleri kendi içinde farklı bağlamlarda çeşitlendir; kullanıcıya seçenek listesi verme. Görsel kanca, neden-sonuç, fiziksel tutarlılık, diyalogsuz okunurluk ve tamamlanmış final kapılarından geçmeyen fikri ele.
6. Yeterince güçlü fikir kalmazsa bunu söyle; sırf cevap üretmek için zayıf fikir sunma. Başarı bir hipotezdir, garanti değildir.
7. Yayın sonrası sonuçları kendi kanalının karşılaştırılabilir tabanıyla ölç; korelasyonu neden-sonuç diye sunma.

## Sabit yaratıcı sınırlar

- 8 saniye, dikey 9:16, diyalogsuz, İngilizce başlık.
- İlk 0,3 saniyede anlaşılır ve dikkat çekici bir görüntü.
- İnsan davranışından doğan, gerçekçi fizik ve doğal sebep-sonuç.
- Tamamlanmış, görsel olarak okunur final.
- Zorlama tezat, rastgele absürtlük, imkânsız fizik, yalnızca nesne büyütme/değiştirme, açıklama yazısı ve yarım bırakılmış loop yok.
- ASMR/foley ses katmanıdır; mizahın yerine geçmez.

## Kodun görevi ve sınırı

Panel; kendi kanal metriklerini, rakip keşfini, video kimliğine bağlı yorumları, isteğe bağlı gözle doğrulanmış sahne notlarını ve tekrar geçmişini birleştiren bir analiz paketi oluşturur. **Panelin kendisi bir yapay zekâ modeli çağırmaz**; hazırlanan paket kullanıcı tarafından sohbete yapıştırılır. Video karelerine erişim doğrulanmadıysa otomatik görsel analiz varmış gibi davranılmaz.
