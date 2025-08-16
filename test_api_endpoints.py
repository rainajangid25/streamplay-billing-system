"""
Test script for API endpoints
"""

import requests
import json
import time
import threading
from flask import Flask
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def start_server():
    """Start the Flask server in a separate thread"""
    from run_app import initialize_application
    from app import app, socketio
    
    initialize_application()
    socketio.run(app, debug=False, host='localhost', port=5000, use_reloader=False)

def test_api_endpoints():
    """Test various API endpoints"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testing API Endpoints...")
    print("⏳ Waiting for server to start...")
    time.sleep(3)  # Give server time to start
    
    # Test 1: Health check
    print("\n🩺 Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test 2: Root endpoint
    print("\n🏠 Testing root endpoint...")
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("✅ Root endpoint working")
            data = response.json()
            print(f"   Application: {data.get('message', 'Unknown')}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Test 3: Dashboard overview
    print("\n📊 Testing dashboard overview...")
    try:
        response = requests.get(f"{base_url}/api/dashboard/overview", timeout=5)
        if response.status_code == 200:
            print("✅ Dashboard overview working")
            data = response.json()
            print(f"   Total customers: {data.get('metrics', {}).get('total_customers', 'N/A')}")
        else:
            print(f"❌ Dashboard overview failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Dashboard overview error: {e}")
    
    # Test 4: Get customers
    print("\n👥 Testing customers endpoint...")
    try:
        response = requests.get(f"{base_url}/api/customers", timeout=5)
        if response.status_code == 200:
            print("✅ Customers endpoint working")
            data = response.json()
            print(f"   Retrieved {len(data.get('customers', []))} customers")
        else:
            print(f"❌ Customers endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Customers endpoint error: {e}")
    
    # Test 5: Create customer
    print("\n➕ Testing create customer...")
    try:
        customer_data = {
            "name": "Test Customer",
            "email": "test@example.com",
            "phone": "+1234567890",
            "company_name": "Test Company"
        }
        response = requests.post(f"{base_url}/api/customers", 
                               json=customer_data, timeout=5)
        if response.status_code == 201:
            print("✅ Customer creation working")
            data = response.json()
            print(f"   Created customer: {data.get('customer', {}).get('name', 'Unknown')}")
        else:
            print(f"❌ Customer creation failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Customer creation error: {e}")
    
    # Test 6: Train churn model
    print("\n🤖 Testing AI model training...")
    try:
        response = requests.post(f"{base_url}/api/ai/train-churn-model", 
                               json={}, timeout=30)
        if response.status_code == 200:
            print("✅ Churn model training working")
            data = response.json()
            print(f"   Model accuracy: {data.get('accuracy', 'N/A')}")
        else:
            print(f"❌ Churn model training failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Churn model training error: {e}")
    
    # Test 7: Analytics dashboard
    print("\n📈 Testing analytics dashboard...")
    try:
        response = requests.get(f"{base_url}/api/analytics/dashboard", timeout=5)
        if response.status_code == 200:
            print("✅ Analytics dashboard working")
            data = response.json()
            print(f"   Status: {data.get('status', 'Unknown')}")
        else:
            print(f"❌ Analytics dashboard failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Analytics dashboard error: {e}")
    
    # Test 8: Blockchain wallet generation
    print("\n⛓️ Testing blockchain services...")
    try:
        wallet_data = {
            "customer_id": 1,
            "network": "ethereum"
        }
        response = requests.post(f"{base_url}/api/blockchain/wallets", 
                               json=wallet_data, timeout=5)
        if response.status_code == 200:
            print("✅ Blockchain wallet generation working")
            data = response.json()
            print(f"   Generated {data.get('network', 'unknown')} wallet")
        else:
            print(f"❌ Blockchain wallet generation failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Blockchain wallet generation error: {e}")
    
    print("\n🎉 API endpoint testing completed!")

if __name__ == '__main__':
    # Start server in background thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Run tests
    test_api_endpoints()
    
    print("\n⚠️  Server is still running. Press Ctrl+C to stop.")
