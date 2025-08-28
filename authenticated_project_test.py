#!/usr/bin/env python3
"""
Focused Test for Authenticated Project Creation Flow
Tests the specific flow requested: user auth -> project creation -> project retrieval -> user's project list
"""

import requests
import json
from datetime import datetime

# Configuration
BACKEND_URL = "https://ifundmagic.preview.emergentagent.com/api"
TEST_USER_EMAIL = "projectcreator@ifundmagic.com"
TEST_USER_PASSWORD = "CreateMagic2025!"
TEST_USER_NAME = "Project Creator"
TEST_USER_LOCATION = "Magic City, USA"

class AuthenticatedProjectFlowTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.access_token = None
        self.user_id = None
        self.project_id = None
        self.results = []
        
    def log_result(self, test_name, success, message="", details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details
        }
        self.results.append(result)
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
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            return None
    
    def test_user_registration(self):
        """Test user registration for project creation"""
        print("\n=== Step 1: User Registration ===")
        
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
                self.log_result("User Registration", True, f"User registered with ID: {self.user_id}")
                return True
            else:
                self.log_result("User Registration", False, "Missing required fields", data)
                return False
        elif response and response.status_code == 400:
            # User might already exist, try login instead
            return self.test_user_login()
        else:
            self.log_result("User Registration", False, f"Registration failed", 
                          f"Status: {response.status_code if response else 'No response'}")
            return False
    
    def test_user_login(self):
        """Test user login for existing user"""
        print("\n=== Step 1b: User Login (Existing User) ===")
        
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                self.access_token = data["access_token"]
                self.user_id = data["user"]["id"]
                self.log_result("User Login", True, f"User logged in with ID: {self.user_id}")
                return True
            else:
                self.log_result("User Login", False, "Missing required fields", data)
                return False
        else:
            self.log_result("User Login", False, "Login failed", 
                          f"Status: {response.status_code if response else 'No response'}")
            return False
    
    def test_project_creation(self):
        """Test authenticated project creation"""
        print("\n=== Step 2: Authenticated Project Creation ===")
        
        if not self.access_token:
            self.log_result("Project Creation", False, "No authentication token available")
            return False
        
        project_data = {
            "title": "Mystical Card Transformation System",
            "subtitle": "Revolutionary card magic for the modern magician",
            "description": "Learn the secrets of impossible card transformations that will amaze any audience.",
            "full_description": "This comprehensive system teaches you advanced card transformation techniques developed over 20 years of professional performance. Includes step-by-step video tutorials, practice routines, and insider tips from world-renowned magicians. Perfect for intermediate to advanced performers looking to add mind-blowing effects to their repertoire.",
            "category": "cards",
            "image": "https://example.com/mystical-cards.jpg",
            "video": "https://youtube.com/watch?v=mystical-demo",
            "funding_goal": 7500.0,
            "days_duration": 45,
            "location": "Las Vegas Magic Academy",
            "rewards": [
                {
                    "title": "Digital Master Class",
                    "description": "Complete video course with all transformation techniques",
                    "amount": 49.0,
                    "estimated_delivery": "April 2025",
                    "is_limited": False
                },
                {
                    "title": "Complete Magic Kit",
                    "description": "Physical cards, props, and digital content",
                    "amount": 149.0,
                    "estimated_delivery": "May 2025",
                    "is_limited": True,
                    "quantity_limit": 50
                }
            ],
            "faqs": [
                {
                    "question": "What experience level is required?",
                    "answer": "This system is designed for intermediate to advanced magicians with basic card handling skills."
                },
                {
                    "question": "How long are the video tutorials?",
                    "answer": "The complete course includes over 4 hours of detailed instruction and practice sessions."
                }
            ]
        }
        
        response = self.make_request("POST", "/projects/", project_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("title") == project_data["title"] and data.get("creator_id") == self.user_id:
                self.project_id = data["id"]
                self.log_result("Authenticated Project Creation", True, 
                              f"Project created successfully with ID: {self.project_id}")
                
                # Validate project data integrity
                if (data.get("funding_goal") == project_data["funding_goal"] and
                    data.get("category") == project_data["category"] and
                    len(data.get("rewards", [])) == len(project_data["rewards"]) and
                    data.get("creator_id") == self.user_id):
                    self.log_result("Project Data Validation", True, "All project data correctly saved")
                else:
                    self.log_result("Project Data Validation", False, "Project data mismatch", 
                                  {"expected_creator": self.user_id, "actual_creator": data.get("creator_id")})
                return True
            else:
                self.log_result("Authenticated Project Creation", False, "Project data mismatch", data)
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("Authenticated Project Creation", False, "Failed to create project", error_msg)
            return False
    
    def test_project_retrieval(self):
        """Test project retrieval via API"""
        print("\n=== Step 3: Project Retrieval ===")
        
        if not self.project_id:
            self.log_result("Project Retrieval", False, "No project ID available")
            return False
        
        # Test individual project retrieval
        response = self.make_request("GET", f"/projects/{self.project_id}")
        
        if response and response.status_code == 200:
            data = response.json()
            if (data.get("id") == self.project_id and 
                data.get("creator_id") == self.user_id and
                data.get("title") == "Mystical Card Transformation System"):
                self.log_result("Individual Project Retrieval", True, 
                              "Project retrieved successfully with correct data")
                
                # Verify project appears in all projects list
                all_projects_response = self.make_request("GET", "/projects/")
                if all_projects_response and all_projects_response.status_code == 200:
                    all_projects = all_projects_response.json()
                    project_ids = [p.get("id") for p in all_projects]
                    if self.project_id in project_ids:
                        self.log_result("Project in Public List", True, 
                                      "Project appears in public projects list")
                    else:
                        self.log_result("Project in Public List", False, 
                                      "Project not found in public list", project_ids)
                return True
            else:
                self.log_result("Individual Project Retrieval", False, "Project data mismatch", data)
                return False
        else:
            self.log_result("Individual Project Retrieval", False, "Failed to retrieve project",
                          f"Status: {response.status_code if response else 'No response'}")
            return False
    
    def test_user_created_projects(self):
        """Test that project appears in user's created projects list"""
        print("\n=== Step 4: User's Created Projects List ===")
        
        if not self.access_token or not self.project_id:
            self.log_result("User Created Projects", False, "Missing authentication or project ID")
            return False
        
        response = self.make_request("GET", "/users/created")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                project_ids = [project.get("id") for project in data]
                project_titles = [project.get("title") for project in data]
                
                if self.project_id in project_ids:
                    self.log_result("Project in User's Created List", True, 
                                  f"Project found in user's created projects list")
                    
                    # Find our specific project and validate details
                    our_project = next((p for p in data if p.get("id") == self.project_id), None)
                    if our_project:
                        if (our_project.get("creator_id") == self.user_id and
                            our_project.get("title") == "Mystical Card Transformation System"):
                            self.log_result("User-Project Association", True, 
                                          "Project correctly associated with user")
                        else:
                            self.log_result("User-Project Association", False, 
                                          "Project association data incorrect", our_project)
                    return True
                else:
                    self.log_result("Project in User's Created List", False, 
                                  "Project not found in user's created projects", 
                                  {"available_projects": project_titles})
                    return False
            else:
                self.log_result("User Created Projects", False, "Invalid response format", data)
                return False
        else:
            self.log_result("User Created Projects", False, "Failed to get created projects",
                          f"Status: {response.status_code if response else 'No response'}")
            return False
    
    def test_database_persistence(self):
        """Test database persistence by re-retrieving data"""
        print("\n=== Step 5: Database Persistence Verification ===")
        
        if not self.project_id:
            self.log_result("Database Persistence", False, "No project ID to verify")
            return False
        
        # Wait a moment and retrieve again to ensure persistence
        import time
        time.sleep(1)
        
        response = self.make_request("GET", f"/projects/{self.project_id}")
        
        if response and response.status_code == 200:
            data = response.json()
            
            # Verify all critical data is still there
            expected_fields = ["id", "title", "creator_id", "funding_goal", "rewards", "faqs"]
            missing_fields = [field for field in expected_fields if field not in data]
            
            if not missing_fields:
                if (data.get("creator_id") == self.user_id and
                    data.get("funding_goal") == 7500.0 and
                    len(data.get("rewards", [])) == 2):
                    self.log_result("Database Persistence", True, 
                                  "All project data persisted correctly in MongoDB")
                else:
                    self.log_result("Database Persistence", False, 
                                  "Project data corrupted in database", data)
            else:
                self.log_result("Database Persistence", False, 
                              f"Missing fields in persisted data: {missing_fields}")
            return True
        else:
            self.log_result("Database Persistence", False, "Failed to re-retrieve project data")
            return False
    
    def run_authenticated_project_flow_test(self):
        """Run the complete authenticated project creation flow test"""
        print("🎩✨ Testing Authenticated Project Creation Flow ✨🎩")
        print(f"Testing against: {self.base_url}")
        print("=" * 70)
        
        # Step 1: Authentication
        auth_success = self.test_user_registration()
        if not auth_success:
            print("\n❌ Authentication failed - cannot proceed with project creation test")
            return False
        
        # Step 2: Project Creation
        creation_success = self.test_project_creation()
        if not creation_success:
            print("\n❌ Project creation failed")
            return False
        
        # Step 3: Project Retrieval
        retrieval_success = self.test_project_retrieval()
        
        # Step 4: User's Created Projects
        user_projects_success = self.test_user_created_projects()
        
        # Step 5: Database Persistence
        persistence_success = self.test_database_persistence()
        
        # Generate summary
        self.generate_summary()
        
        # Return overall success
        return all([auth_success, creation_success, retrieval_success, 
                   user_projects_success, persistence_success])
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 70)
        print("🎩 AUTHENTICATED PROJECT CREATION FLOW - TEST SUMMARY 🎩")
        print("=" * 70)
        
        total_tests = len(self.results)
        passed_tests = len([r for r in self.results if "✅ PASS" in r["status"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if "❌ FAIL" in result["status"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n✅ PASSED TESTS:")
        for result in self.results:
            if "✅ PASS" in result["status"]:
                print(f"  - {result['test']}: {result['message']}")
        
        # Overall flow assessment
        critical_tests = [
            "User Registration", "User Login", "Authenticated Project Creation",
            "Project Data Validation", "Individual Project Retrieval", 
            "Project in User's Created List", "Database Persistence"
        ]
        
        critical_passed = [r for r in self.results 
                          if any(ct in r["test"] for ct in critical_tests) 
                          and "✅ PASS" in r["status"]]
        
        if len(critical_passed) >= 6:  # Most critical tests passed
            print(f"\n🎉 OVERALL RESULT: AUTHENTICATED PROJECT CREATION FLOW IS WORKING! 🎉")
        else:
            print(f"\n⚠️  OVERALL RESULT: AUTHENTICATED PROJECT CREATION FLOW HAS ISSUES")
        
        print("🎩✨ Flow Testing Complete! ✨🎩")

if __name__ == "__main__":
    tester = AuthenticatedProjectFlowTester()
    success = tester.run_authenticated_project_flow_test()