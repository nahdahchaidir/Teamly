import os
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

SECRET_KEY = os.getenv('SECRET_KEY', 'dev-only-change-me')
ALGORITHM = 'HS256'
pwd = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2 = OAuth2PasswordBearer(tokenUrl='/api/auth/login')
def hash_password(password): return pwd.hash(password)
def verify_password(password, hashed): return pwd.verify(password, hashed)
def create_token(user_id):
    exp = datetime.now(timezone.utc) + timedelta(minutes=int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '1440')))
    return jwt.encode({'sub': str(user_id), 'exp': exp}, SECRET_KEY, algorithm=ALGORITHM)
def current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)):
    try: user_id = int(jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])['sub'])
    except (JWTError, ValueError, KeyError): raise HTTPException(401, 'Invalid or expired token')
    user = db.get(User, user_id)
    if not user: raise HTTPException(401, 'User not found')
    return user
