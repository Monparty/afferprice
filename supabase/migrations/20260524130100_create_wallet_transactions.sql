CREATE TABLE wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('topup','payment','refund')),
  reference_id uuid,
  balance_after numeric(12,2) NOT NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_wallet_tx_user_created ON wallet_transactions(user_id, created_at DESC);

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own tx read" ON wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);
