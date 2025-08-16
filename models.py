import joblib
import os
import pandas as pd

class MLModels:
    def __init__(self):
        self.churn_model = self._load_model('models/churn_prediction_model.joblib')
        self.cltv_model = self._load_model('models/cltv_prediction_model.joblib')
        self.sentiment_model = self._load_model('models/sentiment_analysis_model.joblib')

    def _load_model(self, path):
        if os.path.exists(path):
            print(f"Loading model from {path}...")
            return joblib.load(path)
        else:
            print(f"Warning: Model not found at {path}. Please run scripts/train_models.py first.")
            return None

    def predict_churn(self, customer_features: pd.DataFrame):
        """Predicts churn probability for a given customer."""
        if self.churn_model:
            # Ensure features match training data (simplified for example)
            # In a real system, you'd need robust feature alignment/preprocessing
            # For dummy data, ensure 'gender_Male' and 'contract_type_One year', 'contract_type_Two year' exist
            # and handle missing columns by adding them with 0
            expected_features = ['age', 'monthly_charges', 'total_charges', 'login_count',
                                 'gender_Male', 'contract_type_One year', 'contract_type_Two year']
            for col in expected_features:
                if col not in customer_features.columns:
                    customer_features[col] = 0
            customer_features = customer_features[expected_features] # Ensure order and presence
            return self.churn_model.predict_proba(customer_features)[:, 1][0] # Probability of churn
        return None

    def predict_cltv(self, customer_features: pd.DataFrame):
        """Predicts Customer Lifetime Value."""
        if self.cltv_model:
            # Ensure features match training data
            expected_features = ['age', 'monthly_charges', 'total_charges', 'subscription_duration',
                                 'activity_frequency', 'gender_Male', 'contract_type_One year', 'contract_type_Two year']
            for col in expected_features:
                if col not in customer_features.columns:
                    customer_features[col] = 0
            customer_features = customer_features[expected_features]
            return self.cltv_model.predict(customer_features)[0]
        return None

    def analyze_sentiment(self, feedback_text: str):
        """Analyzes sentiment of feedback text."""
        if self.sentiment_model:
            # Simple feature extraction for demonstration: text length
            features = pd.DataFrame({'text_length': [len(feedback_text)]})
            sentiment_code = self.sentiment_model.predict(features)[0]
            # Map numerical code back to sentiment label (assuming 0: negative, 1: neutral, 2: positive)
            # This mapping depends on how sentiment was encoded during training
            sentiment_map = {0: 'negative', 1: 'neutral', 2: 'positive'}
            return sentiment_map.get(sentiment_code, 'unknown')
        return None

# Example Usage (for testing purposes)
if __name__ == "__main__":
    # This part is for local testing and won't run in the Vercel environment directly
    # You would typically call these functions from your services.py or app.py
    ml_models = MLModels()

    # Dummy customer features for prediction
    # These features should align with what the model was trained on
    dummy_customer_data = {
        'age': 30,
        'gender': 'Female',
        'monthly_charges': 75.0,
        'total_charges': 800.0,
        'contract_type': 'One year',
        'signup_date': '2022-06-01',
        'last_login_date': '2024-01-20',
        'login_count': 30
    }
    df_customer = pd.DataFrame([dummy_customer_data])

    # Preprocess dummy_customer_data to match model's expected input
    df_customer['subscription_duration'] = (pd.to_datetime('today') - pd.to_datetime(df_customer['signup_date'])).dt.days
    df_customer['activity_frequency'] = df_customer['login_count'] / df_customer['subscription_duration']
    df_customer = pd.get_dummies(df_customer, columns=['gender', 'contract_type'], drop_first=True)


    # Predict churn
    churn_prob = ml_models.predict_churn(df_customer.copy()) # Use .copy() to avoid SettingWithCopyWarning
    if churn_prob is not None:
        print(f"Churn Probability: {churn_prob:.2f}")

    # Predict CLTV
    cltv_value = ml_models.predict_cltv(df_customer.copy())
    if cltv_value is not None:
        print(f"Predicted CLTV: ${cltv_value:.2f}")

    # Analyze sentiment
    feedback = "The service was excellent and very responsive!"
    sentiment = ml_models.analyze_sentiment(feedback)
    if sentiment is not None:
        print(f"Sentiment for '{feedback}': {sentiment}")

    feedback_negative = "Very bad experience, slow and unhelpful."
    sentiment_negative = ml_models.analyze_sentiment(feedback_negative)
    if sentiment_negative is not None:
        print(f"Sentiment for '{feedback_negative}': {sentiment_negative}")
