"""
Database models and schemas for the BillChain AI billing system
"""

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime
import json

# Initialize extensions
db = SQLAlchemy()
ma = Marshmallow()

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.String(100), nullable=False, default='default')
    customer_code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50))
    address = db.Column(db.Text)
    country = db.Column(db.String(100))
    company_name = db.Column(db.String(200))
    industry = db.Column(db.String(100))
    account_type = db.Column(db.String(50), default='Individual')
    status = db.Column(db.String(50), default='Active')
    preferred_currency = db.Column(db.String(10), default='USD')
    communication_preferences = db.Column(db.Text)
    
    # AI-generated fields
    churn_risk_score = db.Column(db.Float, default=0.0)
    churn_risk_level = db.Column(db.String(20), default='Low')
    lifetime_value = db.Column(db.Float, default=0.0)
    customer_segment = db.Column(db.String(50))
    
    # Blockchain fields
    crypto_wallets = db.Column(db.Text)  # JSON string of wallet addresses
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subscriptions = db.relationship('Subscription', backref='customer', lazy=True)
    invoices = db.relationship('Invoice', backref='customer', lazy=True)
    transactions = db.relationship('Transaction', backref='customer', lazy=True)
    support_tickets = db.relationship('SupportTicket', backref='customer', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    base_price = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), default='USD')
    billing_cycle = db.Column(db.String(20), default='monthly')  # monthly, yearly, one-time
    features = db.Column(db.Text)  # JSON string
    is_active = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    status = db.Column(db.String(50), default='Active')  # Active, Paused, Cancelled
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), default='USD')
    billing_cycle = db.Column(db.String(20), default='monthly')
    
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    next_billing_date = db.Column(db.DateTime)
    auto_renew = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    product = db.relationship('Product', backref='subscriptions')

class Invoice(db.Model):
    __tablename__ = 'invoices'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    
    status = db.Column(db.String(50), default='Draft')  # Draft, Sent, Pending, Paid, Overdue, Cancelled
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    tax_amount = db.Column(db.Numeric(10, 2), default=0)
    discount_amount = db.Column(db.Numeric(10, 2), default=0)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), default='USD')
    
    invoice_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    paid_date = db.Column(db.DateTime)
    
    # AI and automation fields
    ai_generated = db.Column(db.Boolean, default=False)
    auto_sent = db.Column(db.Boolean, default=False)
    
    notes = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoices.id'))
    
    transaction_type = db.Column(db.String(50), nullable=False)  # payment, refund, chargeback
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), default='USD')
    status = db.Column(db.String(50), default='Pending')  # Pending, Completed, Failed, Cancelled
    
    payment_method = db.Column(db.String(50))  # card, bank_transfer, crypto, etc.
    payment_gateway = db.Column(db.String(50))
    gateway_transaction_id = db.Column(db.String(200))
    
    # Blockchain fields
    blockchain_network = db.Column(db.String(50))
    blockchain_tx_hash = db.Column(db.String(200))
    sender_address = db.Column(db.String(200))
    receiver_address = db.Column(db.String(200))
    
    # AI fraud detection
    fraud_score = db.Column(db.Float, default=0.0)
    fraud_status = db.Column(db.String(20), default='clean')  # clean, suspicious, blocked
    
    transaction_metadata = db.Column(db.Text)  # JSON string for additional data
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    invoice = db.relationship('Invoice', backref='transactions')

class SupportTicket(db.Model):
    __tablename__ = 'support_tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    
    ticket_number = db.Column(db.String(50), unique=True, nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='Open')  # Open, In Progress, Resolved, Closed
    priority = db.Column(db.String(20), default='Medium')  # Low, Medium, High, Critical
    
    assigned_to = db.Column(db.String(100))
    tags = db.Column(db.Text)  # JSON string
    
    # AI fields
    sentiment_score = db.Column(db.Float)
    category = db.Column(db.String(100))
    auto_response_sent = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)

# Marshmallow Schemas
class CustomerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Customer
        load_instance = True

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True

class SubscriptionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Subscription
        load_instance = True
    
    customer = ma.Nested(CustomerSchema, exclude=['subscriptions'])
    product = ma.Nested(ProductSchema, exclude=['subscriptions'])

class InvoiceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Invoice
        load_instance = True
    
    customer = ma.Nested(CustomerSchema, exclude=['invoices'])

class TransactionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Transaction
        load_instance = True
    
    customer = ma.Nested(CustomerSchema, exclude=['transactions'])
    invoice = ma.Nested(InvoiceSchema, exclude=['transactions'])

class SupportTicketSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SupportTicket
        load_instance = True
    
    customer = ma.Nested(CustomerSchema, exclude=['support_tickets'])

# Initialize schemas
customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

subscription_schema = SubscriptionSchema()
subscriptions_schema = SubscriptionSchema(many=True)

invoice_schema = InvoiceSchema()
invoices_schema = InvoiceSchema(many=True)

transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)

support_ticket_schema = SupportTicketSchema()
support_tickets_schema = SupportTicketSchema(many=True)

class DatabaseManager:
    """Database management utilities"""
    
    def __init__(self):
        pass
    
    def create_tables(self):
        """Create all database tables"""
        db.create_all()
    
    def drop_tables(self):
        """Drop all database tables"""
        db.drop_all()
    
    def seed_data(self):
        """Seed initial data for testing"""
        # Add sample products
        products = [
            Product(name='Basic Plan', description='Basic billing features', base_price=29.99, billing_cycle='monthly'),
            Product(name='Pro Plan', description='Advanced billing with AI', base_price=99.99, billing_cycle='monthly'),
            Product(name='Enterprise Plan', description='Full feature set with blockchain', base_price=299.99, billing_cycle='monthly')
        ]
        
        for product in products:
            db.session.add(product)
        
        try:
            db.session.commit()
            print("Sample data seeded successfully")
        except Exception as e:
            db.session.rollback()
            print(f"Error seeding data: {e}")