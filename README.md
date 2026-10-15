# Boş Dükkân Veri Analizi

**Canlı panel:** https://agabeyayd-lgtm.github.io/bos-dukkan-analiz/

## Amaç
Öncelik güncel trend keşfi; ardından Boş Dükkân kanalının gerçek performansıyla bu sinyalleri karşılaştırıp insani davranış ve duygu temelli özgün bir sonraki Shorts fikri bulmak.

## Panel akışı
1. **Trend keşfi:** YouTube Data API v3 ile seçili zaman aralığında kısa video araması. Yayın tarihi, günlük izlenme hızı, izlenme/abone ve etkileşim sayaçları incelenir. Bu örneklem tüm YouTube'u temsil etmez.
2. **Kendi kanalım + Konu Motoru:** Google OAuth ve YouTube Analytics API ile seçili dönem performansı. Ortalama izleme süresi, ortalama izlenen yüzde, beğeni ve kazanılan abone ayrı değerlendirilir.
3. **Yaratıcı karar:** Trend sinyali + kendi kanalının ölçümleri + fikir geçmişi; gerçek insan davranışı ve tek bir insani duygu üzerine kurulu, 8 saniyelik, diyalogsuz, doğal ASMR'lı senaryo.

## Bilinçli olarak kaldırıldı
Rakip Shorts izleme/kare çıkarma akışı ve ayrı rakip kanal analiz ekranı kullanıcı arayüzünden kaldırıldı. Ekran kaydı veya rakip sahnelerinin doğrulanması konu üretmek için şart değildir. Trend araması, dış videoların sahnesini analiz ettiğini iddia etmez.

## Sınırlar
- YouTube Data API anahtarı ve kendi kanal verileri için OAuth yapılandırması gerekir.
- Dış arama sonuçları sınırlı bir örneklemdir; trend sinyali neden-sonuç kanıtı değildir.
- Rakiplerin ortalama izleme süresi/izlenen yüzde verileri herkese açık API'de bulunmadığından tahmin edilmez.
- Panel kendi başına yapay zekâ sonucu üretmez; analiz paketini sohbet içinde değerlendirmek gerekir.
- Seçili Analytics dönemi ve tüm ömür kamusal sayaçları karıştırılmaz; küçük örneklem ve belirsizlik açıkça belirtilir.

## Dosyalar ve dağıtım
- index.html: canlı panelin ana kaynağı.
- bos-dukkan-analiz.html: panelin eş kopyası.
- TOPIC_ENGINE_SPEC.md: trend ve yaratıcı karar kuralları.
- .github/workflows/pages.yml: GitHub Pages dağıtımı.
