"""
Test script for AI services functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_services import get_analytics_service
from services import CustomerService

def test_ai_services():
    """Test AI services functionality"""
    print("🧠 Testing AI Services...")
    
    # Initialize services
    analytics_service = get_analytics_service()
    customer_service = CustomerService()
    
    # Test 1: Get sample customer data
    print("\n📊 Testing customer data retrieval...")
    customers = customer_service.get_all_customers()
    print(f"✅ Retrieved {len(customers)} sample customers")
    
    # Test 2: Train churn model
    print("\n🤖 Testing churn model training...")
    try:
        result = analytics_service.train_churn_model(customers[:50])  # Use subset for faster training
        if result['status'] == 'success':
            print(f"✅ Churn model trained successfully with accuracy: {result['accuracy']:.3f}")
        else:
            print(f"❌ Churn model training failed: {result.get('message')}")
    except Exception as e:
        print(f"❌ Error training churn model: {e}")
    
    # Test 3: Train CLTV model
    print("\n💰 Testing CLTV model training...")
    try:
        result = analytics_service.train_cltv_model(customers[:50])
        if result['status'] == 'success':
            print(f"✅ CLTV model trained successfully with MSE: {result['mse']:.3f}")
        else:
            print(f"❌ CLTV model training failed: {result.get('message')}")
    except Exception as e:
        print(f"❌ Error training CLTV model: {e}")
    
    # Test 4: Predict churn for a customer
    print("\n🎯 Testing churn prediction...")
    try:
        sample_customer = customers[0]
        result = analytics_service.predict_churn(sample_customer)
        if result['status'] == 'success':
            print(f"✅ Churn prediction for customer {sample_customer['id']}:")
            print(f"   Risk Level: {result['risk_level']}")
            print(f"   Probability: {result['churn_probability']:.3f}")
        else:
            print(f"❌ Churn prediction failed: {result.get('message')}")
    except Exception as e:
        print(f"❌ Error in churn prediction: {e}")
    
    # Test 5: Predict CLTV for a customer
    print("\n💎 Testing CLTV prediction...")
    try:
        result = analytics_service.predict_cltv(sample_customer)
        if result['status'] == 'success':
            print(f"✅ CLTV prediction for customer {sample_customer['id']}:")
            print(f"   Predicted CLTV: ${result['predicted_cltv']:.2f}")
            print(f"   Value Segment: {result['value_segment']}")
        else:
            print(f"❌ CLTV prediction failed: {result.get('message')}")
    except Exception as e:
        print(f"❌ Error in CLTV prediction: {e}")
    
    # Test 6: Customer segmentation
    print("\n🔄 Testing customer segmentation...")
    try:
        result = analytics_service.analyze_customer_segments(customers[:20])
        if result['status'] == 'success':
            print(f"✅ Customer segmentation completed:")
            for segment, data in result['segments'].items():
                print(f"   {segment}: {data['count']} customers, avg revenue: ${data['avg_revenue']:.2f}")
        else:
            print(f"❌ Customer segmentation failed: {result.get('message')}")
    except Exception as e:
        print(f"❌ Error in customer segmentation: {e}")
    
    print("\n🎉 AI Services testing completed!")

if __name__ == '__main__':
    test_ai_services()
