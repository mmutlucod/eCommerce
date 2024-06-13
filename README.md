# eCommerce Projesi

Bu proje, modern ve kullanıcı dostu bir e-ticaret platformu geliştirmeyi amaçlayan bir bitirme projesidir. Bu platform, ürün arama ve filtreleme, güvenli ödeme ve gerçek zamanlı stok bilgisi gibi özellikleri içermektedir.

## Proje Özeti

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Sequelize
- **Veritabanı**: MySQL

## Özellikler

- Kullanıcılar ürünleri kolayca arayabilir ve filtreleyebilir
- Güvenli ödeme işlemleri
- Gerçek zamanlı stok bilgisi
- Satıcılar hesap oluşturabilir ve ürün satabilir
- Kullanıcılar hızlıca sipariş verebilir

## Kurulum

### Gereksinimler

- Node.js
- MySQL

### Adımlar

1. Projeyi klonlayın:
    ```bash
    git clone https://github.com/mmutlucod/eCommerce.git
    ```

2. Proje dizinine gidin:
    ```bash
    cd eCommerce
    ```

3. Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

4. Veritabanı ayarlarını yapın ve veritabanını oluşturun. `config/config.json` dosyasını düzenleyin:
    ```json
    {
      "development": {
        "username": "root",
        "password": null,
        "database": "ecommerce_db",
        "host": "127.0.0.1",
        "dialect": "mysql"
      }
    }
    ```

5. Veritabanı migrasyonlarını çalıştırın:
    ```bash
    npx sequelize-cli db:migrate
    ```

6. Uygulamayı başlatın:
    ```bash
    npm start
    ```

## Kullanım

### Kullanıcı Arayüzü

- Ana sayfada popüler ürünleri görüntüleyin.
- Ürün arama ve filtreleme özelliklerini kullanarak aradığınız ürünü bulun.
- Ürün detay sayfasında ürün hakkında bilgi edinin ve sepete ekleyin.
- Sepet sayfasında ürünlerinizi görüntüleyin ve ödeme yapın.

### Satıcı Arayüzü

- Hesap oluşturun ve giriş yapın.
- Yeni ürünler ekleyin ve mevcut ürünlerinizi yönetin.

## Ekran Görüntüleri

Ana Sayfa:
![Ana Sayfa](./screenshots/1.png)

Ürün Listesi:
![Ürün Listesi](./screenshots/2.png)

Giriş Yap:
![Giriş Yap](./screenshots/3.png)

Üye Ol:
![Üye Ol](./screenshots/4.png)

Arama:
![Arama](./screenshots/5.png)

Arama Sonuçları:
![Arama Sonuçları](./screenshots/6.png)

Ürün Detay:
![Ürün Detay](./screenshots/7.png)

Ürün Açıklaması:
![Ürün Açıklaması](./screenshots/8.png)

Ürün Yorumları:
![Ürün Yorumları](./screenshots/9.png)

Değerlendirme Ekle:
![Değerlendirme Ekle](./screenshots/10.png)

Sorular ve Cevaplar:
![Sorular ve Cevaplar](./screenshots/11.png)

Soru Sor:
![Soru Sor](./screenshots/12.png)

Diğer Satıcılar:
![Diğer Satıcılar](./screenshots/13.png)

Kategori Sonuçları:
![Kategori Sonuçları](./screenshots/14.png)

Marka Sonuçları:
![Marka Sonuçları](./screenshots/15.png)

Satıcı Bilgileri:
![Satıcı Bilgileri](./screenshots/16.png)

Siparişlerim:
![Siparişlerim](./screenshots/17.png)

Sipariş Detayları:
![Sipariş Detayları](./screenshots/18.png)

Profilim:
![Profilim](./screenshots/19.png)

Adres Bilgilerim:
![Adres Bilgilerim](./screenshots/20.png)

Adres Ekle:
![Adres Ekle](./screenshots/21.png)

Favorilerim:
![Favorilerim](./screenshots/22.png)

Sorularım:
![Sorularım](./screenshots/23.png)

Değerlendirmelerim:
![Değerlendirmelerim](./screenshots/24.png)

## Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen bir pull request gönderin veya bir sorun (issue) açın.

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---

Bu projeye dair herhangi bir sorunuz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.
