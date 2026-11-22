from datetime import datetime, date
from sqlalchemy import String, Integer, DateTime, Date, ForeignKey, Text, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    verification_code_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    verification_expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    verification_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Project(Base):
    __tablename__ = 'projects'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(180))
    description: Mapped[str] = mapped_column(Text, default='')
    owner_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    deadline: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Member(Base):
    __tablename__ = 'members'
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey('projects.id', ondelete='CASCADE'))
    user_id: Mapped[int | None] = mapped_column(ForeignKey('users.id'), nullable=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(180), default='')
    role: Mapped[str] = mapped_column(String(80), default='Member')

class Task(Base):
    __tablename__ = 'tasks'
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey('projects.id', ondelete='CASCADE'))
    title: Mapped[str] = mapped_column(String(220))
    description: Mapped[str] = mapped_column(Text, default='')
    assignee_id: Mapped[int | None] = mapped_column(ForeignKey('members.id'), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default='todo')
    priority: Mapped[str] = mapped_column(String(20), default='medium')
    deadline: Mapped[date | None] = mapped_column(Date, nullable=True)
    estimated_hours: Mapped[float] = mapped_column(Float, default=4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = 'activity_logs'
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey('projects.id', ondelete='CASCADE'))
    task_id: Mapped[int | None] = mapped_column(ForeignKey('tasks.id'), nullable=True)
    actor: Mapped[str] = mapped_column(String(120), default='System')
    action: Mapped[str] = mapped_column(String(180))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
