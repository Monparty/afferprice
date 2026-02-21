-- สร้าง profile อัตโนมัติหลังสมัคร
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
    insert into public.profiles (id)
    values (new.id);
    return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- place_bid() = ฟังก์ชันฝั่ง DB ที่ควบคุมการประมูล
create or replace function place_bid(
    p_product_id uuid,
    p_price numeric
)
returns void
language plpgsql
security definer
as $$
declare
    v_now timestamptz := now();
    v_end_time timestamptz;
    v_seller_id uuid;
    v_current_max numeric;
begin
    -- 1) lock product row (กัน bid พร้อมกันแล้วพัง)
    select auction_end_time, seller_id
    into v_end_time, v_seller_id
    from products
    where id = p_product_id
    for update;

    if not found then
        raise exception 'Product not found';
    end if;

    -- 2) ห้ามเจ้าของสินค้าประมูลเอง
    if v_seller_id = auth.uid() then
        raise exception 'You cannot bid on your own product';
    end if;

    -- 3) ตรวจหมดเวลา
    if v_end_time <= v_now then
        raise exception 'Auction already ended';
    end if;

    -- 4) ราคาสูงสุดปัจจุบัน
    select coalesce(max(bid_price), 0)
    into v_current_max
    from bids
    where product_id = p_product_id;

    if p_price <= v_current_max then
        raise exception 'Bid price must be higher than current highest bid';
    end if;

    -- 5) clear winner เดิม
    update bids
    set is_winning = false
    where product_id = p_product_id;

    -- 6) insert bid ใหม่ (ผู้ชนะล่าสุด)
    insert into bids(product_id, user_id, bid_price, is_winning)
    values (p_product_id, auth.uid(), p_price, true);

end;
$$;

-- RLS สำหรับ function
create policy "allow bid via function" on bids for insert
with
    check (auth.uid () = user_id);