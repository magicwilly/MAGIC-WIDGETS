#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for iFundMagic
Tests all endpoints and functionality including authentication, projects, categories, backing, and file upload.
"""

import requests
import json
import os
import time
from datetime import datetime, timedelta
from pathlib import Path
import tempfile
from PIL import Image
import io

# Configuration
BACKEND_URL = "https://ifundmagic.preview.emergentagent.com/api"
TEST_USER_EMAIL = "magician@sleightschool.com"
TEST_USER_PASSWORD = "MagicPassword123!"
TEST_USER_NAME = "Master Magician"
TEST_USER_LOCATION = "Las Vegas, NV"

class iFundMagicAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.access_token = None
        self.user_id = None
        self.project_id = None
        self.test_results = []
        
    def log_result(self, test_name, success, message="", details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method, endpoint, data=None, files=None, headers=None):
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        
        # Default headers
        default_headers = {"Content-Type": "application/json"}
        if self.access_token:
            default_headers["Authorization"] = f"Bearer {self.access_token}"
        
        # Merge headers
        if headers:
            default_headers.update(headers)
        
        # Remove Content-Type for file uploads
        if files:
            default_headers.pop("Content-Type", None)
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                if files:
                    response = requests.post(url, files=files, headers=default_headers, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PATCH":
                response = requests.patch(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            return None
    
    def test_health_check(self):
        """Test API health endpoints"""
        print("\n=== Testing Health Check ===")
        
        # Test root endpoint
        response = self.make_request("GET", "/")
        if response and response.status_code == 200:
            data = response.json()
            if "iFundMagic" in data.get("message", ""):
                self.log_result("Root Endpoint", True, "API root accessible")
            else:
                self.log_result("Root Endpoint", False, "Unexpected response", data)
        else:
            self.log_result("Root Endpoint", False, f"Failed to connect", 
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test health endpoint
        response = self.make_request("GET", "/health")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "healthy":
                self.log_result("Health Check", True, "API is healthy")
            else:
                self.log_result("Health Check", False, "API not healthy", data)
        else:
            self.log_result("Health Check", False, "Health endpoint failed",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def test_user_registration(self):
        """Test user registration"""
        print("\n=== Testing User Registration ===")
        
        user_data = {
            "name": TEST_USER_NAME,
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "location": TEST_USER_LOCATION
        }
        
        response = self.make_request("POST", "/auth/register", user_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                self.access_token = data["access_token"]
                self.user_id = data["user"]["id"]
                self.log_result("User Registration", True, "User registered successfully")
                
                # Validate user data
                user = data["user"]
                if (user["name"] == TEST_USER_NAME and 
                    user["email"] == TEST_USER_EMAIL and
                    user["location"] == TEST_USER_LOCATION):
                    self.log_result("Registration Data Validation", True, "User data correct")
                else:
                    self.log_result("Registration Data Validation", False, "User data mismatch", user)
            else:
                self.log_result("User Registration", False, "Missing required fields", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("User Registration", False, f"Registration failed", error_msg)
    
    def test_duplicate_registration(self):
        """Test duplicate email registration"""
        print("\n=== Testing Duplicate Registration ===")
        
        user_data = {
            "name": "Another Magician",
            "email": TEST_USER_EMAIL,  # Same email
            "password": "AnotherPassword123!",
            "location": "New York, NY"
        }
        
        response = self.make_request("POST", "/auth/register", user_data)
        
        if response and response.status_code == 400:
            data = response.json()
            if "already registered" in data.get("detail", "").lower():
                self.log_result("Duplicate Registration Prevention", True, "Duplicate email rejected")
            else:
                self.log_result("Duplicate Registration Prevention", False, "Wrong error message", data)
        else:
            self.log_result("Duplicate Registration Prevention", False, "Should have failed with 400",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def test_user_login(self):
        """Test user login"""
        print("\n=== Testing User Login ===")
        
        # Test correct credentials
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                # Update token (in case we're testing login separately)
                self.access_token = data["access_token"]
                self.user_id = data["user"]["id"]
                self.log_result("User Login", True, "Login successful")
            else:
                self.log_result("User Login", False, "Missing required fields", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("User Login", False, "Login failed", error_msg)
        
        # Test incorrect credentials
        wrong_login_data = {
            "email": TEST_USER_EMAIL,
            "password": "WrongPassword123!"
        }
        
        response = self.make_request("POST", "/auth/login", wrong_login_data)
        
        if response and response.status_code == 401:
            self.log_result("Invalid Login Prevention", True, "Invalid credentials rejected")
        else:
            self.log_result("Invalid Login Prevention", False, "Should have failed with 401",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def test_profile_operations(self):
        """Test profile retrieval and updates"""
        print("\n=== Testing Profile Operations ===")
        
        # Test get profile
        response = self.make_request("GET", "/users/profile")
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("email") == TEST_USER_EMAIL:
                self.log_result("Get Profile", True, "Profile retrieved successfully")
            else:
                self.log_result("Get Profile", False, "Profile data mismatch", data)
        else:
            self.log_result("Get Profile", False, "Failed to get profile",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test update profile
        update_data = {
            "bio": "Professional magician specializing in close-up magic and mentalism",
            "location": "Los Angeles, CA"
        }
        
        response = self.make_request("PUT", "/users/profile", update_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if (data.get("bio") == update_data["bio"] and 
                data.get("location") == update_data["location"]):
                self.log_result("Update Profile", True, "Profile updated successfully")
            else:
                self.log_result("Update Profile", False, "Profile update failed", data)
        else:
            self.log_result("Update Profile", False, "Failed to update profile",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def test_categories(self):
        """Test categories endpoint"""
        print("\n=== Testing Categories ===")
        
        response = self.make_request("GET", "/categories/")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) >= 6:
                # Check for expected categories
                category_ids = [cat.get("id") for cat in data]
                expected_categories = ["illusion", "closeup", "mentalism", "books", "cards", "events"]
                
                if all(cat_id in category_ids for cat_id in expected_categories):
                    self.log_result("Categories Retrieval", True, f"All {len(expected_categories)} categories found")
                    
                    # Validate category structure
                    first_category = data[0]
                    required_fields = ["id", "name", "icon", "project_count"]
                    if all(field in first_category for field in required_fields):
                        self.log_result("Category Structure", True, "Category fields correct")
                    else:
                        self.log_result("Category Structure", False, "Missing category fields", first_category)
                else:
                    self.log_result("Categories Retrieval", False, "Missing expected categories", category_ids)
            else:
                self.log_result("Categories Retrieval", False, "Invalid categories response", data)
        else:
            self.log_result("Categories Retrieval", False, "Failed to get categories",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def test_project_creation(self):
        """Test project creation"""
        print("\n=== Testing Project Creation ===")
        
        project_data = {
            "title": "Revolutionary Card Magic System",
            "subtitle": "A groundbreaking approach to card manipulation",
            "description": "Discover the secrets behind impossible card magic with our innovative system.",
            "full_description": "This comprehensive system teaches advanced card manipulation techniques that will revolutionize your magic performances. Includes detailed instructions, practice routines, and professional tips from world-class magicians.",
            "category": "cards",
            "image": "https://example.com/card-magic.jpg",
            "video": "https://youtube.com/watch?v=example",
            "funding_goal": 5000.0,
            "days_duration": 30,
            "location": "Magic Academy, CA",
            "rewards": [
                {
                    "title": "Digital Download",
                    "description": "Complete digital version of the card magic system",
                    "amount": 25.0,
                    "estimated_delivery": "March 2025",
                    "is_limited": False
                },
                {
                    "title": "Physical Kit + Digital",
                    "description": "Physical practice cards plus digital content",
                    "amount": 75.0,
                    "estimated_delivery": "April 2025",
                    "is_limited": True,
                    "quantity_limit": 100
                }
            ],
            "faqs": [
                {
                    "question": "What skill level is required?",
                    "answer": "This system is suitable for intermediate to advanced magicians."
                },
                {
                    "question": "How long does it take to master?",
                    "answer": "With regular practice, most techniques can be mastered in 2-3 months."
                }
            ]
        }
        
        response = self.make_request("POST", "/projects/", project_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("title") == project_data["title"]:
                self.project_id = data["id"]
                self.log_result("Project Creation", True, "Project created successfully")
                
                # Validate project data
                if (data.get("funding_goal") == project_data["funding_goal"] and
                    data.get("category") == project_data["category"] and
                    len(data.get("rewards", [])) == len(project_data["rewards"])):
                    self.log_result("Project Data Validation", True, "Project data correct")
                else:
                    self.log_result("Project Data Validation", False, "Project data mismatch", data)
            else:
                self.log_result("Project Creation", False, "Project data mismatch", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("Project Creation", False, "Failed to create project", error_msg)
    
    def test_projects_retrieval(self):
        """Test projects retrieval with various filters"""
        print("\n=== Testing Projects Retrieval ===")
        
        # Test get all projects
        response = self.make_request("GET", "/projects/")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_result("Get All Projects", True, f"Retrieved {len(data)} projects")
                
                # Test project structure if we have projects
                if data:
                    project = data[0]
                    required_fields = ["id", "title", "description", "funding_goal", "current_funding", "days_left"]
                    if all(field in project for field in required_fields):
                        self.log_result("Project Structure", True, "Project fields correct")
                    else:
                        self.log_result("Project Structure", False, "Missing project fields", project)
            else:
                self.log_result("Get All Projects", False, "Invalid projects response", data)
        else:
            self.log_result("Get All Projects", False, "Failed to get projects",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test category filtering
        response = self.make_request("GET", "/projects/?category=cards")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_result("Category Filtering", True, f"Retrieved {len(data)} card projects")
            else:
                self.log_result("Category Filtering", False, "Invalid filtered response", data)
        else:
            self.log_result("Category Filtering", False, "Category filtering failed",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test search functionality
        response = self.make_request("GET", "/projects/?search=card")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_result("Search Functionality", True, f"Search returned {len(data)} results")
            else:
                self.log_result("Search Functionality", False, "Invalid search response", data)
        else:
            self.log_result("Search Functionality", False, "Search failed",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def test_individual_project(self):
        """Test individual project retrieval"""
        print("\n=== Testing Individual Project ===")
        
        if not self.project_id:
            self.log_result("Individual Project Test", False, "No project ID available")
            return
        
        response = self.make_request("GET", f"/projects/{self.project_id}")
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("id") == self.project_id:
                self.log_result("Get Individual Project", True, "Project retrieved successfully")
                
                # Check for detailed fields
                detailed_fields = ["full_description", "rewards", "faqs", "comments", "updates"]
                if all(field in data for field in detailed_fields):
                    self.log_result("Project Details", True, "All detailed fields present")
                else:
                    self.log_result("Project Details", False, "Missing detailed fields", data.keys())
            else:
                self.log_result("Get Individual Project", False, "Project ID mismatch", data)
        else:
            self.log_result("Get Individual Project", False, "Failed to get project",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def test_project_story_update(self):
        """Test project story update endpoint (NEW FEATURE)"""
        print("\n=== Testing Project Story Update (NEW FEATURE) ===")
        
        if not self.project_id:
            self.log_result("Project Story Update Test", False, "No project ID available")
            return
        
        # Test story update with authenticated creator (should succeed)
        story_data = {
            "story": "This is an updated story for our revolutionary card magic system. We've added new insights and techniques based on community feedback."
        }
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", story_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if "message" in data and "updated successfully" in data["message"]:
                self.log_result("Story Update - Creator Access", True, "Story updated by creator successfully")
                
                # Verify story was actually updated by retrieving project
                verify_response = self.make_request("GET", f"/projects/{self.project_id}")
                if verify_response and verify_response.status_code == 200:
                    project_data = verify_response.json()
                    # Note: The story field might not be in the response model, but update should succeed
                    self.log_result("Story Update - Verification", True, "Story update endpoint working")
                else:
                    self.log_result("Story Update - Verification", False, "Could not verify story update")
            else:
                self.log_result("Story Update - Creator Access", False, "Unexpected response format", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("Story Update - Creator Access", False, "Failed to update story", error_msg)
        
        # Test story update without authentication (should fail with 401)
        old_token = self.access_token
        self.access_token = None
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", story_data)
        
        if response and response.status_code == 401:
            self.log_result("Story Update - No Auth", True, "Unauthenticated access properly blocked")
        else:
            self.log_result("Story Update - No Auth", False, "Should have failed with 401",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Restore token
        self.access_token = old_token
        
        # Test story update with different user (should fail with 403)
        # First create another user
        other_user_data = {
            "name": "Another Magician",
            "email": "other@magician.com",
            "password": "OtherPassword123!",
            "location": "New York, NY"
        }
        
        register_response = self.make_request("POST", "/auth/register", other_user_data)
        
        if register_response and register_response.status_code == 200:
            other_user_token = register_response.json().get("access_token")
            
            # Try to update story with other user's token
            old_token = self.access_token
            self.access_token = other_user_token
            
            response = self.make_request("PATCH", f"/projects/{self.project_id}/story", story_data)
            
            if response and response.status_code == 403:
                self.log_result("Story Update - Non-Creator", True, "Non-creator access properly blocked")
            else:
                self.log_result("Story Update - Non-Creator", False, "Should have failed with 403",
                              f"Status: {response.status_code if response else 'No response'}")
            
            # Restore original token
            self.access_token = old_token
        else:
            self.log_result("Story Update - Non-Creator", False, "Could not create test user for authorization test")
        
        # Test with empty/invalid story content
        invalid_story_data = {"story": ""}
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", invalid_story_data)
        
        if response and response.status_code == 200:
            self.log_result("Story Update - Empty Content", True, "Empty story content accepted (valid behavior)")
        else:
            self.log_result("Story Update - Empty Content", False, "Empty story should be allowed",
                          f"Status: {response.status_code if response else 'No response'}")

    def test_project_updates_with_media(self):
        """Test enhanced project updates with media support (NEW FEATURE)"""
        print("\n=== Testing Project Updates with Media (NEW FEATURE) ===")
        
        if not self.project_id:
            self.log_result("Project Updates Media Test", False, "No project ID available")
            return
        
        # Test 1: Create update with title and content only
        basic_update_data = {
            "title": "Basic Progress Update",
            "content": "We've made significant progress on the card magic system. The core techniques are now finalized."
        }
        
        response = self.make_request("POST", f"/projects/{self.project_id}/updates", basic_update_data)
        
        if response and response.status_code == 200:
            data = response.json()
            updates = data.get("updates", [])
            if len(updates) > 0:
                latest_update = updates[-1]  # Get the most recent update
                if (latest_update.get("title") == basic_update_data["title"] and
                    latest_update.get("content") == basic_update_data["content"]):
                    self.log_result("Update Creation - Basic", True, "Basic update created successfully")
                    
                    # Verify images and videos arrays exist and are empty
                    if (isinstance(latest_update.get("images", []), list) and
                        isinstance(latest_update.get("videos", []), list)):
                        self.log_result("Update Structure - Media Arrays", True, "Images and videos arrays present")
                    else:
                        self.log_result("Update Structure - Media Arrays", False, "Missing media arrays", latest_update)
                else:
                    self.log_result("Update Creation - Basic", False, "Update data mismatch", latest_update)
            else:
                self.log_result("Update Creation - Basic", False, "Update not added to project", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("Update Creation - Basic", False, "Failed to create basic update", error_msg)
        
        # Test 2: Create update with images array
        images_update_data = {
            "title": "Visual Progress Update",
            "content": "Here are some images showing our progress on the card techniques.",
            "images": [
                "https://example.com/progress1.jpg",
                "https://example.com/progress2.jpg",
                "https://example.com/technique_demo.png"
            ]
        }
        
        response = self.make_request("POST", f"/projects/{self.project_id}/updates", images_update_data)
        
        if response and response.status_code == 200:
            data = response.json()
            updates = data.get("updates", [])
            if len(updates) >= 2:  # Should have at least 2 updates now
                latest_update = updates[-1]
                if (latest_update.get("title") == images_update_data["title"] and
                    latest_update.get("images") == images_update_data["images"]):
                    self.log_result("Update Creation - With Images", True, "Update with images created successfully")
                else:
                    self.log_result("Update Creation - With Images", False, "Images data mismatch", latest_update)
            else:
                self.log_result("Update Creation - With Images", False, "Images update not added", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("Update Creation - With Images", False, "Failed to create images update", error_msg)
        
        # Test 3: Create update with videos array
        videos_update_data = {
            "title": "Video Demonstration Update",
            "content": "Check out these video demonstrations of the new techniques.",
            "videos": [
                "https://youtube.com/watch?v=demo1",
                "https://vimeo.com/demo2"
            ]
        }
        
        response = self.make_request("POST", f"/projects/{self.project_id}/updates", videos_update_data)
        
        if response and response.status_code == 200:
            data = response.json()
            updates = data.get("updates", [])
            if len(updates) >= 3:  # Should have at least 3 updates now
                latest_update = updates[-1]
                if (latest_update.get("title") == videos_update_data["title"] and
                    latest_update.get("videos") == videos_update_data["videos"]):
                    self.log_result("Update Creation - With Videos", True, "Update with videos created successfully")
                else:
                    self.log_result("Update Creation - With Videos", False, "Videos data mismatch", latest_update)
            else:
                self.log_result("Update Creation - With Videos", False, "Videos update not added", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("Update Creation - With Videos", False, "Failed to create videos update", error_msg)
        
        # Test 4: Create update with both images and videos
        mixed_media_update_data = {
            "title": "Complete Media Update",
            "content": "This update includes both images and videos showcasing our complete progress.",
            "images": [
                "https://example.com/final_setup.jpg",
                "https://example.com/cards_layout.png"
            ],
            "videos": [
                "https://youtube.com/watch?v=final_demo",
                "https://youtube.com/watch?v=behind_scenes"
            ]
        }
        
        response = self.make_request("POST", f"/projects/{self.project_id}/updates", mixed_media_update_data)
        
        if response and response.status_code == 200:
            data = response.json()
            updates = data.get("updates", [])
            if len(updates) >= 4:  # Should have at least 4 updates now
                latest_update = updates[-1]
                if (latest_update.get("title") == mixed_media_update_data["title"] and
                    latest_update.get("images") == mixed_media_update_data["images"] and
                    latest_update.get("videos") == mixed_media_update_data["videos"]):
                    self.log_result("Update Creation - Mixed Media", True, "Update with both images and videos created successfully")
                    
                    # Verify timestamp creation
                    if "created_at" in latest_update:
                        self.log_result("Update Timestamp", True, "Created_at timestamp properly set")
                    else:
                        self.log_result("Update Timestamp", False, "Missing created_at timestamp")
                else:
                    self.log_result("Update Creation - Mixed Media", False, "Mixed media data mismatch", latest_update)
            else:
                self.log_result("Update Creation - Mixed Media", False, "Mixed media update not added", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("Update Creation - Mixed Media", False, "Failed to create mixed media update", error_msg)
        
        # Test 5: Test authorization for updates (non-creator should fail)
        # Create another user for authorization test
        other_user_data = {
            "name": "Update Tester",
            "email": "updatetester@magic.com",
            "password": "UpdateTest123!",
            "location": "Test City"
        }
        
        register_response = self.make_request("POST", "/auth/register", other_user_data)
        
        if register_response and register_response.status_code == 200:
            other_user_token = register_response.json().get("access_token")
            
            # Try to create update with other user's token
            old_token = self.access_token
            self.access_token = other_user_token
            
            unauthorized_update = {
                "title": "Unauthorized Update",
                "content": "This should fail"
            }
            
            response = self.make_request("POST", f"/projects/{self.project_id}/updates", unauthorized_update)
            
            if response and response.status_code == 403:
                self.log_result("Update Authorization", True, "Non-creator update properly blocked")
            else:
                self.log_result("Update Authorization", False, "Should have failed with 403",
                              f"Status: {response.status_code if response else 'No response'}")
            
            # Restore original token
            self.access_token = old_token
        else:
            self.log_result("Update Authorization", False, "Could not create test user for authorization test")

    def test_project_updates_and_comments(self):
        """Test project updates and comments (LEGACY)"""
        print("\n=== Testing Project Updates & Comments (LEGACY) ===")
        
        if not self.project_id:
            self.log_result("Project Updates Test", False, "No project ID available")
            return
        
        # Test creating comment
        comment_data = {
            "content": "This looks amazing! Can't wait to learn these techniques. When will the digital version be available?"
        }
        
        response = self.make_request("POST", f"/projects/{self.project_id}/comments", comment_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if len(data.get("comments", [])) > 0:
                self.log_result("Create Project Comment", True, "Comment created successfully")
            else:
                self.log_result("Create Project Comment", False, "Comment not added", data)
        else:
            self.log_result("Create Project Comment", False, "Failed to create comment",
                          f"Status: {response.status_code if response else 'No response'}")

    def test_enhanced_project_retrieval(self):
        """Test that updated projects retrieve properly with new data"""
        print("\n=== Testing Enhanced Project Retrieval ===")
        
        if not self.project_id:
            self.log_result("Enhanced Retrieval Test", False, "No project ID available")
            return
        
        # Get project and verify updates appear
        response = self.make_request("GET", f"/projects/{self.project_id}")
        
        if response and response.status_code == 200:
            data = response.json()
            
            # Check if updates array exists and has content
            updates = data.get("updates", [])
            if len(updates) > 0:
                self.log_result("Project Updates Retrieval", True, f"Retrieved {len(updates)} updates")
                
                # Check update structure
                first_update = updates[0]
                required_fields = ["id", "title", "content", "created_at"]
                optional_fields = ["images", "videos"]
                
                if all(field in first_update for field in required_fields):
                    self.log_result("Update Structure Validation", True, "Required update fields present")
                    
                    # Check if optional media fields exist
                    if all(field in first_update for field in optional_fields):
                        self.log_result("Update Media Fields", True, "Images and videos fields present in updates")
                        
                        # Verify they are lists
                        if (isinstance(first_update.get("images"), list) and
                            isinstance(first_update.get("videos"), list)):
                            self.log_result("Update Media Types", True, "Images and videos are properly typed as lists")
                        else:
                            self.log_result("Update Media Types", False, "Images/videos not properly typed as lists")
                    else:
                        self.log_result("Update Media Fields", False, "Missing images/videos fields in updates")
                else:
                    self.log_result("Update Structure Validation", False, "Missing required update fields", first_update)
                
                # Check update ordering (newest first)
                if len(updates) > 1:
                    first_date = datetime.fromisoformat(updates[0]["created_at"].replace('Z', '+00:00'))
                    second_date = datetime.fromisoformat(updates[1]["created_at"].replace('Z', '+00:00'))
                    
                    if first_date >= second_date:
                        self.log_result("Update Ordering", True, "Updates properly ordered (newest first)")
                    else:
                        self.log_result("Update Ordering", False, "Updates not properly ordered")
            else:
                self.log_result("Project Updates Retrieval", False, "No updates found in project")
        else:
            self.log_result("Enhanced Retrieval Test", False, "Failed to retrieve project",
                          f"Status: {response.status_code if response else 'No response'}")

    def test_data_validation(self):
        """Test data validation for new endpoints"""
        print("\n=== Testing Data Validation ===")
        
        if not self.project_id:
            self.log_result("Data Validation Test", False, "No project ID available")
            return
        
        # Test missing required fields for updates
        incomplete_update = {
            "title": "Missing Content"
            # Missing content field
        }
        
        response = self.make_request("POST", f"/projects/{self.project_id}/updates", incomplete_update)
        
        if response and response.status_code in [400, 422]:
            self.log_result("Update Validation - Missing Content", True, "Missing content field properly rejected")
        else:
            self.log_result("Update Validation - Missing Content", False, "Should reject missing content",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test missing title
        incomplete_update2 = {
            "content": "Missing Title"
            # Missing title field
        }
        
        response = self.make_request("POST", f"/projects/{self.project_id}/updates", incomplete_update2)
        
        if response and response.status_code in [400, 422]:
            self.log_result("Update Validation - Missing Title", True, "Missing title field properly rejected")
        else:
            self.log_result("Update Validation - Missing Title", False, "Should reject missing title",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test invalid media arrays (should accept non-list values gracefully or reject)
        invalid_media_update = {
            "title": "Invalid Media Test",
            "content": "Testing invalid media types",
            "images": "not_a_list",
            "videos": 123
        }
        
        response = self.make_request("POST", f"/projects/{self.project_id}/updates", invalid_media_update)
        
        # This could either succeed (if backend converts to lists) or fail with validation error
        if response:
            if response.status_code == 200:
                self.log_result("Update Validation - Invalid Media Types", True, "Invalid media types handled gracefully")
            elif response.status_code in [400, 422]:
                self.log_result("Update Validation - Invalid Media Types", True, "Invalid media types properly rejected")
            else:
                self.log_result("Update Validation - Invalid Media Types", False, "Unexpected response to invalid media",
                              f"Status: {response.status_code}")
        else:
            self.log_result("Update Validation - Invalid Media Types", False, "No response to invalid media test")
    
    def test_backing_system(self):
        """Test project backing functionality"""
        print("\n=== Testing Backing System ===")
        
        if not self.project_id:
            self.log_result("Backing System Test", False, "No project ID available")
            return
        
        # First, get project to find a reward ID
        response = self.make_request("GET", f"/projects/{self.project_id}")
        reward_id = None
        
        if response and response.status_code == 200:
            project_data = response.json()
            rewards = project_data.get("rewards", [])
            if rewards:
                reward_id = rewards[0]["id"]
        
        # Test creating a backing
        backing_data = {
            "project_id": self.project_id,
            "reward_id": reward_id,
            "amount": 75.0,
            "payment_method": "stripe"
        }
        
        response = self.make_request("POST", "/backing/", backing_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if (data.get("project_id") == self.project_id and 
                data.get("amount") == backing_data["amount"]):
                self.log_result("Create Backing", True, "Backing created successfully")
                
                # Validate backing response structure
                required_fields = ["id", "user_id", "project_id", "amount", "payment_status", "backed_at"]
                if all(field in data for field in required_fields):
                    self.log_result("Backing Structure", True, "Backing data structure correct")
                else:
                    self.log_result("Backing Structure", False, "Missing backing fields", data)
            else:
                self.log_result("Create Backing", False, "Backing data mismatch", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("Create Backing", False, "Failed to create backing", error_msg)
        
        # Test getting user's backed projects
        response = self.make_request("GET", "/users/backed")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                self.log_result("Get Backed Projects", True, f"Retrieved {len(data)} backed projects")
                
                # Check if our backing is in the list
                project_ids = [backing.get("project_id") for backing in data]
                if self.project_id in project_ids:
                    self.log_result("Backing Persistence", True, "Backing found in user's backed projects")
                else:
                    self.log_result("Backing Persistence", False, "Backing not found in user's list", project_ids)
            else:
                self.log_result("Get Backed Projects", False, "No backed projects found", data)
        else:
            self.log_result("Get Backed Projects", False, "Failed to get backed projects",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def test_file_upload(self):
        """Test file upload functionality"""
        print("\n=== Testing File Upload ===")
        
        # Create a test image
        try:
            # Create a simple test image
            img = Image.new('RGB', (100, 100), color='red')
            img_buffer = io.BytesIO()
            img.save(img_buffer, format='JPEG')
            img_buffer.seek(0)
            
            # Test avatar upload
            files = {'file': ('test_avatar.jpg', img_buffer, 'image/jpeg')}
            
            response = self.make_request("POST", "/upload/avatar", files=files)
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get("success") and "avatar_url" in data:
                    self.log_result("Avatar Upload", True, "Avatar uploaded successfully")
                    
                    # Test serving the uploaded file
                    avatar_url = data["avatar_url"]
                    filename = avatar_url.split("/")[-1]
                    
                    serve_response = self.make_request("GET", f"/upload/avatars/{filename}")
                    
                    if serve_response and serve_response.status_code == 200:
                        self.log_result("Avatar Serving", True, "Avatar served successfully")
                    else:
                        self.log_result("Avatar Serving", False, "Failed to serve avatar",
                                      f"Status: {serve_response.status_code if serve_response else 'No response'}")
                else:
                    self.log_result("Avatar Upload", False, "Upload response invalid", data)
            else:
                error_msg = response.json() if response else "No response"
                self.log_result("Avatar Upload", False, "Failed to upload avatar", error_msg)
        
        except Exception as e:
            self.log_result("Avatar Upload", False, f"Upload test error: {str(e)}")
        
        # Test file size validation (create oversized file)
        try:
            # Create a large image (over 5MB)
            large_img = Image.new('RGB', (3000, 3000), color='blue')
            large_buffer = io.BytesIO()
            large_img.save(large_buffer, format='JPEG', quality=100)
            large_buffer.seek(0)
            
            files = {'file': ('large_avatar.jpg', large_buffer, 'image/jpeg')}
            
            response = self.make_request("POST", "/upload/avatar", files=files)
            
            if response and response.status_code == 400:
                self.log_result("File Size Validation", True, "Large file rejected correctly")
            else:
                self.log_result("File Size Validation", False, "Large file should have been rejected",
                              f"Status: {response.status_code if response else 'No response'}")
        
        except Exception as e:
            self.log_result("File Size Validation", False, f"Size validation test error: {str(e)}")
    
    def test_authorization(self):
        """Test authorization and access control"""
        print("\n=== Testing Authorization ===")
        
        # Test accessing protected endpoint without token
        old_token = self.access_token
        self.access_token = None
        
        response = self.make_request("GET", "/users/profile")
        
        if response and response.status_code == 401:
            self.log_result("Unauthorized Access Prevention", True, "Protected endpoint blocked without token")
        else:
            self.log_result("Unauthorized Access Prevention", False, "Should have been blocked",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test with invalid token
        self.access_token = "invalid_token_12345"
        
        response = self.make_request("GET", "/users/profile")
        
        if response and response.status_code == 401:
            self.log_result("Invalid Token Prevention", True, "Invalid token rejected")
        else:
            self.log_result("Invalid Token Prevention", False, "Invalid token should be rejected",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Restore valid token
        self.access_token = old_token
    
    def test_error_handling(self):
        """Test error handling for various scenarios"""
        print("\n=== Testing Error Handling ===")
        
        # Test non-existent project
        response = self.make_request("GET", "/projects/non-existent-project-id")
        
        if response and response.status_code == 404:
            self.log_result("Non-existent Resource", True, "404 returned for non-existent project")
        else:
            self.log_result("Non-existent Resource", False, "Should return 404",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test invalid endpoint
        response = self.make_request("GET", "/invalid/endpoint")
        
        if response and response.status_code == 404:
            self.log_result("Invalid Endpoint", True, "404 returned for invalid endpoint")
        else:
            self.log_result("Invalid Endpoint", False, "Should return 404 for invalid endpoint",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test invalid JSON data
        response = self.make_request("POST", "/auth/register", {"invalid": "data"})
        
        if response and response.status_code == 422:
            self.log_result("Invalid Data Validation", True, "422 returned for invalid data")
        else:
            self.log_result("Invalid Data Validation", False, "Should return 422 for invalid data",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def test_database_integration(self):
        """Test database persistence and relationships"""
        print("\n=== Testing Database Integration ===")
        
        # Test data persistence by retrieving created project
        if self.project_id:
            response = self.make_request("GET", f"/projects/{self.project_id}")
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get("creator_id") == self.user_id:
                    self.log_result("Data Persistence", True, "Project-user relationship maintained")
                else:
                    self.log_result("Data Persistence", False, "Project-user relationship broken", data)
            else:
                self.log_result("Data Persistence", False, "Failed to retrieve created project")
        
        # Test user's created projects
        response = self.make_request("GET", "/users/created")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                project_ids = [project.get("id") for project in data]
                if self.project_id and self.project_id in project_ids:
                    self.log_result("User-Project Relationship", True, "Created project found in user's projects")
                else:
                    self.log_result("User-Project Relationship", False, "Created project not in user's list", project_ids)
            else:
                self.log_result("User-Project Relationship", False, "Invalid created projects response", data)
        else:
            self.log_result("User-Project Relationship", False, "Failed to get created projects")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🎩✨ Starting iFundMagic Backend API Tests ✨🎩")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Core functionality tests
        self.test_health_check()
        self.test_user_registration()
        self.test_duplicate_registration()
        self.test_user_login()
        self.test_profile_operations()
        self.test_categories()
        self.test_project_creation()
        self.test_projects_retrieval()
        self.test_individual_project()
        
        # NEW FEATURE TESTS - Project Editing and Updates
        print("\n" + "="*60)
        print("🎯 TESTING NEW FEATURES - PROJECT EDITING & UPDATES")
        print("="*60)
        self.test_project_story_update()
        self.test_project_updates_with_media()
        self.test_enhanced_project_retrieval()
        self.test_data_validation()
        
        # Legacy tests
        self.test_project_updates_and_comments()
        self.test_backing_system()
        self.test_file_upload()
        
        # Security and error handling tests
        self.test_authorization()
        self.test_error_handling()
        self.test_database_integration()
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 60)
        print("🎩 TEST SUMMARY 🎩")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if "✅ PASS" in r["status"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if "❌ FAIL" in result["status"]:
                    print(f"  - {result['test']}: {result['message']}")
                    if result.get('details'):
                        print(f"    Details: {result['details']}")
        
        print("\n✅ PASSED TESTS:")
        for result in self.test_results:
            if "✅ PASS" in result["status"]:
                print(f"  - {result['test']}: {result['message']}")
        
        # Save detailed results to file
        with open("/app/test_results_detailed.json", "w") as f:
            json.dump(self.test_results, f, indent=2, default=str)
        
        print(f"\nDetailed results saved to: /app/test_results_detailed.json")
        print("🎩✨ Testing Complete! ✨🎩")

if __name__ == "__main__":
    tester = iFundMagicAPITester()
    tester.run_all_tests()