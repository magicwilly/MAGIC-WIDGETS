from fastapi import APIRouter, HTTPException, Depends, status
from models.backing import BackingCreate, BackingResponse, Backing
from models.user import UserResponse
from database import backings_collection, projects_collection, users_collection
from auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter(prefix="/backing", tags=["backing"])

@router.post("/", response_model=BackingResponse)
async def create_backing(
    backing_data: BackingCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new backing for a project"""
    
    # Get project details
    project = await projects_collection.find_one({"id": backing_data.project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if project is active
    if project["status"] != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project is not accepting new backings"
        )
    
    # Check if project has ended
    if project["end_date"] < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project funding period has ended"
        )
    
    # Validate reward if specified
    reward_title = None
    if backing_data.reward_id:
        reward_found = False
        for reward in project.get("rewards", []):
            if reward["id"] == backing_data.reward_id:
                reward_found = True
                reward_title = reward["title"]
                
                # Check if reward is available
                if not reward.get("is_available", True):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Selected reward is no longer available"
                    )
                
                # Check quantity limits
                if reward.get("is_limited") and reward.get("quantity_limit"):
                    if reward["backers_count"] >= reward["quantity_limit"]:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Selected reward tier is sold out"
                        )
                
                # Validate minimum amount
                if backing_data.amount < reward["amount"]:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Minimum amount for this reward is ${reward['amount']}"
                    )
                break
        
        if not reward_found:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reward not found"
            )
    
    # Create backing
    backing = Backing(
        user_id=current_user.id,
        project_id=backing_data.project_id,
        reward_id=backing_data.reward_id,
        amount=backing_data.amount,
        payment_method=backing_data.payment_method,
        payment_status="completed",  # Mock payment success
        transaction_id=str(uuid.uuid4())  # Mock transaction ID
    )
    
    # Insert backing
    await backings_collection.insert_one(backing.dict())
    
    # Update project funding
    await projects_collection.update_one(
        {"id": backing_data.project_id},
        {
            "$inc": {
                "current_funding": backing_data.amount,
                "backers_count": 1
            }
        }
    )
    
    # Update reward backer count if applicable
    if backing_data.reward_id:
        await projects_collection.update_one(
            {"id": backing_data.project_id, "rewards.id": backing_data.reward_id},
            {"$inc": {"rewards.$.backers_count": 1}}
        )
    
    # Update user's backed projects and total pledged
    await users_collection.update_one(
        {"id": current_user.id},
        {
            "$push": {"backed_projects": backing_data.project_id},
            "$inc": {"total_pledged": backing_data.amount}
        }
    )
    
    # Check if project reached funding goal
    updated_project = await projects_collection.find_one({"id": backing_data.project_id})
    if updated_project["current_funding"] >= updated_project["funding_goal"]:
        await projects_collection.update_one(
            {"id": backing_data.project_id},
            {"$set": {"status": "funded"}}
        )
    
    return BackingResponse(
        id=backing.id,
        user_id=backing.user_id,
        project_id=backing.project_id,
        project_title=project["title"],
        project_image=project.get("image"),
        reward_id=backing.reward_id,
        reward_title=reward_title,
        amount=backing.amount,
        payment_status=backing.payment_status,
        backed_at=backing.backed_at
    )

@router.get("/project/{project_id}")
async def get_project_backings(
    project_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get project backings (creator only)"""
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
            detail="Only project creator can view backings"
        )
    
    # Get all backings for this project
    backings = await backings_collection.find({"project_id": project_id}).to_list(1000)
    
    # Enrich with user details
    enriched_backings = []
    for backing in backings:
        user = await users_collection.find_one({"id": backing["user_id"]})
        if user:
            backing["user_name"] = user["name"]
            backing["user_email"] = user["email"]
        enriched_backings.append(backing)
    
    return enriched_backings