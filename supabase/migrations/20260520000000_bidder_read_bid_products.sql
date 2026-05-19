-- Bidders can read products they have placed a bid on (in any state)
-- This lets winners see their won products and lost bidders see sold auctions
create policy "bidder read bid products" on public.products
  for select using (
    id in (select product_id from public.bids where user_id = auth.uid())
  );
