# StreamPlay Billing System

A comprehensive billing and subscription management system for StreamPlay's streaming platform, built with Next.js, Supabase, and modern web technologies.

## 🚀 Features

- **Complete Billing Management**: Handle subscriptions, invoices, and payments
- **StreamPlay Integration**: Seamless integration with StreamPlay platform (mock mode available)
- **User Management**: Comprehensive customer and subscriber management
- **Analytics Dashboard**: Real-time insights and reporting
- **AI-Powered Insights**: Machine learning for churn prediction and customer analytics
- **Blockchain Integration**: Web3 billing and NFT marketplace features
- **RESTful APIs**: Complete API suite for all operations
- **Webhook Support**: Real-time event processing
- **Multi-deployment**: Support for Vercel, AWS Amplify, and Docker

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Python Flask (AI services)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration ready
- **Blockchain**: Viem, WalletConnect
- **AI/ML**: Python scikit-learn, pandas, numpy
- **Deployment**: Vercel, AWS Amplify, Docker

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- Supabase account
- Git

### Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd billing-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   pip install -r requirements.txt
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update `.env.local` with your values:
   \`\`\`env
   SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supabasSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   STREAMPLAY_MOCK_MODE=true
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   # Run the SQL migration in your Supabase dashboard
   # File: supabase/migrations/001_initial_schema.sql
   \`\`\`

5. **Seed test data**
   \`\`\`bash
   npm run dev
   # Visit http://localhost:3000/seed-data to create test data
   \`\`\`

6. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🌐 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

2. **Set environment variables in Vercel dashboard**

### AWS Amplify

1. **Deploy using the provided script**
   \`\`\`bash
   chmod +x deploy-amplify.sh
   ./deploy-amplify.sh deploy
   \`\`\`

2. **Set environment variables in Amplify Console**

### Docker

1. **Build and run with Docker**
   \`\`\`bash
   docker build -t billing-system .
   docker run -p 3000:3000 billing-system
   \`\`\`

## 📊 Usage

### Main Features

1. **Dashboard**: Overview of all billing metrics at `/`
2. **Customer Management**: Manage customers at `/customers`
3. **Subscription Management**: Handle subscriptions at `/subscriber-management`
4. **Product Management**: Manage products and plans at `/product-management`
5. **Billing Management**: Process billing at `/billing-management`
6. **Analytics**: View insights at `/analytics`
7. **AI Insights**: ML-powered analytics at `/ai-insights`
8. **StreamPlay Demo**: Test integration at `/streamplay-demo`

### API Endpoints

- **Customers**: `/api/customers`
- **Subscriptions**: `/api/v1/subscriptions`
- **StreamPlay Integration**: `/api/integrations/streamplay`
- **Webhooks**: `/api/webhooks/streamplay`
- **AI Services**: `/api/ai`
- **Blockchain**: `/api/blockchain`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `STREAMPLAY_MOCK_MODE` | Enable mock mode for StreamPlay | No |
| `STREAMPLAY_API_KEY` | StreamPlay API key | No |
| `STREAMPLAY_WEBHOOK_SECRET` | StreamPlay webhook secret | No |

### Database Schema

The system uses the following main tables:
- `customers` - Customer information
- `subscriptions` - Subscription records
- `subscription_plans` - Available plans
- `invoices` - Billing invoices
- `transactions` - Payment transactions
- `tickets` - Support tickets

## 🤖 AI Features

The system includes ML models for:
- **Churn Prediction**: Identify customers likely to cancel
- **Customer Lifetime Value**: Predict customer value
- **Sentiment Analysis**: Analyze customer feedback

Train models:
\`\`\`bash
python scripts/train_models.py
\`\`\`

## 🔗 Integrations

### StreamPlay Integration

The system integrates with StreamPlay platform:
- User synchronization
- Subscription management
- Webhook event processing
- Real-time updates

### Blockchain Features

- Web3 billing and payments
- NFT marketplace integration
- Smart contract deployment
- Multi-chain support

## 📈 Monitoring

- Real-time analytics dashboard
- Customer behavior tracking
- Revenue and churn metrics
- Performance monitoring

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run Python tests
python -m pytest

# Test API endpoints
curl http://localhost:3000/api/health
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Visit the demo at `/streamplay-demo`

## 🔄 Updates

The system is actively maintained with regular updates for:
- Security patches
- Feature enhancements
- Performance improvements
- New integrations

---

Built with ❤️ for StreamPlay
\`\`\`

```python file="ai_services.py"
"""
AI Services for the billing system
Provides machine learning capabilities for customer analytics, churn prediction, and insights
"""

