# Boş Dükkân Veri Analizi

**Canlı panel:** https://agabeyayd-lgtm.github.io/bos-dukkan-analiz/

## Projenin amacı
Boş Dükkân Shorts kanalının gerçek performans verilerini rakip keşfiyle bir araya getirip, bir sonraki video konusu için kanıta dayalı karar desteği üretmek. Kanal adı konu kısıtı değildir. Başlık/izlenme metrikleri, gerçek sahne kanıtının yerine geçmez.

## Geçerli dosyalar
- `index.html`: ana giriş noktası; panel doğrudan burada sunulur.
- `bos-dukkan-analiz.html`: panelin ayrı kopyası.
- `.github/workflows/pages.yml`: `main` dalındaki değişikliklerle GitHub Pages'e dağıtım akışı.

## Paneldeki bölümler
1. **Genel analiz:** YouTube Data API v3 ile sorgulanan harici videolar, yayın tarihi, görüntülenme, kanal abonesi ve yorum örnekleri.
2. **Kanal analizi:** Herkese açık kanal verileri.
3. **Kendi kanalım + konu motoru:** Google OAuth ve YouTube Analytics API ile kanal sahibinin dönem verileri; rakip verileri ve yorumlarla birleştirilmiş analiz paketi.
4. **Gerçek kareler:** Bağlantıdan deneysel herkese açık storyboard önizlemelerini isteme veya yerel video dosyasından kare çıkarma. Bu bölüm YouTube'un tam video akışına doğrudan eriştiğini varsaymaz.

## Önemli sınırlar
- YouTube Data API anahtarı ve kanal sahibi verileri için OAuth yapılandırması gerekir. Anahtar ve yerel notlar tarayıcının `localStorage` alanında tutulur; farklı tarayıcı/alan adlarında otomatik aktarılmaz.
- YouTube Data API görüntülenme, beğeni, yorum sayısı ve başlık sağlayabilir; rakip videonun ortalama izleme süresi/izlenen yüzde metriklerini herkese açık şekilde vermez.
- Yorumlar temsili anket değildir. Başlık veya yorum, videoda gerçekten görülen sahne olarak kabul edilmez.
- YouTube iframe oynatıcısından doğrudan kare okuma tarayıcı güvenliği nedeniyle kısıtlıdır. Storyboard hizmeti deneysel üçüncü taraf bir hizmettir; çalışmaması mümkün. Yerel ekran kaydı kullanılamıyorsa panel sahne içeriğini uydurmamalı, eksikliği açıkça belirtmelidir.
- Panel kendi başına yapay zekâ analizi yürütmez; hazırlanmış paketi bu sohbet içinde analiz etmek gerekir.
- Başarı eşikleri sabit kural olarak kullanılmaz; küçük örneklem ve korelasyon/ neden-sonuç ayrımı açıkça raporlanır.

## Dağıtım
`.github/workflows/pages.yml` iş akışı, `main` güncellemelerinde statik panel dosyalarını paketleyip GitHub Pages'e göndermeyi dener. İlk yayın, repo Settings → Pages bölümünde GitHub Actions kaynağının seçili olmasını gerektirebilir. Yayın doğrulanmadıkça canlı sitenin açıldığını varsaymayın.
