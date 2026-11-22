import os
import smtplib
import threading
from email.message import EmailMessage

def is_smtp_configured() -> bool:
    host = (os.getenv('SMTP_HOST') or '').strip()
    sender = (os.getenv('SMTP_FROM_EMAIL') or '').strip()
    password = (os.getenv('SMTP_PASSWORD') or '').strip()
    return bool(host and sender and password)

def send_email_async(to_email: str, subject: str, html_body: str, text_body: str = ""):
    """Mengirim email secara asinkron di background thread agar tidak memperlambat API."""
    def _send():
        if not to_email or "@" not in to_email:
            return

        host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        port = int(os.getenv('SMTP_PORT', '587'))
        username = os.getenv('SMTP_USERNAME') or os.getenv('SMTP_FROM_EMAIL')
        password = os.getenv('SMTP_PASSWORD')
        sender = os.getenv('SMTP_FROM_EMAIL') or username

        if not is_smtp_configured():
            print(f"\n=======================================================")
            print(f"[GMAIL NOTIFIKASI DEV - SMTP Belum Dikonfigurasi di .env]")
            print(f"Kepada: {to_email}")
            print(f"Subjek: {subject}")
            print(f"Ringkasan: {text_body[:120]}...")
            print(f"Tip: Isi SMTP_USERNAME, SMTP_PASSWORD, dan SMTP_FROM_EMAIL di .env untuk kirim email asli via Gmail.")
            print(f"=======================================================\n")
            return

        try:
            msg = EmailMessage()
            msg['Subject'] = subject
            msg['From'] = f"Teamly AI <{sender}>"
            msg['To'] = to_email
            msg.set_content(text_body or subject)
            if html_body:
                msg.add_alternative(html_body, subtype='html')

            with smtplib.SMTP(host, port, timeout=12) as server:
                if os.getenv('SMTP_USE_TLS', 'true').lower() == 'true':
                    server.starttls()
                if username and password:
                    server.login(username, password)
                server.send_message(msg)
                print(f"[GMAIL SUCCESS] Email notifikasi berhasil dikirim ke {to_email}!")
        except Exception as e:
            print(f"[GMAIL ERROR] Gagal mengirim email ke {to_email}: {e}")

    thread = threading.Thread(target=_send, daemon=True)
    thread.start()

def send_test_email(to_email: str) -> tuple[bool, str | None]:
    """Mengirim email tes secara sinkron untuk memverifikasi kredensial SMTP Gmail."""
    host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
    port = int(os.getenv('SMTP_PORT', '587'))
    username = os.getenv('SMTP_USERNAME') or os.getenv('SMTP_FROM_EMAIL')
    password = os.getenv('SMTP_PASSWORD')
    sender = os.getenv('SMTP_FROM_EMAIL') or username

    if not is_smtp_configured():
        return False, "SMTP belum dikonfigurasi di file .env (Isi SMTP_USERNAME, SMTP_PASSWORD, dan SMTP_FROM_EMAIL)"

    try:
        msg = EmailMessage()
        msg['Subject'] = '[Teamly] Tes Koneksi API Gmail Berhasil! 🚀'
        msg['From'] = f"Teamly AI <{sender}>"
        msg['To'] = to_email
        msg.set_content("Halo! Jika Anda menerima email ini, berarti integrasi Gmail SMTP pada Teamly telah aktif dan berfungsi sempurna!")

        with smtplib.SMTP(host, port, timeout=12) as server:
            if os.getenv('SMTP_USE_TLS', 'true').lower() == 'true':
                server.starttls()
            if username and password:
                server.login(username, password)
            server.send_message(msg)
            return True, None
    except Exception as e:
        return False, str(e)

