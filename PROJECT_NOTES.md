# Algebra ISOSofts Interface — Proje Notları

> Bu dosya kod tabanını anlatan kalıcı referans dokümandır.
> Her değişiklikten sonra güncellenmelidir.

---

## Genel Bakış

**Ne yapar?** ISO 9001 / 14001 / 45001 uyumlu QHSE (Kalite, Sağlık, Güvenlik, Çevre) yönetim sistemi arayüzü.
19 modül içerir: risk kayıtları, KPI/OPI takibi, doküman yönetimi, iş süreçleri vb.

**Tech Stack:**
- React 19 + Vite 7
- Tailwind CSS 4
- React Router DOM 7 (sadece tek route: `/`)
- Recharts 3 (dashboard grafikleri)
- ECharts / echarts-for-react (bazı profil sayfalarında)
- Firebase Realtime Database (sadece HelpModal içeriği)
- XLSX (xlsx lib) — Excel export
- FontAwesome 7 (ikonlar)
- Axios (package.json'da var ama ana kodda kullanılmıyor)

---

## Dizin Yapısı

```
/
├── src/
│   ├── main.jsx          ← GERÇEK GİRİŞ NOKTASI (App.jsx değil!)
│   ├── App.jsx           ← DEFAUlT VITE STUB, KULLANILMIYOR
│   ├── index.css
│   └── App.css
│
├── components/
│   ├── navbar.jsx          ← Üst sabit nav
│   ├── riskrouter.jsx      ← Ana layout + sidebar + modül yönlendirme
│   ├── IntroScreen.jsx     ← ~3 saniyelik açılış animasyonu
│   ├── kpi.jsx             ← KPI Dashboard (dashboard modülü)
│   │
│   ├── profile.jsx         ← Business Risk (bg-reg)
│   ├── hsprofile.jsx       ← H&S Risk (hs-reg)
│   ├── legprofile.jsx      ← Legislation (leg-reg)
│   ├── envprofile.jsx      ← Environmental (env-reg)
│   ├── eiprofile.jsx       ← Equipment & Inventories (eq-reg)
│   ├── trprofile.jsx       ← Training (tr-reg)
│   ├── docprofile.jsx      ← Documents (doc-reg)
│   ├── venprofile.jsx      ← Vendors (ven-reg)
│   ├── customerprofile.jsx ← Customers (cus-reg)
│   ├── fbprofile.jsx       ← Feedbacks (fb-reg)
│   ├── earprofile.jsx      ← Employee Appraisal (ear-reg)
│   ├── mocprofile.jsx      ← Management of Change (moc-reg)
│   ├── flog.jsx            ← Findings Log (fl-reg)
│   ├── aoprofile.jsx       ← Assurance & Oversight (ao-reg)
│   ├── mrmprofile.jsx      ← Management Review (mr-reg)
│   ├── actionprofile.jsx   ← Action Log (ac-reg)
│   ├── kpiprofile.jsx      ← KPI Register (kpi modülü)
│   ├── opiprofile.jsx      ← OPI Register (opi modülü)
│   │
│   ├── tabledatas/         ← Her modülün <tbody> bileşeni
│   │   ├── bgrisk.jsx, hsrisk.jsx, legrisk.jsx, envrisk.jsx
│   │   ├── eirisk.jsx, trrisk.jsx, docrisk.jsx, venrisk.jsx
│   │   ├── customerrisk.jsx, fbrisk.jsx, earrisk.jsx, mocrisk.jsx
│   │   ├── frisk.jsx, aorisk.jsx, mrmrisk.jsx, actionrisk.jsx
│   │   ├── kpirisk.jsx, opirisk.jsx
│   │
│   ├── tableheaders/       ← Her modülün <thead> bileşeni
│   │   ├── tableheards.jsx (bg), hsheaders.jsx, legheaders.jsx, envheaders.jsx
│   │   ├── eiheaders.jsx, trheaders.jsx, docheaders.jsx, venheaders.jsx
│   │   ├── customerheaders.jsx, fbheaders.jsx, earheaders.jsx, mocheaders.jsx
│   │   ├── fheaders.jsx, aoheaders.jsx, mrmheaders.jsx, actionheaders.jsx
│   │   ├── kpiheaders.jsx, opiheaders.jsx
│   │
│   └── utils/
│       ├── firebase.js       ← Firebase init → exports `db`
│       ├── auth.js           ← isAuth() — localStorage tabanlı, KULLANILMIYOR
│       ├── UserContext.jsx   ← Context: { isSuperAdmin, openExport }
│       ├── toast.js          ← Pub/sub toast sistemi
│       ├── ToastContainer.jsx← Toast renderer (fixed top-right)
│       ├── ExportButton.jsx  ← Buton → openExport(moduleKey)
│       ├── ExportModal.jsx   ← Export modal UI
│       ├── exportUtils.js    ← MODULE_CONFIGS + tüm export mantığı
│       ├── HelpModal.jsx     ← Sağdan açılan yardım paneli (Firebase'den içerik)
│       ├── helpContents.js   ← Her modül için yerel yardım verisi (fallback)
│       ├── helpStore.js      ← (Firebase'e içerik kaydeden util)
│       └── EmptyRow.jsx      ← Boş tablo satırı bileşeni
│
├── style/
│   └── mainpage.css          ← Ayrı CSS dosyası
│
├── public/
│   └── jsondatas/bgrisk.json ← Test/statik veri
│
├── index.html
├── vite.config.js
├── .env                      ← Firebase config değerleri
│
├── components/riskrouter copy.jsx  ← ESKİ KOPYA, KULLANILMIYOR
├── et --hard ...              ← Git komutundan yanlışlıkla oluşan dosyalar
└── PROJECT_NOTES.md           ← Bu dosya
```

---

## Uygulama Akışı

```
index.html
  └── src/main.jsx (createRoot)
        ├── IntroScreen (~3 sn açılış animasyonu)
        ├── <Nav /> (navbar.jsx)
        ├── <ToastContainer /> (global toast)
        └── <Routes>
              └── "/" → <RiskRouter />
                    ├── UserProvider (isSuperAdmin, openExport)
                    ├── Sidebar (19 modül butonu)
                    ├── selectedRisk state → ilgili profil bileşeni
                    └── <ExportModal /> (root'ta, tüm modüllerin paylaştığı)
```

**Önemli:** `src/App.jsx` default Vite stub'ıdır, render edilmez. Gerçek App fonksiyonu `src/main.jsx` içindedir.

---

## Modül Tablosu

| Sidebar ID   | Bileşen           | API prefix           | tabledata       | tableheader       |
|--------------|-------------------|----------------------|-----------------|-------------------|
| dashboard    | kpi.jsx           | /dashboard/kpi + opi | —               | —                 |
| kpi          | kpiprofile.jsx    | /dashboard/kpi       | kpirisk.jsx     | kpiheaders.jsx    |
| opi          | opiprofile.jsx    | /dashboard/opi       | opirisk.jsx     | opiheaders.jsx    |
| bg-reg       | profile.jsx       | /register/br         | bgrisk.jsx      | tableheards.jsx   |
| hs-reg       | hsprofile.jsx     | /register/hsr        | hsrisk.jsx      | hsheaders.jsx     |
| leg-reg      | legprofile.jsx    | /register/leg        | legrisk.jsx     | legheaders.jsx    |
| env-reg      | envprofile.jsx    | /register/eai        | envrisk.jsx     | envheaders.jsx    |
| eq-reg       | eiprofile.jsx     | /register/ei         | eirisk.jsx      | eiheaders.jsx     |
| tr-reg       | trprofile.jsx     | /register/tra        | trrisk.jsx      | trheaders.jsx     |
| doc-reg      | docprofile.jsx    | /register/doc        | docrisk.jsx     | docheaders.jsx    |
| ven-reg      | venprofile.jsx    | /register/ven        | venrisk.jsx     | venheaders.jsx    |
| cus-reg      | customerprofile.jsx| /register/cus       | customerrisk.jsx| customerheaders.jsx|
| fb-reg       | fbprofile.jsx     | /register/fb         | fbrisk.jsx      | fbheaders.jsx     |
| ear-reg      | earprofile.jsx    | /register/ea         | earrisk.jsx     | earheaders.jsx    |
| moc-reg      | mocprofile.jsx    | /register/moc        | mocrisk.jsx     | mocheaders.jsx    |
| fl-reg       | flog.jsx          | /register/fin        | frisk.jsx       | fheaders.jsx      |
| ao-reg       | aoprofile.jsx     | /register/aop        | aorisk.jsx      | aoheaders.jsx     |
| mr-reg       | mrmprofile.jsx    | /register/mrm        | mrmrisk.jsx     | mrmheaders.jsx    |
| ac-reg       | actionprofile.jsx | /dashboard/actionLog | actionrisk.jsx  | actionheaders.jsx |

---

## API & Auth Yapısı

**Base URL:** `https://isosofts.com`

**Token:** Cookie'den alınır:
```js
document.cookie.split("; ")
  .find(r => r.startsWith("auth_token="))
  ?.split("=").slice(1).join("=") ?? ""
```
Her istekte `?token=${token}` query param olarak eklenir.

**Ortak Endpoint Kalıbı:**
```
GET  /api/register/{prefix}/all?token=         → tüm aktif kayıtlar
GET  /api/register/{prefix}/all?token=&status= → archived/deleted
POST /api/register/{prefix}/one?token=         → yeni kayıt
PUT  /api/register/{prefix}/one/{id}?token=    → kayıt güncelleme
PUT  /api/register/{prefix}/all/delete?token=  → soft delete (body: {ids:[...]})
PUT  /api/register/{prefix}/all/undelete?token= → geri al
PUT  /api/register/{prefix}/all/archive?token= → arşivle
PUT  /api/register/{prefix}/all/unarchive?token= → arşivden çıkar
```

**Action (Alt Kayıt) Endpoints:**
```
POST /api/register/component/action/one?token=
PUT  /api/register/component/action/one/{id}?token=
PUT  /api/register/component/action/all/delete?token=
PUT  /api/register/component/action/all/undelete?token=
```

**Dropdown:**
```
GET /api/tablecomponent/dropdownlistitem?token=
```
Dönen yapı: `{ swot:[], pestle:[], process:[], interestedParty:[], relativeFunction:[], affectedPosition:[], confirmation:[], status:[], verificationStatus:[], ... }`

**Hesap/Şirket:**
```
GET /api/account/self?token=   → { fullName, firstName, lastName, username, role, isSuperAdmin, type }
GET /api/company/self?token=   → { name }
```

---

## Profil Bileşeni Kalıbı (tüm modüllerde aynı)

Her `*profile.jsx` ve `flog.jsx` aynı state/mantık şablonunu izler:

```
State:
  selectedRows      → Set<id>      (checkbox seçimi, ana tablo)
  selectedTable     → Array        (seçili satır objeleri)
  selectedRowsForActions → Set     (action alt tablosu için)
  selectedTableForActions → Array
  showArchived      → bool
  showDeleted       → bool
  showDeletedAction → bool
  showAction        → bool         (action alt tablosunu göster/gizle)
  activeHeader      → bool         (true=ana tablo, false=action tablosu)
  showModal         → bool
  modalMode         → "add"|"edit"
  formData          → {}           (modüle özgü alanlar)
  actionData        → { actionPlan:[{...}] }
  dropdownData      → {}           (API'den gelen dropdown seçenekleri)
  refresh           → bool         (tetiklemek için)
  showHelp          → bool
  showDeleteModal   → bool

Fonksiyonlar:
  openAddModal()     → dropdown çek, formu sıfırla, modalı aç
  openEditModal(row) → dropdown çek, formu doldur, modalı aç
  saveRisk()         → POST(add) veya PUT(edit), refresh=true
  handleDeleteConfirm() → soft delete veya undelete
  archiveData()      → archive veya unarchive
  editSingle()       → getSelectedRow() → openEditModal
  toggleArchiveView()
  toggleDeleteView()
  toggleActionView()  → activeHeader toggle

JSX yapısı:
  <div> (h-full)
    Header Toolbar (Add, Archive, Delete, Action butonları + ExportButton + HelpModal butonu)
    <table>
      <SomeHeaders activeHeader={activeHeader} />
      <SomeBody ... />
    </table>
    {showModal && (activeHeader ? <Risk Modal> : <Action Modal>)}
    {showDeleteModal && <Delete Confirm Modal>}
    <HelpModal isOpen={showHelp} helpData={someHelpContent} />
  </div>
```

**Modal CSS sınıfları:** `.modal-overlay` + `.modal-box` — `riskrouter.jsx`'teki global MutationObserver bunları sürüklenebilir yapar.

---

## Util Dosyaları Detayı

### `utils/toast.js`
Pub/sub sistemi. `listeners` Set'i tutar.
```js
toast.success("mesaj")
toast.error("mesaj")
toast.info("mesaj")
toast.warning("mesaj")
```

### `utils/ToastContainer.jsx`
`subscribeToast()` ile abone olur. Fixed top-right, 3500ms sonra kaybolur.

### `utils/UserContext.jsx`
```js
const { isSuperAdmin, openExport } = useUser();
```
`openExport(moduleKey)` → `riskrouter.jsx`'te ExportModal'ı açar.

### `utils/exportUtils.js`
- `MODULE_CONFIGS` — 16 modülün export config'i (endpoint, columns, isKpiOpi flag)
- `fetchData(endpoint, status)` — tek status için veri çeker
- `exportModule(moduleKey, statuses, visual)` — tek modülü Excel'e yazar
- `exportAll(statuses, visual, onProgress)` — tüm modülleri tek Excel'e yazar
- Risk level: Low (≤6), Medium (≤10), High (>10) = severity × likelihood

### `utils/HelpModal.jsx`
- Sağdan açılan panel (`max-w-xl`, `h-full`)
- Firebase Realtime DB: `helpContent/{toKey(title)}` path'inden veri çeker
- Önce lokal `helpContents.js` fallback'i gösterir, Firebase yüklenince override eder
- "Edited" badge: Firebase'den veri geldiyse gösterir

### `utils/firebase.js`
- `.env` dosyasından `VITE_FIREBASE_*` değerleri alır
- `export const db = getDatabase(app)`

### `utils/auth.js`
- `isAuth()` → localStorage `token` varlığını kontrol eder
- **ANA UYGULAMADA KULLANILMIYOR** (token cookie'den alınıyor)

---

## KPI Dashboard (`kpi.jsx`)

Dashboard modülünün bileşenidir (sidebar'da `"dashboard"` ID'si).

**Veri akışı:**
1. `/api/dashboard/kpi?token=` → `kpiData[]`
2. `/api/dashboard/opi/all?token=` → `opiData[]`
3. Dropdown'dan seçim: `selectedType ("kpi"|"opi")` + `selectedId`
4. `chartData` = seçili KPI/OPI'nin 12 aylık verisi

**Grafik tipleri:** line, bar, area, radar, pie (tamamı recharts)

**Hero stat boxes:** `TARGET_NOS = ["001"..."009","020"]` — bu numaralara sahip KPI'ları bulur, `actualKPI` değerlerini gösterir.

**Props:** `companyName`, `userName` — `riskrouter.jsx`'ten geçirilir.

---

## riskrouter.jsx Önemli Detaylar

1. **Çift veri çekimi:** Hem `navbar.jsx` hem `riskrouter.jsx` aynı account/company API'lerini çağırır. Navbar kendi state'ini tutar, riskrouter dashboard'a prop geçirir.

2. **Draggable Modals (useEffect):**
   - `MutationObserver` ile DOM izler
   - `.modal-box` sınıfı olan elemanları bulur
   - `mousedown/mousemove/mouseup` ile sürükleme
   - 5px threshold: gerçek sürükleme vs. tıklama ayrımı
   - Sürükleme sırasında modal `document.body`'e taşınır

3. **Mobile davranış:** `window.innerWidth < 1024` ise sidebar başlangıçta kapalı.

4. **Export akışı:**
   ```
   ExportButton.onClick → openExport(moduleKey)
   → setExportModuleKey(key), setShowExport(true)
   → ExportModal açılır
   → exportModule() veya exportAll() çağrılır
   ```

---

## Bilinen Sorunlar / Dikkat Edilecekler

1. **`src/App.jsx` kullanılmıyor** — karışıklık yaratabilir, silmeden önce sor.

2. **`riskrouter copy.jsx`** — eski kopya, aktif değil.

3. **`et --hard ...` dosyaları** — git reset komutunun yanlış çalışmasından oluşan, içi boş dosyalar.

4. **`utils/auth.js`'in `isAuth()`** — ana akışta kullanılmıyor, cookie tabanlı token sistemi var.

5. **profile.jsx içinde duplicate `hCheckboxChange`** — hem `profile.jsx` hem `flog.jsx` aynı fonksiyonu export ediyor (kopyalanmış). Ortak util'e taşınabilir.

6. **`profile.jsx` (bg-reg) içinde `formDataHs`** — HS form state'i var ama bg-reg bileşeninde kullanılmıyor; eski kodun kalıntısı.

7. **`mainbranches.jsx`, `mainpage.jsx`, `mainpage1.jsx`** — aktif route'da kullanılmıyor, eski sayfalar.

8. **`components/test/test.jsx`** — test bileşeni, production'da kullanılmıyor.

---

## Değişiklik Günlüğü

| Tarih      | Dosya(lar)         | Değişiklik |
|------------|--------------------|------------|
| 2026-05-29 | PROJECT_NOTES.md   | Dosya oluşturuldu (ilk tam inceleme) |
| 2026-05-29 | utils/staffCache.js, utils/StaffName.jsx | Yeni: Staff adı çekme utility (in-memory cache) ve React bileşeni |
| 2026-05-29 | tabledatas/*.jsx (17 dosya) | Action tablolarındaki `responsible?.value` → `<StaffName id={...?.responsibleId} />` — backend artık `responsibleId` döndürüyor, GET /api/account/staff/:id üzerinden isim çekiliyor |
| 2026-05-29 | utils/staffListCache.js | Yeni: Staff listesi çekme/cache utility → GET /api/account/staff?isActive=1, döndürür `{id, value: "name surname"}[]` |
| 2026-05-29 | 16 profil bileşeni (profile, hsprofile, legprofile, aoprofile, customerprofile, docprofile, opiprofile, trprofile, venprofile, earprofile, eiprofile, envprofile, flog, mocprofile, mrmprofile, actionprofile) | Action modal'daki Responsible dropdown'ı `dropdownData.affectedPosition` yerine `staffList` (staff API) kullanıyor. Her component: `fetchStaffList` import + `staffList` state + mount'ta fetch |

