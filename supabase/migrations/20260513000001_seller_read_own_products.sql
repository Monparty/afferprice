-- Seller can read their own products in all states
create policy "seller read own products" on public.products
  for select using (auth.uid() = seller_id);
