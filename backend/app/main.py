from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
import os
from dotenv import load_dotenv
from .database import Base, engine, get_db
from .models import User, Project, Member, Task, ActivityLog
from .schemas import *
from .security import hash_password, verify_password, create_token, current_user
from .ai import ask_ai, project_prompt, generate_project_idea

load_dotenv(); Base.metadata.create_all(bind=engine)
app = FastAPI(title='TeamPilot AI API', version='1.0.0', description='AI-powered project management assistant')
origins = [os.getenv('FRONTEND_ORIGIN', 'http://localhost:5173'), 'http://127.0.0.1:5173']
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

@app.get('/api/health')
def health(): return {'status':'ok','app':'TeamPilot AI'}

@app.post('/api/auth/register', response_model=TokenOut)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if len(data.password) < 8: raise HTTPException(400, 'Password minimal 8 karakter')
    if db.query(User).filter(User.email == data.email).first(): raise HTTPException(409, 'Email sudah terdaftar')
    user = User(name=data.name, email=data.email, hashed_password=hash_password(data.password)); db.add(user); db.commit(); db.refresh(user)
    return {'access_token':create_token(user.id),'user':user}

@app.post('/api/auth/login', response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password): raise HTTPException(401, 'Email atau password salah')
    return {'access_token':create_token(user.id),'user':user}

@app.get('/api/auth/me', response_model=UserOut)
def me(user: User = Depends(current_user)): return user

def owned_project(project_id, user, db):
    p = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not p: raise HTTPException(404, 'Project tidak ditemukan')
    return p

@app.get('/api/projects', response_model=list[ProjectOut])
def list_projects(db: Session=Depends(get_db), user: User=Depends(current_user)):
    return db.query(Project).filter(Project.owner_id==user.id).order_by(Project.created_at.desc()).all()

@app.post('/api/projects', response_model=ProjectOut)
def create_project(data: ProjectIn, db: Session=Depends(get_db), user: User=Depends(current_user)):
    p=Project(**data.model_dump(), owner_id=user.id); db.add(p); db.commit(); db.refresh(p)
    db.add(Member(project_id=p.id,user_id=user.id,name=user.name,email=user.email,role='Project Owner')); db.commit()
    return p

@app.get('/api/projects/{pid}', response_model=ProjectOut)
def get_project(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)): return owned_project(pid,user,db)

@app.delete('/api/projects/{pid}')
def delete_project(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=owned_project(pid,user,db); db.delete(p); db.commit(); return {'message':'Project deleted'}

@app.get('/api/projects/{pid}/members', response_model=list[MemberOut])
def members(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(pid,user,db); return db.query(Member).filter(Member.project_id==pid).all()

@app.post('/api/projects/{pid}/members', response_model=MemberOut)
def add_member(pid:int, data:MemberIn, db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(pid,user,db); m=Member(project_id=pid,**data.model_dump()); db.add(m); db.commit(); db.refresh(m); return m

@app.delete('/api/projects/{pid}/members/{mid}')
def delete_member(pid:int, mid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(pid,user,db)
    m = db.query(Member).filter(Member.id==mid, Member.project_id==pid).first()
    if not m: raise HTTPException(404, 'Member tidak ditemukan')
    db.delete(m); db.commit()
    return {'message': 'Member deleted'}

@app.get('/api/projects/{pid}/tasks', response_model=list[TaskOut])
def tasks(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(pid,user,db); return db.query(Task).filter(Task.project_id==pid).order_by(Task.created_at.desc()).all()

@app.post('/api/projects/{pid}/tasks', response_model=TaskOut)
def create_task(pid:int, data:TaskIn, db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(pid,user,db)
    if data.status not in ['todo','doing','review','done']: raise HTTPException(400,'Status tidak valid')
    if data.priority not in ['low','medium','high']: raise HTTPException(400,'Priority tidak valid')
    if data.assignee_id and not db.query(Member).filter(Member.id==data.assignee_id,Member.project_id==pid).first(): raise HTTPException(400,'Assignee tidak valid')
    t=Task(project_id=pid,**data.model_dump()); db.add(t); db.commit(); db.refresh(t)
    db.add(ActivityLog(project_id=pid,task_id=t.id,actor=user.name,action=f'created task {t.title}')); db.commit(); return t

@app.patch('/api/tasks/{tid}', response_model=TaskOut)
def update_task(tid:int, data:dict, db:Session=Depends(get_db), user:User=Depends(current_user)):
    t=db.get(Task,tid)
    if not t: raise HTTPException(404,'Task tidak ditemukan')
    owned_project(t.project_id,user,db)
    allowed={'title','description','assignee_id','status','priority','deadline','estimated_hours'}
    for k,v in data.items():
        if k in allowed: setattr(t,k,v)
    if t.status not in ['todo','doing','review','done']: raise HTTPException(400,'Status tidak valid')
    db.add(ActivityLog(project_id=t.project_id,task_id=t.id,actor=user.name,action=f'updated task {t.title}')); db.commit(); db.refresh(t); return t

@app.delete('/api/tasks/{tid}')
def delete_task(tid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    t=db.get(Task,tid)
    if not t: raise HTTPException(404,'Task tidak ditemukan')
    owned_project(t.project_id,user,db); db.delete(t); db.commit(); return {'message':'Task deleted'}

@app.get('/api/projects/{pid}/analytics')
def analytics(pid:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=owned_project(pid,user,db); ts=db.query(Task).filter(Task.project_id==pid).all(); ms=db.query(Member).filter(Member.project_id==pid).all()
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
    p=owned_project(pid,user,db); ts=db.query(Task).filter(Task.project_id==pid).all(); ms=db.query(Member).filter(Member.project_id==pid).all()
    prompt=project_prompt(p,ts,ms,'Analyze task priority, workload balance, deadline risks, and give practical next steps.')
    return {'analysis':await ask_ai(prompt),'provider':'gemini' if os.getenv('GEMINI_API_KEY') else 'rule-based-fallback'}

@app.post('/api/ai/chat')
async def chat(data:ChatIn, db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=owned_project(data.project_id,user,db); ts=db.query(Task).filter(Task.project_id==p.id).all(); ms=db.query(Member).filter(Member.project_id==p.id).all()
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
    p=owned_project(pid,user,db); ts=db.query(Task).filter(Task.project_id==pid).all(); ms=db.query(Member).filter(Member.project_id==pid).all()
    done=sum(t.status=='done' for t in ts); overdue=sum(bool(t.deadline and t.deadline<date.today() and t.status!='done') for t in ts)
    return {'project':p.name,'generated_on':date.today().isoformat(),'summary':f'{done} dari {len(ts)} task selesai ({round(done/len(ts)*100) if ts else 0}%). {overdue} task terlambat.','total_tasks':len(ts),'completed':done,'overdue':overdue,'members':len(ms),'next_steps':['Tinjau task yang melewati deadline.','Pastikan setiap task memiliki penanggung jawab.','Perbarui progres dan estimasi waktu secara berkala.']}
