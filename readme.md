# Undangan Pernikahan Digital — SaaS Monorepo

Platform undangan pernikahan digital multi-tenant: satu backend & satu database melayani banyak pasangan pengantin, masing-masing punya subdomain sendiri (`nama-pasangan.domain.com`), tema visual sendiri, dan bisa mengedit isi undangannya sendiri lewat link token tanpa perlu login/password.

## Daftar Isi

- [Arsitektur](#arsitektur)
- [Struktur Monorepo](#struktur-monorepo)
- [Skema Database](#skema-database)
- [Alur Multi-Tenant (Subdomain Resolution)](#alur-multi-tenant-subdomain-resolution)
- [Alur Aplikasi](#alur-aplikasi)
- [Referensi API](#referensi-api)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Environment Variables](#environment-variables)
- [Keterbatasan & Langkah Selanjutnya](#keterbatasan--langkah-selanjutnya)

---

## Arsitektur

```
                                   ┌─────────────────────┐
                                   │   Cloudflare DNS     │
                                   │  *.undangan.com  →   │
                                   │   IP Mini Server      │
                                   └──────────┬───────────┘
                                              │
                                   ┌──────────▼───────────┐
                                   │   Mini Server (Docker)│
                                   │                        │
   ┌────────────────────────────────────────────────────────────────────┐
   │  docker compose (infra/docker-compose.yml)                          │
   │                                                                      │
   │  ┌───────────┐   ┌───────────┐   ┌────────────┐   ┌──────────────┐ │
   │  │  frontend │──▶│  backend  │──▶│  postgres  │   │    minio     │ │
   │  │  Vite/React│  │  Rust/Axum│──▶│  (weddings,│   │ (S3-compat., │ │
   │  │  :5173     │  │  :8080    │   │  wedding_  │   │  foto/musik) │ │
   │  │            │  │           │   │  details,  │   │   :9000/9001 │ │
   │  │            │  │           │   │  rsvp)     │   │              │ │
   │  └───────────┘   └───────────┘   └────────────┘   └──────────────┘ │
   └────────────────────────────────────────────────────────────────────┘
```

**Prinsip kunci**: backend TIDAK pernah menyimpan atau menebak domain publiknya sendiri (tidak ada `APP_BASE_DOMAIN` di config). Semua identifikasi tenant dan pembentukan URL diturunkan dari konteks request yang sebenarnya (`Host` header / `window.location`), jadi kode yang sama berjalan benar baik di `localhost` maupun di domain production apa pun yang di-set di depan Cloudflare/nginx — tanpa perlu diubah.

### Stack

| Layer | Teknologi |
|---|---|
| Backend | Rust, Axum, SQLx (Postgres), Tokio |
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS v4 |
| Database | PostgreSQL 16 |
| Object storage | MinIO (S3-compatible), diakses via `aws-sdk-s3` |
| Orkestrasi lokal | Docker Compose — **semua service jalan di container**, tidak butuh Rust/Node terinstal di mesin host |
| DNS production (rencana) | Cloudflare wildcard `*.domain.com` |

---

## Struktur Monorepo

```
.
├── Makefile                 # wrapper `docker compose` yang baca .env root
├── .env / .env.example       # SATU sumber konfigurasi untuk seluruh stack
├── infra/
│   └── docker-compose.yml   # definisi service: postgres, minio, backend, frontend
├── apps/
│   ├── backend/              # Rust (Axum + SQLx)
│   │   ├── Dockerfile.dev    # image dev: cargo-watch, auto-reload
│   │   ├── migrations/       # 0001..0005, dijalankan otomatis saat startup
│   │   └── src/
│   │       ├── main.rs       # wiring: config → pool → S3 client → router → serve
│   │       ├── config.rs     # AppConfig dari env
│   │       ├── db.rs         # PgPool
│   │       ├── state.rs      # AppState { db, config, s3_client }
│   │       ├── auth.rs       # validasi Basic Auth admin (kredensial konstan)
│   │       ├── s3.rs         # S3 client diarahkan ke MinIO
│   │       ├── error.rs      # AppError → HTTP response
│   │       ├── middleware/
│   │       │   └── tenant.rs # ekstrak subdomain dari Host header
│   │       ├── models/       # DTO request/response tiap fitur
│   │       ├── routes/       # handler tiap endpoint
│   │       └── utils/
│   │           └── slug.rs   # generate_couple_slug("Ivan","Aura") -> "ivan-aura"
│   └── frontend/              # React + TypeScript
│       └── src/
│           ├── App.tsx        # router utama: admin vs tenant vs /edit
│           ├── types/wedding.ts # interface TS, mirror 1:1 struct Rust
│           ├── lib/api.ts     # semua fetch() ke backend
│           ├── hooks/useCountdown.ts
│           ├── utils/
│           │   ├── subdomain.ts  # resolveSubdomainSlug + buildInviteUrl
│           │   └── formatDate.ts
│           ├── components/themes/
│           │   ├── Theme1.tsx    # tema undangan (layout tetap, value dinamis)
│           │   └── registry.ts   # mapping theme_id -> komponen
│           └── pages/
│               ├── AdminGate.tsx      # gerbang login sebelum dashboard
│               ├── AdminLogin.tsx
│               ├── AdminDashboard.tsx # form generate undangan baru
│               ├── WeddingEditor.tsx  # editor /edit?token=...
│               └── InvitationNotFound.tsx
└── theme1-desain/             # referensi desain Figma Theme 1 (screenshot)
```

---

## Skema Database

```
weddings                          wedding_details                   rsvp
─────────────────────────         ─────────────────────────         ─────────────────────────
id                UUID PK         id                UUID PK         id                UUID PK
subdomain_slug    VARCHAR UNIQUE  wedding_id        UUID FK ──┐      wedding_id        UUID FK ──┐
theme_id          INT             groom_name        VARCHAR   │      guest_name        VARCHAR   │
primary_color     VARCHAR         bride_name        VARCHAR   │      attendance_status VARCHAR   │
secondary_color   VARCHAR         wedding_date      TIMESTAMPTZ│     message           TEXT      │
music_url         TEXT            location_address  TEXT      │      created_at        TIMESTAMPTZ│
access_token      VARCHAR UNIQUE  maps_url          TEXT      │      ── belum ada endpoint API ──┘
is_published      BOOLEAN         cover_photo_url   TEXT      │
created_at        TIMESTAMPTZ     ─────────────────────────   │
updated_at        TIMESTAMPTZ  ◀──────────────────────────────┘  (ON DELETE CASCADE)
```

- `subdomain_slug` dan `access_token` sengaja **tidak** diberi index terpisah — `UNIQUE` di Postgres otomatis membuat B-tree index.
- `wedding_details.wedding_id` punya unique index (relasi 1-ke-1 dengan `weddings`).
- `rsvp` sudah ada skemanya tapi **belum ada endpoint backend** yang mengeksposnya (fitur RSVP submit/list belum dibangun).
- Semua migrasi ada di `apps/backend/migrations/`, dijalankan otomatis (`sqlx::migrate!`) tiap backend start.

---

## Alur Multi-Tenant (Subdomain Resolution)

Backend membaca `Host` header setiap request masuk (`middleware/tenant.rs`), memecahnya berdasarkan titik (`.`), dan mengambil label paling depan sebagai `subdomain_slug` — **tanpa** mencocokkan ke domain yang di-hardcode:

```
"ivan-aura.undangan.com"       (3 label, root = 2 label)  -> tenant slug "ivan-aura"
"undangan.com"                 (2 label = root domain)    -> tidak ada tenant (None)
"www.undangan.com"             (label pertama = "www")    -> None (reserved)
"ivan-aura.localhost"          (root ".localhost" = 1 label)-> tenant slug "ivan-aura"
"localhost" / "127.0.0.1"                                 -> None
```

Aturan "root = 2 label, kecuali `.localhost` yang root-nya 1 label" ini di-implementasi **identik** di dua tempat (harus tetap sinkron kalau salah satu diubah):
- Backend: `apps/backend/src/middleware/tenant.rs` → `extract_subdomain()`
- Frontend: `apps/frontend/src/utils/subdomain.ts` → `resolveSubdomainSlug()`

**Kenapa frontend butuh logika yang sama?** Karena `App.tsx` perlu tahu duluan (sebelum fetch apa pun) apakah halaman ini harus render Admin Dashboard, halaman Editor, atau undangan tenant — murni dari `window.location.hostname`.

**Masalah yang sudah diselesaikan — Host header saat dev lokal**: frontend (Vite, port 5173) dan backend (Axum, port 8080) adalah origin yang berbeda saat development. Kalau frontend fetch langsung ke `http://localhost:8080/...`, browser mengirim `Host: localhost:8080` ke backend — bukan subdomain aslinya. Solusinya: frontend selalu fetch pakai path **relatif** (`/api/...`), dan `vite.config.ts` mem-proxy `/api/*` ke backend dengan `changeOrigin: false`, yang membuat Vite meneruskan `Host` header ASLI dari browser apa adanya. Pola ini otomatis benar juga di production (frontend & backend disajikan dari domain tenant yang sama, tidak perlu CORS).

---

## Alur Aplikasi

### 1. Admin membuat undangan baru

```
Admin buka localhost:5173 (root domain -> AdminGate)
  │
  ├─ belum login → AdminLogin.tsx
  │     └─ POST /api/admin/login {username, password}
  │           └─ backend cocokkan ke ADMIN_USERNAME/ADMIN_PASSWORD (env, konstan)
  │           └─ sukses → frontend simpan base64(user:pass) di sessionStorage
  │
  └─ sudah login → AdminDashboard.tsx
        └─ isi Nama Pria, Nama Wanita, pilih Tema → submit
        └─ POST /api/weddings  (header Authorization: Basic ..., divalidasi ULANG di backend)
              ├─ generate_couple_slug("Ivan","Aura") -> "ivan-aura"
              │     (kalau slug bentrok, retry "ivan-aura-2", dst — pakai SAVEPOINT
              │      per percobaan supaya transaksi induk tidak ikut ter-abort)
              ├─ generate access_token = Uuid::new_v4()
              ├─ INSERT weddings + wedding_details dalam SATU transaksi
              └─ return { subdomain_slug, access_token, theme_id, ... }
        └─ Dashboard tampilkan invite_url = buildInviteUrl(subdomain_slug)
              (dibentuk dari window.location saat itu, BUKAN dari config backend)
```

### 2. Tamu membuka undangan

```
Tamu buka https://ivan-aura.undangan.com/?to=Budi
  │
  └─ App.tsx: resolveSubdomainSlug(hostname) -> "ivan-aura" (bukan admin/edit)
        └─ GET /api/wedding-details
              (Host header "ivan-aura.undangan.com" -> middleware resolve tenant)
              └─ JOIN weddings + wedding_details WHERE subdomain_slug = 'ivan-aura'
              ├─ 200 OK  → registry.ts pilih komponen sesuai theme_id → <Theme1 data=... guestName="Budi" />
              └─ 404     → <InvitationNotFound />
```

`Theme1.tsx`: layout & className Tailwind **tetap**, semua isi (nama, tanggal, lokasi, warna, musik) murni dari props. Warna didaftarkan sekali sebagai CSS custom property (`--color-primary`/`--color-secondary`) di root, dipakai lewat Tailwind arbitrary value (`bg-[var(--color-primary)]`) di seluruh komponen.

### 3. Pengantin mengedit undangannya sendiri (tanpa password)

```
Pengantin buka https://ivan-aura.undangan.com/edit?token=4342b010-4aa1-411c-ab87-b242d4aef124
  │
  └─ App.tsx: slug != null && pathname === '/edit' -> <WeddingEditor slug="ivan-aura" />
        └─ useEffect: GET /api/wedding/edit-auth?slug=ivan-aura&token=...
              ├─ 200 OK (token cocok dgn slug) → prefill form dengan data terkini
              └─ 401    → "Akses Ditolak: Token Tidak Valid"
        │
        ├─ Ubah warna (color picker), nama, tanggal, lokasi, maps url
        │
        ├─ Pilih foto pranikah
        │     └─ POST /api/wedding/upload  (multipart, header X-Access-Token)
        │           └─ backend cari wedding by access_token → upload ke MinIO
        │                 (key: weddings/{wedding_id}/{uuid}.{ext}, MAX 10MB,
        │                  hanya JPEG/PNG/WEBP)
        │           └─ return { url: "http://.../undangan-assets/weddings/..." }
        │           └─ frontend simpan url ke state form
        │
        └─ Klik "Simpan Perubahan"
              └─ PUT /api/wedding/update  (header X-Access-Token)
                    └─ backend validasi token → UPDATE weddings + wedding_details
                          dalam satu transaksi → return data terbaru
```

**Kredensial editor = `access_token` itu sendiri** (UUID v4 unik per wedding, bukan tabel user/password). Siapa pun yang punya link `/edit?token=...` bisa mengedit — modelnya sengaja "token sebagai kunci", sesuai instruksi awal proyek.

---

## Referensi API

Base path semua endpoint: `/api`. Tidak ada versioning (`/v1`, dst) — MVP.

| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/admin/login` | — | Validasi username/password admin konstan (feedback UI saja, tidak menerbitkan sesi) |
| `POST` | `/weddings` | `Authorization: Basic` (admin) | Buat undangan baru: generate slug unik + access_token, simpan `weddings` + `wedding_details` |
| `GET` | `/wedding-details` | — (tenant dari `Host` header) | Data publik undangan (tema, pasangan, acara) untuk halaman tamu |
| `GET` | `/wedding/edit-auth?slug=&token=` | query `token` + `slug` | Validasi akses editor, sekaligus mengembalikan data lengkap untuk prefill form |
| `PUT` | `/wedding/update` | `X-Access-Token` header | Update nama, warna, tanggal, lokasi, foto |
| `POST` | `/wedding/upload` | `X-Access-Token` header | Upload foto (multipart `file`) ke MinIO, kembalikan URL publik |

**Belum ada** (potensi langkah selanjutnya): `POST /rsvp` (submit ucapan & konfirmasi kehadiran tamu) dan `GET /rsvp` (daftar ucapan) — tabel `rsvp` sudah ada di skema tapi belum di-wire ke API/UI.

---

## Menjalankan Secara Lokal

Seluruh stack jalan di Docker — **tidak perlu install Rust atau Node** di mesin kamu.

```bash
cp .env.example .env
# wajib isi ADMIN_PASSWORD di .env (tidak ada default, backend akan gagal start kalau kosong)

make up      # build image + start postgres, minio, backend, frontend
make logs    # tail semua log
make ps      # status container
make down    # stop semua
```

- Admin Dashboard: `http://localhost:5173`
- Backend langsung (debug): `http://localhost:8080`
- MinIO Console: `http://localhost:9001`
- Undangan tenant: `http://<subdomain-slug>.localhost:5173` (browser modern resolve `*.localhost` otomatis ke `127.0.0.1`, tidak perlu edit `/etc/hosts`)
- Editor: `http://<subdomain-slug>.localhost:5173/edit?token=f00d88dc-96f9-4410-8640-7a69ae285f21

Backend (`cargo-watch`) dan frontend (`vite`) auto-reload begitu file di `apps/backend/src` atau `apps/frontend/src` disimpan — edit kode seperti biasa, tidak perlu restart container manual.

---

## Environment Variables

Satu file `.env` di root mengatur seluruh stack (lihat `.env.example`):

| Variabel | Dipakai oleh | Keterangan |
|---|---|---|
| `POSTGRES_USER/PASSWORD/DB/PORT` | postgres, backend | |
| `MINIO_ROOT_USER/PASSWORD`, `MINIO_API_PORT`, `MINIO_CONSOLE_PORT`, `MINIO_BUCKET` | minio, backend | |
| `BACKEND_PORT` | backend | |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | backend | Kredensial Admin Dashboard. **`ADMIN_PASSWORD` wajib diisi**, tidak ada default. Ganti sebelum production. |
| `FRONTEND_PORT` | frontend | |

Backend **tidak** punya variabel domain (`APP_BASE_DOMAIN` sudah dihapus) — URL publik selalu diturunkan dari request/browser saat itu, bukan dikonfigurasi statis.

---

## Production Deployment

Stack production memakai **satu image aplikasi** (`infra/Dockerfile.prod`): frontend
di-`vite build` lalu disajikan langsung oleh backend Rust — termasuk inject OG meta
tags per wedding (padanan production dari plugin Vite dev, lihat
`apps/backend/src/routes/spa.rs`). Tidak ada Vite/nginx untuk HTML di production.

### Menjalankan

```bash
# dari root repo; pastikan .env berisi nilai production (lihat bawah)
docker compose -p undangan-prod --env-file .env -f infra/docker-compose.prod.yml up -d --build
```

Env WAJIB untuk production (di samping yang sudah ada di `.env.example`):

| Variabel | Contoh | Catatan |
| --- | --- | --- |
| `ADMIN_PASSWORD` | (acak panjang) | Jangan pakai default. |
| `POSTGRES_PASSWORD` | (acak panjang) | |
| `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` | (acak) | |
| `MINIO_PUBLIC_URL` | `https://assets.domainmu.com` | URL publik asset yang bisa diakses browser tamu — URL foto/lagu yang tersimpan memakai base ini. |
| `APP_PORT` | `8080` | Port host untuk container app. |

### DNS & TLS (wajib di depan stack)

1. **DNS wildcard**: arahkan `domainmu.com` dan `*.domainmu.com` (A record) ke server.
2. **Reverse proxy ber-TLS** — Basic Auth admin & token editor hanya aman di belakang
   HTTPS. Dua opsi mudah:
   - **Cloudflare** (paling praktis): proxy oranye untuk `domainmu.com`, `*.domainmu.com`
     (wildcard butuh plan yang mendukung / Advanced Certificate), dan
     `assets.domainmu.com` → origin port `APP_PORT` / `MINIO_API_PORT`.
   - **Caddy** di server yang sama (wildcard cert via DNS challenge):
     ```
     *.domainmu.com, domainmu.com {
         reverse_proxy localhost:8080
     }
     assets.domainmu.com {
         reverse_proxy localhost:9000
     }
     ```
3. Backend me-resolve tenant dari `Host` header, jadi proxy harus meneruskan Host
   apa adanya (perilaku default Cloudflare & Caddy `reverse_proxy`).

### Backup

```bash
# Postgres: dump harian (contoh cron 03:00)
0 3 * * * docker exec undangan-prod-postgres pg_dump -U undangan undangan | gzip > /backup/undangan-$(date +\%F).sql.gz

# MinIO: mirror bucket asset ke folder backup
docker run --rm --network undangan-prod-net -v /backup/minio:/backup minio/mc:latest \
  sh -c "mc alias set local http://minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD && mc mirror local/undangan-assets /backup"
```

Migrasi database berjalan otomatis saat container app start (ter-embed di binary
via `sqlx::migrate!`).

## Keterbatasan & Langkah Selanjutnya

Hal-hal yang secara sadar disederhanakan untuk MVP, dan bisa jadi prioritas iterasi berikutnya:

- **Timezone = WIB tunggal** — konvensi platform: semua timestamp acara adalah jam
  dinding WIB (lihat `apps/frontend/src/utils/formatDate.ts`). Countdown & file .ics
  sudah benar untuk tamu di timezone mana pun, tapi belum ada dukungan acara di
  WITA/WIT (perlu kolom timezone per wedding kalau dibutuhkan).
- **Basic Auth admin** aman hanya di belakang HTTPS (Cloudflare/nginx TLS termination) — jangan expose port 8080 backend langsung ke internet tanpa TLS di depannya.
- **Hanya Theme 1** yang punya komponen — `registry.ts` & `theme_id` di skema sudah didesain skalabel untuk Theme 2, 3, dst.
- **Root domain ccSLD** (mis. `undangan.co.id`, 3 label) belum didukung oleh heuristik hitung-label subdomain (butuh public suffix list kalau nanti dipakai domain seperti itu).
- **Belum ada billing/masa aktif** — gerbang publish sudah ada (admin toggle), tapi alur bayar/expired/perpanjang belum.
- **Belum ada hapus wedding & kelola lagu (hapus/edit) dari Admin UI** — masih lewat SQL manual.
