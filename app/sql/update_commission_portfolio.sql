-- Add missing commission_portfolio entries
INSERT INTO commission_portfolio (commission_id, portfolio_id, display_order) VALUES
(4, 4, 1),
(5, 5, 1)
ON CONFLICT (commission_id, portfolio_id) DO NOTHING; 