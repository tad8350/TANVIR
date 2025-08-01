-- mock_data.sql - COMPLETELY FIXED VERSION

-- Clear existing data to avoid conflicts (optional - uncomment if needed)
-- DELETE FROM customer_preferences;
-- DELETE FROM brand_analytics;
-- DELETE FROM campaigns;
-- DELETE FROM referrals;
-- DELETE FROM support_tickets;
-- DELETE FROM user_activity_logs;
-- DELETE FROM search_logs;
-- DELETE FROM review_images;
-- DELETE FROM reviews;
-- DELETE FROM refunds;
-- DELETE FROM returns;
-- DELETE FROM notifications;
-- DELETE FROM notification_templates;
-- DELETE FROM user_promos;
-- DELETE FROM promo_codes;
-- DELETE FROM favorites;
-- DELETE FROM shipments;
-- DELETE FROM payments;
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM addresses;
-- DELETE FROM cart;
-- DELETE FROM product_images;
-- DELETE FROM product_variants;
-- DELETE FROM sizes;
-- DELETE FROM colors;
-- DELETE FROM products;
-- DELETE FROM categories;
-- DELETE FROM brand_locations;
-- DELETE FROM customer_profiles;
-- DELETE FROM brand_profiles;
-- DELETE FROM admin_profiles;
-- DELETE FROM users;

-- Users table (admin, brand, customer) - with conflict handling
INSERT INTO users (email, password_hash, user_type, is_verified, is_active, last_login, created_at, updated_at) VALUES
('admin@example.com', 'hashed_password1', 'admin', true, true, '2023-01-01 12:00:00', '2023-01-01 12:00:00', '2023-01-01 12:00:00'),
('brand@example.com', 'hashed_password2', 'brand', true, true, '2023-01-01 12:00:00', '2023-01-01 12:00:00', '2023-01-01 12:00:00'),
('customer@example.com', 'hashed_password3', 'customer', true, true, '2023-01-01 12:00:00', '2023-01-01 12:00:00', '2023-01-01 12:00:00'),
('customer2@example.com', 'hashed_password4', 'customer', true, true, '2023-01-01 12:00:00', '2023-01-01 12:00:00', '2023-01-01 12:00:00')
ON CONFLICT (email) DO NOTHING;

-- Admin_profiles table (skip if already exists)
INSERT INTO admin_profiles (user_id, first_name, last_name, role, permissions) VALUES
(1, 'Admin', 'User', 'super_admin', '{"can_manage_users": true, "can_manage_products": true}')
ON CONFLICT (user_id) DO NOTHING;

-- Brand_profiles table (skip if already exists)
INSERT INTO brand_profiles (user_id, brand_name, business_name, tax_id, business_license, contact_person, phone, website, description, logo_url, banner_url, commission_rate, payment_methods, shipping_methods, is_verified, bank_account) VALUES
(2, 'Example Brand', 'Example Business', '123456789', 'license123', 'Contact Person', '123-456-7890', 'http://example.com', 'An example brand.', 'http://example.com/logo.jpg', 'http://example.com/banner.jpg', 0.1, '["credit_card", "paypal"]', '["standard", "express"]', true, '{"account_number": "123456789", "bank_name": "Example Bank"}')
ON CONFLICT (user_id) DO NOTHING;

-- Customer_profiles table (skip if already exists)
INSERT INTO customer_profiles (user_id, first_name, last_name, date_of_birth, gender, preferences, newsletter_subscription, marketing_consent) VALUES
(3, 'Customer', 'User', '1990-01-01', 'male', '{"favorite_categories": ["electronics"]}', true, true),
(4, 'Customer2', 'User2', '1995-01-01', 'female', '{"favorite_categories": ["clothing"]}', true, true)
ON CONFLICT (user_id) DO NOTHING;

-- Brand_locations table (with explicit ID)
INSERT INTO brand_locations (id, brand_id, name, address, city, contact_number, is_primary, is_active, contact_email, latitude, longitude, business_hours) VALUES
(1, 1, 'Main Store', '456 Brand St', 'Brand City', '123-456-7890', true, true, 'store@example.com', 40.7128, -74.0060, '{"mon": "9-5", "tue": "9-5"}')
ON CONFLICT (id) DO NOTHING;

-- Categories table
INSERT INTO categories (name, parent_id) VALUES
('Electronics', NULL),
('Smartphones', 1),
('Clothing', NULL);

-- Products table
INSERT INTO products (brand_id, name, description, category_id, status, is_active, created_at, updated_at) VALUES
(1, 'Example Smartphone', 'A sample smartphone.', 2, 'active', true, '2023-01-01 12:00:00', '2023-01-01 12:00:00'),
(1, 'Example Shirt', 'A sample shirt.', 3, 'active', true, '2023-01-01 12:00:00', '2023-01-01 12:00:00');

-- Colors table
INSERT INTO colors (name) VALUES
('Black'),
('White');

-- Sizes table
INSERT INTO sizes (name) VALUES
('Medium'),
('Large');

-- Product_variants table (with conflict handling for SKU)
INSERT INTO product_variants (product_id, color_id, size_id, stock, price, discount_price, sku, is_active) VALUES
(1, 1, 1, 100, 999.99, 899.99, 'SMARTPHONE-BLACK-M', true),
(2, 2, 2, 50, 29.99, NULL, 'SHIRT-WHITE-L', true)
ON CONFLICT (sku) DO NOTHING;

-- Product_images table
INSERT INTO product_images (product_id, url) VALUES
(1, 'http://example.com/smartphone.jpg'),
(2, 'http://example.com/shirt.jpg');

