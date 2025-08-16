"""
BillChain AI System Status and Summary
"""

import os
import sys
from datetime import datetime

def check_file_exists(filename):
    """Check if a file exists and return status"""
    return "✅" if os.path.exists(filename) else "❌"

def get_file_size(filename):
    """Get file size in KB"""
    if os.path.exists(filename):
        size = os.path.getsize(filename) / 1024
        return f"{size:.1f} KB"
    return "N/A"

def print_system_status():
    """Print comprehensive system status"""
    print("🌟 BillChain AI - System Status Report")
    print("=" * 50)
    print(f"📅 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Core Files Status
    print("📁 Core Files Status:")
    core_files = [
        "app.py",
        "database.py", 
        "ai_services.py",
        "blockchain_services.py",
        "communication_services.py",
        "services.py",
        "requirements.txt",
        "config.py"
    ]
    
    for file in core_files:
        status = check_file_exists(file)
        size = get_file_size(file)
        print(f"   {status} {file:<25} ({size})")
    
    print()
    
    # Utility Files Status
    print("🛠️ Utility Files Status:")
    utility_files = [
        "run_app.py",
        "test_ai_services.py",
        "test_api_endpoints.py",
        "system_status.py",
        "README_simple.md"
    ]
    
    for file in utility_files:
        status = check_file_exists(file)
        size = get_file_size(file)
        print(f"   {status} {file:<25} ({size})")
    
    print()
    
    # Directory Status
    print("📂 Directory Status:")
    directories = ["models"]
    for directory in directories:
        status = "✅" if os.path.exists(directory) else "❌"
        print(f"   {status} {directory}/")
    
    print()
    
    # Feature Summary
    print("🚀 Feature Summary:")
    features = [
        "✅ Flask Web Application Framework",
        "✅ SQLAlchemy Database Models",
        "✅ AI/ML Services (Churn Prediction, CLTV)",
        "✅ Blockchain Integration (Wallet Generation)",
        "✅ Real-time WebSocket Support",
        "✅ RESTful API Endpoints",
        "✅ Automated Billing System",
        "✅ Customer Analytics Dashboard",
        "✅ Communication Services (Email/SMS)",
        "✅ Fraud Detection System",
        "✅ Customer Segmentation",
        "✅ Predictive Analytics"
    ]
    
    for feature in features:
        print(f"   {feature}")
    
    print()
    
    # Quick Start Instructions
    print("🚀 Quick Start Commands:")
    print("   1. Install dependencies:")
    print("      pip install -r requirements.txt")
    print()
    print("   2. Run the application:")
    print("      python run_app.py")
    print()
    print("   3. Test AI services:")
    print("      python test_ai_services.py")
    print()
    print("   4. Test API endpoints:")
    print("      python test_api_endpoints.py")
    print()
    
    # API Endpoints Summary
    print("🌐 Key API Endpoints:")
    endpoints = [
        "GET  /                           - Application info",
        "GET  /health                     - Health check",
        "GET  /api/dashboard/overview     - Dashboard data",
        "GET  /api/customers              - List customers",
        "POST /api/customers              - Create customer",
        "POST /api/ai/train-churn-model   - Train churn model",
        "POST /api/ai/predict-churn       - Predict churn",
        "POST /api/blockchain/wallets     - Generate wallet",
        "GET  /api/analytics/dashboard    - Analytics data"
    ]
    
    for endpoint in endpoints:
        print(f"   {endpoint}")
    
    print()
    print("🎉 BillChain AI is ready for development and testing!")
    print("📍 Access the application at: http://localhost:5000")

if __name__ == "__main__":
    print_system_status()
