# Entity Relationship Diagram (ERD) Teamly

## 1. Deskripsi

Teamly merupakan aplikasi manajemen proyek dan kolaborasi tim mahasiswa. ERD ini menggambarkan hubungan antarentitas yang digunakan dalam sistem Teamly.

## 2. Diagram ERD

```mermaid
erDiagram
    USER ||--o{ TEAM : creates
    TEAM ||--o{ TEAM_MEMBER : has
    USER ||--o{ TEAM_MEMBER : joins
    TEAM ||--o{ PROJECT : manages
    PROJECT ||--o{ SPRINT : contains
    SPRINT ||--o{ TASK : contains
    USER ||--o{ TASK : assigned_to
    USER ||--o{ AI_RECOMMENDATION : receives
    USER ||--o{ AI_CHAT : uses
```

## 3. Entitas

1. USER: Menyimpan informasi akun pengguna.
2. TEAM: Menyimpan informasi kelompok.
3. TEAM_MEMBER: Menghubungkan pengguna dengan kelompok.
4. PROJECT: Menyimpan informasi proyek.
5. SPRINT: Mengatur periode pengerjaan proyek.
6. TASK: Menyimpan tugas, status, prioritas, dan deadline.
7. AI_RECOMMENDATION: Menyimpan rekomendasi ide proyek dari AI.
8. AI_CHAT: Menyimpan riwayat konsultasi pengguna dengan AI.