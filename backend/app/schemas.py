from datetime import date
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class RegisterIn(BaseModel): name: str; email: EmailStr; password: str
class LoginIn(BaseModel): email: EmailStr; password: str
class VerifyEmailIn(BaseModel): email: EmailStr; code: str
class ResendVerificationIn(BaseModel): email: EmailStr; password: str
class UserOut(BaseModel): id: int; name: str; email: EmailStr; model_config = ConfigDict(from_attributes=True)
class TokenOut(BaseModel): access_token: str; token_type: str = 'bearer'; user: UserOut
class VerificationOut(BaseModel):
    message: str
    access_token: Optional[str] = None
    user: Optional[UserOut] = None
    auto_login: Optional[bool] = False
class ProjectIn(BaseModel): name: str; description: str = ''; start_date: Optional[date] = None; deadline: Optional[date] = None
class ProjectOut(BaseModel): id: int; name: str; description: str; owner_id: int; start_date: Optional[date]; deadline: Optional[date]; model_config = ConfigDict(from_attributes=True)
class MemberIn(BaseModel): name: str; email: str = ''; role: str = 'Member'
class MemberOut(BaseModel): id: int; project_id: int; name: str; email: str; role: str; model_config = ConfigDict(from_attributes=True)
class TaskIn(BaseModel): title: str; description: str = ''; assignee_id: Optional[int] = None; status: str = 'todo'; priority: str = 'medium'; deadline: Optional[date] = None; estimated_hours: float = 4
class TaskOut(BaseModel): id: int; project_id: int; title: str; description: str; assignee_id: Optional[int]; status: str; priority: str; deadline: Optional[date]; estimated_hours: float; model_config = ConfigDict(from_attributes=True)
class ChatIn(BaseModel): project_id: int; message: str

class IdeaGeneratorIn(BaseModel):
    domain: Optional[str] = 'kampus'
    course_topic: Optional[str] = 'Pemrograman Web / RPL'
    member_count: Optional[int] = 3
    target_platform: Optional[str] = 'Web App'
    difficulty: Optional[str] = 'standard'
    problem: Optional[str] = ''

class GeneratedTask(BaseModel):
    title: str
    description: str = ''
    priority: str = 'medium'
    estimated_hours: float = 4
    role: str = 'Developer'

class ProjectIdeaCard(BaseModel):
    id: Optional[str] = None
    name: str
    tagline: str
    description: str
    category: str
    difficulty: str
    target_platform: str
    banner_theme: str
    tech_stack: list[str]
    features: list[str]
    tasks: list[GeneratedTask]
    roles: list[str]

class IdeaGeneratorOut(BaseModel):
    ideas: list[ProjectIdeaCard]
