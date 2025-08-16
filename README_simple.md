# BillChain AI - Billing Platform

AI-Powered Billing System with Blockchain Integration

## Features
- AI-Powered Customer Analytics (Churn Prediction, CLTV)
- Blockchain Payment Processing
- Automated Billing & Invoicing
- Real-time Dashboard
- WebSocket Support

## Quick Start

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python run_app.py
```

3. Visit: http://localhost:5000

## API Endpoints

- GET /health - Health check
- GET /api/dashboard/overview - Dashboard data
- GET /api/customers - List customers
- POST /api/customers - Create customer
- POST /api/ai/train-churn-model - Train AI model
- POST /api/blockchain/wallets - Generate crypto wallet

## Testing

```bash
python test_ai_services.py
python test_api_endpoints.py
```

Built with Flask, SQLAlchemy, Scikit-learn, and WebSockets.
