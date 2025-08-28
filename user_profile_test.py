#!/usr/bin/env python3
"""
Focused User Profile Endpoints Test for iFundMagic
Tests the specific issue with created projects not showing on profile page.
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
BACKEND_URL = "https://ifundmagic.preview.emergentagent.com/api"
TEST_USER_EMAIL = "projectcreator@ifundmagic.com"
TEST_USER_PASSWORD = "MagicCreator123!"
TEST_USER_NAME = "Project Creator"
TEST_USER_LOCATION = "Magic City, CA"

class UserProfileTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.access_token = None
        self.user_id = None
        self.created_project_ids = []
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
    
    def make_request(self, method, endpoint, data=None, headers=None):
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        
        # Default headers
        default_headers = {"Content-Type": "application/json"}
        if self.access_token:
            default_headers["Authorization"] = f"Bearer {self.access_token}"
        
        # Merge headers
        if headers:
            default_headers.update(headers)
        
        try:
            print(f"Making {method} request to: {url}")
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            print(f"Response status: {response.status_code}")
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            return None
    
    def authenticate_user(self):
        """Register or login user for testing"""
        print("\n=== User Authentication ===")
        
        # Try to register first
        user_data = {
            "name": TEST_USER_NAME,
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "location": TEST_USER_LOCATION
        }
        
        response = self.make_request("POST", "/auth/register", user_data)
        
        if response and response.status_code == 200:
            data = response.json()
            self.access_token = data["access_token"]
            self.user_id = data["user"]["id"]
            self.log_result("User Registration", True, "New user registered successfully")
            return True
        elif response and response.status_code == 400:
            # User already exists, try login
            login_data = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            
            response = self.make_request("POST", "/auth/login", login_data)
            
            if response and response.status_code == 200:
                data = response.json()
                self.access_token = data["access_token"]
                self.user_id = data["user"]["id"]
                self.log_result("User Login", True, "Existing user logged in successfully")
                return True
            else:
                self.log_result("User Authentication", False, "Failed to login existing user", 
                              response.json() if response else "No response")
                return False
        else:
            self.log_result("User Authentication", False, "Failed to register or login", 
                          response.json() if response else "No response")
            return False
    
    def test_user_profile_endpoint(self):
        """Test GET /api/users/profile endpoint"""
        print("\n=== Testing User Profile Endpoint ===")
        
        response = self.make_request("GET", "/users/profile")
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("email") == TEST_USER_EMAIL and data.get("id") == self.user_id:
                self.log_result("GET /users/profile", True, "Profile retrieved successfully")
                print(f"   User ID: {data.get('id')}")
                print(f"   User Name: {data.get('name')}")
                print(f"   User Email: {data.get('email')}")
                return True
            else:
                self.log_result("GET /users/profile", False, "Profile data mismatch", data)
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("GET /users/profile", False, "Failed to get profile", error_msg)
            return False
    
    def test_user_created_projects_empty(self):
        """Test GET /api/users/created endpoint when user has no projects"""
        print("\n=== Testing User Created Projects (Empty) ===")
        
        response = self.make_request("GET", "/users/created")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_result("GET /users/created (empty)", True, f"Retrieved {len(data)} created projects")
                print(f"   Current created projects count: {len(data)}")
                return True
            else:
                self.log_result("GET /users/created (empty)", False, "Invalid response format", data)
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("GET /users/created (empty)", False, "Failed to get created projects", error_msg)
            return False
    
    def test_user_backed_projects_empty(self):
        """Test GET /api/users/backed endpoint when user has no backed projects"""
        print("\n=== Testing User Backed Projects (Empty) ===")
        
        response = self.make_request("GET", "/users/backed")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_result("GET /users/backed (empty)", True, f"Retrieved {len(data)} backed projects")
                print(f"   Current backed projects count: {len(data)}")
                return True
            else:
                self.log_result("GET /users/backed (empty)", False, "Invalid response format", data)
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("GET /users/backed (empty)", False, "Failed to get backed projects", error_msg)
            return False
    
    def create_test_project(self, project_number=1):
        """Create a test project and return its ID"""
        print(f"\n=== Creating Test Project #{project_number} ===")
        
        project_data = {
            "title": f"Magic Test Project #{project_number}",
            "subtitle": f"Testing project creation flow #{project_number}",
            "description": f"This is a test project #{project_number} to verify the created projects endpoint",
            "full_description": f"Detailed description for test project #{project_number}. This project is created to test the user profile endpoints and ensure that created projects appear correctly in the user's profile.",
            "category": "illusion",
            "image": "https://example.com/test-project.jpg",
            "video": "https://youtube.com/watch?v=test",
            "funding_goal": 1000.0 + (project_number * 100),
            "days_duration": 30,
            "location": "Test City, CA",
            "rewards": [
                {
                    "title": f"Test Reward #{project_number}",
                    "description": f"Test reward for project #{project_number}",
                    "amount": 25.0,
                    "estimated_delivery": "March 2025",
                    "is_limited": False
                }
            ],
            "faqs": [
                {
                    "question": f"Test question for project #{project_number}?",
                    "answer": f"Test answer for project #{project_number}."
                }
            ]
        }
        
        response = self.make_request("POST", "/projects/", project_data)
        
        if response and response.status_code == 200:
            data = response.json()
            project_id = data.get("id")
            if project_id and data.get("title") == project_data["title"]:
                self.created_project_ids.append(project_id)
                self.log_result(f"Create Test Project #{project_number}", True, f"Project created with ID: {project_id}")
                
                # Verify creator_id is set correctly
                if data.get("creator_id") == self.user_id:
                    self.log_result(f"Project #{project_number} Creator ID", True, "Creator ID set correctly")
                else:
                    self.log_result(f"Project #{project_number} Creator ID", False, 
                                  f"Creator ID mismatch. Expected: {self.user_id}, Got: {data.get('creator_id')}")
                
                print(f"   Project ID: {project_id}")
                print(f"   Project Title: {data.get('title')}")
                print(f"   Creator ID: {data.get('creator_id')}")
                print(f"   Funding Goal: ${data.get('funding_goal')}")
                
                return project_id
            else:
                self.log_result(f"Create Test Project #{project_number}", False, "Project data mismatch", data)
                return None
        else:
            error_msg = response.json() if response else "No response"
            self.log_result(f"Create Test Project #{project_number}", False, "Failed to create project", error_msg)
            return None
    
    def test_created_projects_after_creation(self):
        """Test GET /api/users/created after creating projects"""
        print("\n=== Testing Created Projects After Creation ===")
        
        response = self.make_request("GET", "/users/created")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                found_project_ids = [project.get("id") for project in data]
                
                self.log_result("GET /users/created (after creation)", True, 
                              f"Retrieved {len(data)} created projects")
                
                print(f"   Total created projects found: {len(data)}")
                print(f"   Expected project IDs: {self.created_project_ids}")
                print(f"   Found project IDs: {found_project_ids}")
                
                # Check if all created projects are in the list
                missing_projects = []
                for project_id in self.created_project_ids:
                    if project_id not in found_project_ids:
                        missing_projects.append(project_id)
                
                if not missing_projects:
                    self.log_result("Created Projects Consistency", True, 
                                  "All created projects found in user's created list")
                    
                    # Verify project details
                    for project in data:
                        if project.get("id") in self.created_project_ids:
                            if project.get("creator_id") == self.user_id:
                                self.log_result(f"Project {project.get('id')} Details", True, 
                                              f"Project details correct: {project.get('title')}")
                            else:
                                self.log_result(f"Project {project.get('id')} Details", False, 
                                              f"Creator ID mismatch in project details")
                    
                    return True
                else:
                    self.log_result("Created Projects Consistency", False, 
                                  f"Missing projects in created list: {missing_projects}")
                    return False
            else:
                self.log_result("GET /users/created (after creation)", False, "Invalid response format", data)
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("GET /users/created (after creation)", False, "Failed to get created projects", error_msg)
            return False
    
    def test_immediate_consistency(self):
        """Test immediate consistency - create project and immediately check if it appears"""
        print("\n=== Testing Immediate Consistency ===")
        
        # Get current count
        response = self.make_request("GET", "/users/created")
        initial_count = 0
        if response and response.status_code == 200:
            initial_count = len(response.json())
        
        # Create a new project
        project_id = self.create_test_project(999)  # Special number for immediate test
        
        if project_id:
            # Immediately check if it appears in created projects
            time.sleep(1)  # Small delay to ensure database consistency
            
            response = self.make_request("GET", "/users/created")
            
            if response and response.status_code == 200:
                data = response.json()
                new_count = len(data)
                found_project_ids = [project.get("id") for project in data]
                
                if project_id in found_project_ids:
                    self.log_result("Immediate Consistency", True, 
                                  f"Project immediately appeared in created list (count: {initial_count} -> {new_count})")
                    return True
                else:
                    self.log_result("Immediate Consistency", False, 
                                  f"Project NOT found immediately in created list. Count: {initial_count} -> {new_count}")
                    print(f"   Looking for: {project_id}")
                    print(f"   Found IDs: {found_project_ids}")
                    return False
            else:
                self.log_result("Immediate Consistency", False, "Failed to retrieve created projects after creation")
                return False
        else:
            self.log_result("Immediate Consistency", False, "Failed to create test project")
            return False
    
    def test_database_query_verification(self):
        """Verify the database query is working correctly"""
        print("\n=== Testing Database Query Verification ===")
        
        # Get all projects and filter by creator_id manually
        response = self.make_request("GET", "/projects/")
        
        if response and response.status_code == 200:
            all_projects = response.json()
            user_projects = [p for p in all_projects if p.get("creator_id") == self.user_id]
            
            print(f"   Total projects in system: {len(all_projects)}")
            print(f"   Projects by this user (manual filter): {len(user_projects)}")
            
            # Compare with /users/created endpoint
            response = self.make_request("GET", "/users/created")
            
            if response and response.status_code == 200:
                created_projects = response.json()
                print(f"   Projects from /users/created: {len(created_projects)}")
                
                if len(user_projects) == len(created_projects):
                    self.log_result("Database Query Consistency", True, 
                                  "Manual filter matches /users/created endpoint")
                    return True
                else:
                    self.log_result("Database Query Consistency", False, 
                                  f"Count mismatch: manual={len(user_projects)}, endpoint={len(created_projects)}")
                    
                    # Show details for debugging
                    manual_ids = [p.get("id") for p in user_projects]
                    endpoint_ids = [p.get("id") for p in created_projects]
                    print(f"   Manual filter IDs: {manual_ids}")
                    print(f"   Endpoint IDs: {endpoint_ids}")
                    return False
            else:
                self.log_result("Database Query Consistency", False, "Failed to get created projects")
                return False
        else:
            self.log_result("Database Query Verification", False, "Failed to get all projects")
            return False
    
    def run_focused_test(self):
        """Run focused test for user profile endpoints issue"""
        print("🎩✨ iFundMagic User Profile Endpoints Test ✨🎩")
        print(f"Testing against: {self.base_url}")
        print(f"Focus: Created projects not showing on profile page")
        print("=" * 60)
        
        # Step 1: Authenticate
        if not self.authenticate_user():
            print("❌ Authentication failed - cannot continue tests")
            return
        
        # Step 2: Test basic profile endpoints
        self.test_user_profile_endpoint()
        self.test_user_created_projects_empty()
        self.test_user_backed_projects_empty()
        
        # Step 3: Create test projects
        print("\n=== Creating Multiple Test Projects ===")
        for i in range(1, 4):  # Create 3 test projects
            self.create_test_project(i)
            time.sleep(0.5)  # Small delay between creations
        
        # Step 4: Test created projects endpoint after creation
        self.test_created_projects_after_creation()
        
        # Step 5: Test immediate consistency
        self.test_immediate_consistency()
        
        # Step 6: Verify database query consistency
        self.test_database_query_verification()
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 60)
        print("🎩 USER PROFILE TEST SUMMARY 🎩")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if "✅ PASS" in r["status"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        print(f"\nCreated Projects: {len(self.created_project_ids)}")
        print(f"Project IDs: {self.created_project_ids}")
        
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
        
        # Diagnosis
        print("\n🔍 DIAGNOSIS:")
        created_endpoint_working = any("GET /users/created" in r["test"] and "✅ PASS" in r["status"] for r in self.test_results)
        consistency_working = any("Consistency" in r["test"] and "✅ PASS" in r["status"] for r in self.test_results)
        
        if created_endpoint_working and consistency_working:
            print("✅ User profile endpoints are working correctly")
            print("✅ Created projects are appearing in user profile")
            print("✅ No issues found with the reported bug")
        else:
            print("❌ Issues found with user profile endpoints:")
            if not created_endpoint_working:
                print("  - GET /users/created endpoint has issues")
            if not consistency_working:
                print("  - Created projects not appearing consistently")
        
        print("🎩✨ User Profile Testing Complete! ✨🎩")

if __name__ == "__main__":
    tester = UserProfileTester()
    tester.run_focused_test()