from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, inspect, or_, text
from datetime import date, datetime, timedelta
from email.message import EmailMessage
import os
import secrets
import smtplib
from dotenv import load_dotenv
from .database import Base, engine, get_db
from .models import User, Project, Member, Task, ActivityLog, TaskComment
from .schemas import *
from .security import hash_password, verify_password, create_token, current_user
from .ai import ask_ai, project_prompt, generate_project_idea
from .mailer import (
    is_smtp_configured,
    send_email_async,
    send_test_email,
    send_task_assignment_notification,
    send_member_invitation_notification
)

load_dotenv(); Base.metadata.create_all(bind=engine)

def ensure_email_verification_columns():
    columns = {column['name'] for column in inspect(engine).get_columns('users')}
    additions = {
        'email_verified': 'BOOLEAN NOT NULL DEFAULT FALSE',
        'verification_code_hash': 'VARCHAR(255)',
        'verification_expires_at': 'TIMESTAMP',
        'verification_attempts': 'INTEGER NOT NULL DEFAULT 0',
    }
    with engine.begin() as connection:
        for column, definition in additions.items():
            if column not in columns:
                connection.execute(text(f'ALTER TABLE users ADD COLUMN {column} {definition}'))

ensure_email_verification_columns()

def seed_admin_user():
    db = next(get_db())
    try:
        admin_email = 'admin@teamly.com'
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                name='Admin Teamly',
                email=admin_email,
                hashed_password=hash_password('admin123'),
                email_verified=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            p = Project(
                name='Sistem Informasi Teamly',
                description='Workspace utama administrasi dan pengelolaan tugas tim',
                deadline=date(2026, 12, 31),
                owner_id=admin.id
            )
            db.add(p)
            db.commit()
            db.refresh(p)
            db.add(Member(project_id=p.id, user_id=admin.id, name=admin.name, email=admin.email, role='Project Leader'))
            db.commit()
    except Exception as e:
        print(f"Seed admin user note: {e}")
    finally:
        db.close()

seed_admin_user()

app = FastAPI(title='Teamly AI API', version='1.0.0', description='AI-powered project management assistant')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

def send_verification_email(email: str, code: str):
    if not is_smtp_configured():
        print(f"[AUTH DEV] SMTP belum dikonfigurasi. Kode verifikasi untuk {email}: {code}")
        return

    host = os.getenv('SMTP_HOST')
    sender = os.getenv('SMTP_FROM_EMAIL')
    username = os.getenv('SMTP_USERNAME')
    password = os.getenv('SMTP_PASSWORD')

    try:
        port = int(os.getenv('SMTP_PORT', '587'))
        message = EmailMessage()
        message['Subject'] = 'Kode verifikasi akun Teamly'
        message['From'] = sender
        message['To'] = email
        message.set_content(
            f'Kode verifikasi Teamly Anda: {code}\n'
            'Kode ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.'
        )
        with smtplib.SMTP(host, port, timeout=10) as server:
            if os.getenv('SMTP_USE_TLS', 'true').lower() == 'true':
                server.starttls()
            if username and password:
                server.login(username, password)
            server.send_message(message)
    except (OSError, smtplib.SMTPException, ValueError) as exc:
        raise HTTPException(503, 'Email verifikasi gagal dikirim. Coba lagi nanti.') from exc


def prepare_verification(user: User):
    code = f'{secrets.randbelow(1_000_000):06d}'
    user.verification_code_hash = hash_password(code)
    user.verification_expires_at = datetime.utcnow() + timedelta(minutes=10)
    user.verification_attempts = 0
    send_verification_email(user.email, code)

@app.get('/api/health')
def health(): return {'status':'ok','app':'Teamly AI'}

