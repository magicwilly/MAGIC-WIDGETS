from fastapi import APIRouter
from typing import List
from models.backing import Category
from database import categories_collection, projects_collection

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=List[Category])
async def get_categories():
    """Get all magic categories with project counts"""
    categories = await categories_collection.find({}).to_list(100)
    
    # Count projects in each category
    category_responses = []
    for category in categories:
        project_count = await projects_collection.count_documents({
            "category": category["id"],
            "status": {"$ne": "draft"}
        })
        
        category_response = Category(
            id=category["id"],
            name=category["name"],
            icon=category["icon"],
            description=category.get("description"),
            project_count=project_count
        )
        category_responses.append(category_response)
    
    return category_responses

@router.get("/{category_id}/projects")
async def get_category_projects(category_id: str):
    """Get projects in a specific category"""
    # This redirects to the main projects endpoint with category filter
    from .projects import get_projects
    return await get_projects(category=category_id)