-- Cart table
INSERT INTO cart (user_id, product_variant_id, quantity, added_at, is_active) VALUES
(3, 1, 1, '2023-01-01 12:00:00', true);

-- Addresses table
INSERT INTO addresses (user_id, name, phone, address_line, city, postal_code, type) VALUES
(3, 'Customer User', '123-456-7890', '123 Example St', 'Example City', '12345', 'shipping');

-- Orders table
INSERT INTO orders (user_id, status, total_amount, subtotal_amount, shipping_cost, tax_amount, discount_amount, payment_status, shipping_address_id, shipping_method, estimated_delivery_date, created_at) VALUES
(3, 'pending', 909.99, 899.99, 10.00, 0.00, 0.00, 'pending', 1, 'standard', '2023-01-10', '2023-01-01 12:00:00');

-- Order_items table
INSERT INTO order_items (order_id, product_variant_id, quantity, price) VALUES
(1, 1, 1, 899.99);

-- Payments table
INSERT INTO payments (order_id, method, status, transaction_id, paid_at) VALUES
(1, 'credit_card', 'pending', 'txn_123456', NULL);

-- Shipments table
INSERT INTO shipments (order_id, courier_name, tracking_number, status, shipped_at, delivered_at) VALUES
(1, 'Example Courier', 'track123', 'pending', NULL, NULL);

-- Favorites table
INSERT INTO favorites (user_id, product_variant_id, created_at) VALUES
(3, 1, '2023-01-01 12:00:00');

-- Promo_codes table (with conflict handling)
INSERT INTO promo_codes (code, type, value, usage_limit, valid_from, valid_to, brand_id, campaign_id) VALUES
('DISCOUNT10', 'percentage', 10.0, 100, '2023-01-01 00:00:00', '2023-12-31 23:59:59', 1, NULL)
ON CONFLICT (code) DO NOTHING;

-- User_promos table (with explicit ID)
INSERT INTO user_promos (id, user_id, promo_code_id, used_at) VALUES
(1, 3, 1, NULL)
ON CONFLICT (id) DO NOTHING;

-- Notification_templates table (with explicit ID)
INSERT INTO notification_templates (id, name, channel, subject_template, body_template) VALUES
(1, 'Order Confirmation', 'email', 'Your order is confirmed', 'Dear {name}, your order {order_id} is confirmed.')
ON CONFLICT (id) DO NOTHING;

-- Notifications table
INSERT INTO notifications (user_id, type, channel, subject, message, status, sent_at, meta) VALUES
(3, 'order_confirmation', 'email', 'Your order is confirmed', 'Dear Customer User, your order 1 is confirmed.', 'sent', '2023-01-01 12:00:00', '{"order_id": 1}');

-- Returns table (with explicit ID)
INSERT INTO returns (id, order_id, order_item_id, status, reason, refund_status, requested_at, updated_at) VALUES
(1, 1, 1, 'pending', 'Defective', 'pending', '2023-01-02 12:00:00', '2023-01-02 12:00:00')
ON CONFLICT (id) DO NOTHING;

-- Refunds table (with explicit ID)
INSERT INTO refunds (id, return_id, refund_amount, refund_method, refund_status, processed_by, processed_at) VALUES
(1, 1, 899.99, 'original_payment', 'pending', 1, NULL)
ON CONFLICT (id) DO NOTHING;

-- Reviews table
INSERT INTO reviews (customer_id, product_id, order_id, review_text, star_rating, is_verified_purchase, is_approved) VALUES
(1, 1, 1, 'Great product!', 5, true, true);

-- Review_images table (with explicit ID)
INSERT INTO review_images (id, review_id, image_path, image_url) VALUES
(1, 1, '/path/to/image.jpg', 'http://example.com/review_image.jpg')
ON CONFLICT (id) DO NOTHING;

-- Search_logs table (with explicit ID)
INSERT INTO search_logs (id, user_id, query, results_count, searched_at) VALUES
(1, 3, 'smartphone', 10, '2023-01-01 12:00:00')
ON CONFLICT (id) DO NOTHING;

-- User_activity_logs table (with explicit ID)
INSERT INTO user_activity_logs (id, user_id, product_id, activity_type, activity_at, source) VALUES
(1, 3, 1, 'view', '2023-01-01 12:00:00', 'web')
ON CONFLICT (id) DO NOTHING;

-- Support_tickets table (with explicit ID)
INSERT INTO support_tickets (id, user_id, subject, message, status, priority, assigned_to) VALUES
(1, 3, 'Order Delay', 'My order is late.', 'open', 'high', 1)
ON CONFLICT (id) DO NOTHING;

-- Referrals table (with explicit ID)
INSERT INTO referrals (id, referrer_id, referred_id, referral_code, bonus_status) VALUES
(1, 3, 4, 'REF123', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Campaigns table
INSERT INTO campaigns (name, description, start_date, end_date, is_active) VALUES
('Summer Sale', 'Summer discounts', '2023-06-01', '2023-08-31', true);

-- Brand_analytics table (with explicit ID)
INSERT INTO brand_analytics (id, brand_id, date, total_sales, total_orders, commission_earned) VALUES
(1, 1, '2023-01-01', 899.99, 1, 89.99)
ON CONFLICT (id) DO NOTHING;

-- Customer_preferences table (with explicit ID)
INSERT INTO customer_preferences (id, customer_id, category_id, preference_score) VALUES
(1, 1, 1, 0.8)
ON CONFLICT (id) DO NOTHING;