@app.post('/api/auth/register', response_model=VerificationOut)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if len(data.password) < 8: raise HTTPException(400, 'Password minimal 8 karakter')
    email = str(data.email).lower().strip()
    if db.query(User).filter(func.lower(User.email) == email).first(): raise HTTPException(409, 'Email sudah terdaftar')

    smtp_ready = is_smtp_configured()
    user = User(
        name=data.name.strip(),
        email=email,
        hashed_password=hash_password(data.password),
        email_verified=not smtp_ready
    )

    if smtp_ready:
        prepare_verification(user)
        db.add(user)
        db.commit()
        return {'message': 'Kode verifikasi telah dikirim ke email Anda.'}
    else:
        db.add(user)
        db.commit()
        db.refresh(user)
        token = create_token(user.id)
        return {
            'message': 'Pendaftaran berhasil! Akun langsung aktif.',
            'access_token': token,
            'user': user,
            'auto_login': True
        }

@app.post('/api/auth/login', response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    email = str(data.email).lower().strip()
    user = db.query(User).filter(func.lower(User.email) == email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, 'Email atau password salah')
    if not user.email_verified:
        if not is_smtp_configured():
            user.email_verified = True
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(403, 'Email belum diverifikasi')
    return {'access_token':create_token(user.id),'user':user}

@app.post('/api/auth/verify-email', response_model=TokenOut)
def verify_email(data: VerifyEmailIn, db: Session = Depends(get_db)):
    email = str(data.email).lower().strip()
    user = db.query(User).filter(func.lower(User.email) == email).first()
    if not user:
        raise HTTPException(400, 'User tidak ditemukan')
    if not is_smtp_configured():
        user.email_verified = True
        user.verification_code_hash = None
        user.verification_expires_at = None
        user.verification_attempts = 0
        db.commit()
        db.refresh(user)
        return {'access_token': create_token(user.id), 'user': user}
    if user.email_verified or not user.verification_code_hash:
        raise HTTPException(400, 'Kode verifikasi tidak valid atau sudah kedaluwarsa')
    if user.verification_attempts >= 5:
        user.verification_code_hash = None
        user.verification_expires_at = None
        db.commit()
        raise HTTPException(400, 'Batas percobaan tercapai. Minta kode verifikasi baru.')
    if not user.verification_expires_at or user.verification_expires_at < datetime.utcnow():
        user.verification_code_hash = None
        user.verification_expires_at = None
        db.commit()
        raise HTTPException(400, 'Kode verifikasi tidak valid atau sudah kedaluwarsa')
    if len(data.code) != 6 or not data.code.isdigit() or not verify_password(data.code, user.verification_code_hash):
        user.verification_attempts += 1
        if user.verification_attempts >= 5:
            user.verification_code_hash = None
            user.verification_expires_at = None
        db.commit()
        raise HTTPException(400, 'Kode verifikasi salah')
    user.email_verified = True
    user.verification_code_hash = None
    user.verification_expires_at = None
    user.verification_attempts = 0
    db.commit()
    db.refresh(user)
    return {'access_token': create_token(user.id), 'user': user}

@app.post('/api/auth/verification/resend', response_model=VerificationOut)
def resend_verification(data: ResendVerificationIn, db: Session = Depends(get_db)):
    email = str(data.email).lower().strip()
    user = db.query(User).filter(func.lower(User.email) == email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, 'Email atau password salah')
    if not is_smtp_configured():
        user.email_verified = True
        db.commit()
        return {'message': 'Akun Anda telah otomatis diverifikasi. Silakan masuk.'}
    if user.email_verified:
        raise HTTPException(400, 'Email sudah diverifikasi. Silakan masuk.')
    prepare_verification(user)
    db.commit()
    return {'message': 'Kode verifikasi baru telah dikirim ke email Anda.'}

@app.get('/api/auth/me', response_model=UserOut)
def me(user: User = Depends(current_user)): return user

def owned_project(project_id, user, db):
    p = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not p: raise HTTPException(404, 'Project tidak ditemukan')
    return p

def accessible_project(project_id, user, db):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p: raise HTTPException(404, 'Project tidak ditemukan')
    if p.owner_id == user.id:
        return p
    member = db.query(Member.id).filter(
        Member.project_id == project_id,
        func.lower(Member.email) == user.email.lower()
    ).first()
    if not member: raise HTTPException(404, 'Project tidak ditemukan')
    return p

@app.get('/api/projects', response_model=list[ProjectOut])
def list_projects(db: Session=Depends(get_db), user: User=Depends(current_user)):
    return db.query(Project).outerjoin(Member, Member.project_id == Project.id).filter(
        or_(
            Project.owner_id == user.id,
            func.lower(Member.email) == user.email.lower()
        )
    ).distinct().order_by(Project.created_at.desc()).all()

@app.post('/api/projects', response_model=ProjectOut)
def create_project(data: ProjectIn, db: Session=Depends(get_db), user: User=Depends(current_user)):
    p=Project(**data.model_dump(), owner_id=user.id); db.add(p); db.commit(); db.refresh(p)
    db.add(Member(project_id=p.id,user_id=user.id,name=user.name,email=user.email,role='Project Leader')); db.commit()
    return p

@app.get('/api/projects/{pid}', response_model=ProjectOut)
def get_project(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)): return accessible_project(pid,user,db)