def send_task_assignment_notification(
    member_name: str,
    member_email: str,
    task_title: str,
    task_description: str,
    project_name: str,
    leader_name: str,
    priority: str = "Sedang",
    deadline: str = "Fleksibel"
):
    """Mengirimkan email notifikasi penambahan tugas baru kepada member kelompok."""
    subject = f"[Teamly] 📋 Tugas Baru Diberikan: {task_title} ({project_name})"
    
    text_body = (
        f"Halo {member_name},\n\n"
        f"Anda baru saja diberikan tugas baru oleh {leader_name} (Project Leader) dalam project '{project_name}':\n\n"
        f"- Nama Tugas: {task_title}\n"
        f"- Prioritas: {priority.upper()}\n"
        f"- Tenggat Waktu: {deadline}\n"
        f"- Catatan: {task_description or '-'}\n\n"
        f"Silakan buka Teamly Workspace di browser Anda untuk melihat detail tugas dan mulai berdiskusi melalui fitur Feedback Tugas.\n\n"
        f"Salam,\nTeamly AI"
    )

    html_body = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }}
  .card {{ max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
  .header {{ background: linear-gradient(135deg, #ea580c, #f97316); padding: 24px 28px; color: #ffffff; }}
  .brand {{ font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }}
  .badge {{ background: rgba(255,255,255,0.25); font-size: 11px; padding: 2px 8px; border-radius: 12px; margin-left: 6px; font-weight: 700; }}
  .content {{ padding: 28px; }}
  .title {{ font-size: 18px; font-weight: 700; margin: 0 0 12px; color: #0f172a; }}
  .sub {{ font-size: 14px; color: #475569; line-height: 1.5; margin: 0 0 20px; }}
  .task-box {{ background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 18px; margin-bottom: 24px; }}
  .task-title {{ font-size: 16px; font-weight: 700; color: #c2410c; margin-bottom: 12px; }}
  .info-table {{ width: 100%; border-collapse: collapse; font-size: 13px; }}
  .info-table td {{ padding: 5px 0; }}
  .info-label {{ font-weight: 600; width: 120px; color: #475569; }}
  .btn {{ display: inline-block; background: #ea580c; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; }}
  .footer {{ background: #fafaf9; border-top: 1px solid #f1f5f9; padding: 16px 28px; font-size: 11px; color: #94a3b8; text-align: center; }}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <span class="brand">Teamly</span><span class="badge">AI</span>
  </div>
  <div class="content">
    <div class="title">📋 Penugasan Tugas Baru</div>
    <p class="sub">Halo <strong>{member_name}</strong>, Anda baru saja ditugaskan pada tugas baru dalam project <strong>{project_name}</strong> oleh <strong>{leader_name}</strong> (Project Leader).</p>
    
    <div class="task-box">
      <div class="task-title">📌 {task_title}</div>
      <table class="info-table">
        <tr><td class="info-label">Project:</td><td><strong>{project_name}</strong></td></tr>
        <tr><td class="info-label">Prioritas:</td><td>{priority.upper()}</td></tr>
        <tr><td class="info-label">Tenggat Waktu:</td><td>{deadline}</td></tr>
        <tr><td class="info-label">Catatan:</td><td>{task_description or 'Tidak ada catatan tambahan'}</td></tr>
      </table>
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">
      Masuk ke Teamly Workspace dengan email Anda untuk melihat papan tugas, memperbarui progres pengerjaan, dan berdiskusi langsung melalui fitur <strong>Feedback Tugas</strong>.
    </p>

    <div style="text-align: center;">
      <a href="http://localhost:5173" class="btn">Buka Teamly Workspace &rarr;</a>
    </div>
  </div>
  <div class="footer">
    Notifikasi otomatis dari Teamly AI • Platform Kolaborasi Tugas Kelompok Mahasiswa
  </div>
</div>
</body>
</html>"""

    send_email_async(member_email, subject, html_body, text_body)

def send_member_invitation_notification(
    member_name: str,
    member_email: str,
    project_name: str,
    leader_name: str,
    role: str = "Member"
):
    """Mengirimkan email notifikasi saat member baru ditambahkan ke kelompok."""
    subject = f"[Teamly] 👥 Anda Ditambahkan ke Project: {project_name}"
    
    text_body = (
        f"Halo {member_name},\n\n"
        f"Anda telah ditambahkan oleh {leader_name} (Project Leader) ke dalam project tugas kelompok '{project_name}' dengan peran '{role}'.\n\n"
        f"Silakan daftar atau login menggunakan alamat email ini ({member_email}) di Teamly untuk mulai mengakses workspace kelompok Anda.\n\n"
        f"Salam,\nTeamly AI"
    )

    html_body = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }}
  .card {{ max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
  .header {{ background: linear-gradient(135deg, #ea580c, #f97316); padding: 24px 28px; color: #ffffff; }}
  .brand {{ font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }}
  .badge {{ background: rgba(255,255,255,0.25); font-size: 11px; padding: 2px 8px; border-radius: 12px; margin-left: 6px; font-weight: 700; }}
  .content {{ padding: 28px; }}
  .title {{ font-size: 18px; font-weight: 700; margin: 0 0 12px; color: #0f172a; }}
  .sub {{ font-size: 14px; color: #475569; line-height: 1.5; margin: 0 0 20px; }}
  .box {{ background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 18px; margin-bottom: 24px; }}
  .btn {{ display: inline-block; background: #ea580c; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; }}
  .footer {{ background: #fafaf9; border-top: 1px solid #f1f5f9; padding: 16px 28px; font-size: 11px; color: #94a3b8; text-align: center; }}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <span class="brand">Teamly</span><span class="badge">AI</span>
  </div>
  <div class="content">
    <div class="title">👥 Undangan Bergabung ke Project</div>
    <p class="sub">Halo <strong>{member_name}</strong>, Anda telah ditambahkan oleh <strong>{leader_name}</strong> ke dalam project tugas kelompok <strong>{project_name}</strong>.</p>
    
    <div class="box">
      <div style="font-size: 15px; font-weight: 700; color: #1e40af; margin-bottom: 6px;">📂 {project_name}</div>
      <div style="font-size: 13px; color: #3b82f6;">Peran Anda: <strong>{role}</strong></div>
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">
      Gunakan alamat email ini (<strong>{member_email}</strong>) saat mendaftar atau masuk ke Teamly agar otomatis terhubung ke project ini.
    </p>

    <div style="text-align: center;">
      <a href="http://localhost:5173" class="btn">Masuk ke Teamly &rarr;</a>
    </div>
  </div>
  <div class="footer">
    Notifikasi otomatis dari Teamly AI • Platform Kolaborasi Tugas Kelompok Mahasiswa
  </div>
</div>
</body>
</html>"""

    send_email_async(member_email, subject, html_body, text_body)
