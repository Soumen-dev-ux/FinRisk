-- Financial Risk Platform Database Schema

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolios table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_value DECIMAL(15,2) DEFAULT 0,
    risk_score DECIMAL(3,2) DEFAULT 0,
    expected_return DECIMAL(5,4) DEFAULT 0,
    volatility DECIMAL(5,4) DEFAULT 0,
    sharpe_ratio DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    market_cap BIGINT,
    beta DECIMAL(5,4),
    dividend_yield DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(symbol)
);

-- Portfolio assets (holdings)
CREATE TABLE portfolio_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    quantity DECIMAL(15,6) NOT NULL,
    weight DECIMAL(5,4) NOT NULL,
    average_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, asset_id)
);

-- Risk scores table
CREATE TABLE risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL, -- Can reference portfolios or assets
    entity_type VARCHAR(20) NOT NULL, -- 'portfolio' or 'asset'
    score DECIMAL(3,2) NOT NULL,
    confidence DECIMAL(3,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    factors JSONB,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ESG scores table
CREATE TABLE esg_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    environmental_score DECIMAL(3,2),
    social_score DECIMAL(3,2),
    governance_score DECIMAL(3,2),
    overall_score DECIMAL(3,2),
    factors JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sentiment data table
CREATE TABLE sentiment_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    source VARCHAR(100) NOT NULL,
    content TEXT,
    sentiment_score DECIMAL(3,2) NOT NULL, -- -1 to 1
    confidence DECIMAL(3,2) NOT NULL,
    keywords TEXT[],
    impact_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alert rules table
CREATE TABLE alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    condition_type VARCHAR(50) NOT NULL,
    threshold DECIMAL(10,4) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    enabled BOOLEAN DEFAULT true,
    recipients TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES alert_rules(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data sources table
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    last_update TIMESTAMP,
    frequency VARCHAR(50),
    reliability_score DECIMAL(3,2) DEFAULT 1.0,
    configuration JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stress test scenarios table
CREATE TABLE stress_test_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parameters JSONB NOT NULL,
    severity VARCHAR(20) NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stress test results table
CREATE TABLE stress_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID REFERENCES stress_test_scenarios(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    original_value DECIMAL(15,2) NOT NULL,
    stressed_value DECIMAL(15,2) NOT NULL,
    loss_amount DECIMAL(15,2) NOT NULL,
    loss_percentage DECIMAL(5,4) NOT NULL,
    results_detail JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market data table
CREATE TABLE market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    price DECIMAL(10,4) NOT NULL,
    volume BIGINT,
    high DECIMAL(10,4),
    low DECIMAL(10,4),
    open DECIMAL(10,4),
    close DECIMAL(10,4),
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asset_id, timestamp)
);

-- Audit trail table
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolio_assets_portfolio_id ON portfolio_assets(portfolio_id);
CREATE INDEX idx_risk_scores_entity ON risk_scores(entity_id, entity_type);
CREATE INDEX idx_sentiment_data_asset_id ON sentiment_data(asset_id);
CREATE INDEX idx_market_data_asset_timestamp ON market_data(asset_id, timestamp DESC);
CREATE INDEX idx_alerts_portfolio_id ON alerts(portfolio_id);
CREATE INDEX idx_audit_trail_user_action ON audit_trail(user_id, action);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_assets_updated_at BEFORE UPDATE ON portfolio_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_esg_scores_updated_at BEFORE UPDATE ON esg_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON alert_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_data_sources_updated_at BEFORE UPDATE ON data_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stress_test_scenarios_updated_at BEFORE UPDATE ON stress_test_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
