#!/usr/bin/env python3
"""
Story Update Verification Test
Comprehensive verification that story update functionality is working end-to-end
"""

import requests
import json
from datetime import datetime

# Configuration
BACKEND_URL = "https://ifundmagic.preview.emergentagent.com/api"

class StoryVerificationTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.access_token = None
        self.user_id = None
        self.project_id = None
        
    def make_request(self, method, endpoint, data=None):
        """Make HTTP request"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "PATCH":
                response = requests.patch(url, json=data, headers=headers, timeout=30)
            return response
        except:
            return None
    
    def setup_user_and_project(self):
        """Setup test user and project"""
        print("🔧 Setting up test environment...")
        
        # Login as existing user
        login_data = {
            "email": "story_tester@sleightschool.com",
            "password": "StoryTest123!"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        if response and response.status_code == 200:
            data = response.json()
            self.access_token = data["access_token"]
            self.user_id = data["user"]["id"]
            print(f"✅ Logged in successfully")
        else:
            print("❌ Failed to login")
            return False
        
        # Create a new test project
        project_data = {
            "title": "Story Verification Project",
            "subtitle": "Testing complete story functionality",
            "description": "A project to verify story updates work end-to-end",
            "full_description": "This project tests the complete story update workflow.",
            "category": "cards",
            "funding_goal": 1000.0,
            "days_duration": 30,
            "rewards": [{
                "title": "Test Reward",
                "description": "A test reward",
                "amount": 25.0,
                "estimated_delivery": "March 2025",
                "is_limited": False
            }],
            "faqs": []
        }
        
        response = self.make_request("POST", "/projects/", project_data)
        if response and response.status_code == 200:
            data = response.json()
            self.project_id = data["id"]
            print(f"✅ Project created: {self.project_id}")
            return True
        else:
            print("❌ Failed to create project")
            return False
    
    def test_complete_story_workflow(self):
        """Test the complete story update workflow"""
        print("\n🎯 TESTING COMPLETE STORY UPDATE WORKFLOW")
        print("=" * 50)
        
        # Step 1: Verify project initially has no story
        print("1️⃣ Checking initial project state...")
        response = self.make_request("GET", f"/projects/{self.project_id}")
        if response and response.status_code == 200:
            project = response.json()
            initial_story = project.get("story")
            print(f"   Initial story: {initial_story}")
            if initial_story is None or initial_story == "":
                print("   ✅ Project initially has no story (expected)")
            else:
                print(f"   ⚠️ Project has initial story: '{initial_story}'")
        
        # Step 2: Update story with meaningful content
        print("\n2️⃣ Updating project story...")
        story_content = """
        🎩 Welcome to our Magic Project Story! ✨
        
        We're excited to share our journey in creating this revolutionary magic system. 
        
        **What We've Accomplished:**
        - Developed 15 new card techniques
        - Created comprehensive video tutorials
        - Tested with 50+ beta magicians
        - Refined based on community feedback
        
        **What's Next:**
        - Final video production (Week 1-2)
        - Printing physical materials (Week 3-4)
        - Quality assurance testing (Week 5)
        - Shipping to backers (Week 6-8)
        
        Thank you for your support! Your backing makes this magic possible. 🎭
        
        Stay tuned for more updates as we bring this project to life!
        """
        
        story_data = {"story": story_content.strip()}
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", story_data)
        if response and response.status_code == 200:
            result = response.json()
            print(f"   ✅ Story update response: {result}")
        else:
            print(f"   ❌ Story update failed: {response.status_code if response else 'No response'}")
            return False
        
        # Step 3: Verify story was saved and can be retrieved
        print("\n3️⃣ Verifying story persistence...")
        response = self.make_request("GET", f"/projects/{self.project_id}")
        if response and response.status_code == 200:
            project = response.json()
            retrieved_story = project.get("story")
            
            if retrieved_story == story_content.strip():
                print("   ✅ Story perfectly matches what was saved!")
                print(f"   📝 Story length: {len(retrieved_story)} characters")
                print(f"   📝 Story preview: {retrieved_story[:100]}...")
            else:
                print("   ❌ Story mismatch!")
                print(f"   Expected length: {len(story_content.strip())}")
                print(f"   Retrieved length: {len(retrieved_story) if retrieved_story else 0}")
                return False
        else:
            print(f"   ❌ Failed to retrieve project: {response.status_code if response else 'No response'}")
            return False
        
        # Step 4: Update story again to test overwriting
        print("\n4️⃣ Testing story update (overwrite)...")
        updated_story = """
        🎩 UPDATED: Magic Project Story - Progress Update! ✨
        
        **MAJOR MILESTONE REACHED!** 🎉
        
        We've just completed our beta testing phase with incredible results:
        - 98% satisfaction rate from beta testers
        - 5 additional techniques added based on feedback  
        - Professional video production is now underway
        
        **Timeline Update:**
        - Video production: 90% complete ✅
        - Physical materials: In production ✅
        - Expected delivery: 2 weeks ahead of schedule! 🚀
        
        Thank you for your patience and continued support!
        """
        
        updated_story_data = {"story": updated_story.strip()}
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", updated_story_data)
        if response and response.status_code == 200:
            print("   ✅ Story update successful")
        else:
            print(f"   ❌ Story update failed: {response.status_code if response else 'No response'}")
            return False
        
        # Step 5: Verify the updated story
        print("\n5️⃣ Verifying updated story...")
        response = self.make_request("GET", f"/projects/{self.project_id}")
        if response and response.status_code == 200:
            project = response.json()
            final_story = project.get("story")
            
            if final_story == updated_story.strip():
                print("   ✅ Updated story perfectly matches!")
                print(f"   📝 Updated story length: {len(final_story)} characters")
                print(f"   📝 Updated story preview: {final_story[:100]}...")
            else:
                print("   ❌ Updated story mismatch!")
                return False
        else:
            print(f"   ❌ Failed to retrieve updated project: {response.status_code if response else 'No response'}")
            return False
        
        # Step 6: Test empty story (clearing story)
        print("\n6️⃣ Testing story clearing (empty story)...")
        empty_story_data = {"story": ""}
        
        response = self.make_request("PATCH", f"/projects/{self.project_id}/story", empty_story_data)
        if response and response.status_code == 200:
            print("   ✅ Empty story update successful")
        else:
            print(f"   ❌ Empty story update failed: {response.status_code if response else 'No response'}")
            return False
        
        # Step 7: Verify story was cleared
        print("\n7️⃣ Verifying story was cleared...")
        response = self.make_request("GET", f"/projects/{self.project_id}")
        if response and response.status_code == 200:
            project = response.json()
            cleared_story = project.get("story")
            
            if cleared_story == "":
                print("   ✅ Story successfully cleared!")
            else:
                print(f"   ❌ Story not cleared properly: '{cleared_story}'")
                return False
        else:
            print(f"   ❌ Failed to retrieve cleared project: {response.status_code if response else 'No response'}")
            return False
        
        return True
    
    def run_verification(self):
        """Run complete verification"""
        print("🎯 STORY UPDATE FUNCTIONALITY VERIFICATION")
        print("=" * 50)
        
        if not self.setup_user_and_project():
            print("❌ Setup failed")
            return
        
        if self.test_complete_story_workflow():
            print("\n" + "=" * 50)
            print("🎉 SUCCESS: STORY UPDATE FUNCTIONALITY FULLY WORKING!")
            print("=" * 50)
            print("✅ Story creation works")
            print("✅ Story retrieval works") 
            print("✅ Story updates work")
            print("✅ Story overwriting works")
            print("✅ Story clearing works")
            print("✅ Data persistence works")
            print("\n🎯 CONCLUSION: The reported issue has been RESOLVED!")
            print("   Users can now successfully update and view their project stories.")
        else:
            print("\n" + "=" * 50)
            print("❌ FAILURE: Story update functionality has issues")
            print("=" * 50)

if __name__ == "__main__":
    tester = StoryVerificationTester()
    tester.run_verification()