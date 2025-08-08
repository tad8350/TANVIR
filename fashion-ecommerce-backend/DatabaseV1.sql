CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "email" text UNIQUE NOT NULL,
  "password_hash" text NOT NULL,
  "user_type" text,
  "is_verified" boolean DEFAULT false,
  "is_active" boolean DEFAULT true,
  "last_login" timestamp,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "admin_profiles" (
  "id" integer PRIMARY KEY,
  "user_id" integer UNIQUE,
  "first_name" text,
  "last_name" text,
  "role" text,
  "permissions" json
);

CREATE TABLE "brand_profiles" (
  "id" integer PRIMARY KEY,
  "user_id" integer UNIQUE,
  "brand_name" text NOT NULL,
  "business_name" text,
  "tax_id" text,
  "business_license" text,
  "contact_person" text,
  "phone" text,
  "website" text,
  "description" text,
  "logo_url" text,
  "banner_url" text,
  "commission_rate" numeric,
  "payment_methods" json,
  "shipping_methods" json,
  "is_verified" boolean DEFAULT false,
  "bank_account" json,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "customer_profiles" (
  "id" integer PRIMARY KEY,
  "user_id" integer UNIQUE,
  "first_name" text,
  "last_name" text,
  "date_of_birth" date,
  "gender" text,
  "preferences" json,
  "newsletter_subscription" boolean DEFAULT false,
  "marketing_consent" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "brand_locations" (
  "id" integer PRIMARY KEY,
  "brand_id" integer,
  "name" text,
  "address" text,
  "city" text,
  "contact_number" text,
  "is_primary" boolean DEFAULT false,
  "is_active" boolean DEFAULT true,
  "contact_email" text,
  "latitude" numeric,
  "longitude" numeric,
  "business_hours" json,
  "address_line2" text,
  "created_at" timestamp
);

CREATE TABLE "categories" (
  "id" integer PRIMARY KEY,
  "name" text,
  "parent_id" integer,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "products" (
  "id" integer PRIMARY KEY,
  "brand_id" integer,
  "name" text,
  "title" text,
  "description" text,
  "short_description" text,
  "price" numeric,
  "sale_price" numeric,
  "cost_price" numeric,
  "sku" text UNIQUE,
  "barcode" text,
  "category_id" integer,
  "category_level1" text,
  "category_level2" text,
  "category_level3" text,
  "category_level4" text,
  "category" text,
  "status" text,
  "is_active" boolean DEFAULT true,
  "low_stock_threshold" integer,
  "meta_title" text,
  "meta_description" text,
  "keywords" text,
  "tags" text[],
  "shipping_weight" numeric,
  "shipping_length" numeric,
  "shipping_width" numeric,
  "shipping_height" numeric,
  "free_shipping" boolean DEFAULT false,
  "shipping_class" text,
  "tax_class" text,
  "tax_rate" numeric,
  "track_inventory" boolean DEFAULT true,
  "allow_backorders" boolean DEFAULT false,
  "max_order_quantity" integer,
  "min_order_quantity" integer DEFAULT 1,
  "is_virtual" boolean DEFAULT false,
  "is_downloadable" boolean DEFAULT false,
  "download_limit" integer,
  "download_expiry" integer,
  "has_variants" boolean DEFAULT false,
  "variant_type" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "product_variants" (
  "id" integer PRIMARY KEY,
  "product_id" integer,
  "color_id" integer,
  "size_id" integer,
  "stock" integer,
  "price" numeric,
  "discount_price" numeric,
  "sku" text UNIQUE,
  "is_active" boolean DEFAULT true
);

CREATE TABLE "product_images" (
  "id" integer PRIMARY KEY,
  "product_id" integer,
  "url" text
);

CREATE TABLE "colors" (
  "id" integer PRIMARY KEY,
  "name" text,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "sizes" (
  "id" integer PRIMARY KEY,
  "name" text,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "cart" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "product_variant_id" integer,
  "quantity" integer,
  "added_at" timestamp,
  "is_active" boolean DEFAULT true
);

CREATE TABLE "orders" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "status" text,
  "total_amount" numeric,
  "subtotal_amount" numeric,
  "shipping_cost" numeric,
  "tax_amount" numeric,
  "discount_amount" numeric,
  "payment_status" text,
  "shipping_address_id" integer,
  "shipping_method" text,
  "estimated_delivery_date" date,
  "created_at" timestamp
);

CREATE TABLE "order_items" (
  "id" integer PRIMARY KEY,
  "order_id" integer,
  "product_variant_id" integer,
  "quantity" integer,
  "price" numeric
);

CREATE TABLE "addresses" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "name" text,
  "phone" text,
  "address_line" text,
  "city" text,
  "postal_code" text,
  "type" text,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "payments" (
  "id" integer PRIMARY KEY,
  "order_id" integer,
  "method" text,
  "status" text,
  "transaction_id" text,
  "paid_at" timestamp,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "shipments" (
  "id" integer PRIMARY KEY,
  "order_id" integer,
  "courier_name" text,
  "tracking_number" text,
  "status" text,
  "shipped_at" timestamp,
  "delivered_at" timestamp,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "favorites" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "product_variant_id" integer,
  "created_at" timestamp
);

CREATE TABLE "promo_codes" (
  "id" integer PRIMARY KEY,
  "code" text UNIQUE,
  "type" text,
  "value" numeric,
  "usage_limit" integer,
  "valid_from" timestamp,
  "valid_to" timestamp,
  "brand_id" integer,
  "campaign_id" integer,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "user_promos" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "promo_code_id" integer,
  "used_at" timestamp,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "notification_templates" (
  "id" integer PRIMARY KEY,
  "name" text,
  "channel" text,
  "subject_template" text,
  "body_template" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "notifications" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "type" text,
  "channel" text,
  "subject" text,
  "message" text,
  "status" text,
  "sent_at" timestamp,
  "meta" json
);

CREATE TABLE "returns" (
  "id" integer PRIMARY KEY,
  "order_id" integer,
  "order_item_id" integer,
  "status" text,
  "reason" text,
  "refund_status" text,
  "requested_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "refunds" (
  "id" integer PRIMARY KEY,
  "return_id" integer,
  "refund_amount" numeric,
  "refund_method" text,
  "refund_status" text,
  "processed_by" integer,
  "processed_at" timestamp,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "reviews" (
  "id" integer PRIMARY KEY,
  "customer_id" integer,
  "product_id" integer,
  "order_id" integer,
  "review_text" text,
  "star_rating" integer,
  "is_verified_purchase" boolean DEFAULT false,
  "is_helpful" integer DEFAULT 0,
  "is_not_helpful" integer DEFAULT 0,
  "is_approved" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "updated_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "review_images" (
  "id" integer PRIMARY KEY,
  "review_id" integer,
  "image_path" text,
  "image_url" text,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "search_logs" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "query" text,
  "results_count" integer,
  "searched_at" timestamp,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "user_activity_logs" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "product_id" integer,
  "activity_type" text,
  "activity_at" timestamp,
  "source" text,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "support_tickets" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "subject" text,
  "message" text,
  "status" text,
  "priority" text,
  "assigned_to" integer,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "referrals" (
  "id" integer PRIMARY KEY,
  "referrer_id" integer,
  "referred_id" integer,
  "referral_code" text,
  "bonus_status" text,
  "created_at" timestamp
);

CREATE TABLE "campaigns" (
  "id" integer PRIMARY KEY,
  "name" text,
  "description" text,
  "start_date" date,
  "end_date" date,
  "is_active" boolean,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "brand_analytics" (
  "id" integer PRIMARY KEY,
  "brand_id" integer,
  "date" date,
  "total_sales" numeric,
  "total_orders" integer,
  "commission_earned" numeric
);

CREATE TABLE "customer_preferences" (
  "id" integer PRIMARY KEY,
  "customer_id" integer,
  "category_id" integer,
  "preference_score" numeric
);

CREATE INDEX ON "products" ("brand_id");

CREATE INDEX ON "products" ("category_id");

CREATE INDEX ON "products" ("status");

CREATE INDEX ON "cart" ("user_id");

CREATE INDEX ON "orders" ("user_id");

CREATE INDEX ON "orders" ("status");

CREATE INDEX ON "orders" ("payment_status");

CREATE INDEX ON "favorites" ("user_id");

CREATE INDEX ON "reviews" ("product_id");

CREATE INDEX ON "reviews" ("customer_id");

CREATE INDEX ON "search_logs" ("user_id");

CREATE INDEX ON "user_activity_logs" ("user_id");

CREATE INDEX ON "user_activity_logs" ("product_id");

COMMENT ON COLUMN "users"."user_type" IS 'admin, brand, customer';

COMMENT ON COLUMN "admin_profiles"."role" IS 'super_admin, content_admin, support_admin';

COMMENT ON COLUMN "brand_profiles"."commission_rate" IS 'Platform commission';

COMMENT ON COLUMN "brand_profiles"."payment_methods" IS 'Accepted payment methods';

COMMENT ON COLUMN "brand_profiles"."shipping_methods" IS 'Available shipping options';

COMMENT ON COLUMN "brand_profiles"."bank_account" IS 'Payment details';

COMMENT ON COLUMN "customer_profiles"."preferences" IS 'Shopping preferences, sizes, etc.';

COMMENT ON COLUMN "products"."status" IS 'draft, active, inactive, deleted';

COMMENT ON COLUMN "orders"."status" IS 'pending, confirmed, processing, shipped, delivered, cancelled';

COMMENT ON COLUMN "orders"."subtotal_amount" IS 'Product total before shipping and taxes';

COMMENT ON COLUMN "orders"."shipping_cost" IS 'Shipping cost';

COMMENT ON COLUMN "orders"."tax_amount" IS 'Tax amount';

COMMENT ON COLUMN "orders"."discount_amount" IS 'Discount amount';

COMMENT ON COLUMN "orders"."shipping_method" IS 'Selected shipping method';

COMMENT ON COLUMN "orders"."estimated_delivery_date" IS 'Estimated delivery date';

COMMENT ON COLUMN "payments"."status" IS 'pending, processing, completed, failed, refunded';

COMMENT ON COLUMN "shipments"."status" IS 'pending, shipped, in_transit, delivered, failed';

COMMENT ON COLUMN "returns"."status" IS 'pending, approved, rejected, completed';

COMMENT ON COLUMN "refunds"."refund_method" IS 'original_payment, store_credit, bank_transfer';

COMMENT ON COLUMN "refunds"."refund_status" IS 'pending, processing, completed, failed';

COMMENT ON COLUMN "refunds"."processed_by" IS 'Admin who processed the refund';

COMMENT ON COLUMN "reviews"."star_rating" IS '1-5 rating';

COMMENT ON COLUMN "review_images"."image_path" IS 'File path where uploaded image is stored';

COMMENT ON COLUMN "review_images"."image_url" IS 'CDN/cloud storage URL for the image';

COMMENT ON COLUMN "support_tickets"."status" IS 'open, in_progress, resolved, closed';

COMMENT ON COLUMN "support_tickets"."priority" IS 'low, medium, high, urgent';

ALTER TABLE "admin_profiles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "brand_profiles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "customer_profiles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "brand_locations" ADD FOREIGN KEY ("brand_id") REFERENCES "brand_profiles" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("brand_id") REFERENCES "brand_profiles" ("id");

ALTER TABLE "promo_codes" ADD FOREIGN KEY ("brand_id") REFERENCES "brand_profiles" ("id");

ALTER TABLE "brand_analytics" ADD FOREIGN KEY ("brand_id") REFERENCES "brand_profiles" ("id");

ALTER TABLE "categories" ADD FOREIGN KEY ("parent_id") REFERENCES "categories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "customer_preferences" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "product_variants" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "product_images" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "user_activity_logs" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "cart" ADD FOREIGN KEY ("product_variant_id") REFERENCES "product_variants" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_variant_id") REFERENCES "product_variants" ("id");

ALTER TABLE "favorites" ADD FOREIGN KEY ("product_variant_id") REFERENCES "product_variants" ("id");

ALTER TABLE "product_variants" ADD FOREIGN KEY ("color_id") REFERENCES "colors" ("id");

ALTER TABLE "product_variants" ADD FOREIGN KEY ("size_id") REFERENCES "sizes" ("id");

ALTER TABLE "cart" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "addresses" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "favorites" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_promos" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "search_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_activity_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "support_tickets" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "support_tickets" ADD FOREIGN KEY ("assigned_to") REFERENCES "users" ("id");

ALTER TABLE "referrals" ADD FOREIGN KEY ("referrer_id") REFERENCES "users" ("id");

ALTER TABLE "referrals" ADD FOREIGN KEY ("referred_id") REFERENCES "users" ("id");

ALTER TABLE "refunds" ADD FOREIGN KEY ("processed_by") REFERENCES "users" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "payments" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "shipments" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "returns" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("shipping_address_id") REFERENCES "addresses" ("id");

ALTER TABLE "returns" ADD FOREIGN KEY ("order_item_id") REFERENCES "order_items" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("customer_id") REFERENCES "customer_profiles" ("id");

ALTER TABLE "customer_preferences" ADD FOREIGN KEY ("customer_id") REFERENCES "customer_profiles" ("id");

ALTER TABLE "promo_codes" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id");

ALTER TABLE "user_promos" ADD FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes" ("id");

ALTER TABLE "refunds" ADD FOREIGN KEY ("return_id") REFERENCES "returns" ("id");

ALTER TABLE "review_images" ADD FOREIGN KEY ("review_id") REFERENCES "reviews" ("id");
