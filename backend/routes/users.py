from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from models.user import UserResponse, UserUpdate
from models.backing import BackingResponse
from models.project import ProjectResponse
from database import users_collection, projects_collection, backings_collection
from auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: UserResponse = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update user profile"""
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if update_data:
        await users_collection.update_one(
            {"id": current_user.id},
            {"$set": update_data}
        )
        
        # Get updated user
        updated_user = await users_collection.find_one({"id": current_user.id})
        return UserResponse(**updated_user)
    
    return current_user

@router.get("/backed", response_model=List[BackingResponse])
async def get_backed_projects(current_user: UserResponse = Depends(get_current_user)):
    """Get projects backed by current user"""
    backings = await backings_collection.find({"user_id": current_user.id}).to_list(100)
    
    # Enrich with project details
    backed_projects = []
    for backing in backings:
        project = await projects_collection.find_one({"id": backing["project_id"]})
        if project:
            # Get reward details if applicable
            reward_title = None
            if backing.get("reward_id"):
                for reward in project.get("rewards", []):
                    if reward["id"] == backing["reward_id"]:
                        reward_title = reward["title"]
                        break
            
            backed_projects.append(BackingResponse(
                id=backing["id"],
                user_id=backing["user_id"],
                project_id=backing["project_id"],
                project_title=project["title"],
                project_image=project.get("image"),
                reward_id=backing.get("reward_id"),
                reward_title=reward_title,
                amount=backing["amount"],
                payment_status=backing["payment_status"],
                backed_at=backing["backed_at"]
            ))
    
    return backed_projects

@router.get("/created", response_model=List[ProjectResponse])
async def get_created_projects(current_user: UserResponse = Depends(get_current_user)):
    """Get projects created by current user"""
    projects = await projects_collection.find({"creator_id": current_user.id}).to_list(100)
    
    project_responses = []
    for project in projects:
        # Calculate days left
        days_left = max(0, (project["end_date"] - datetime.utcnow()).days)
        
        # Calculate funding percentage
        funding_percentage = (project["current_funding"] / project["funding_goal"]) * 100 if project["funding_goal"] > 0 else 0
        
        # Update project data with calculated values
        project["days_left"] = days_left
        project["funding_percentage"] = funding_percentage
        
        project_response = ProjectResponse(**project)
        project_responses.append(project_response)
    
    return project_responses

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_public(user_id: str):
    """Get public user profile"""
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(**user)