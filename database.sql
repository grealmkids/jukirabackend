
CREATE TYPE plan_enum AS ENUM ('starter', 'essential', 'pro', 'enterprise');
CREATE TYPE channel_enum AS ENUM ('whatsapp', 'sms', 'email');
CREATE TYPE status_enum AS ENUM ('pending', 'sent', 'failed');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    plan plan_enum DEFAULT 'starter',
    credits INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE birthdays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    celebrant_name VARCHAR(255) NOT NULL,
    celebrant_photo_url VARCHAR(255),
    category VARCHAR(50) CHECK (category IN ('family', 'friends', 'clients')),
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    birthday_id UUID REFERENCES birthdays(id) ON DELETE CASCADE,
    message TEXT,
    theme VARCHAR(255),
    generated_image_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    channel channel_enum NOT NULL,
    status status_enum DEFAULT 'pending',
    delivery_log JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) CHECK (provider IN ('stripe', 'flutterwave')),
    amount DECIMAL(10, 2) NOT NULL,
    credits_added INT NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
