from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional
from models.project import ProjectCreate, ProjectResponse, ProjectUpdate, ProjectComment, FAQ
from models.user import UserResponse
from database import projects_collection, users_collection
from auth import get_current_user, get_current_user_optional
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "trending",
    featured: Optional[bool] = None,
    status: Optional[str] = None,
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0)
):
    """Get projects with filtering and pagination"""
    
    # Build query
    query = {}
    
    if category and category != "all":
        query["category"] = category
    
    if featured is not None:
        query["is_featured"] = featured
        
    if status:
        query["status"] = status
    else:
        query["status"] = {"$ne": "draft"}  # Exclude drafts by default
    
    # Search functionality
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"creator_name": {"$regex": search, "$options": "i"}}
        ]
    
    # Sorting
    sort_options = {
        "trending": {"current_funding": -1, "backers_count": -1},
        "newest": {"created_at": -1},
        "ending_soon": {"end_date": 1},
        "most_funded": {"current_funding": -1},
        "recently_launched": {"created_at": -1}
    }
    
    sort_criteria = sort_options.get(sort_by, {"created_at": -1})
    
    # Execute query
    projects = await projects_collection.find(query).sort(list(sort_criteria.items())).skip(offset).limit(limit).to_list(limit)
    
    # Process projects
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

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    """Get single project by ID"""
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Calculate days left
    days_left = max(0, (project["end_date"] - datetime.utcnow()).days)
    
    # Calculate funding percentage
    funding_percentage = (project["current_funding"] / project["funding_goal"]) * 100 if project["funding_goal"] > 0 else 0
    
    # Update project data with calculated values
    project["days_left"] = days_left
    project["funding_percentage"] = funding_percentage
    
    return ProjectResponse(**project)

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new project"""
    
    # Calculate end date
    end_date = datetime.utcnow() + timedelta(days=project_data.days_duration)
    
    # Create project
    from models.project import Project
    project = Project(
        title=project_data.title,
        subtitle=project_data.subtitle,
        description=project_data.description,
        full_description=project_data.full_description,
        category=project_data.category,
        image=project_data.image,
        video=project_data.video,
        creator_id=current_user.id,
        creator_name=current_user.name,
        creator_bio=current_user.bio,
        creator_avatar=current_user.avatar,
        funding_goal=project_data.funding_goal,
        days_left=project_data.days_duration,
        location=project_data.location,
        end_date=end_date,
        rewards=[reward.dict() for reward in project_data.rewards],
        faqs=[faq.dict() for faq in project_data.faqs]
    )
    
    # Insert into database
    await projects_collection.insert_one(project.dict())
    
    # Update user's created projects
    await users_collection.update_one(
        {"id": current_user.id},
        {"$push": {"created_projects": project.id}}
    )
    
    # Calculate funding percentage
    funding_percentage = 0.0
    
    # Create project dict with calculated values
    project_dict = project.dict()
    project_dict["days_left"] = project_data.days_duration
    project_dict["funding_percentage"] = funding_percentage
    
    return ProjectResponse(**project_dict)

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update project (only by creator)"""
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is the creator
    if project["creator_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only project creator can update the project"
        )
    
    # Update project data
    update_data = {k: v for k, v in project_data.dict().items() if v is not None}
    update_data["rewards"] = [reward.dict() for reward in project_data.rewards]
    update_data["faqs"] = [faq.dict() for faq in project_data.faqs]
    
    await projects_collection.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    
    # Get updated project
    updated_project = await projects_collection.find_one({"id": project_id})
    days_left = max(0, (updated_project["end_date"] - datetime.utcnow()).days)
    funding_percentage = (updated_project["current_funding"] / updated_project["funding_goal"]) * 100
    
    updated_project["days_left"] = days_left
    updated_project["funding_percentage"] = funding_percentage
    return ProjectResponse(**updated_project)

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete project (only by creator)"""
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is the creator
    if project["creator_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only project creator can delete the project"
        )
    
    # Check if project has backers
    if project["backers_count"] > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete project with existing backers"
        )
    
    # Delete project
    await projects_collection.delete_one({"id": project_id})
    
    # Remove from user's created projects
    await users_collection.update_one(
        {"id": current_user.id},
        {"$pull": {"created_projects": project_id}}
    )
    
    return {"message": "Project deleted successfully"}

@router.patch("/{project_id}/story")
async def update_project_story(
    project_id: str,
    story_data: dict,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update project story (only by creator)"""
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is the creator
    if project["creator_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only project creator can update the story"
        )
    
    # Update only the story field
    await projects_collection.update_one(
        {"id": project_id},
        {"$set": {"story": story_data.get("story", "")}}
    )
    
    return {"message": "Project story updated successfully"}

@router.post("/{project_id}/updates", response_model=ProjectResponse)
async def create_project_update(
    project_id: str,
    update_data: dict,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create project update (only by creator)"""
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is the creator
    if project["creator_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only project creator can create updates"
        )
    
    # Create update
    update = ProjectUpdate(
        title=update_data["title"],
        content=update_data["content"],
        images=update_data.get("images", []),
        videos=update_data.get("videos", [])
    )
    
    # Add update to project
    await projects_collection.update_one(
        {"id": project_id},
        {"$push": {"updates": update.dict()}}
    )
    
    # Get updated project
    updated_project = await projects_collection.find_one({"id": project_id})
    days_left = max(0, (updated_project["end_date"] - datetime.utcnow()).days)
    funding_percentage = (updated_project["current_funding"] / updated_project["funding_goal"]) * 100
    
    updated_project["days_left"] = days_left
    updated_project["funding_percentage"] = funding_percentage
    return ProjectResponse(**updated_project)

@router.post("/{project_id}/comments", response_model=ProjectResponse)
async def create_comment(
    project_id: str,
    comment_data: dict,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create project comment"""
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Create comment
    comment = ProjectComment(
        user_id=current_user.id,
        user_name=current_user.name,
        user_avatar=current_user.avatar,
        content=comment_data["content"]
    )
    
    # Add comment to project
    await projects_collection.update_one(
        {"id": project_id},
        {"$push": {"comments": comment.dict()}}
    )
    
    # Get updated project
    updated_project = await projects_collection.find_one({"id": project_id})
    days_left = max(0, (updated_project["end_date"] - datetime.utcnow()).days)
    funding_percentage = (updated_project["current_funding"] / updated_project["funding_goal"]) * 100
    
    updated_project["days_left"] = days_left
    updated_project["funding_percentage"] = funding_percentage
    return ProjectResponse(**updated_project)