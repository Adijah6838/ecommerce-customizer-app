CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    custom_text TEXT,
    custom_color VARCHAR(50),
    custom_size VARCHAR(50),
    custom_image_url TEXT,
    calculated_price DECIMAL(10, 2) NOT NULL
);

-- Seed some products
INSERT INTO products (name, description, base_price, image_url) VALUES
('Classic T-Shirt', '100% cotton premium t-shirt.', 25.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'),
('Premium Hoodie', 'Warm and cozy hoodie for cold days.', 55.00, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'),
('Coffee Mug', 'Ceramic mug for your morning coffee.', 15.00, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800')
ON CONFLICT DO NOTHING;