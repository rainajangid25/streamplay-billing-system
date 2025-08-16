-- StreamPlay Billing System Database Schema
-- This schema supports the hybrid database architecture

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (minimal data, references StreamPlay users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    streamplay_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_inr INTEGER NOT NULL, -- Price in paise (₹399 = 39900 paise)
    currency VARCHAR(3) DEFAULT 'INR',
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly
    features JSONB,
    app_count INTEGER DEFAULT 0,
    device_support TEXT[] DEFAULT ARRAY['mobile', 'laptop', 'tv'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    streamplay_user_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, cancelled, expired, pending
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    payment_method VARCHAR(100),
    last_payment_date TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES user_subscriptions(id),
    streamplay_user_id VARCHAR(255) NOT NULL,
    amount_inr INTEGER NOT NULL, -- Amount in paise
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(100),
    payment_gateway VARCHAR(100), -- razorpay, paytm, stripe
    gateway_transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaming apps catalog
CREATE TABLE streaming_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,
    category VARCHAR(100), -- entertainment, sports, news, kids
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan app associations (which apps are included in which plans)
CREATE TABLE plan_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
    app_id UUID REFERENCES streaming_apps(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, app_id)
);

-- User activity logs
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    streamplay_user_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL, -- subscription_created, payment_completed, plan_changed
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook events (for StreamPlay integration)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    streamplay_user_id VARCHAR(255),
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_streamplay_id ON users(streamplay_user_id);
CREATE INDEX idx_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_streamplay_id ON user_subscriptions(streamplay_user_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_transactions_subscription_id ON payment_transactions(subscription_id);
CREATE INDEX idx_transactions_streamplay_id ON payment_transactions(streamplay_user_id);
CREATE INDEX idx_transactions_status ON payment_transactions(status);
CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(streamplay_user_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_id, name, description, price_inr, app_count, features) VALUES
('streamplay_basic', 'Basic', 'Essential streaming with popular apps', 29900, 15, '{"hd_quality": true, "simultaneous_streams": 2, "download_offline": false}'),
('streamplay_mega', 'Mega', 'Premium streaming with all major apps', 39900, 33, '{"hd_quality": true, "simultaneous_streams": 4, "download_offline": true, "4k_quality": false}'),
('streamplay_premium', 'Premium', 'Ultimate streaming experience', 59900, 50, '{"hd_quality": true, "simultaneous_streams": 6, "download_offline": true, "4k_quality": true, "family_sharing": true}');

-- Insert popular streaming apps
INSERT INTO streaming_apps (app_id, name, logo_url, category) VALUES
('prime_video', 'Prime Video', '/logos/prime-video.png', 'entertainment'),
('apple_tv', 'Apple TV+', '/logos/apple-tv.png', 'entertainment'),
('disney_plus', 'Disney+ Hotstar', '/logos/disney-plus.png', 'entertainment'),
('netflix', 'Netflix', '/logos/netflix.png', 'entertainment'),
('zee5', 'ZEE5', '/logos/zee5.png', 'entertainment'),
('sony_liv', 'SonyLIV', '/logos/sony-liv.png', 'entertainment'),
('voot', 'Voot', '/logos/voot.png', 'entertainment'),
('alt_balaji', 'ALTBalaji', '/logos/alt-balaji.png', 'entertainment'),
('mx_player', 'MX Player', '/logos/mx-player.png', 'entertainment'),
('youtube_premium', 'YouTube Premium', '/logos/youtube.png', 'entertainment'),
('spotify', 'Spotify', '/logos/spotify.png', 'music'),
('jio_cinema', 'JioCinema', '/logos/jio-cinema.png', 'entertainment'),
('discovery_plus', 'Discovery+', '/logos/discovery.png', 'documentary'),
('epic_on', 'EPIC ON', '/logos/epic-on.png', 'entertainment'),
('fancode', 'FanCode', '/logos/fancode.png', 'sports'),
('klikk', 'KLIKK', '/logos/klikk.png', 'entertainment'),
('chaupal', 'Chaupal', '/logos/chaupal.png', 'entertainment'),
('travelxp', 'Travelxp', '/logos/travelxp.png', 'travel'),
('docubay', 'DocuBay', '/logos/docubay.png', 'documentary'),
('stage', 'STAGE', '/logos/stage.png', 'entertainment'),
('playflix', 'PlayFlix', '/logos/playflix.png', 'entertainment'),
('sports18', 'Sports18', '/logos/sports18.png', 'sports'),
('nammaflix', 'NammaFlix', '/logos/nammaflix.png', 'entertainment'),
('vrott', 'VROTT', '/logos/vrott.png', 'entertainment'),
('fuse', 'Fuse', '/logos/fuse.png', 'entertainment'),
('sun_nxt', 'Sun NXT', '/logos/sun-nxt.png', 'entertainment'),
('eros_now', 'Eros Now', '/logos/eros-now.png', 'entertainment'),
('shemaroo', 'Shemaroo', '/logos/shemaroo.png', 'entertainment'),
('lionsgateplay', 'Lionsgate Play', '/logos/lionsgate.png', 'entertainment'),
('bbc_player', 'BBC Player', '/logos/bbc.png', 'entertainment'),
('aaha', 'Aaha', '/logos/aaha.png', 'entertainment'),
('hoichoi', 'Hoichoi', '/logos/hoichoi.png', 'entertainment'),
('addatimes', 'Addatimes', '/logos/addatimes.png', 'entertainment'),
('koode', 'Koode', '/logos/koode.png', 'entertainment');

-- Associate apps with plans
-- Basic plan (15 apps)
INSERT INTO plan_apps (plan_id, app_id) 
SELECT sp.id, sa.id 
FROM subscription_plans sp, streaming_apps sa 
WHERE sp.plan_id = 'streamplay_basic' 
AND sa.app_id IN ('prime_video', 'disney_plus', 'zee5', 'sony_liv', 'voot', 'mx_player', 'youtube_premium', 'jio_cinema', 'discovery_plus', 'fancode', 'sun_nxt', 'eros_now', 'shemaroo', 'hoichoi', 'addatimes');

-- Mega plan (33 apps) - includes all basic + more
INSERT INTO plan_apps (plan_id, app_id) 
SELECT sp.id, sa.id 
FROM subscription_plans sp, streaming_apps sa 
WHERE sp.plan_id = 'streamplay_mega';

-- Premium plan (50+ apps) - includes all apps
INSERT INTO plan_apps (plan_id, app_id) 
SELECT sp.id, sa.id 
FROM subscription_plans sp, streaming_apps sa 
WHERE sp.plan_id = 'streamplay_premium';

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streaming_apps_updated_at BEFORE UPDATE ON streaming_apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
