from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
import uuid
import os

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
JWT_ALG = os.getenv("JWT_ALGORITHM", "HS256")
JWT_TTL_MIN = int(os.getenv("JWT_ACCESS_TTL_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: str, extra: Optional[dict] = None) -> str:
    to_encode = {"sub": subject, "iat": int(datetime.utcnow().timestamp())}
    if extra:
        to_encode.update(extra)
    expire = datetime.utcnow() + timedelta(minutes=JWT_TTL_MIN)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALG)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def generate_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}" 