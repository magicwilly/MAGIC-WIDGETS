from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Backing(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    project_id: str
    reward_id: Optional[str] = None
    amount: float
    payment_status: str = "pending"  # pending, completed, failed, refunded
    backed_at: datetime = Field(default_factory=datetime.utcnow)
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None

class BackingCreate(BaseModel):
    project_id: str
    reward_id: Optional[str] = None
    amount: float
    payment_method: str = "stripe"

class BackingResponse(BaseModel):
    id: str
    user_id: str
    project_id: str
    project_title: str
    project_image: Optional[str]
    reward_id: Optional[str]
    reward_title: Optional[str]
    amount: float
    payment_status: str
    backed_at: datetime
    
class Category(BaseModel):
    id: str
    name: str
    icon: str
    description: Optional[str] = None
    project_count: int = 0