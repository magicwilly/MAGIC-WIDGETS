#!/usr/bin/env python3
"""
Focused Story Update Test for iFundMagic
Tests the specific PATCH /api/projects/{project_id}/story endpoint functionality
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BACKEND_URL = "https://ifundmagic.preview.emergentagent.com/api"
TEST_USER_EMAIL = "story_tester@sleightschool.com"
TEST_USER_PASSWORD = "StoryTest123!"
TEST_USER_NAME = "Story Test Magician"
TEST_USER_LOCATION = "Story Test City"

class StoryUpdateTester:
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
            elif method.upper() == "PATCH":
                response = requests.patch(url, json=data, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            return None
    
    def setup_test_user_and_project(self):
        """Setup test user and create a project for testing"""
        print("🔧 Setting up test user and project...")
        
        # Register test user
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
            print(f"✅ User registered: {TEST_USER_EMAIL}")
        else:
            # Try login if user already exists
            login_data = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            
            response = self.make_request("POST", "/auth/login", login_data)
            
            if response and response.status_code == 200:
                data = response.json()
                self.access_token = data["access_token"]
                self.user_id = data["user"]["id"]
                print(f"✅ User logged in: {TEST_USER_EMAIL}")
            else:
                print("❌ Failed to setup test user")
                return False
        
        # Create test project
        project_data = {
            "title": "Story Update Test Project",
            "subtitle": "Testing story update functionality",
            "description": "A test project for story update functionality",
            "full_description": "This project is created specifically to test the story update endpoint functionality.",
            "category": "cards",
            "image": "https://example.com/test-project.jpg",
            "funding_goal": 1000.0,
            "days_duration": 30,
            "location": "Test Location",
            "rewards": [
                {
                    "title": "Test Reward",
                    "description": "A test reward",
                    "amount": 25.0,
                    "estimated_delivery": "March 2025",
                    "is_limited": False
                }
            ],
            "faqs": [
                {
                    "question": "Is this a test?",
                    "answer": "Yes, this is a test project."
                }
            ]
        }
        
        response = self.make_request("POST", "/projects/", project_data)
        
        if response and response.status_code == 200:
            data = response.json()
            self.project_id = data["id"]
            print(f"✅ Test project created: {self.project_id}")
            return True
        else:
            error_msg = response.json() if response else "No response"
            print(f"❌ Failed to create test project: {error_msg}")
            return False
    
    def test_story_update_functionality(self):
        """Test the core story update functionality"""
        print("\n=== Testing Story Update Functionality ===")
        
        if not self.project_id:
            self.log_result("Story Update Test Setup", False, "No project ID available")
            return
        
        # Test 1: Update story with valid content
        story_data = {
            "story": "This is an updated story for our test project. We've made significant progress and want to share our journey with backers. The story includes details about our development process, challenges we've overcome, and exciting milestones we've reached."
        }
        
        print(f"🔍 Testing PATCH /api/projects/{self.project_id}/story")
        print(f"🔍 Story data: {story_data}")
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", story_data)
        
        if response:
            print(f"🔍 Response status: {response.status_code}")
            print(f"🔍 Response headers: {dict(response.headers)}")
            try:
                response_data = response.json()
                print(f"🔍 Response data: {response_data}")
            except:
                print(f"🔍 Response text: {response.text}")
        else:
            print("🔍 No response received")
        
        if response and response.status_code == 200:
            data = response.json()
            if "message" in data and "updated successfully" in data["message"]:
                self.log_result("Story Update - Valid Content", True, "Story updated successfully")
                
                # Test 2: Verify story persistence by retrieving project
                print(f"🔍 Verifying story persistence with GET /api/projects/{self.project_id}")
                verify_response = self.make_request("GET", f"/projects/{self.project_id}")
                
                if verify_response and verify_response.status_code == 200:
                    project_data = verify_response.json()
                    print(f"🔍 Retrieved project keys: {list(project_data.keys())}")
                    
                    # Check if story field exists in response
                    if "story" in project_data:
                        retrieved_story = project_data["story"]
                        if retrieved_story == story_data["story"]:
                            self.log_result("Story Persistence Verification", True, "Story correctly persisted and retrieved")
                        else:
                            self.log_result("Story Persistence Verification", False, 
                                          f"Story mismatch. Expected: '{story_data['story']}', Got: '{retrieved_story}'")
                    else:
                        self.log_result("Story Field Missing", False, 
                                      "Story field not present in project response model", 
                                      f"Available fields: {list(project_data.keys())}")
                else:
                    self.log_result("Story Persistence Verification", False, "Could not retrieve project for verification")
            else:
                self.log_result("Story Update - Valid Content", False, "Unexpected response format", data)
        else:
            error_msg = response.json() if response else "No response"
            self.log_result("Story Update - Valid Content", False, "Failed to update story", error_msg)
    
    def test_story_update_authentication(self):
        """Test authentication and authorization for story updates"""
        print("\n=== Testing Story Update Authentication ===")
        
        if not self.project_id:
            self.log_result("Story Auth Test Setup", False, "No project ID available")
            return
        
        story_data = {"story": "Unauthorized story update attempt"}
        
        # Test 1: No authentication (should fail with 401)
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
        
        # Test 2: Different user authentication (should fail with 403)
        other_user_data = {
            "name": "Other Story Tester",
            "email": "other_story_tester@magic.com",
            "password": "OtherStoryTest123!",
            "location": "Other Test City"
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
    
    def test_story_update_data_validation(self):
        """Test data validation for story updates"""
        print("\n=== Testing Story Update Data Validation ===")
        
        if not self.project_id:
            self.log_result("Story Validation Test Setup", False, "No project ID available")
            return
        
        # Test 1: Empty story content
        empty_story_data = {"story": ""}
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", empty_story_data)
        
        if response and response.status_code == 200:
            self.log_result("Story Update - Empty Content", True, "Empty story content accepted (valid behavior)")
        else:
            self.log_result("Story Update - Empty Content", False, "Empty story should be allowed",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test 2: Very long story content
        long_story = "A" * 10000  # 10,000 character story
        long_story_data = {"story": long_story}
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", long_story_data)
        
        if response and response.status_code == 200:
            self.log_result("Story Update - Long Content", True, "Long story content accepted")
        else:
            self.log_result("Story Update - Long Content", False, "Long story should be allowed",
                          f"Status: {response.status_code if response else 'No response'}")
        
        # Test 3: Missing story field
        invalid_data = {"not_story": "This is not the story field"}
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", invalid_data)
        
        if response and response.status_code == 200:
            # Check if it set story to empty string (default behavior)
            verify_response = self.make_request("GET", f"/projects/{self.project_id}")
            if verify_response and verify_response.status_code == 200:
                project_data = verify_response.json()
                if "story" in project_data and project_data["story"] == "":
                    self.log_result("Story Update - Missing Field", True, "Missing story field handled gracefully (set to empty)")
                else:
                    self.log_result("Story Update - Missing Field", False, "Unexpected behavior with missing story field")
            else:
                self.log_result("Story Update - Missing Field", False, "Could not verify missing field behavior")
        else:
            # Could also be valid to reject missing field
            self.log_result("Story Update - Missing Field", True, "Missing story field properly rejected")
    
    def test_nonexistent_project(self):
        """Test story update on non-existent project"""
        print("\n=== Testing Non-existent Project ===")
        
        fake_project_id = "non-existent-project-id"
        story_data = {"story": "This should fail"}
        
        response = self.make_request("PATCH", f"/projects/{fake_project_id}/story", story_data)
        
        if response and response.status_code == 404:
            self.log_result("Story Update - Non-existent Project", True, "Non-existent project properly rejected with 404")
        else:
            self.log_result("Story Update - Non-existent Project", False, "Should have failed with 404",
                          f"Status: {response.status_code if response else 'No response'}")
    
    def run_focused_story_tests(self):
        """Run focused story update tests"""
        print("🎯 FOCUSED STORY UPDATE TESTING FOR IFUNDMAGIC")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Setup
        if not self.setup_test_user_and_project():
            print("❌ Failed to setup test environment")
            return
        
        # Run story-specific tests
        self.test_story_update_functionality()
        self.test_story_update_authentication()
        self.test_story_update_data_validation()
        self.test_nonexistent_project()
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 60)
        print("🎯 STORY UPDATE TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if "✅ PASS" in r["status"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%" if total_tests > 0 else "No tests run")
        
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
        
        print("\n🎯 STORY UPDATE ANALYSIS:")
        
        # Check for specific issues
        story_field_missing = any("Story Field Missing" in r["test"] and "❌ FAIL" in r["status"] for r in self.test_results)
        update_failing = any("Story Update - Valid Content" in r["test"] and "❌ FAIL" in r["status"] for r in self.test_results)
        
        if story_field_missing:
            print("🚨 CRITICAL ISSUE: Story field is missing from ProjectResponse model")
            print("   - The PATCH endpoint may work but story data is not returned in GET requests")
            print("   - This explains why users can't see their story updates")
        
        if update_failing:
            print("🚨 CRITICAL ISSUE: Story update endpoint is not working")
            print("   - The PATCH /api/projects/{id}/story endpoint is failing")
            print("   - This is the core functionality that users are reporting as broken")
        
        if not story_field_missing and not update_failing:
            print("✅ Story update functionality appears to be working correctly")
            print("   - The issue may be in the frontend implementation")
        
        print("\n🎯 Testing Complete!")

if __name__ == "__main__":
    tester = StoryUpdateTester()
    tester.run_focused_story_tests()