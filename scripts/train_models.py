import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report
import joblib
import os

# Ensure models directory exists
MODELS_DIR = 'models'
os.makedirs(MODELS_DIR, exist_ok=True)

def train_revenue_prediction_model():
    """
    Trains a simple linear regression model for revenue prediction.
    Features: month_number, marketing_spend, customer_count
    Target: revenue
    """
    print("Training Revenue Prediction Model...")
    # Simulate historical data
    np.random.seed(42)
    months = np.arange(1, 101) # 100 months of data
    marketing_spend = np.random.rand(100) * 10000 + 5000 # $5k - $15k
    customer_count = np.random.randint(1000, 10000, 100)
    
    # Revenue is influenced by marketing spend and customer count, plus some noise
    revenue = 50 * marketing_spend + 2 * customer_count + np.random.randn(100) * 5000 + 100000
    
    df = pd.DataFrame({
        'month_number': months,
        'marketing_spend': marketing_spend,
        'customer_count': customer_count,
        'revenue': revenue
    })
    
    X = df[['month_number', 'marketing_spend', 'customer_count']]
    y = df['revenue']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    print(f"Revenue Model RMSE: {rmse:.2f}")
    
    joblib.dump(model, os.path.join(MODELS_DIR, 'revenue_model.pkl'))
    print("Revenue Prediction Model trained and saved.")

def train_churn_prediction_model(data_path='data/customer_data.csv'):
    """
    Trains a churn prediction model using RandomForestClassifier.
    Assumes 'churn' is the target variable (1 for churn, 0 for no churn).
    """
    print(f"Training churn prediction model with data from {data_path}...")
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: {data_path} not found. Please ensure the data file exists.")
        return

    # --- Feature Engineering (Example) ---
    # Convert categorical features to numerical using one-hot encoding
    df = pd.get_dummies(df, columns=['gender', 'contract_type'], drop_first=True)

    # Define features (X) and target (y)
    # Exclude non-numeric or target columns
    X = df.drop(columns=['customer_id', 'churn', 'signup_date', 'last_login_date'])
    y = df['churn']

    # Handle missing values (simple imputation for demonstration)
    for col in X.columns:
        if X[col].dtype == 'object': # Handle any remaining categorical columns
            X = pd.get_dummies(X, columns=[col], drop_first=True)
        else: # Impute numerical columns with mean
            X[col] = X[col].fillna(X[col].mean())

    # Align columns after one-hot encoding (important if data_path changes)
    # This is a simplified approach; in production, use a robust pipeline (e.g., sklearn.pipeline)
    # For now, we'll just ensure X has no object columns left
    X = X.select_dtypes(include=['number', 'bool'])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Churn Prediction Model Accuracy: {accuracy:.2f}")

    model_path = os.path.join(MODELS_DIR, 'churn_prediction_model.joblib')
    joblib.dump(model, model_path)
    print(f"Churn prediction model saved to {model_path}")

