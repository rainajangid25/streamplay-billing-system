"""
Flask application for AI services and machine learning endpoints
Provides REST API for customer analytics, churn prediction, and insights
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime, timedelta
import os
import json
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from io import BytesIO
import logging

# Import our services and models
from database import db, ma, Customer, Product, Subscription, Invoice, Transaction, SupportTicket
from database import customer_schema, customers_schema, subscription_schema, subscriptions_schema
from database import invoice_schema, invoices_schema, transaction_schema, transactions_schema
from ai_services import analytics_service, get_analytics_service
from communication_services import communication_service
from blockchain_services import blockchain_service
from services import BillingService, CustomerService, AnalyticsService
from database import DatabaseManager

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///billchain.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
ma.init_app(app)
CORS(app, origins="*")
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize scheduler for automation
scheduler = BackgroundScheduler()
scheduler.start()
atexit.register(lambda: scheduler.shutdown())

# Initialize services
analytics_service = get_analytics_service()
billing_service = BillingService()
customer_service = CustomerService()
analytics_service_basic = AnalyticsService()
db_manager = DatabaseManager()

# Create tables
with app.app_context():
    db.create_all()

# --- WebSocket Events ---
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('status', {'message': 'Connected to BillChain AI'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('get_real_time_metrics')
def handle_real_time_metrics():
    """Send real-time business metrics"""
    metrics = {
        'active_customers': Customer.query.filter_by(status='Active').count(),
        'monthly_revenue': float(db.session.query(db.func.sum(Invoice.total_amount))
                                .filter(Invoice.status == 'Paid')
                                .filter(Invoice.invoice_date >= datetime.utcnow() - timedelta(days=30))
                                .scalar() or 0),
        'pending_invoices': Invoice.query.filter_by(status='Pending').count(),
        'churn_risk_customers': Customer.query.filter_by(churn_risk_level='High').count()
    }
    emit('metrics_update', metrics)

# --- Enhanced API Endpoints ---

# Dashboard and Analytics
@app.route('/api/dashboard/overview', methods=['GET'])
def get_dashboard_overview():
    """Get comprehensive dashboard overview"""
    try:
        # Basic metrics
        total_customers = Customer.query.count()
        active_customers = Customer.query.filter_by(status='Active').count()
        total_revenue = float(db.session.query(db.func.sum(Invoice.total_amount))
                            .filter(Invoice.status == 'Paid').scalar() or 0)
        
        # AI insights
        high_churn_risk = Customer.query.filter_by(churn_risk_level='High').count()
        
        # Recent transactions
        recent_transactions = Transaction.query.order_by(Transaction.created_at.desc()).limit(10).all()
        
        # Blockchain metrics
        crypto_transactions = Transaction.query.filter(Transaction.blockchain_tx_hash.isnot(None)).count()
        crypto_volume = float(db.session.query(db.func.sum(Transaction.amount))
                            .filter(Transaction.blockchain_tx_hash.isnot(None)).scalar() or 0)
        
        overview = {
            'metrics': {
                'total_customers': total_customers,
                'active_customers': active_customers,
                'total_revenue': total_revenue,
                'high_churn_risk': high_churn_risk,
                'crypto_transactions': crypto_transactions,
                'crypto_volume': crypto_volume
            },
            'recent_transactions': transactions_schema.dump(recent_transactions),
            'ai_insights': ai_services.get_ai_insights() if hasattr(ai_services, 'get_ai_insights') else {},
            'generated_at': datetime.utcnow().isoformat()
        }
        
        return jsonify(overview), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'AI Services API'
    })

@app.route('/api/ai/train-churn-model', methods=['POST'])
def train_churn_model():
    """Train the churn prediction model"""
    try:
        # Get customer data from request or database
        data = request.get_json()
        
        if 'customer_data' in data:
            customer_data = data['customer_data']
        else:
            # Fetch from database
            customer_data = customer_service.get_all_customers()
        
        # Train the model
        result = analytics_service.train_churn_model(customer_data)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error training churn model: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/train-cltv-model', methods=['POST'])
def train_cltv_model():
    """Train the Customer Lifetime Value prediction model"""
    try:
        # Get customer data from request or database
        data = request.get_json()
        
        if 'customer_data' in data:
            customer_data = data['customer_data']
        else:
            # Fetch from database
            customer_data = customer_service.get_all_customers()
        
        # Train the model
        result = analytics_service.train_cltv_model(customer_data)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error training CLTV model: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/predict-churn', methods=['POST'])
def predict_churn():
    """Predict churn probability for a customer"""
    try:
        data = request.get_json()
        
        if 'customer_data' not in data:
            return jsonify({'error': 'customer_data is required'}), 400
        
        customer_data = data['customer_data']
        result = analytics_service.predict_churn(customer_data)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error predicting churn: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/predict-cltv', methods=['POST'])
def predict_cltv():
    """Predict Customer Lifetime Value"""
    try:
        data = request.get_json()
        
        if 'customer_data' not in data:
            return jsonify({'error': 'customer_data is required'}), 400
        
        customer_data = data['customer_data']
        result = analytics_service.predict_cltv(customer_data)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error predicting CLTV: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/customer-insights/<customer_id>', methods=['GET'])
def get_customer_insights(customer_id):
    """Get comprehensive insights for a specific customer"""
    try:
        # Get customer data from database
        customer_data = customer_service.get_customer_by_id(customer_id)
        
        if not customer_data:
            return jsonify({'error': 'Customer not found'}), 404
        
        # Get insights
        insights = analytics_service.get_customer_insights(customer_id, customer_data)
        
        return jsonify(insights)
        
    except Exception as e:
        logger.error(f"Error getting customer insights: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/customer-segments', methods=['GET'])
def analyze_customer_segments():
    """Analyze customer segments and provide insights"""
    try:
        # Get all customer data
        customer_data = customer_service.get_all_customers()
        
        # Analyze segments
        result = analytics_service.analyze_customer_segments(customer_data)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error analyzing customer segments: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/batch-insights', methods=['POST'])
def get_batch_insights():
    """Get insights for multiple customers"""
    try:
        data = request.get_json()
        
        if 'customer_ids' not in data:
            return jsonify({'error': 'customer_ids is required'}), 400
        
        customer_ids = data['customer_ids']
        insights = {}
        
        for customer_id in customer_ids:
            try:
                customer_data = customer_service.get_customer_by_id(customer_id)
                if customer_data:
                    customer_insights = analytics_service.get_customer_insights(customer_id, customer_data)
                    insights[customer_id] = customer_insights
                else:
                    insights[customer_id] = {'error': 'Customer not found'}
            except Exception as e:
                insights[customer_id] = {'error': str(e)}
        
        return jsonify(insights)
        
    except Exception as e:
        logger.error(f"Error getting batch insights: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/recommendations/<customer_id>', methods=['GET'])
def get_customer_recommendations(customer_id):
    """Get recommendations for a specific customer"""
    try:
        # Get customer data
        customer_data = customer_service.get_customer_by_id(customer_id)
        
        if not customer_data:
            return jsonify({'error': 'Customer not found'}), 404
        
        # Get churn and CLTV predictions
        churn_result = analytics_service.predict_churn(customer_data)
        cltv_result = analytics_service.predict_cltv(customer_data)
        
        # Generate recommendations
        recommendations = analytics_service.generate_recommendations(
            customer_data, churn_result, cltv_result
        )
        
        return jsonify({
            'customer_id': customer_id,
            'recommendations': recommendations,
            'generated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/health-score/<customer_id>', methods=['GET'])
def get_customer_health_score(customer_id):
    """Get health score for a specific customer"""
    try:
        # Get customer data
        customer_data = customer_service.get_customer_by_id(customer_id)
        
        if not customer_data:
            return jsonify({'error': 'Customer not found'}), 404
        
        # Calculate health score
        health_score = analytics_service.calculate_health_score(customer_data)
        
        return jsonify({
            'customer_id': customer_id,
            'health_score': health_score,
            'calculated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error calculating health score: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/dashboard', methods=['GET'])
def get_analytics_dashboard():
    """Get analytics dashboard data"""
    try:
        dashboard_data = analytics_service_basic.get_dashboard_metrics()
        return jsonify(dashboard_data)
        
    except Exception as e:
        logger.error(f"Error getting dashboard data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/billing/process-payment', methods=['POST'])
def process_payment():
    """Process a payment"""
    try:
        data = request.get_json()
        result = billing_service.process_payment(data)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error processing payment: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Get customers with advanced filtering and AI insights"""
    try:
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        search = request.args.get('search', '')
        churn_risk = request.args.get('churn_risk', '')
        segment = request.args.get('segment', '')
        
        # Build query
        query = Customer.query
        
        if search:
            query = query.filter(
                db.or_(
                    Customer.name.contains(search),
                    Customer.email.contains(search),
                    Customer.customer_code.contains(search)
                )
            )
        
        if churn_risk:
            query = query.filter(Customer.churn_risk_level == churn_risk)
        
        # Paginate results
        customers_paginated = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Add AI insights for each customer
        customers_data = customers_schema.dump(customers_paginated.items)
        for customer_data in customers_data:
            # Add AI-generated insights
            customer_data['ai_insights'] = {
                'ltv_prediction': ai_services.predict_customer_lifetime_value(customer_data),
                'churn_analysis': ai_services.advanced_churn_prediction(customer_data),
                'next_best_action': _get_next_best_action(customer_data)
            }
        
        return jsonify({
            'customers': customers_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': customers_paginated.total,
                'pages': customers_paginated.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers/<customer_id>', methods=['GET'])
def get_customer(customer_id):
    """Get a specific customer"""
    try:
        customer = customer_service.get_customer_by_id(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        return jsonify(customer)
        
    except Exception as e:
        logger.error(f"Error getting customer: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/models/status', methods=['GET'])
def get_models_status():
    """Get status of trained models"""
    try:
        status = {
            'churn_model': analytics_service.churn_model is not None,
            'cltv_model': analytics_service.cltv_model is not None,
            'scaler': analytics_service.scaler is not None,
            'models_directory': analytics_service.models_dir,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Error getting models status: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers', methods=['POST'])
def create_customer():
    """Create new customer with AI-powered onboarding"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create customer
        customer = Customer(
            tenant_id=data.get('tenant_id', 'default'),
            customer_code=f"CUST-{datetime.utcnow().strftime('%Y%m%d')}-{Customer.query.count() + 1:04d}",
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address'),
            country=data.get('country'),
            company_name=data.get('company_name'),
            industry=data.get('industry'),
            account_type=data.get('account_type', 'Individual'),
            preferred_currency=data.get('preferred_currency', 'USD'),
            communication_preferences=json.dumps(data.get('communication_preferences', {}))
        )
        
        db.session.add(customer)
        db.session.flush()  # Get customer ID
        
        # AI-powered customer analysis
        customer_data = customer_schema.dump(customer)
        ai_analysis = ai_services.advanced_churn_prediction(customer_data)
        
        customer.churn_risk_score = ai_analysis.get('churn_probability', 0.0)
        customer.churn_risk_level = ai_analysis.get('risk_level', 'Low')
        
        # Generate blockchain wallets if requested
        if data.get('enable_crypto_payments', False):
            for network in ['bitcoin', 'ethereum', 'usdc']:
                wallet_result = blockchain_service.generate_wallet_address(network, customer.id)
                if wallet_result['status'] == 'success':
                    print(f"Generated {network} wallet for customer {customer.id}")
        
        db.session.commit()
        
        # Send welcome communication
        if data.get('send_welcome_email', True):
            communication_service.send_email(
                customer.email,
                'Welcome to BillChain AI',
                f'Welcome {customer.name}! Your account has been created successfully.',
                template_name='welcome',
                template_data={
                    'customer_name': customer.name,
                    'plan_name': data.get('initial_plan', 'Basic'),
                    'next_billing_date': (datetime.utcnow() + timedelta(days=30)).strftime('%Y-%m-%d')
                }
            )
        
        return jsonify({
            'customer': customer_schema.dump(customer),
            'ai_analysis': ai_analysis,
            'message': 'Customer created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Advanced AI/ML Endpoints
@app.route('/api/ai/customer-segmentation', methods=['POST'])
def perform_customer_segmentation():
    """Perform AI-powered customer segmentation"""
    try:
        customers = Customer.query.all()
        customers_data = customers_schema.dump(customers)
        
        segmentation_result = ai_services.customer_segmentation(customers_data)
        
        return jsonify({
            'status': 'success',
            'segmentation': segmentation_result,
            'total_customers': len(customers_data),
            'generated_at': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/pricing-optimization', methods=['POST'])
def optimize_pricing():
    """AI-powered pricing optimization"""
    try:
        data = request.get_json()
        customer_id = data.get('customer_id')
        product_id = data.get('product_id')
        
        customer = Customer.query.get(customer_id)
        product = Product.query.get(product_id)
        
        if not customer or not product:
            return jsonify({'error': 'Customer or product not found'}), 404
        
        customer_data = customer_schema.dump(customer)
        product_data = {
            'base_price': float(product.base_price),
            'name': product.name,
            'category': product.category
        }
        
        pricing_result = ai_services.intelligent_pricing_optimization(
            customer_data, product_data, data.get('market_data', {})
        )
        
        return jsonify({
            'status': 'success',
            'pricing_optimization': pricing_result,
            'customer_id': customer_id,
            'product_id': product_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/predictive-analytics', methods=['GET'])
def get_predictive_analytics():
    """Get comprehensive predictive analytics"""
    try:
        # Gather business data
        business_data = {
            'current_monthly_revenue': float(db.session.query(db.func.sum(Invoice.total_amount))
                                           .filter(Invoice.status == 'Paid')
                                           .filter(Invoice.invoice_date >= datetime.utcnow() - timedelta(days=30))
                                           .scalar() or 0),
            'current_churn_rate': Customer.query.filter_by(churn_risk_level='High').count() / max(Customer.query.count(), 1),
            'growth_rate': 0.05,  # This would be calculated from historical data
            'customer_concentration': 0.25,  # Top 10% of customers' revenue share
            'market_growth_rate': 0.08,
            'competitive_intensity': 0.6
        }
        
        analytics = ai_services.predictive_analytics_dashboard(business_data)
        
        return jsonify({
            'status': 'success',
            'analytics': analytics,
            'business_data': business_data,
            'generated_at': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Enhanced Blockchain Endpoints
@app.route('/api/blockchain/wallets', methods=['POST'])
def create_blockchain_wallet():
    """Create blockchain wallet for customer"""
    try:
        data = request.get_json()
        customer_id = data.get('customer_id')
        network = data.get('network')
        
        if not customer_id or not network:
            return jsonify({'error': 'Missing customer_id or network'}), 400
        
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        wallet_result = blockchain_service.generate_wallet_address(network, customer_id)
        
        return jsonify(wallet_result), 200 if wallet_result['status'] == 'success' else 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/blockchain/payments', methods=['POST'])
def process_crypto_payment():
    """Process cryptocurrency payment"""
    try:
        data = request.get_json()
        
        required_fields = ['customer_id', 'invoice_id', 'amount_usd', 'network', 'sender_address', 'receiver_address']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Fraud detection
        fraud_analysis = ai_services.advanced_fraud_detection({
            'amount': data['amount_usd'],
            'customer_id': data['customer_id'],
            'payment_method': data['network'],
            'hour': datetime.utcnow().hour,
            'transactions_24h': Transaction.query.filter(
                Transaction.customer_id == data['customer_id'],
                Transaction.created_at >= datetime.utcnow() - timedelta(hours=24)
            ).count()
        })
        
        if fraud_analysis.get('is_fraud', False):
            return jsonify({
                'status': 'blocked',
                'reason': 'Transaction blocked due to fraud detection',
                'fraud_analysis': fraud_analysis
            }), 403
        
        # Process payment
        payment_result = blockchain_service.process_crypto_payment(
            data['customer_id'],
            data['invoice_id'],
            data['amount_usd'],
            data['network'],
            data['sender_address'],
            data['receiver_address']
        )
        
        # Real-time notification
        if payment_result['status'] == 'success':
            socketio.emit('payment_processed', {
                'customer_id': data['customer_id'],
                'amount': data['amount_usd'],
                'network': data['network'],
                'tx_hash': payment_result.get('tx_hash')
            })
        
        return jsonify(payment_result), 200 if payment_result['status'] == 'success' else 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/blockchain/defi-opportunities', methods=['GET'])
def get_defi_opportunities():
    """Get DeFi yield farming opportunities"""
    try:
        customer_id = request.args.get('customer_id')
        
        # Sample portfolio balance (in real app, this would come from blockchain APIs)
        portfolio_balance = {
            'USDC': 10000,
            'ETH': 5,
            'BTC': 0.5,
            'MATIC': 1000
        }
        
        opportunities = blockchain_service.get_defi_opportunities(customer_id, portfolio_balance)
        
        return jsonify(opportunities), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/blockchain/smart-contracts', methods=['POST'])
def create_smart_contract():
    """Create and deploy smart contract"""
    try:
        data = request.get_json()
        contract_type = data.get('contract_type')
        parameters = data.get('parameters', {})
        
        if not contract_type:
            return jsonify({'error': 'Missing contract_type'}), 400
        
        contract_result = blockchain_service.create_smart_contract(contract_type, parameters)
        
        return jsonify(contract_result), 200 if contract_result['status'] == 'success' else 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Enhanced Communication Endpoints
@app.route('/api/communications/campaigns', methods=['POST'])
def create_campaign():
    """Create automated marketing campaign"""
    try:
        data = request.get_json()
        
        # Create campaign in database (simplified)
        campaign_data = {
            'name': data.get('name'),
            'campaign_type': data.get('campaign_type'),
            'target_criteria': json.dumps(data.get('target_criteria', {})),
            'subject_template': data.get('subject_template'),
            'content_template': data.get('content_template'),
            'channel': data.get('channel', 'email')
        }
        
        # Execute campaign
        campaign_result = communication_service.send_automated_campaign(
            'temp_campaign_id',  # In real app, this would be the saved campaign ID
            data.get('customer_ids')
        )
        
        return jsonify(campaign_result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/communications/reports', methods=['POST'])
def generate_report():
    """Generate analytics report with visualizations"""
    try:
        data = request.get_json()
        report_type = data.get('report_type', 'revenue')
        date_range = data.get('date_range', {})
        customer_id = data.get('customer_id')
        
        report_result = communication_service.generate_analytics_report(
            report_type, date_range, customer_id
        )
        
        return jsonify(report_result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/invoices/<invoice_id>/pdf', methods=['GET'])
def download_invoice_pdf(invoice_id):
    """Download invoice as PDF"""
    try:
        pdf_data = communication_service.generate_invoice_pdf(invoice_id)
        
        if pdf_data:
            return send_file(
                BytesIO(pdf_data),
                mimetype='application/pdf',
                as_attachment=True,
                download_name=f'invoice_{invoice_id}.pdf'
            )
        else:
            return jsonify({'error': 'Invoice not found or PDF generation failed'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Automation Endpoints
@app.route('/api/automation/invoice-generation', methods=['POST'])
def trigger_invoice_automation():
    """Trigger automated invoice generation"""
    try:
        result = _automate_invoice_generation()
        
        # Real-time notification
        socketio.emit('automation_completed', {
            'type': 'invoice_generation',
            'result': result
        })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/automation/churn-prevention', methods=['POST'])
def trigger_churn_prevention():
    """Trigger automated churn prevention campaigns"""
    try:
        # Find high-risk customers
        high_risk_customers = Customer.query.filter_by(churn_risk_level='High').all()
        
        results = []
        for customer in high_risk_customers:
            # Send personalized retention email
            email_result = communication_service.send_email(
                customer.email,
                'We miss you! Special offer inside',
                'retention campaign content',
                template_name='churn_prevention',
                template_data={
                    'customer_name': customer.name,
                    'offer_details': '20% discount on next billing cycle',
                    'offer_link': f'https://app.billchain.ai/offers/{customer.id}'
                }
            )
            
            results.append({
                'customer_id': customer.id,
                'email_status': email_result['status']
            })
        
        return jsonify({
            'status': 'success',
            'campaigns_sent': len(results),
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Scheduled Tasks
def _automate_invoice_generation():
    """Automated invoice generation for subscriptions"""
    try:
        with app.app_context():
            # Find subscriptions due for billing
            due_subscriptions = Subscription.query.filter(
                Subscription.status == 'Active',
                Subscription.auto_renew == True,
                Subscription.next_billing_date <= datetime.utcnow() + timedelta(days=5)
            ).all()
            
            generated_count = 0
            for subscription in due_subscriptions:
                # Check if invoice already exists for this billing cycle
                existing_invoice = Invoice.query.filter(
                    Invoice.customer_id == subscription.customer_id,
                    Invoice.status.in_(['Draft', 'Sent', 'Pending']),
                    Invoice.invoice_date >= subscription.next_billing_date - timedelta(days=5)
                ).first()
                
                if not existing_invoice:
                    # Generate invoice
                    invoice = Invoice(
                        customer_id=subscription.customer_id,
                        invoice_number=f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{Invoice.query.count() + 1:04d}",
                        subtotal=subscription.amount,
                        total_amount=subscription.amount,
                        due_date=subscription.next_billing_date + timedelta(days=7),
                        ai_generated=True,
                        auto_sent=True
                    )
                    
                    db.session.add(invoice)
                    
                    # Update subscription next billing date
                    if subscription.billing_cycle == 'monthly':
                        subscription.next_billing_date = subscription.next_billing_date + timedelta(days=30)
                    elif subscription.billing_cycle == 'yearly':
                        subscription.next_billing_date = subscription.next_billing_date + timedelta(days=365)
                    
                    generated_count += 1
            
            db.session.commit()
            
            return {
                'status': 'success',
                'invoices_generated': generated_count,
                'processed_at': datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        db.session.rollback()
        return {'status': 'error', 'message': str(e)}

def _update_customer_ai_scores():
    """Update AI scores for all customers"""
    try:
        with app.app_context():
            customers = Customer.query.all()
            
            for customer in customers:
                customer_data = customer_schema.dump(customer)
                
                # Update churn prediction
                churn_analysis = ai_services.advanced_churn_prediction(customer_data)
                customer.churn_risk_score = churn_analysis.get('churn_probability', 0.0)
                customer.churn_risk_level = churn_analysis.get('risk_level', 'Low')
                
                # Update lifetime value
                ltv_analysis = ai_services.predict_customer_lifetime_value(customer_data)
                customer.lifetime_value = ltv_analysis.get('predicted_ltv', 0.0)
            
            db.session.commit()
            print(f"Updated AI scores for {len(customers)} customers")
            
    except Exception as e:
        print(f"Error updating AI scores: {e}")

# Helper functions
def _get_next_best_action(customer_data):
    """Determine next best action for customer"""
    churn_risk = customer_data.get('churn_risk_level', 'Low')
    total_revenue = customer_data.get('total_revenue', 0)
    
    if churn_risk == 'High':
        return 'Send retention offer'
    elif total_revenue > 5000:
        return 'Upsell to premium plan'
    elif customer_data.get('last_activity_days_ago', 0) > 30:
        return 'Re-engagement campaign'
    else:
        return 'Continue monitoring'

# Schedule automated tasks
scheduler.add_job(
    func=_automate_invoice_generation,
    trigger="cron",
    hour=9,  # Run daily at 9 AM
    minute=0,
    id='invoice_generation'
)

scheduler.add_job(
    func=_update_customer_ai_scores,
    trigger="cron",
    hour=2,  # Run daily at 2 AM
    minute=0,
    id='ai_score_update'
)

# Root endpoint
@app.route('/')
def home():
    return jsonify({
        'message': 'BillChain AI - Next-Generation Billing Platform',
        'version': '2.0.0',
        'features': [
            'AI-Powered Customer Analytics',
            'Blockchain Payment Processing',
            'Automated Billing & Invoicing',
            'Advanced Fraud Detection',
            'DeFi Integration',
            'Smart Contract Automation',
            'Predictive Analytics',
            'Real-time Communication'
        ],
        'endpoints': {
            'dashboard': '/api/dashboard/overview',
            'customers': '/api/customers',
            'ai_analytics': '/api/ai/predictive-analytics',
            'blockchain': '/api/blockchain/payments',
            'automation': '/api/automation/invoice-generation'
        }
    })

if __name__ == '__main__':
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # For development
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
