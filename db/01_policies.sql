-- เปิด RLS ทุกตาราง
alter table profiles enable row level security;

alter table user_addresses enable row level security;

alter table categories enable row level security;

alter table products enable row level security;

alter table product_images enable row level security;

alter table bids enable row level security;

alter table auction_results enable row level security;

alter table payments enable row level security;

alter table shipments enable row level security;

alter table reviews enable row level security;

alter table favorites enable row level security;

alter table notifications enable row level security;

alter table admin_logs enable row level security;

-- profile
-- user อ่าน/แก้ไข profile ตัวเอง
create policy "read own profile" on profiles for
select using (auth.uid () = id);

create policy "update own profile" on profiles
for update
    using (auth.uid () = id);

    -- admin อ่านได้หมด
create policy "admin read all profiles"
on profiles for select
using (auth.jwt() ->> 'role' = 'admin');
-- end profile

-- address
create policy "user manage own address" on user_addresses for all using (user_id = auth.uid ());
-- end address

-- categories
create policy "public read categories" on categories for
select using (true);

create policy "admin manage categories" on categories for all using (
    exists (
        select 1
        from profiles p
        where
            p.id = auth.uid ()
            and p.role = 'admin'
    )
);
-- end categories

-- products
-- ทุกคนดูสินค้าได้
create policy "public read products" on products for
select using (true);

-- seller เพิ่ม/แก้/ลบของตัวเอง
create policy "seller manage own products" on products for all using (seller_id = auth.uid ());
-- end products

-- product_images
create policy "public read images" on product_images for
select using (true);

create policy "seller manage own images" on product_images for all using (
    product_id in (
        select id
        from products
        where
            seller_id = auth.uid ()
    )
);
-- end product_images

-- bids
-- ทุกคนดู bid ได้
create policy "public read bids" on bids for select using (true);

-- user ใส่ bid ได้เฉพาะตัวเอง
create policy "user insert own bid" on bids for insert
with
    check (user_id = auth.uid ());
-- end bids

-- auction_results
-- ผู้ชนะหรือ seller ดูได้
create policy "winner or seller read result" on auction_results for
select using (
        winner_id = auth.uid ()
        or product_id in (
            select id
            from products
            where
                seller_id = auth.uid ()
        )
    );
-- end auction_results

-- payments
-- owner ดู payment ตัวเอง
create policy "user read own payment" on payments for
select using (user_id = auth.uid ());

-- owner insert payment ตัวเอง
create policy "user insert own payment" on payments for insert
with
    check (user_id = auth.uid ());
-- end payments

-- shipments
-- buyer หรือ seller ดู shipment ได้
create policy "buyer or seller read shipment" on shipments for
select using (
        auction_result_id in (
            select ar.id
            from
                auction_results ar
                join products p on ar.product_id = p.id
            where
                ar.winner_id = auth.uid ()
                or p.seller_id = auth.uid ()
        )
    );
-- end shipments

-- reviews
-- ทุกคนดูรีวิวได้
create policy "public read reviews" on reviews for
select using (true);

-- คนซื้อเท่านั้นรีวิวได้
create policy "buyer insert review" on reviews for insert
with
    check (
        reviewer_id = auth.uid ()
        and product_id in (
            select ar.product_id
            from auction_results ar
            where
                ar.winner_id = auth.uid ()
        )
    );
-- end reviews

-- favorites
create policy "user manage own favorites" on favorites for all using (user_id = auth.uid ());
-- end favorites

-- notifications
create policy "user read own notifications" on notifications for
select using (user_id = auth.uid ());

create policy "user update own notifications" on notifications
for update
    using (user_id = auth.uid ());
-- end notifications

-- admin_logs
create policy "admin only logs" on admin_logs for all using (
    exists (
        select 1
        from profiles p
        where
            p.id = auth.uid ()
            and p.role = 'admin'
    )
);
-- end admin_logs

-- | ตาราง           | ใครเห็น         | ใครแก้  |
-- | --------------- | --------------- | ------- |
-- | profiles        | เจ้าของ / admin | เจ้าของ |
-- | products        | ทุกคน           | seller  |
-- | bids            | ทุกคน           | คน bid  |
-- | auction_results | buyer / seller  | system  |
-- | payments        | buyer           | buyer   |
-- | shipments       | buyer / seller  | system  |
-- | reviews         | ทุกคน           | buyer   |
-- | favorites       | owner           | owner   |
-- | notifications   | owner           | owner   |
-- | categories      | ทุกคน           | admin   |