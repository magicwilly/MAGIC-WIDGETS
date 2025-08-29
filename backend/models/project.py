from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Reward(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    amount: float
    estimated_delivery: str
    backers_count: int = 0
    is_limited: bool = False
    quantity_limit: Optional[int] = None
    is_available: bool = True

class RewardCreate(BaseModel):
    title: str
    description: str
    amount: float
    estimated_delivery: str
    is_limited: bool = False
    quantity_limit: Optional[int] = None

class ProjectUpdate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    images: List[str] = Field(default_factory=list)  # List of image URLs
    videos: List[str] = Field(default_factory=list)  # List of video URLs
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectComment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    user_avatar: Optional[str]
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FAQ(BaseModel):
    question: str
    answer: str

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: Optional[str] = None
    description: str
    full_description: str
    story: Optional[str] = None  # Project story field for updates
    category: str
    image: Optional[str] = None
    video: Optional[str] = None
    creator_id: str
    creator_name: str
    creator_bio: Optional[str] = None
    creator_avatar: Optional[str] = None
    funding_goal: float
    current_funding: float = 0.0
    backers_count: int = 0
    days_left: int
    location: Optional[str] = None
    status: str = "active"  # active, funded, failed, draft
    created_at: datetime = Field(default_factory=datetime.utcnow)
    end_date: datetime
    rewards: List[Reward] = Field(default_factory=list)
    updates: List[ProjectUpdate] = Field(default_factory=list)
    comments: List[ProjectComment] = Field(default_factory=list)
    faqs: List[FAQ] = Field(default_factory=list)
    is_featured: bool = False

class ProjectCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: str
    full_description: str
    category: str
    image: Optional[str] = None
    video: Optional[str] = None
    funding_goal: float
    days_duration: int
    location: Optional[str] = None
    rewards: List[RewardCreate] = Field(default_factory=list)
    faqs: List[FAQ] = Field(default_factory=list)

class ProjectResponse(BaseModel):
    id: str
    title: str
    subtitle: Optional[str]
    description: str
    full_description: str
    category: str
    image: Optional[str]
    video: Optional[str]
    creator_id: str
    creator_name: str
    creator_bio: Optional[str]
    creator_avatar: Optional[str]
    funding_goal: float
    current_funding: float
    backers_count: int
    days_left: int
    location: Optional[str]
    status: str
    created_at: datetime
    end_date: datetime
    rewards: List[Reward]
    updates: List[ProjectUpdate]
    comments: List[ProjectComment]
    faqs: List[FAQ]
    is_featured: bool
    funding_percentage: Optional[float] = None