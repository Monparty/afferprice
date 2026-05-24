ALTER TABLE profiles ADD COLUMN wallet_balance numeric(12,2) NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD CONSTRAINT wallet_balance_non_negative CHECK (wallet_balance >= 0);
