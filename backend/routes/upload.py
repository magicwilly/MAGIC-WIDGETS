from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import FileResponse
import os
import uuid
import shutil
from pathlib import Path
from PIL import Image
import io
from models.user import UserResponse
from auth import get_current_user

router = APIRouter(prefix="/upload", tags=["upload"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("/app/uploads")
AVATAR_DIR = UPLOAD_DIR / "avatars"
AVATAR_DIR.mkdir(parents=True, exist_ok=True)

# Allowed image types
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def validate_image(file: UploadFile) -> bool:
    """Validate uploaded image file"""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return False
    
    # Check file size
    if file.size and file.size > MAX_FILE_SIZE:
        return False
    
    return True

def resize_image(image_data: bytes, max_size: int = 300) -> bytes:
    """Resize image to max_size while maintaining aspect ratio"""
    try:
        # Open image
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary (for PNG with transparency)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        
        # Calculate new size maintaining aspect ratio
        width, height = image.size
        if width > height:
            new_width = min(width, max_size)
            new_height = int((height * new_width) / width)
        else:
            new_height = min(height, max_size)
            new_width = int((width * new_height) / height)
        
        # Resize image
        resized_image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Save to bytes
        output_buffer = io.BytesIO()
        resized_image.save(output_buffer, format="JPEG", quality=85, optimize=True)
        
        return output_buffer.getvalue()
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user)
):
    """Upload and process user avatar"""
    
    # Validate file
    if not validate_image(file):
        raise HTTPException(
            status_code=400,
            detail="Invalid file. Please upload a JPEG, PNG, GIF, or WebP image under 5MB."
        )
    
    try:
        # Read file data
        file_data = await file.read()
        
        # Resize image
        processed_image_data = resize_image(file_data)
        
        # Generate unique filename
        file_ext = ".jpg"  # Always save as JPEG after processing
        filename = f"{current_user.id}_{uuid.uuid4().hex}{file_ext}"
        file_path = AVATAR_DIR / filename
        
        # Save processed image
        with open(file_path, "wb") as f:
            f.write(processed_image_data)
        
        # Generate URL for the uploaded file
        avatar_url = f"/api/upload/avatars/{filename}"
        
        return {
            "success": True,
            "avatar_url": avatar_url,
            "filename": filename,
            "message": "Avatar uploaded successfully!"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@router.get("/avatars/{filename}")
async def get_avatar(filename: str):
    """Serve uploaded avatar files"""
    file_path = AVATAR_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Avatar not found")
    
    return FileResponse(
        path=file_path,
        media_type="image/jpeg",
        headers={"Cache-Control": "public, max-age=3600"}  # Cache for 1 hour
    )

@router.delete("/avatar/{filename}")
async def delete_avatar(
    filename: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete user's avatar file"""
    
    # Check if filename belongs to current user
    if not filename.startswith(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this file")
    
    file_path = AVATAR_DIR / filename
    
    if file_path.exists():
        try:
            os.remove(file_path)
            return {"success": True, "message": "Avatar deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")
    else:
        raise HTTPException(status_code=404, detail="Avatar not found")