def train_fraud_detection_model():
    """
    Trains a simple logistic regression model for fraud detection.
    Features: amount, transaction_frequency_24h, ip_country_match, time_of_day_hour
    Target: is_fraud (binary: 0=not fraud, 1=fraud)
    """
    print("Training Fraud Detection Model...")
    np.random.seed(42)
    num_transactions = 5000
    
    amount = np.random.rand(num_transactions) * 1000 + 10 # $10 - $1010
    transaction_frequency_24h = np.random.randint(1, 20, num_transactions)
    ip_country_match = np.random.choice([0, 1], size=num_transactions, p=[0.05, 0.95]) # 5% mismatch
    time_of_day_hour = np.random.randint(0, 24, num_transactions)
    
    # Simulate fraud (e.g., high amount, high frequency, IP mismatch, unusual hours)
    is_fraud = ((amount > 800) * 0.3 +
                (transaction_frequency_24h > 15) * 0.4 +
                (ip_country_match == 0) * 0.5 +
                ((time_of_day_hour < 6) | (time_of_day_hour > 22)) * 0.2 +
                np.random.rand(num_transactions) * 0.5 > 0.9).astype(int)
    
    df = pd.DataFrame({
        'amount': amount,
        'transaction_frequency_24h': transaction_frequency_24h,
        'ip_country_match': ip_country_match,
        'time_of_day_hour': time_of_day_hour,
        'is_fraud': is_fraud
    })
    
    X = df[['amount', 'transaction_frequency_24h', 'ip_country_match', 'time_of_day_hour']]
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = LogisticRegression(random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Fraud Model Accuracy: {accuracy:.2f}")
    print("Fraud Model Classification Report:\n", classification_report(y_test, y_pred))
    
    model_path = os.path.join(MODELS_DIR, 'fraud_model.pkl')
    joblib.dump(model, model_path)
    print(f"Fraud Detection Model trained and saved.")

def train_dynamic_pricing_model():
    """
    Placeholder for dynamic pricing model training.
    """
    print("Dynamic pricing logic placeholder ready.")

def train_cltv_prediction_model(data_path='data/customer_data.csv'):
    """
    Trains a Customer Lifetime Value (CLTV) prediction model using RandomForestRegressor.
    Assumes 'cltv' is the target variable.
    """
    print(f"Training CLTV prediction model with data from {data_path}...")
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: {data_path} not found. Please ensure the data file exists.")
        return

    # --- Feature Engineering (Example) ---
    df['subscription_duration'] = (pd.to_datetime('today') - pd.to_datetime(df['signup_date'])).dt.days
    df['activity_frequency'] = df['login_count'] / df['subscription_duration'] # Example feature

    df = pd.get_dummies(df, columns=['gender', 'contract_type'], drop_first=True)

    X = df.drop(columns=['customer_id', 'cltv', 'signup_date', 'last_login_date'])
    y = df['cltv']

    # Handle missing values
    for col in X.columns:
        if X[col].dtype == 'object':
            X = pd.get_dummies(X, columns=[col], drop_first=True)
        else:
            X[col] = X[col].fillna(X[col].mean())

    X = X.select_dtypes(include=['number', 'bool'])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse = mean_squared_error(y_test, y_pred, squared=False) # RMSE
    print(f"CLTV Prediction Model RMSE: {rmse:.2f}")

    model_path = os.path.join(MODELS_DIR, 'cltv_prediction_model.joblib')
    joblib.dump(model, model_path)
    print(f"CLTV prediction model saved to {model_path}")

def train_sentiment_analysis_model(data_path='data/customer_feedback.csv'):
    """
    Trains a simple sentiment analysis model (example using text features).
    In a real scenario, this would involve more advanced NLP techniques (e.g., TF-IDF, Word2Vec, deep learning).
    Assumes 'sentiment' is the target variable (e.g., 'positive', 'negative', 'neutral').
    """
    print(f"Training sentiment analysis model with data from {data_path}...")
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: {data_path} not found. Please ensure the data file exists.")
        return

    # For simplicity, let's assume 'feedback_text' is pre-processed into numerical features
    # In a real application, you'd use a TfidfVectorizer or similar.
    # Here, we'll just create dummy numerical features from text length.
    df['text_length'] = df['feedback_text'].apply(len)

    X = df[['text_length']] # Simple numerical feature
    y = df['sentiment']

    # Convert sentiment labels to numerical if they are strings
    if y.dtype == 'object':
        y = y.astype('category').cat.codes

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Sentiment Analysis Model Accuracy: {accuracy:.2f}")

    model_path = os.path.join(MODELS_DIR, 'sentiment_analysis_model.joblib')
    joblib.dump(model, model_path)
    print(f"Sentiment analysis model saved to {model_path}")

if __name__ == "__main__":
    # Create dummy data files for demonstration if they don't exist
    if not os.path.exists('data'):
        os.makedirs('data')

    if not os.path.exists('data/customer_data.csv'):
        print("Creating dummy customer_data.csv...")
        dummy_customer_data = {
            'customer_id': [f'CUST{i:03d}' for i in range(1, 101)],
            'age': [25 + i % 40 for i in range(100)],
            'gender': ['Male' if i % 2 == 0 else 'Female' for i in range(100)],
            'monthly_charges': [50.0 + i * 1.5 for i in range(100)],
            'total_charges': [100.0 + i * 10.0 for i in range(100)],
            'contract_type': ['Month-to-month' if i % 3 == 0 else ('One year' if i % 3 == 1 else 'Two year') for i in range(100)],
            'churn': [1 if i % 10 == 0 else 0 for i in range(100)], # 10% churn rate
            'cltv': [500 + i * 20 for i in range(100)], # Dummy CLTV
            'signup_date': pd.to_datetime(['2022-01-01'] * 100) + pd.to_timedelta(range(100), unit='D'),
            'last_login_date': pd.to_datetime(['2023-01-01'] * 100) + pd.to_timedelta(range(100), unit='D'),
            'login_count': [10 + i % 50 for i in range(100)],
        }
        pd.DataFrame(dummy_customer_data).to_csv('data/customer_data.csv', index=False)

    if not os.path.exists('data/customer_feedback.csv'):
        print("Creating dummy customer_feedback.csv...")
        dummy_feedback_data = {
            'feedback_id': [f'FB{i:03d}' for i in range(1, 51)],
            'customer_id': [f'CUST{i:03d}' for i in range(1, 51)],
            'feedback_text': [
                "Great service, very happy!",
                "Connectivity issues, quite frustrating.",
                "Neutral experience, nothing special.",
                "Excellent support, quick resolution.",
                "Billing is confusing, need clarity.",
                "Love the new features!",
                "Slow internet speeds.",
                "Satisfied with the overall experience.",
                "Customer service was rude.",
                "Smooth onboarding process.",
                # Add more diverse feedback
                "The app crashes frequently.", "Very intuitive interface.", "Pricing is a bit high.",
                "Reliable service, no complaints.", "Had trouble setting up, but got help.",
                "Fantastic value for money.", "Disappointed with the recent update.",
                "It just works, simple and effective.", "Long wait times for support.",
                "Impressed with the performance.", "Not worth the cost.", "User-friendly design.",
                "Frequent disconnections.", "Good, but could be better.", "Responsive team.",
                "Buggy software.", "Seamless integration.", "Overpriced for the features.",
                "Solid product, highly recommend.", "Confusing documentation.", "Fast and efficient.",
                "Lack of features.", "Very good product.", "Constant buffering.",
                "Decent service."
            ][:50],
            'sentiment': [
                'positive', 'negative', 'neutral', 'positive', 'negative',
                'positive', 'negative', 'positive', 'negative', 'positive',
                'negative', 'positive', 'negative', 'positive', 'neutral',
                'positive', 'negative', 'positive', 'negative', 'positive',
                'negative', 'positive', 'negative', 'neutral', 'positive',
                'negative', 'positive', 'negative', 'positive', 'negative',
                'positive', 'negative', 'positive', 'negative', 'neutral',
                'positive', 'negative', 'positive', 'negative', 'positive',
                'negative', 'positive', 'negative', 'positive', 'negative',
                'positive', 'negative', 'positive', 'negative', 'neutral'
            ][:50]
        }
        pd.DataFrame(dummy_feedback_data).to_csv('data/customer_feedback.csv', index=False)

    train_revenue_prediction_model()
    train_churn_prediction_model()
    train_cltv_prediction_model()
    train_sentiment_analysis_model()
    train_dynamic_pricing_model()
    print("All models trained and saved successfully.")
