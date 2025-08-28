from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import logging

# Import routes
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.projects import router as projects_router
from routes.categories import router as categories_router
from routes.backing import router as backing_router

# Import database initialization
from database import init_categories

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(
    title="FundMagic API",
    description="Crowdfunding platform for magic projects by Sleight School",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "🎩✨ Welcome to FundMagic API - Where Magic Meets Funding! ✨🎩"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "FundMagic API"}

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(users_router)  
api_router.include_router(projects_router)
api_router.include_router(categories_router)
api_router.include_router(backing_router)

# Include the main router in the app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
