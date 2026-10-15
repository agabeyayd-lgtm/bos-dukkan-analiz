# Boş Dükkân — Trend ve Konu Motoru yöntemi

## Ana öncelik: trend keşfi
Trend keşfi panelin ilk ve en önemli özelliğidir. YouTube Data API aramasıyla seçilen zaman aralığındaki kısa videoların yayın tarihi, izlenmesi, günlük izlenme hızı, beğeni/yorum sayaçları ve kanal büyüklüğü gibi erişilebilir sinyaller incelenir. Sonuçlar yalnızca arama örneklemidir; tüm YouTube'u temsil etmez. Video yaşı dikkate alınır; günlük izlenme hızı ve farklı sıralama biçimleri karşılaştırılır. API'nin sağlamadığı ortalama izleme süresi ve izlenen yüzde tahmin edilmez.

## Kendi kanal verisi — birincil performans kanıtı
Kanal sahibinin YouTube Analytics verileri konu kararında birincildir: görüntülenme, ortalama izleme süresi, ortalama izlenen yüzde, beğeni ve kazanılan abone ayrı ayrı değerlendirilir. Seçili Analytics dönemi ile videonun tüm ömrü boyunca biriken kamusal sayaçlar karıştırılmaz. Küçük örneklem, video yaşı ve dağıtım farkları açıkça belirtilir; korelasyon neden-sonuç diye sunulmaz.

## Yaratıcı çekirdek: insan davranışı + insani duygu
Her fikir gerçekçi bir insan davranışından ve o davranışın doğurduğu görünür sonuçtan doğar. Fikrin altında tek ve net bir insani duygu bulunmalıdır; örnekler sabit konu kataloğu değildir. Karakterler duyguyu ciddiye alır. Mizah rastgele tuhaflıktan değil, insanın duygu ve davranışının beklenmedik ama inandırıcı bir nesneye veya duruma yönelmesinden çıkar.

## Kanıt katmanları
1. Kendi kanal verisi: performans hakkında birincil kanıt.
2. Trend araması: dışarıda hangi videoların hız kazandığına dair sınırlı keşif sinyali; evrenin tamamı değil.
3. Fikir geçmişi: yayımlanmış, denenmiş ve reddedilmiş fikirler tekrar filtresinde kullanılır.
4. Rakip videosu izleme, ekran kaydı veya kare çıkarma şart değildir. Dış videonun gerçek sahnesi gözle doğrulanmadıysa sahne mekanizması hakkında iddia kurulmaz. Trend verisi tek başına sahne analizi yapmaz.

## Karar sırası
1. Önce trend aramasının sorgusunu, zaman penceresini, örneklem sayısını ve eksik alanlarını raporla.
2. Dış örneklerde video yaşı ve kanal büyüklüğünü hesaba kat; görüntülenme/gün, izlenme/abone ve beğeni/yorum oranlarını ayrı tut. Sıralama yanlılığını belirt.
3. Kendi kanalının ölçümlerini kendi içinde karşılaştır ve trend sinyalleriyle yalnızca test edilebilir hipotezler kur.
4. İnsan davranışından ve insani duygudan hareketle farklı bağlamlarda özgün adaylar geliştir. Sabit mizah kataloğu, keyfî puan formülü veya otomatik başarı eşiği kullanma.
5. Kullanıcıya zayıf fikir listesi verme. Kalite kapılarını geçmeyen adayları ele; güçlü aday yoksa bunu söyle.
6. Yayın sonrası sonuçları kendi kanalının karşılaştırılabilir tabanıyla ölç. Başarı garantisi verme.

## Sabit yaratıcı sınırlar
- 8 saniye, dikey 9:16, diyalogsuz, doğal ASMR/foley; İngilizce başlık.
- İlk 0,3 saniyede net ve dikkat çekici görsel kanca.
- İnsan davranışı ve tek, anlaşılır insani duygu.
- Gerçekçi fizik ve doğal sebep-sonuç.
- Görsel olarak anlaşılır, somut ve tamamlanmış final.
- Zorlama tezat, rastgele absürtlük, imkânsız fizik, yalnızca nesne büyütme/değiştirme, açıklama yazısı ve yarım bırakılmış loop yok.
- Rakip izleme, ekran kaydı veya gerçek kare çıkarma konu üretmenin ön şartı değildir.

## Panelin sınırı
Panel veri toplar, karşılaştırır ve kullanıcı tarafından sohbete yapıştırılacak analiz paketini hazırlar. Panel kendi başına yapay zekâ modeli çağırmaz. Trend sinyalleri ve kendi kanal verileri birlikte kullanılır; yaratıcı karar, kanıt ve hipotez ayrımı açık tutularak verilir.
