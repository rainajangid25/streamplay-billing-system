"""
Startup script for BillChain AI billing system
"""

import os
from app import app, socketio, db
from database import DatabaseManager

def initialize_application():
    """Initialize the application with database setup"""
    with app.app_context():
        # Create database tables
        db.create_all()
        print("✅ Database tables created successfully")
        
        # Create models directory
        os.makedirs('models', exist_ok=True)
        print("✅ Models directory ready")
        
        # Initialize database manager and seed data if needed
        db_manager = DatabaseManager()
        try:
            db_manager.seed_data()
            print("✅ Sample data seeded successfully")
        except Exception as e:
            print(f"⚠️  Sample data already exists or error: {e}")
        
        print("🚀 BillChain AI is ready to launch!")

if __name__ == '__main__':
    print("🔧 Initializing BillChain AI...")
    initialize_application()
    
    print("\n🌟 Starting BillChain AI server...")
    print("📍 Available at: http://localhost:5000")
    print("📚 API Documentation: http://localhost:5000")
    print("🔄 Real-time features enabled via WebSocket")
    
    # Run the application
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
