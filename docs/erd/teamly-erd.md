# Entity Relationship Diagram (ERD) Teamly

## 1. Deskripsi

Teamly merupakan aplikasi manajemen proyek dan kolaborasi tim mahasiswa. ERD ini menggambarkan entitas, atribut, serta hubungan antarentitas yang digunakan dalam sistem Teamly.

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

    USER {
        int user_id PK
        string name
        string email
    }

    TEAM {
        int team_id PK
        string team_name
        int created_by FK
    }

    TEAM_MEMBER {
        int member_id PK
        int team_id FK
        int user_id FK
        string role
    }

    PROJECT {
        int project_id PK
        int team_id FK
        string project_name
        string description
        string status
    }

    SPRINT {
        int sprint_id PK
        int project_id FK
        string sprint_name
        date start_date
        date end_date
    }

    TASK {
        int task_id PK
        int sprint_id FK
        int assigned_user_id FK
        string task_name
        string status
        string priority
        date deadline
    }

    AI_RECOMMENDATION {
        int recommendation_id PK
        int user_id FK
        string project_title
        string description
        string tech_stack
    }

    AI_CHAT {
        int chat_id PK
        int user_id FK
        string question
        string answer
        timestamp created_at
    }
```

## 3. Keterangan Entitas

1. USER: Menyimpan informasi akun pengguna.
2. TEAM: Menyimpan informasi kelompok dan pembuat kelompok.
3. TEAM_MEMBER: Menghubungkan pengguna dengan kelompok serta menyimpan peran anggota.
4. PROJECT: Menyimpan informasi proyek yang dikelola oleh kelompok.
5. SPRINT: Mengatur periode pengerjaan proyek.
6. TASK: Menyimpan tugas, anggota yang bertanggung jawab, status, prioritas, dan deadline.
7. AI_RECOMMENDATION: Menyimpan rekomendasi ide proyek yang dihasilkan AI.
8. AI_CHAT: Menyimpan riwayat konsultasi pengguna dengan AI.