@app.delete('/api/projects/{pid}')
def delete_project(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=owned_project(pid,user,db); db.delete(p); db.commit(); return {'message':'Project deleted'}

@app.get('/api/projects/{pid}/members', response_model=list[MemberOut])
def members(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    accessible_project(pid,user,db)
    raw_members = db.query(Member).filter(Member.project_id==pid).all()
    seen = set()
    cleaned = []
    for m in raw_members:
        key = (m.email or '').strip().lower() or (m.name or '').strip().lower()
        if key not in seen:
            seen.add(key)
            r = (m.role or '').strip().lower()
            if r in ['project leader', 'project lead', 'leader', 'lead', 'administrator', 'admin', 'project owner', 'owner']:
                m.role = 'Project Leader'
            else:
                m.role = 'Member'
            cleaned.append(m)
        else:
            db.delete(m)
    db.commit()
    return cleaned

@app.post('/api/projects/{pid}/members', response_model=MemberOut)
def add_member(pid:int, data:MemberIn, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p = owned_project(pid,user,db)
    email_clean = (data.email or '').strip().lower()
    name_clean = data.name.strip()
    r = (data.role or '').strip().lower()
    role_clean = 'Project Leader' if r in ['project leader', 'project lead', 'leader', 'lead'] else 'Member'
    
    # Hubungkan ke akun user yang sudah terdaftar jika ada
    linked_user = None
    if email_clean:
        linked_user = db.query(User).filter(func.lower(User.email) == email_clean).first()

    existing = None
    if email_clean:
        existing = db.query(Member).filter(
            Member.project_id == pid,
            func.lower(Member.email) == email_clean
        ).first()
    if not existing and name_clean:
        existing = db.query(Member).filter(
            Member.project_id == pid,
            func.lower(Member.name) == name_clean.lower()
        ).first()
    
    if existing:
        existing.role = role_clean
        if email_clean: existing.email = email_clean
        if linked_user: existing.user_id = linked_user.id
        db.commit()
        db.refresh(existing)
        return existing

    m = Member(
        project_id=pid,
        user_id=linked_user.id if linked_user else None,
        name=name_clean,
        email=email_clean,
        role=role_clean
    )
    db.add(m); db.commit(); db.refresh(m)

    # Kirim email undangan via Gmail jika email diisi
    if email_clean and "@" in email_clean:
        send_member_invitation_notification(
            member_name=name_clean,
            member_email=email_clean,
            project_name=p.name,
            leader_name=user.name,
            role=role_clean
        )
    return m

@app.patch('/api/projects/{pid}/members/{mid}', response_model=MemberOut)
def update_member(pid:int, mid:int, data:MemberIn, db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(pid,user,db)
    m = db.query(Member).filter(Member.id==mid, Member.project_id==pid).first()
    if not m: raise HTTPException(404, 'Member tidak ditemukan')

    name_clean = data.name.strip()
    email_clean = (data.email or '').strip().lower()
    r = (data.role or '').strip().lower()
    role_clean = 'Project Leader' if r in ['project leader', 'project lead', 'leader', 'lead'] else 'Member'

    # Cek duplikasi nama/email dengan member lain
    if email_clean:
        dup = db.query(Member).filter(
            Member.project_id == pid,
            Member.id != mid,
            func.lower(Member.email) == email_clean
        ).first()
        if dup:
            raise HTTPException(409, f'Email {email_clean} sudah digunakan member lain di project ini')

    m.name = name_clean
    m.email = email_clean
    m.role = role_clean

    # Hubungkan ke akun user terdaftar jika email berubah
    if email_clean:
        linked_user = db.query(User).filter(func.lower(User.email) == email_clean).first()
        if linked_user:
            m.user_id = linked_user.id

    db.commit(); db.refresh(m)
    return m

@app.delete('/api/projects/{pid}/members/{mid}')
def delete_member(pid:int, mid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(pid,user,db)
    m = db.query(Member).filter(Member.id==mid, Member.project_id==pid).first()
    if not m: raise HTTPException(404, 'Member tidak ditemukan')
    db.delete(m); db.commit()
    return {'message': 'Member deleted'}

@app.get('/api/projects/{pid}/tasks', response_model=list[TaskOut])
def tasks(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    accessible_project(pid,user,db); return db.query(Task).filter(Task.project_id==pid).order_by(Task.created_at.desc()).all()

@app.post('/api/projects/{pid}/tasks', response_model=TaskOut)
def create_task(pid:int, data:TaskIn, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p = owned_project(pid,user,db)
    if data.status not in ['todo','doing','review','done']: raise HTTPException(400,'Status tidak valid')
    if data.priority not in ['low','medium','high']: raise HTTPException(400,'Priority tidak valid')
    assignee_member = None
    if data.assignee_id:
        assignee_member = db.query(Member).filter(Member.id==data.assignee_id,Member.project_id==pid).first()
        if not assignee_member: raise HTTPException(400,'Assignee tidak valid')
    t=Task(project_id=pid,**data.model_dump()); db.add(t); db.commit(); db.refresh(t)

    # Kirim notifikasi Gmail ke email member yang ditugaskan
    if assignee_member and assignee_member.email and "@" in assignee_member.email:
        priority_map = {'low': 'Rendah', 'medium': 'Sedang', 'high': 'Tinggi / Urgent'}
        send_task_assignment_notification(
            member_name=assignee_member.name,
            member_email=assignee_member.email,
            task_title=t.title,
            task_description=t.description or '-',
            project_name=p.name,
            leader_name=user.name,
            priority=priority_map.get(t.priority, t.priority),
            deadline=str(t.deadline) if t.deadline else 'Fleksibel'
        )

    email_note = f" (Email notifikasi terkirim ke {assignee_member.email})" if (assignee_member and assignee_member.email) else ""
    db.add(ActivityLog(project_id=pid,task_id=t.id,actor=user.name,action=f'Tugas "{t.title}" dibuat{email_note}')); db.commit(); return t

@app.patch('/api/tasks/{tid}', response_model=TaskOut)
def update_task(tid:int, data:dict, db:Session=Depends(get_db), user:User=Depends(current_user)):
    t=db.get(Task,tid)
    if not t: raise HTTPException(404,'Task tidak ditemukan')
    project = db.get(Project, t.project_id)
    if not project: raise HTTPException(404, 'Project tidak ditemukan')
    is_owner = project.owner_id == user.id
    if is_owner:
        allowed={'title','description','assignee_id','status','priority','deadline','estimated_hours'}
    else:
        member = db.query(Member).filter(
            Member.project_id == t.project_id,
            func.lower(Member.email) == user.email.lower()
        ).first()
        if not member or t.assignee_id != member.id:
            raise HTTPException(404, 'Task tidak ditemukan')
        allowed={'status','description'}
    
    old_assignee_id = t.assignee_id
    for k,v in data.items():
        if k in allowed: setattr(t,k,v)
    if t.status not in ['todo','doing','review','done']: raise HTTPException(400,'Status tidak valid')
    
    assignee_member = None
    if t.assignee_id:
        assignee_member = db.query(Member).filter(Member.id==t.assignee_id).first()
        # Jika baru ditugaskan atau dialihkan ke member baru, kirim notifikasi email
        if assignee_member and assignee_member.email and "@" in assignee_member.email and t.assignee_id != old_assignee_id:
            priority_map = {'low': 'Rendah', 'medium': 'Sedang', 'high': 'Tinggi / Urgent'}
            send_task_assignment_notification(
                member_name=assignee_member.name,
                member_email=assignee_member.email,
                task_title=t.title,
                task_description=t.description or '-',
                project_name=project.name,
                leader_name=user.name,
                priority=priority_map.get(t.priority, t.priority),
                deadline=str(t.deadline) if t.deadline else 'Fleksibel'
            )

    email_note = f" (Email notifikasi terkirim ke {assignee_member.email})" if (assignee_member and assignee_member.email) else ""
    db.add(ActivityLog(project_id=t.project_id,task_id=t.id,actor=user.name,action=f'Tugas "{t.title}" diperbarui ke {t.status}{email_note}')); db.commit(); db.refresh(t); return t

@app.post('/api/test-email')
def test_email_endpoint(data: dict = {}, user: User = Depends(current_user)):
    target_email = (data.get('email') or user.email or '').strip()
    if not target_email or '@' not in target_email:
        raise HTTPException(400, 'Alamat email tujuan tidak valid')
    success, error_msg = send_test_email(target_email)
    if not success:
        raise HTTPException(500, f'Gagal mengirim email tes: {error_msg}')
    return {'message': f'Email tes berhasil dikirim ke {target_email}! Periksa Inbox atau folder Spam Anda.'}

@app.get('/api/projects/{pid}/notifications')
def project_notifications(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    accessible_project(pid,user,db)
    return db.query(ActivityLog).filter(ActivityLog.project_id==pid).order_by(ActivityLog.created_at.desc()).limit(20).all()

@app.delete('/api/tasks/{tid}')
def delete_task(tid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    t=db.get(Task,tid)
    if not t: raise HTTPException(404,'Task tidak ditemukan')
    owned_project(t.project_id,user,db); db.delete(t); db.commit(); return {'message':'Task deleted'}

@app.get('/api/tasks/{tid}/comments', response_model=list[CommentOut])
def get_task_comments(tid: int, db: Session = Depends(get_db), user: User = Depends(current_user)):
    t = db.get(Task, tid)
    if not t: raise HTTPException(404, 'Task tidak ditemukan')
    accessible_project(t.project_id, user, db)
    return db.query(TaskComment).filter(TaskComment.task_id == tid).order_by(TaskComment.created_at.asc()).all()

@app.post('/api/tasks/{tid}/comments', response_model=CommentOut)
def add_task_comment(tid: int, data: CommentIn, db: Session = Depends(get_db), user: User = Depends(current_user)):
    t = db.get(Task, tid)
    if not t: raise HTTPException(404, 'Task tidak ditemukan')
    p = accessible_project(t.project_id, user, db)
    txt = data.text.strip()
    if not txt: raise HTTPException(400, 'Komentar tidak boleh kosong')

    # Identifikasi peran pengirim: Project Leader atau Member
    if p.owner_id == user.id:
        role = 'Project Leader'
    else:
        m = db.query(Member).filter(
            Member.project_id == t.project_id,
            func.lower(Member.email) == user.email.lower()
        ).first()
        role = m.role if (m and m.role) else 'Member'

    comment = TaskComment(
        task_id=tid,
        user_id=user.id,
        author=user.name,
        role=role,
        text=txt
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    db.add(ActivityLog(
        project_id=t.project_id,
        task_id=t.id,
        actor=user.name,
        action=f'Feedback tugas "{t.title}": {txt[:35]}...'
    ))
    db.commit()
    return comment

@app.get('/api/projects/{pid}/analytics')
def analytics(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=accessible_project(pid,user,db); ts=db.query(Task).filter(Task.project_id==pid).all(); ms=db.query(Member).filter(Member.project_id==pid).all()
    counts={s:sum(1 for t in ts if t.status==s) for s in ['todo','doing','review','done']}
    overdue=[t for t in ts if t.deadline and t.deadline < date.today() and t.status!='done']
    total=len(ts); progress=round(counts['done']/total*100) if total else 0
    workload=[]
    for m in ms:
        assigned=[t for t in ts if t.assignee_id==m.id and t.status!='done']
        workload.append({'member_id':m.id,'name':m.name,'role':m.role,'active_tasks':len(assigned),'estimated_hours':sum(t.estimated_hours for t in assigned)})
    return {'project':p.name,'total_tasks':total,'progress':progress,'counts':counts,'overdue_count':len(overdue),'overdue_tasks':[{'id':t.id,'title':t.title,'deadline':t.deadline} for t in overdue],'workload':workload}

@app.get('/api/projects/{pid}/insights')
async def insights(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=accessible_project(pid,user,db); ts=db.query(Task).filter(Task.project_id==pid).all(); ms=db.query(Member).filter(Member.project_id==pid).all()
    prompt=project_prompt(p,ts,ms,'Analyze task priority, workload balance, deadline risks, and give practical next steps.')
    return {'analysis':await ask_ai(prompt),'provider':'gemini' if os.getenv('GEMINI_API_KEY') else 'rule-based-fallback'}

@app.post('/api/ai/chat')
async def chat(data:ChatIn, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=accessible_project(data.project_id,user,db); ts=db.query(Task).filter(Task.project_id==p.id).all(); ms=db.query(Member).filter(Member.project_id==p.id).all()
    return {'answer':await ask_ai(project_prompt(p,ts,ms,data.message)),'provider':'gemini' if os.getenv('GEMINI_API_KEY') else 'rule-based-fallback'}

@app.post('/api/ai/generate-project-idea', response_model=IdeaGeneratorOut)
async def generate_idea(data: IdeaGeneratorIn):
    return await generate_project_idea(
        domain=data.domain or 'kampus',
        course_topic=data.course_topic or 'Pemrograman Web / RPL',
        member_count=data.member_count or 3,
        target_platform=data.target_platform or 'Web App',
        difficulty=data.difficulty or 'standard',
        problem=data.problem or ''
    )

@app.get('/api/projects/{pid}/report')
def report(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=accessible_project(pid,user,db); ts=db.query(Task).filter(Task.project_id==pid).all(); ms=db.query(Member).filter(Member.project_id==pid).all()
    done=sum(t.status=='done' for t in ts); overdue=sum(bool(t.deadline and t.deadline<date.today() and t.status!='done') for t in ts)
    return {'project':p.name,'generated_on':date.today().isoformat(),'summary':f'{done} dari {len(ts)} task selesai ({round(done/len(ts)*100) if ts else 0}%). {overdue} task terlambat.','total_tasks':len(ts),'completed':done,'overdue':overdue,'members':len(ms),'next_steps':['Tinjau task yang melewati deadline.','Pastikan setiap task memiliki penanggung jawab.','Perbarui progres dan estimasi waktu secara berkala.']}
