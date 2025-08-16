"""
Configuration settings for BillChain AI billing system
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///billchain.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Email configuration
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SMTP_USERNAME = os.getenv('SMTP_USERNAME')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
    
    # Twilio configuration
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
    
    # Blockchain configuration
    ETHEREUM_RPC_URL = os.getenv('ETHEREUM_RPC_URL')
    BITCOIN_RPC_URL = os.getenv('BITCOIN_RPC_URL')
    
    # AI/ML configuration
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    MODELS_DIR = os.getenv('MODELS_DIR', 'models')
    
    # Other APIs
    COINGECKO_API_KEY = os.getenv('COINGECKO_API_KEY')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test_billchain.db'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
