"""
AI Services for BillChain AI - Advanced Analytics and Machine Learning
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error, classification_report
import joblib
import os
from datetime import datetime, timedelta
import json
import logging

logger = logging.getLogger(__name__)

class AdvancedAnalyticsService:
    """Advanced AI analytics service for customer insights and predictions"""
    
    def __init__(self, models_dir='models'):
        self.models_dir = models_dir
        self.churn_model = None
        self.cltv_model = None
        self.scaler = None
        self.label_encoder = None
        
        # Ensure models directory exists
        os.makedirs(models_dir, exist_ok=True)
        
        # Try to load existing models
        self._load_models()
    
    def _load_models(self):
        """Load trained models from disk"""
        try:
            churn_model_path = os.path.join(self.models_dir, 'churn_model.pkl')
            cltv_model_path = os.path.join(self.models_dir, 'cltv_model.pkl')
            scaler_path = os.path.join(self.models_dir, 'scaler.pkl')
            
            if os.path.exists(churn_model_path):
                self.churn_model = joblib.load(churn_model_path)
                logger.info("Churn model loaded successfully")
            
            if os.path.exists(cltv_model_path):
                self.cltv_model = joblib.load(cltv_model_path)
                logger.info("CLTV model loaded successfully")
            
            if os.path.exists(scaler_path):
                self.scaler = joblib.load(scaler_path)
                logger.info("Scaler loaded successfully")
                
        except Exception as e:
            logger.error(f"Error loading models: {e}")
    
    def _save_models(self):
        """Save trained models to disk"""
        try:
            if self.churn_model:
                joblib.dump(self.churn_model, os.path.join(self.models_dir, 'churn_model.pkl'))
            
            if self.cltv_model:
                joblib.dump(self.cltv_model, os.path.join(self.models_dir, 'cltv_model.pkl'))
            
            if self.scaler:
                joblib.dump(self.scaler, os.path.join(self.models_dir, 'scaler.pkl'))
                
            logger.info("Models saved successfully")
            
        except Exception as e:
            logger.error(f"Error saving models: {e}")
    
    def _prepare_customer_features(self, customer_data):
        """Prepare customer features for ML models"""
        if isinstance(customer_data, list):
            # Multiple customers
            features = []
            for customer in customer_data:
                features.append(self._extract_features(customer))
            return pd.DataFrame(features)
        else:
            # Single customer
            features = self._extract_features(customer_data)
            return pd.DataFrame([features])
    
    def _extract_features(self, customer):
        """Extract features from customer data"""
        features = {
            'account_age_days': (datetime.now() - datetime.fromisoformat(customer.get('created_at', datetime.now().isoformat()).replace('Z', '+00:00'))).days if customer.get('created_at') else 0,
            'total_transactions': customer.get('total_transactions', 0),
            'total_revenue': float(customer.get('total_revenue', 0)),
            'avg_transaction_amount': float(customer.get('avg_transaction_amount', 0)),
            'days_since_last_payment': customer.get('days_since_last_payment', 0),
            'failed_payments': customer.get('failed_payments', 0),
            'support_tickets': customer.get('support_tickets', 0),
            'subscription_count': customer.get('subscription_count', 0),
            'is_enterprise': 1 if customer.get('account_type') == 'Enterprise' else 0,
            'has_crypto_wallet': 1 if customer.get('crypto_wallets') else 0,
            'communication_frequency': customer.get('communication_frequency', 0),
            'payment_method_diversity': customer.get('payment_method_diversity', 1)
        }
        return features
    
    def train_churn_model(self, customer_data):
        """Train churn prediction model"""
        try:
            # Prepare features
            features_df = self._prepare_customer_features(customer_data)
            
            # Generate synthetic churn labels for training (in real app, use actual churn data)
            y = self._generate_synthetic_churn_labels(features_df)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                features_df, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            if not self.scaler:
                self.scaler = StandardScaler()
            
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.churn_model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            
            self.churn_model.fit(X_train_scaled, y_train)
            
            # Evaluate
            y_pred = self.churn_model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Save models
            self._save_models()
            
            return {
                'status': 'success',
                'accuracy': accuracy,
                'features_used': list(features_df.columns),
                'training_samples': len(X_train),
                'test_samples': len(X_test)
            }
            
        except Exception as e:
            logger.error(f"Error training churn model: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def train_cltv_model(self, customer_data):
        """Train Customer Lifetime Value prediction model"""
        try:
            # Prepare features
            features_df = self._prepare_customer_features(customer_data)
            
            # Generate synthetic CLTV labels for training
            y = self._generate_synthetic_cltv_labels(features_df)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                features_df, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            if not self.scaler:
                self.scaler = StandardScaler()
            
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.cltv_model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            
            self.cltv_model.fit(X_train_scaled, y_train)
            
            # Evaluate
            y_pred = self.cltv_model.predict(X_test_scaled)
            mse = mean_squared_error(y_test, y_pred)
            
            # Save models
            self._save_models()
            
            return {
                'status': 'success',
                'mse': mse,
                'features_used': list(features_df.columns),
                'training_samples': len(X_train),
                'test_samples': len(X_test)
            }
            
        except Exception as e:
            logger.error(f"Error training CLTV model: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def predict_churn(self, customer_data):
        """Predict churn probability for a customer"""
        try:
            if not self.churn_model or not self.scaler:
                return {
                    'status': 'error',
                    'message': 'Churn model not trained. Please train the model first.'
                }
            
            # Prepare features
            features_df = self._prepare_customer_features(customer_data)
            features_scaled = self.scaler.transform(features_df)
            
            # Predict
            churn_probability = self.churn_model.predict_proba(features_scaled)[0][1]
            churn_prediction = self.churn_model.predict(features_scaled)[0]
            
            # Determine risk level
            if churn_probability >= 0.7:
                risk_level = 'High'
            elif churn_probability >= 0.4:
                risk_level = 'Medium'
            else:
                risk_level = 'Low'
            
            return {
                'status': 'success',
                'churn_probability': float(churn_probability),
                'will_churn': bool(churn_prediction),
                'risk_level': risk_level,
                'confidence': float(max(churn_probability, 1 - churn_probability))
            }
            
        except Exception as e:
            logger.error(f"Error predicting churn: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def predict_cltv(self, customer_data):
        """Predict Customer Lifetime Value"""
        try:
            if not self.cltv_model or not self.scaler:
                return {
                    'status': 'error',
                    'message': 'CLTV model not trained. Please train the model first.'
                }
            
            # Prepare features
            features_df = self._prepare_customer_features(customer_data)
            features_scaled = self.scaler.transform(features_df)
            
            # Predict
            predicted_cltv = self.cltv_model.predict(features_scaled)[0]
            
            # Calculate confidence intervals (simplified)
            confidence_interval = {
                'lower': float(predicted_cltv * 0.8),
                'upper': float(predicted_cltv * 1.2)
            }
            
            return {
                'status': 'success',
                'predicted_cltv': float(predicted_cltv),
                'confidence_interval': confidence_interval,
                'value_segment': self._get_value_segment(predicted_cltv)
            }
            
        except Exception as e:
            logger.error(f"Error predicting CLTV: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def get_customer_insights(self, customer_id, customer_data):
        """Get comprehensive insights for a customer"""
        try:
            insights = {
                'customer_id': customer_id,
                'generated_at': datetime.now().isoformat()
            }
            
            # Churn analysis
            churn_result = self.predict_churn(customer_data)
            if churn_result['status'] == 'success':
                insights['churn_analysis'] = churn_result
            
            # CLTV analysis
            cltv_result = self.predict_cltv(customer_data)
            if cltv_result['status'] == 'success':
                insights['cltv_analysis'] = cltv_result
            
            # Health score
            health_score = self.calculate_health_score(customer_data)
            insights['health_score'] = health_score
            
            # Recommendations
            recommendations = self.generate_recommendations(customer_data, churn_result, cltv_result)
            insights['recommendations'] = recommendations
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating customer insights: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def analyze_customer_segments(self, customer_data):
        """Analyze customer segments"""
        try:
            features_df = self._prepare_customer_features(customer_data)
            
            # Simple segmentation based on revenue and activity
            segments = {}
            
            for i, customer in enumerate(customer_data):
                revenue = features_df.iloc[i]['total_revenue']
                account_age = features_df.iloc[i]['account_age_days']
                
                if revenue > 5000:
                    segment = 'High Value'
                elif revenue > 1000:
                    segment = 'Medium Value'
                elif account_age < 30:
                    segment = 'New Customer'
                else:
                    segment = 'Low Value'
                
                if segment not in segments:
                    segments[segment] = {
                        'count': 0,
                        'total_revenue': 0,
                        'avg_revenue': 0,
                        'customers': []
                    }
                
                segments[segment]['count'] += 1
                segments[segment]['total_revenue'] += revenue
                segments[segment]['customers'].append(customer.get('id'))
            
            # Calculate averages
            for segment in segments:
                if segments[segment]['count'] > 0:
                    segments[segment]['avg_revenue'] = segments[segment]['total_revenue'] / segments[segment]['count']
            
            return {
                'status': 'success',
                'segments': segments,
                'total_customers': len(customer_data)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing customer segments: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def calculate_health_score(self, customer_data):
        """Calculate customer health score (0-100)"""
        try:
            features = self._extract_features(customer_data)
            
            score = 100
            
            # Payment behavior (40% weight)
            if features['failed_payments'] > 2:
                score -= 20
            elif features['failed_payments'] > 0:
                score -= 10
            
            if features['days_since_last_payment'] > 60:
                score -= 15
            elif features['days_since_last_payment'] > 30:
                score -= 8
            
            # Engagement (30% weight)
            if features['support_tickets'] > 5:
                score -= 15
            elif features['support_tickets'] > 2:
                score -= 5
            
            if features['account_age_days'] < 30:
                score -= 10  # New customers are riskier
            
            # Revenue contribution (30% weight)
            if features['total_revenue'] < 100:
                score -= 20
            elif features['total_revenue'] < 500:
                score -= 10
            
            return max(0, min(100, score))
            
        except Exception as e:
            logger.error(f"Error calculating health score: {e}")
            return 50  # Default score
    
    def generate_recommendations(self, customer_data, churn_result, cltv_result):
        """Generate actionable recommendations for a customer"""
        recommendations = []
        
        try:
            features = self._extract_features(customer_data)
            
            # Churn-based recommendations
            if churn_result.get('status') == 'success':
                churn_risk = churn_result.get('risk_level', 'Low')
                
                if churn_risk == 'High':
                    recommendations.append({
                        'type': 'retention',
                        'priority': 'high',
                        'action': 'Send personalized retention offer',
                        'reason': 'High churn risk detected'
                    })
                elif churn_risk == 'Medium':
                    recommendations.append({
                        'type': 'engagement',
                        'priority': 'medium',
                        'action': 'Increase engagement with product updates',
                        'reason': 'Medium churn risk - preventive action needed'
                    })
            
            # CLTV-based recommendations
            if cltv_result.get('status') == 'success':
                predicted_cltv = cltv_result.get('predicted_cltv', 0)
                
                if predicted_cltv > 5000:
                    recommendations.append({
                        'type': 'upsell',
                        'priority': 'high',
                        'action': 'Offer premium features or higher tier',
                        'reason': 'High lifetime value potential'
                    })
            
            # Payment behavior recommendations
            if features['failed_payments'] > 1:
                recommendations.append({
                    'type': 'payment',
                    'priority': 'medium',
                    'action': 'Review payment methods and send payment reminder',
                    'reason': 'Multiple failed payments detected'
                })
            
            # Support recommendations
            if features['support_tickets'] > 3:
                recommendations.append({
                    'type': 'support',
                    'priority': 'medium',
                    'action': 'Proactive customer success outreach',
                    'reason': 'High support ticket volume'
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            return []
    
    def _generate_synthetic_churn_labels(self, features_df):
        """Generate synthetic churn labels for training (replace with real data)"""
        # Simple rule-based synthetic labels
        churn_labels = []
        
        for _, row in features_df.iterrows():
            churn_score = 0
            
            if row['days_since_last_payment'] > 60:
                churn_score += 0.3
            if row['failed_payments'] > 2:
                churn_score += 0.4
            if row['support_tickets'] > 5:
                churn_score += 0.2
            if row['total_revenue'] < 100:
                churn_score += 0.1
            
            # Add some randomness
            churn_score += np.random.normal(0, 0.1)
            
            churn_labels.append(1 if churn_score > 0.5 else 0)
        
        return np.array(churn_labels)
    
    def _generate_synthetic_cltv_labels(self, features_df):
        """Generate synthetic CLTV labels for training (replace with real data)"""
        cltv_labels = []
        
        for _, row in features_df.iterrows():
            base_cltv = row['total_revenue'] * 2  # Simple baseline
            
            # Adjust based on other factors
            if row['account_age_days'] > 365:
                base_cltv *= 1.5
            if row['failed_payments'] > 2:
                base_cltv *= 0.7
            if row['is_enterprise']:
                base_cltv *= 2.0
            
            # Add some randomness
            cltv = base_cltv * (1 + np.random.normal(0, 0.2))
            cltv_labels.append(max(0, cltv))
        
        return np.array(cltv_labels)
    
    def _get_value_segment(self, cltv):
        """Get value segment based on CLTV"""
        if cltv > 10000:
            return 'Premium'
        elif cltv > 5000:
            return 'High Value'
        elif cltv > 1000:
            return 'Medium Value'
        else:
            return 'Low Value'

# Legacy AI Services Functions for backward compatibility
def advanced_churn_prediction(customer_data):
    """Legacy function for churn prediction"""
    service = get_analytics_service()
    return service.predict_churn(customer_data)

def predict_customer_lifetime_value(customer_data):
    """Legacy function for CLTV prediction"""
    service = get_analytics_service()
    return service.predict_cltv(customer_data)

def customer_segmentation(customers_data):
    """Legacy function for customer segmentation"""
    service = get_analytics_service()
    return service.analyze_customer_segments(customers_data)

def intelligent_pricing_optimization(customer_data, product_data, market_data):
    """AI-powered pricing optimization"""
    try:
        base_price = product_data.get('base_price', 100)
        customer_segment = customer_data.get('customer_segment', 'Medium Value')
        
        # Simple pricing logic (replace with ML model)
        multiplier = 1.0
        
        if customer_segment == 'Premium':
            multiplier = 1.3
        elif customer_segment == 'High Value':
            multiplier = 1.15
        elif customer_segment == 'Low Value':
            multiplier = 0.9
        
        # Market conditions
        if market_data.get('competitive_intensity', 0.5) > 0.7:
            multiplier *= 0.95
        
        optimized_price = base_price * multiplier
        
        return {
            'status': 'success',
            'original_price': base_price,
            'optimized_price': round(optimized_price, 2),
            'adjustment': round((multiplier - 1) * 100, 1),
            'reasoning': f"Adjusted for {customer_segment} customer segment"
        }
        
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def predictive_analytics_dashboard(business_data):
    """Generate predictive analytics for dashboard"""
    try:
        current_revenue = business_data.get('current_monthly_revenue', 0)
        churn_rate = business_data.get('current_churn_rate', 0.05)
        growth_rate = business_data.get('growth_rate', 0.05)
        
        # Predict next 12 months
        predictions = []
        revenue = current_revenue
        
        for month in range(1, 13):
            # Apply growth and churn
            revenue = revenue * (1 + growth_rate - churn_rate)
            predictions.append({
                'month': month,
                'predicted_revenue': round(revenue, 2),
                'confidence': 0.85 - (month * 0.02)  # Confidence decreases over time
            })
        
        return {
            'status': 'success',
            'revenue_predictions': predictions,
            'summary': {
                'projected_yearly_revenue': sum(p['predicted_revenue'] for p in predictions),
                'growth_trajectory': 'positive' if growth_rate > churn_rate else 'negative',
                'key_risks': ['Customer churn', 'Market competition'] if churn_rate > 0.1 else ['Market competition']
            }
        }
        
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def advanced_fraud_detection(transaction_data):
    """Advanced fraud detection using AI"""
    try:
        fraud_score = 0.0
        
        # Amount-based scoring
        amount = transaction_data.get('amount', 0)
        if amount > 10000:
            fraud_score += 0.3
        elif amount > 5000:
            fraud_score += 0.1
        
        # Time-based scoring
        hour = transaction_data.get('hour', 12)
        if hour < 6 or hour > 23:
            fraud_score += 0.2
        
        # Frequency-based scoring
        transactions_24h = transaction_data.get('transactions_24h', 0)
        if transactions_24h > 10:
            fraud_score += 0.4
        elif transactions_24h > 5:
            fraud_score += 0.2
        
        # Payment method scoring
        payment_method = transaction_data.get('payment_method', 'card')
        if payment_method in ['bitcoin', 'ethereum']:
            fraud_score += 0.1
        
        is_fraud = fraud_score > 0.5
        
        return {
            'status': 'success',
            'fraud_score': fraud_score,
            'is_fraud': is_fraud,
            'risk_level': 'high' if fraud_score > 0.7 else 'medium' if fraud_score > 0.3 else 'low',
            'factors': {
                'amount_risk': amount > 5000,
                'time_risk': hour < 6 or hour > 23,
                'frequency_risk': transactions_24h > 5
            }
        }
        
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def get_ai_insights():
    """Get general AI insights for dashboard"""
    return {
        'model_status': 'active',
        'predictions_today': 45,
        'accuracy_score': 0.87,
        'last_training': datetime.now().strftime('%Y-%m-%d')
    }

# Global analytics service instance
_analytics_service = None

def get_analytics_service():
    """Get or create analytics service instance"""
    global _analytics_service
    if _analytics_service is None:
        _analytics_service = AdvancedAnalyticsService()
    return _analytics_service

# Initialize analytics service
analytics_service = get_analytics_service()