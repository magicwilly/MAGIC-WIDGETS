from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    password: str  # Will be hashed
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    member_since: datetime = Field(default_factory=datetime.utcnow)
    backed_projects: List[str] = Field(default_factory=list)
    created_projects: List[str] = Field(default_factory=list)
    total_pledged: float = 0.0
    is_active: bool = True

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    location: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str]
    bio: Optional[str]
    location: Optional[str]
    member_since: datetime
    backed_projects: List[str]
    created_projects: List[str]
    total_pledged: float