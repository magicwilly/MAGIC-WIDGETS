from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timedelta
from typing import List, Optional
import bcrypt
import jwt

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
users_collection = db.users
projects_collection = db.projects
backings_collection = db.backings
categories_collection = db.categories

# JWT Configuration
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "fundmagic_secret_key_2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def init_categories():
    """Initialize magic categories if they don't exist"""
    existing_count = await categories_collection.count_documents({})
    if existing_count == 0:
        categories = [
            {"id": "illusion", "name": "Illusion & Stage Magic", "icon": "🎩", "description": "Grand illusions and stage performances"},
            {"id": "closeup", "name": "Close-up Magic", "icon": "🃏", "description": "Intimate magic performed up close"},
            {"id": "mentalism", "name": "Mentalism", "icon": "🧠", "description": "Mind reading and psychological magic"},
            {"id": "props", "name": "Magic Props & Apparatus", "icon": "🪄", "description": "Magical devices and apparatus"},
            {"id": "education", "name": "Magic Education", "icon": "📚", "description": "Teaching and learning magic"},
            {"id": "digital", "name": "Digital & Tech Magic", "icon": "💻", "description": "Technology-enhanced magic"},
            {"id": "comedy", "name": "Comedy Magic", "icon": "🎭", "description": "Humorous magical performances"},
            {"id": "events", "name": "Magic Events & Shows", "icon": "🎪", "description": "Magic shows and events"}
        ]
        await categories_collection.insert_many(categories)