import os
import json
import pickle
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, mean_squared_error, classification_report
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CustomerAnalyticsService:
    """
    Service for customer analytics and machine learning predictions
    """
    
    def __init__(self):
        self.models_dir = "models"
        self.churn_model = None
        self.cltv_model = None
        self.scaler = None
        self.label_encoders = {}
        
        # Create models directory if it doesn't exist
        os.makedirs(self.models_dir, exist_ok=True)
        
        # Load pre-trained models if available
        self.load_models()
    
    def load_models(self):
        """Load pre-trained models from disk"""
        try:
            # Load churn prediction model
            churn_model_path = os.path.join(self.models_dir, "churn_model.pkl")
            if os.path.exists(churn_model_path):
                with open(churn_model_path, "rb") as f:
                    self.churn_model = pickle.load(f)
                logger.info("Churn prediction model loaded successfully")
            
            # Load CLTV prediction model
            cltv_model_path = os.path.join(self.models_dir, "cltv_model.pkl")
            if os.path.exists(cltv_model_path):
                with open(cltv_model_path, "rb") as f:
                    self.cltv_model = pickle.load(f)
                logger.info("CLTV prediction model loaded successfully")
            
            # Load scaler
            scaler_path = os.path.join(self.models_dir, "scaler.pkl")
            if os.path.exists(scaler_path):
                with open(scaler_path, "rb") as f:
                    self.scaler = pickle.load(f)
                logger.info("Feature scaler loaded successfully")
            
            # Load label encoders
            encoders_path = os.path.join(self.models_dir, "label_encoders.pkl")
            if os.path.exists(encoders_path):
                with open(encoders_path, "rb") as f:
                    self.label_encoders = pickle.load(f)
                logger.info("Label encoders loaded successfully")
                
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
    
    def save_models(self):
        """Save trained models to disk"""
        try:
            if self.churn_model:
                with open(os.path.join(self.models_dir, "churn_model.pkl"), "wb") as f:
                    pickle.dump(self.churn_model, f)
            
            if self.cltv_model:
                with open(os.path.join(self.models_dir, "cltv_model.pkl"), "wb") as f:
                    pickle.dump(self.cltv_model, f)
            
            if self.scaler:
                with open(os.path.join(self.models_dir, "scaler.pkl"), "wb") as f:
                    pickle.dump(self.scaler, f)
            
            if self.label_encoders:
                with open(os.path.join(self.models_dir, "label_encoders.pkl"), "wb") as f:
                    pickle.dump(self.label_encoders, f)
            
            logger.info("Models saved successfully")
        except Exception as e:
            logger.error(f"Error saving models: {str(e)}")
    
    def prepare_features(self, customer_data: List[Dict]) -> pd.DataFrame:
        """
        Prepare features for machine learning models
        """
        df = pd.DataFrame(customer_data)
        
        # Convert dates
        date_columns = ['created_at', 'updated_at', 'last_payment_date']
        for col in date_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
        
        # Calculate derived features
        current_date = datetime.now()
        
        # Customer age (days since registration)
        if 'created_at' in df.columns:
            df['customer_age_days'] = (current_date - df['created_at']).dt.days
        
        # Days since last payment
        if 'last_payment_date' in df.columns:
            df['days_since_last_payment'] = (current_date - df['last_payment_date']).dt.days
            df['days_since_last_payment'] = df['days_since_last_payment'].fillna(999)
        
        # Payment frequency (payments per month)
        if 'total_spent' in df.columns and 'customer_age_days' in df.columns:
            df['payment_frequency'] = df['total_spent'] / (df['customer_age_days'] / 30 + 1)
        
        # Subscription status encoding
        if 'subscription_status' in df.columns:
            status_mapping = {
                'active': 1,
                'inactive': 0,
                'cancelled': -1,
                'trial': 0.5
            }
            df['subscription_status_encoded'] = df['subscription_status'].map(status_mapping).fillna(0)
        
        # Fill missing values
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        df[numeric_columns] = df[numeric_columns].fillna(0)
        
        return df
    
    def train_churn_model(self, customer_data: List[Dict]) -> Dict[str, Any]:
        """
        Train churn prediction model
        """
        try:
            df = self.prepare_features(customer_data)
            
            # Define features for churn prediction
            feature_columns = [
                'total_spent', 'subscription_count', 'customer_age_days',
                'days_since_last_payment', 'payment_frequency', 'subscription_status_encoded'
            ]
            
            # Filter available columns
            available_features = [col for col in feature_columns if col in df.columns]
            
            if len(available_features) &lt; 3:
                return {"error": "Insufficient features for training"}
            
            X = df[available_features].fillna(0)
            
            # Create churn labels (customers who cancelled or haven't paid in 60+ days)
            y = ((df['subscription_status'] == 'cancelled') | 
                 (df['days_since_last_payment'] > 60)).astype(int)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features
            self.scaler = StandardScaler()
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.churn_model = RandomForestClassifier(
                n_estimators=100, random_state=42, max_depth=10
            )
            self.churn_model.fit(X_train_scaled, y_train)
            
            # Evaluate model
            y_pred = self.churn_model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Feature importance
            feature_importance = dict(zip(
                available_features,
                self.churn_model.feature_importances_
            ))
            
            # Save model
            self.save_models()
            
            return {
                "success": True,
                "accuracy": accuracy,
                "feature_importance": feature_importance,
                "features_used": available_features,
                "training_samples": len(X_train)
            }
            
        except Exception as e:
            logger.error(f"Error training churn model: {str(e)}")
            return {"error": str(e)}
    
    def predict_churn(self, customer_data: Dict) -> Dict[str, Any]:
        """
        Predict churn probability for a customer
        """
        try:
            if not self.churn_model or not self.scaler:
                return {"error": "Churn model not trained"}
            
            # Prepare features
            df = self.prepare_features([customer_data])
            
            feature_columns = [
                'total_spent', 'subscription_count', 'customer_age_days',
                'days_since_last_payment', 'payment_frequency', 'subscription_status_encoded'
            ]
            
            available_features = [col for col in feature_columns if col in df.columns]
            X = df[available_features].fillna(0)
            
            # Scale features
            X_scaled = self.scaler.transform(X)
            
            # Predict
            churn_probability = self.churn_model.predict_proba(X_scaled)[0][1]
            churn_prediction = self.churn_model.predict(X_scaled)[0]
            
            # Risk level
            if churn_probability > 0.7:
                risk_level = "High"
            elif churn_probability > 0.4:
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            return {
                "churn_probability": float(churn_probability),
                "churn_prediction": bool(churn_prediction),
                "risk_level": risk_level,
                "features_used": available_features
            }
            
        except Exception as e:
            logger.error(f"Error predicting churn: {str(e)}")
            return {"error": str(e)}
    
    def train_cltv_model(self, customer_data: List[Dict]) -> Dict[str, Any]:
        """
        Train Customer Lifetime Value prediction model
        """
        try:
            df = self.prepare_features(customer_data)
            
            # Define features for CLTV prediction
            feature_columns = [
                'subscription_count', 'customer_age_days', 'payment_frequency',
                'subscription_status_encoded'
            ]
            
            available_features = [col for col in feature_columns if col in df.columns]
            
            if len(available_features) &lt; 2:
                return {"error": "Insufficient features for CLTV training"}
            
            X = df[available_features].fillna(0)
            y = df['total_spent'].fillna(0)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train model
            self.cltv_model = GradientBoostingRegressor(
                n_estimators=100, random_state=42, max_depth=6
            )
            self.cltv_model.fit(X_train, y_train)
            
            # Evaluate model
            y_pred = self.cltv_model.predict(X_test)
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            
            # Feature importance
            feature_importance = dict(zip(
                available_features,
                self.cltv_model.feature_importances_
            ))
            
            # Save model
            self.save_models()
            
            return {
                "success": True,
                "rmse": rmse,
                "feature_importance": feature_importance,
                "features_used": available_features,
                "training_samples": len(X_train)
            }
            
        except Exception as e:
            logger.error(f"Error training CLTV model: {str(e)}")
            return {"error": str(e)}
    
    def predict_cltv(self, customer_data: Dict) -> Dict[str, Any]:
        """
        Predict Customer Lifetime Value
        """
        try:
            if not self.cltv_model:
                return {"error": "CLTV model not trained"}
            
            # Prepare features
            df = self.prepare_features([customer_data])
            
            feature_columns = [
                'subscription_count', 'customer_age_days', 'payment_frequency',
                'subscription_status_encoded'
            ]
            
            available_features = [col for col in feature_columns if col in df.columns]
            X = df[available_features].fillna(0)
            
            # Predict
            cltv_prediction = self.cltv_model.predict(X)[0]
            
            # Value segment
            if cltv_prediction > 1000:
                value_segment = "High Value"
            elif cltv_prediction > 500:
                value_segment = "Medium Value"
            else:
                value_segment = "Low Value"
            
            return {
                "predicted_cltv": float(cltv_prediction),
                "value_segment": value_segment,
                "features_used": available_features
            }
            
        except Exception as e:
            logger.error(f"Error predicting CLTV: {str(e)}")
            return {"error": str(e)}
    
    def analyze_customer_segments(self, customer_data: List[Dict]) -> Dict[str, Any]:
        """
        Analyze customer segments and provide insights
        """
        try:
            df = self.prepare_features(customer_data)
            
            # Basic statistics
            total_customers = len(df)
            active_customers = len(df[df['subscription_status'] == 'active'])
            total_revenue = df['total_spent'].sum()
            avg_revenue_per_customer = df['total_spent'].mean()
            
            # Subscription status distribution
            status_distribution = df['subscription_status'].value_counts().to_dict()
            
            # Revenue segments
            df['revenue_segment'] = pd.cut(
                df['total_spent'],
                bins=[0, 100, 500, 1000, float('inf')],
                labels=['Low', 'Medium', 'High', 'Premium']
            )
            revenue_segments = df['revenue_segment'].value_counts().to_dict()
            
            # Churn risk analysis
            churn_predictions = []
            if self.churn_model and self.scaler:
                for _, customer in df.iterrows():
                    churn_result = self.predict_churn(customer.to_dict())
                    if 'churn_probability' in churn_result:
                        churn_predictions.append(churn_result['churn_probability'])
                
                if churn_predictions:
                    avg_churn_risk = np.mean(churn_predictions)
                    high_risk_customers = sum(1 for p in churn_predictions if p > 0.7)
                else:
                    avg_churn_risk = 0
                    high_risk_customers = 0
            else:
                avg_churn_risk = 0
                high_risk_customers = 0
            
            return {
                "total_customers": total_customers,
                "active_customers": active_customers,
                "total_revenue": float(total_revenue),
                "avg_revenue_per_customer": float(avg_revenue_per_customer),
                "status_distribution": status_distribution,
                "revenue_segments": revenue_segments,
                "avg_churn_risk": float(avg_churn_risk),
                "high_risk_customers": high_risk_customers,
                "analysis_date": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing customer segments: {str(e)}")
            return {"error": str(e)}
    
    def get_customer_insights(self, customer_id: str, customer_data: Dict) -> Dict[str, Any]:
        """
        Get comprehensive insights for a specific customer
        """
        try:
            insights = {
                "customer_id": customer_id,
                "analysis_date": datetime.now().isoformat()
            }
            
            # Churn prediction
            churn_result = self.predict_churn(customer_data)
            if 'error' not in churn_result:
                insights["churn_analysis"] = churn_result
            
            # CLTV prediction
            cltv_result = self.predict_cltv(customer_data)
            if 'error' not in cltv_result:
                insights["cltv_analysis"] = cltv_result
            
            # Customer health score
            health_score = self.calculate_health_score(customer_data)
            insights["health_score"] = health_score
            
            # Recommendations
            recommendations = self.generate_recommendations(customer_data, churn_result, cltv_result)
            insights["recommendations"] = recommendations
            
            return insights
            
        except Exception as e:
            logger.error(f"Error getting customer insights: {str(e)}")
            return {"error": str(e)}
    
    def calculate_health_score(self, customer_data: Dict) -> Dict[str, Any]:
        """
        Calculate customer health score based on various factors
        """
        try:
            score = 100  # Start with perfect score
            factors = []
            
            # Subscription status
            status = customer_data.get('subscription_status', 'inactive')
            if status == 'active':
                factors.append({"factor": "Active Subscription", "impact": 0, "description": "Customer has active subscription"})
            elif status == 'trial':
                score -= 20
                factors.append({"factor": "Trial Status", "impact": -20, "description": "Customer is on trial"})
            elif status == 'cancelled':
                score -= 50
                factors.append({"factor": "Cancelled Subscription", "impact": -50, "description": "Customer cancelled subscription"})
            else:
                score -= 30
                factors.append({"factor": "Inactive Status", "impact": -30, "description": "Customer is inactive"})
            
            # Payment history
            total_spent = customer_data.get('total_spent', 0)
            if total_spent > 1000:
                score += 10
                factors.append({"factor": "High Value Customer", "impact": 10, "description": f"Total spent: ${total_spent}"})
            elif total_spent &lt; 50:
                score -= 15
                factors.append({"factor": "Low Spending", "impact": -15, "description": f"Total spent: ${total_spent}"})
            
            # Days since last payment
            days_since_payment = customer_data.get('days_since_last_payment', 0)
            if days_since_payment > 60:
                score -= 25
                factors.append({"factor": "Payment Delay", "impact": -25, "description": f"{days_since_payment} days since last payment"})
            elif days_since_payment &lt; 30:
                score += 5
                factors.append({"factor": "Recent Payment", "impact": 5, "description": "Recent payment activity"})
            
            # Subscription count
            sub_count = customer_data.get('subscription_count', 0)
            if sub_count > 1:
                score += 5
                factors.append({"factor": "Multiple Subscriptions", "impact": 5, "description": f"{sub_count} subscriptions"})
            
            # Ensure score is between 0 and 100
            score = max(0, min(100, score))
            
            # Health level
            if score >= 80:
                health_level = "Excellent"
                color = "green"
            elif score >= 60:
                health_level = "Good"
                color = "blue"
            elif score >= 40:
                health_level = "Fair"
                color = "yellow"
            else:
                health_level = "Poor"
                color = "red"
            
            return {
                "score": score,
                "health_level": health_level,
                "color": color,
                "factors": factors
            }
            
        except Exception as e:
            logger.error(f"Error calculating health score: {str(e)}")
            return {"score": 50, "health_level": "Unknown", "color": "gray", "factors": []}
    
    def generate_recommendations(self, customer_data: Dict, churn_result: Dict, cltv_result: Dict) -> List[Dict[str, str]]:
        """
        Generate actionable recommendations for customer management
        """
        recommendations = []
        
        try:
            # Churn-based recommendations
            if 'churn_probability' in churn_result:
                churn_prob = churn_result['churn_probability']
                if churn_prob > 0.7:
                    recommendations.append({
                        "type": "retention",
                        "priority": "high",
                        "title": "High Churn Risk - Immediate Action Required",
                        "description": "Customer has high probability of churning. Consider offering discount or reaching out personally.",
                        "action": "Contact customer within 24 hours"
                    })
                elif churn_prob > 0.4:
                    recommendations.append({
                        "type": "engagement",
                        "priority": "medium",
                        "title": "Moderate Churn Risk - Increase Engagement",
                        "description": "Customer shows signs of potential churn. Increase engagement through targeted content.",
                        "action": "Send personalized content recommendations"
                    })
            
            # CLTV-based recommendations
            if 'predicted_cltv' in cltv_result:
                cltv = cltv_result['predicted_cltv']
                if cltv > 1000:
                    recommendations.append({
                        "type": "vip",
                        "priority": "high",
                        "title": "High-Value Customer - VIP Treatment",
                        "description": "Customer has high lifetime value potential. Provide premium support and exclusive offers.",
                        "action": "Assign dedicated account manager"
                    })
                elif cltv &lt; 200:
                    recommendations.append({
                        "type": "upsell",
                        "priority": "medium",
                        "title": "Low CLTV - Upsell Opportunity",
                        "description": "Customer has low predicted lifetime value. Consider upselling to higher-tier plans.",
                        "action": "Present upgrade options"
                    })
            
            # Status-based recommendations
            status = customer_data.get('subscription_status', 'inactive')
            if status == 'trial':
                recommendations.append({
                    "type": "conversion",
                    "priority": "high",
                    "title": "Trial User - Conversion Focus",
                    "description": "Customer is on trial. Focus on demonstrating value to convert to paid subscription.",
                    "action": "Send trial conversion campaign"
                })
            elif status == 'inactive':
                recommendations.append({
                    "type": "reactivation",
                    "priority": "medium",
                    "title": "Inactive Customer - Reactivation Campaign",
                    "description": "Customer is inactive. Launch reactivation campaign with special offers.",
                    "action": "Send win-back email series"
                })
            
            # Payment-based recommendations
            days_since_payment = customer_data.get('days_since_last_payment', 0)
            if days_since_payment > 45:
                recommendations.append({
                    "type": "payment",
                    "priority": "high",
                    "title": "Payment Issue - Follow Up Required",
                    "description": "Customer hasn't made payment in over 45 days. Check for payment issues.",
                    "action": "Verify payment method and send reminder"
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return []

# Global service instance
analytics_service = CustomerAnalyticsService()

def get_analytics_service():
    """Get the global analytics service instance"""
    return analytics_service
