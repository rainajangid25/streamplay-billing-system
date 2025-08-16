-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'expired')),
  wallet_address TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  phone TEXT,
  country TEXT,
  language TEXT DEFAULT 'en',
  
  -- AI/ML fields
  churn_risk_score DECIMAL(3,2) DEFAULT 0.00 CHECK (churn_risk_score >= 0 AND churn_risk_score <= 1),
  churn_risk_level TEXT DEFAULT 'low' CHECK (churn_risk_level IN ('low', 'medium', 'high')),
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  
  -- Preferences
  preferred_currency TEXT DEFAULT 'USD',
  communication_preferences JSONB DEFAULT '{}',
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_billing_date TIMESTAMP WITH TIME ZONE,
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly', 'one-time')),
  
  -- NFT/Blockchain fields
  nft_token_id TEXT,
  blockchain_network TEXT,
  smart_contract_address TEXT,
  
  -- Usage tracking
  usage_data JSONB DEFAULT '{}',
  usage_limits JSONB DEFAULT '{}',
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  blockchain_tx_hash TEXT,
  blockchain_network TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment gateway fields
  gateway_transaction_id TEXT,
  gateway_name TEXT,
  
  -- Fraud detection
  fraud_score DECIMAL(3,2) DEFAULT 0.00,
  is_fraud BOOLEAN DEFAULT FALSE,
  
  -- Gas and fees (for crypto transactions)
  gas_fee DECIMAL(18,8),
  network_fee DECIMAL(18,8),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create invoices table
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  
  -- Financial details
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Dates
  invoice_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_date TIMESTAMP WITH TIME ZONE,
  
  -- AI/Automation
  ai_generated BOOLEAN DEFAULT FALSE,
  auto_sent BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Create invoice_line_items table
CREATE TABLE invoice_line_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  
  -- Usage-based billing
  usage_from TIMESTAMP WITH TIME ZONE,
  usage_to TIMESTAMP WITH TIME ZONE,
  usage_quantity DECIMAL(15,4),
  usage_unit TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create support_tickets table
CREATE TABLE support_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('billing', 'technical', 'general', 'nft', 'blockchain')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  
  -- AI analysis
  sentiment_score DECIMAL(3,2), -- -1 to 1
  urgency_score DECIMAL(3,2), -- 0 to 1
  auto_response_sent BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create usage_analytics table
CREATE TABLE usage_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  metric_unit TEXT,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_wallet_address ON customers(wallet_address);
CREATE INDEX idx_customers_subscription_status ON customers(subscription_status);
CREATE INDEX idx_customers_churn_risk_level ON customers(churn_risk_level);

CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);

CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_blockchain_tx_hash ON transactions(blockchain_tx_hash);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

CREATE INDEX idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority);

CREATE INDEX idx_usage_analytics_customer_id ON usage_analytics(customer_id);
CREATE INDEX idx_usage_analytics_subscription_id ON usage_analytics(subscription_id);
CREATE INDEX idx_usage_analytics_period ON usage_analytics(period_start, period_end);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - can be expanded based on requirements)
-- Customers can only see their own data
CREATE POLICY "Users can view own customer data" ON customers
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own customer data" ON customers
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Similar policies for other tables
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Users can view own support tickets" ON support_tickets
  FOR SELECT USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Users can create support tickets" ON support_tickets
  FOR INSERT WITH CHECK (customer_id::text = auth.uid()::text);

-- Create functions for automated tasks
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((SELECT COUNT(*) + 1 FROM invoices WHERE DATE(created_at) = CURRENT_DATE)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((SELECT COUNT(*) + 1 FROM support_tickets WHERE DATE(created_at) = CURRENT_DATE)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
