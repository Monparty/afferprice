ALTER TABLE payments ALTER COLUMN auction_result_id DROP NOT NULL;

ALTER TABLE payments ADD COLUMN purpose text DEFAULT 'auction'
  CHECK (purpose IN ('auction','topup','listing_fee'));
