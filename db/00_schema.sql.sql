create table profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    phone text,
    first_name text,
    last_name text,
    profile_image text,
    gender text,
    birth_day text,
    birth_month text,
    birth_year text,
    role text default 'user' check (role in ('user', 'admin')),
    status text default 'active' check (
        status in ('active', 'banned')
    ),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table user_addresses (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references profiles (id) on delete cascade,
    receiver_name text,
    phone text,
    address_line text,
    district text,
    province text,
    postal_code text,
    is_default boolean default false,
    created_at timestamptz default now()
);

create table categories (
    id uuid primary key default gen_random_uuid (),
    parent_id uuid references categories (id),
    name text not null,
    description text,
    created_at timestamptz default now()
);

create table products (
    id uuid primary key default gen_random_uuid (),
    seller_id uuid not null references profiles (id),
    category_id uuid not null references categories (id),
    title text not null,
    description text,
    condition text not null check (
        condition in (
            'new',
            'like_new',
            'good',
            'fair',
            'poor'
        )
    ),
    start_price numeric(10, 2) not null,
    buy_now_price numeric(10, 2),
    auction_start_time timestamptz not null,
    auction_end_time timestamptz not null,
    status text default 'draft' check (
        status in (
            'draft',
            'active',
            'ended',
            'canceled'
        )
    ),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table product_images (
    id uuid primary key default gen_random_uuid (),
    product_id uuid not null references products (id) on delete cascade,
    image_url text not null,
    sort_order int default 0,
    created_at timestamptz default now()
);

create table bids (
    id uuid primary key default gen_random_uuid (),
    product_id uuid not null references products (id) on delete cascade,
    user_id uuid not null references profiles (id),
    bid_price numeric(10, 2) not null,
    bid_time timestamptz default now(),
    is_winning boolean default false
);

create table auction_results (
    id uuid primary key default gen_random_uuid (),
    product_id uuid not null references products (id),
    winner_id uuid not null references profiles (id),
    final_price numeric(10, 2) not null,
    ended_at timestamptz default now(),
    payment_status text default 'pending' check (
        payment_status in ('pending', 'paid', 'canceled')
    )
);

create table payments (
    id uuid primary key default gen_random_uuid (),
    auction_result_id uuid not null references auction_results (id) on delete cascade,
    user_id uuid not null references profiles (id),
    amount numeric(10, 2) not null,
    payment_method text check (
        payment_method in (
            'bank',
            'credit_card',
            'promptpay',
            'wallet'
        )
    ),
    payment_status text default 'pending' check (
        payment_status in (
            'pending',
            'success',
            'failed'
        )
    ),
    paid_at timestamptz,
    transaction_ref text
);

create table shipments (
    id uuid primary key default gen_random_uuid (),
    auction_result_id uuid not null references auction_results (id) on delete cascade,
    address_id uuid not null references user_addresses (id),
    shipping_company text,
    tracking_number text,
    shipping_status text default 'preparing' check (
        shipping_status in (
            'preparing',
            'shipped',
            'delivered'
        )
    ),
    shipped_at timestamptz,
    delivered_at timestamptz
);

create table reviews (
    id uuid primary key default gen_random_uuid (),
    reviewer_id uuid not null references profiles (id),
    seller_id uuid not null references profiles (id),
    product_id uuid not null references products (id),
    rating int not null check (rating between 1 and 5),
    comment text,
    created_at timestamptz default now()
);

create table favorites (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references profiles (id),
    product_id uuid not null references products (id),
    created_at timestamptz default now(),
    unique (user_id, product_id)
);

create table notifications (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references profiles (id),
    type text check (
        type in (
            'bid',
            'win',
            'lose',
            'payment',
            'shipping'
        )
    ),
    title text,
    message text,
    is_read boolean default false,
    created_at timestamptz default now()
);

create table admin_logs (
    id uuid primary key default gen_random_uuid (),
    admin_id uuid not null references profiles (id),
    action text,
    target_table text,
    target_id uuid,
    created_at timestamptz default now()
);

create index idx_products_status on products (status);

create index idx_products_category on products (category_id);

create index idx_bids_product on bids (product_id);

create index idx_bids_user on bids (user_id);

create index idx_notifications_user on notifications (user_id);

create index idx_favorites_user on favorites (user_id);