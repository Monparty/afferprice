-- Fix 1: public read products ใช้ state ผิด ('published' ไม่มีใน constraint ต้องเป็น 'active')
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select using (state = 'active');

-- Fix 2: update own profile ไม่มี WITH CHECK → user เปลี่ยน role/status ตัวเองได้
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role    = (select p.role   from public.profiles p where p.id = auth.uid())
    and status  = (select p.status from public.profiles p where p.id = auth.uid())
  );

-- Fix 3: admin policy อ่าน role จาก JWT root ซึ่งเป็น postgres role ไม่ใช่ app role
-- ต้องอ่านจาก app_metadata แทน
drop policy if exists "admin read all profiles" on public.profiles;
create policy "admin read all profiles" on public.profiles
  for select using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- หมายเหตุ Fix 3: เมื่อ promote user เป็น admin ต้อง set app_metadata ด้วย (รันผ่าน service_role)
-- update auth.users
-- set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
-- where id = '<user-id>';
