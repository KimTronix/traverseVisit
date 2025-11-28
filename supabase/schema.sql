-- =====================================================
-- TRAVERSE-VISIT SUPABASE DATABASE SCHEMA
-- Complete SQL for all tables, relationships, policies, and storage
-- =====================================================
-- =====================================================
-- 1. ENABLE EXTENSIONS
-- =====================================================
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable PostGIS for location data
CREATE EXTENSION IF NOT EXISTS "postgis";
-- =====================================================
-- 2. CREATE ENUMS
-- =====================================================
-- User roles
CREATE TYPE user_role AS ENUM ('traveler', 'provider', 'admin', 'both');
-- Account status
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted', 'pending_verification');
-- Booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'rejected');
-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'refunded', 'failed');
-- Property status
CREATE TYPE property_status AS ENUM ('draft', 'pending_approval', 'active', 'inactive', 'rejected');
-- Notification type
CREATE TYPE notification_type AS ENUM ('booking', 'social', 'system', 'payment', 'message');
-- Transaction type
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'booking_payment', 'refund', 'loyalty_reward', 'group_contribution');
-- Service type
CREATE TYPE service_type AS ENUM ('accommodation', 'transport', 'tour_guide', 'restaurant', 'activity');
-- Post type
CREATE TYPE post_type AS ENUM ('photo', 'video', 'story', 'reel', 'live');
-- =====================================================
-- 3. CREATE TABLES
-- =====================================================
-- -----------------------------------------------------
-- Users Table (extends Supabase auth.users)
-- -----------------------------------------------------
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_photo_url TEXT,
    location TEXT,
    location_coordinates GEOGRAPHY(POINT, 4326),
    phone TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    date_of_birth DATE,
    
    -- Role and status
    role user_role DEFAULT 'traveler',
    account_status account_status DEFAULT 'active',
    
    -- Social stats
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Provider info (if role includes provider)
    business_name TEXT,
    business_email TEXT,
    business_phone TEXT,
    business_license_url TEXT,
    service_types service_type[],
    provider_verified BOOLEAN DEFAULT FALSE,
    provider_rating DECIMAL(3,2) DEFAULT 0.00,
    provider_reviews_count INTEGER DEFAULT 0,
    
    -- Preferences
    travel_preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    privacy_settings JSONB DEFAULT '{"profile_visible": true, "show_location": true}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT username_length CHECK (char_length(username) >= 3),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
-- Create indexes
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_account_status ON public.users(account_status);
CREATE INDEX idx_users_location ON public.users USING GIST(location_coordinates);
-- -----------------------------------------------------
-- Destinations Table
-- -----------------------------------------------------
CREATE TABLE public.destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    country TEXT NOT NULL,
    city TEXT,
    location_coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
    
    -- Media
    cover_image_url TEXT,
    images_urls TEXT[],
    
    -- Stats
    views_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    bookings_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    reviews_count INTEGER DEFAULT 0,
    
    -- Budget info
    min_budget_usd DECIMAL(10,2),
    max_budget_usd DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    
    -- Categories
    categories TEXT[],
    tags TEXT[],
    
    -- Weather (cached)
    weather_data JSONB,
    weather_updated_at TIMESTAMPTZ,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_destinations_slug ON public.destinations(slug);
CREATE INDEX idx_destinations_country ON public.destinations(country);
CREATE INDEX idx_destinations_location ON public.destinations USING GIST(location_coordinates);
CREATE INDEX idx_destinations_categories ON public.destinations USING GIN(categories);
CREATE INDEX idx_destinations_is_active ON public.destinations(is_active);
-- -----------------------------------------------------
-- Posts Table
-- -----------------------------------------------------
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    
    -- Content
    caption TEXT,
    media_urls TEXT[] NOT NULL,
    media_type post_type DEFAULT 'photo',
    
    -- Location
    location_name TEXT,
    location_coordinates GEOGRAPHY(POINT, 4326),
    
    -- Budget
    min_budget DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- Features
    is_pinned BOOLEAN DEFAULT FALSE,
    is_story BOOLEAN DEFAULT FALSE,
    is_reel BOOLEAN DEFAULT FALSE,
    story_expires_at TIMESTAMPTZ,
    
    -- Moderation
    is_reported BOOLEAN DEFAULT FALSE,
    is_removed BOOLEAN DEFAULT FALSE,
    removed_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_destination_id ON public.posts(destination_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_is_story ON public.posts(is_story) WHERE is_story = TRUE;
CREATE INDEX idx_posts_location ON public.posts USING GIST(location_coordinates);
-- -----------------------------------------------------
-- Follows Table (Social Graph)
-- -----------------------------------------------------
CREATE TABLE public.follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT no_self_follow CHECK (follower_id != following_id),
    CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);
-- Create indexes
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
-- -----------------------------------------------------
-- Likes Table
-- -----------------------------------------------------
CREATE TABLE public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_like UNIQUE (user_id, post_id)
);
-- Create indexes
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_post_id ON public.likes(post_id);
-- -----------------------------------------------------
-- Comments Table
-- -----------------------------------------------------
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    
    -- Content
    content TEXT NOT NULL,
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_reported BOOLEAN DEFAULT FALSE,
    is_removed BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);
-- Create indexes
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_comment_id);
-- -----------------------------------------------------
-- Properties Table (Accommodations)
-- -----------------------------------------------------
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    
    -- Basic info
    name TEXT NOT NULL,
    description TEXT,
    property_type TEXT, -- hotel, apartment, villa, hostel, etc.
    
    -- Location
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    location_coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
    
    -- Media
    cover_image_url TEXT,
    images_urls TEXT[],
    virtual_tour_url TEXT,
    
    -- Capacity
    max_guests INTEGER NOT NULL,
    bedrooms INTEGER,
    beds INTEGER,
    bathrooms DECIMAL(3,1),
    
    -- Amenities
    amenities TEXT[],
    house_rules TEXT[],
    
    -- Pricing
    price_per_night DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    cleaning_fee DECIMAL(10,2) DEFAULT 0,
    service_fee_percentage DECIMAL(5,2) DEFAULT 10.00,
    
    -- Availability
    min_nights INTEGER DEFAULT 1,
    max_nights INTEGER,
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    
    -- Policies
    cancellation_policy TEXT,
    instant_book BOOLEAN DEFAULT FALSE,
    
    -- Stats
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    reviews_count INTEGER DEFAULT 0,
    bookings_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- Status
    status property_status DEFAULT 'draft',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_price CHECK (price_per_night > 0),
    CONSTRAINT valid_guests CHECK (max_guests > 0)
);
-- Create indexes
CREATE INDEX idx_properties_provider_id ON public.properties(provider_id);
CREATE INDEX idx_properties_destination_id ON public.properties(destination_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_location ON public.properties USING GIST(location_coordinates);
CREATE INDEX idx_properties_price ON public.properties(price_per_night);
-- -----------------------------------------------------
-- Property Availability Table
-- -----------------------------------------------------
CREATE TABLE public.property_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    price_override DECIMAL(10,2),
    min_nights_override INTEGER,
    notes TEXT,
    
    -- Constraints
    CONSTRAINT unique_property_date UNIQUE (property_id, date)
);
-- Create indexes
CREATE INDEX idx_property_availability_property_id ON public.property_availability(property_id);
CREATE INDEX idx_property_availability_date ON public.property_availability(date);
-- -----------------------------------------------------
-- Bookings Table
-- -----------------------------------------------------
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT UNIQUE NOT NULL,
    
    -- Parties
    guest_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    
    -- Dates
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights INTEGER NOT NULL,
    
    -- Guests
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER DEFAULT 0,
    infants INTEGER DEFAULT 0,
    total_guests INTEGER NOT NULL,
    
    -- Pricing
    price_per_night DECIMAL(10,2) NOT NULL,
    total_nights_cost DECIMAL(10,2) NOT NULL,
    cleaning_fee DECIMAL(10,2) DEFAULT 0,
    service_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Payment
    payment_method TEXT,
    payment_status payment_status DEFAULT 'pending',
    paid_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Status
    status booking_status DEFAULT 'pending',
    
    -- Special requests
    guest_message TEXT,
    special_requests TEXT,
    
    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES public.users(id),
    cancellation_reason TEXT,
    refund_amount DECIMAL(10,2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (check_out_date > check_in_date),
    CONSTRAINT valid_guests CHECK (total_guests > 0),
    CONSTRAINT valid_amount CHECK (total_amount >= 0)
);
-- Create indexes
CREATE INDEX idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);
-- -----------------------------------------------------
-- Reviews Table
-- -----------------------------------------------------
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    
    -- Detailed ratings
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    
    -- Media
    images_urls TEXT[],
    
    -- Engagement
    helpful_count INTEGER DEFAULT 0,
    
    -- Response
    response_text TEXT,
    response_at TIMESTAMPTZ,
    
    -- Moderation
    is_verified BOOLEAN DEFAULT FALSE,
    is_reported BOOLEAN DEFAULT FALSE,
    is_removed BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX idx_reviews_destination_id ON public.reviews(destination_id);
CREATE INDEX idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON public.reviews(reviewee_id);
-- -----------------------------------------------------
-- Messages Table (Direct Messaging)
-- -----------------------------------------------------
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Content
    content TEXT,
    media_urls TEXT[],
    message_type TEXT DEFAULT 'text', -- text, image, booking_request, etc.
    
    -- Metadata
    metadata JSONB, -- For booking quick actions, travel recommendations, etc.
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_deleted_by_sender BOOLEAN DEFAULT FALSE,
    is_deleted_by_recipient BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
-- -----------------------------------------------------
-- Conversations Table
-- -----------------------------------------------------
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    participant_2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Last message
    last_message_id UUID REFERENCES public.messages(id),
    last_message_at TIMESTAMPTZ,
    
    -- Unread counts
    unread_count_p1 INTEGER DEFAULT 0,
    unread_count_p2 INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_conversation UNIQUE (participant_1_id, participant_2_id),
    CONSTRAINT no_self_conversation CHECK (participant_1_id != participant_2_id)
);
-- Create indexes
CREATE INDEX idx_conversations_participant_1 ON public.conversations(participant_1_id);
CREATE INDEX idx_conversations_participant_2 ON public.conversations(participant_2_id);
-- -----------------------------------------------------
-- Notifications Table
-- -----------------------------------------------------
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Content
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    related_user_id UUID REFERENCES public.users(id),
    related_post_id UUID REFERENCES public.posts(id),
    related_booking_id UUID REFERENCES public.bookings(id),
    
    -- Action
    action_url TEXT,
    action_data JSONB,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
-- -----------------------------------------------------
-- Wallet Table
-- -----------------------------------------------------
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Balance
    balance DECIMAL(12,2) DEFAULT 0.00 CHECK (balance >= 0),
    currency TEXT DEFAULT 'USD',
    
    -- Loyalty points
    loyalty_points INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
    loyalty_tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_frozen BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);
-- -----------------------------------------------------
-- Transactions Table
-- -----------------------------------------------------
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Transaction details
    type transaction_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Balance tracking
    balance_before DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,
    
    -- Related entities
    booking_id UUID REFERENCES public.bookings(id),
    group_id UUID, -- FK constraint added later after groups table is created
    
    -- Payment details
    payment_method TEXT,
    payment_reference TEXT,
    
    -- Description
    description TEXT,
    metadata JSONB,
    
    -- Status
    status TEXT DEFAULT 'completed', -- pending, completed, failed, reversed
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_transactions_wallet_id ON public.transactions(wallet_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
-- -----------------------------------------------------
-- Groups Table (Trip Planning)
-- -----------------------------------------------------
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    
    -- Admin
    admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Destination
    destination_id UUID REFERENCES public.destinations(id),
    
    -- Trip details
    trip_start_date DATE,
    trip_end_date DATE,
    
    -- Group wallet
    wallet_balance DECIMAL(12,2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
    
    -- Members
    members_count INTEGER DEFAULT 1,
    max_members INTEGER DEFAULT 25 CHECK (max_members >= 5 AND max_members <= 25),
    
    -- Settings
    requires_approval BOOLEAN DEFAULT TRUE,
    voting_threshold DECIMAL(5,2) DEFAULT 75.00, -- 75% for withdrawals
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_groups_admin_id ON public.groups(admin_id);
CREATE INDEX idx_groups_destination_id ON public.groups(destination_id);
-- -----------------------------------------------------
-- Group Members Table
-- -----------------------------------------------------
CREATE TABLE public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Role
    role TEXT DEFAULT 'member', -- admin, member
    
    -- Contribution
    contributed_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- Status
    status TEXT DEFAULT 'active', -- pending, active, left
    
    -- Timestamps
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_group_member UNIQUE (group_id, user_id)
);
-- Create indexes
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
-- -----------------------------------------------------
-- Group Expenses Table
-- -----------------------------------------------------
CREATE TABLE public.group_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    proposed_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Expense details
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    category TEXT, -- accommodation, transport, food, activity, etc.
    
    -- Voting
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    votes_required INTEGER NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);
-- Create indexes
CREATE INDEX idx_group_expenses_group_id ON public.group_expenses(group_id);
CREATE INDEX idx_group_expenses_status ON public.group_expenses(status);
-- -----------------------------------------------------
-- Group Expense Votes Table
-- -----------------------------------------------------
CREATE TABLE public.group_expense_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES public.group_expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vote BOOLEAN NOT NULL, -- true = for, false = against
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_expense_vote UNIQUE (expense_id, user_id)
);
-- Create indexes
CREATE INDEX idx_expense_votes_expense_id ON public.group_expense_votes(expense_id);
-- -----------------------------------------------------
-- Itinerary Items Table
-- -----------------------------------------------------
CREATE TABLE public.itinerary_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Item details
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    location_coordinates GEOGRAPHY(POINT, 4326),
    
    -- Timing
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_minutes INTEGER,
    
    -- Cost
    estimated_cost DECIMAL(10,2),
    
    -- Booking
    booking_id UUID REFERENCES public.bookings(id),
    
    -- Order
    order_index INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_itinerary_group_id ON public.itinerary_items(group_id);
CREATE INDEX idx_itinerary_date ON public.itinerary_items(date);
-- -----------------------------------------------------
-- Reports Table (Content Moderation)
-- -----------------------------------------------------
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Reported entity
    reported_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    reported_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Report details
    reason TEXT NOT NULL, -- spam, inappropriate, misinformation, harassment, other
    description TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending', -- pending, reviewing, resolved, dismissed
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    resolution TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_post_id ON public.reports(reported_post_id);
-- =====================================================
-- 4. CREATE STORAGE BUCKETS
-- =====================================================
-- User avatars and covers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true);
-- Post media (photos, videos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posts', 'posts', true);
-- Property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('properties', 'properties', true);
-- Business licenses (private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('licenses', 'licenses', false);
-- Review images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reviews', 'reviews', true);
-- Message attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('messages', 'messages', false);
-- Destination images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('destinations', 'destinations', true);
-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_expense_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
-- -----------------------------------------------------
-- Users Policies
-- -----------------------------------------------------
-- Anyone can view active users
CREATE POLICY "Users are viewable by everyone" 
ON public.users FOR SELECT 
USING (account_status = 'active');
-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);
-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);
-- -----------------------------------------------------
-- Destinations Policies
-- -----------------------------------------------------
-- Everyone can view active destinations
CREATE POLICY "Destinations are viewable by everyone" 
ON public.destinations FOR SELECT 
USING (is_active = true);
-- Only admins can insert/update/delete destinations
CREATE POLICY "Only admins can modify destinations" 
ON public.destinations FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
-- -----------------------------------------------------
-- Posts Policies
-- -----------------------------------------------------
-- Everyone can view non-removed posts
CREATE POLICY "Posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (is_removed = false);
-- Users can insert their own posts
CREATE POLICY "Users can create posts" 
ON public.posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);
-- Users can update their own posts
CREATE POLICY "Users can update own posts" 
ON public.posts FOR UPDATE 
USING (auth.uid() = user_id);
-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" 
ON public.posts FOR DELETE 
USING (auth.uid() = user_id);
-- -----------------------------------------------------
-- Follows Policies
-- -----------------------------------------------------
-- Users can view all follows
CREATE POLICY "Follows are viewable by everyone" 
ON public.follows FOR SELECT 
USING (true);
-- Users can follow others
CREATE POLICY "Users can follow others" 
ON public.follows FOR INSERT 
WITH CHECK (auth.uid() = follower_id);
-- Users can unfollow
CREATE POLICY "Users can unfollow" 
ON public.follows FOR DELETE 
USING (auth.uid() = follower_id);
-- -----------------------------------------------------
-- Likes Policies
-- -----------------------------------------------------
-- Users can view all likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.likes FOR SELECT 
USING (true);
-- Users can like posts
CREATE POLICY "Users can like posts" 
ON public.likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);
-- Users can unlike posts
CREATE POLICY "Users can unlike posts" 
ON public.likes FOR DELETE 
USING (auth.uid() = user_id);
-- -----------------------------------------------------
-- Comments Policies
-- -----------------------------------------------------
-- Everyone can view non-removed comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (is_removed = false);
-- Users can create comments
CREATE POLICY "Users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);
-- Users can update their own comments
CREATE POLICY "Users can update own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id);
-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" 
ON public.comments FOR DELETE 
USING (auth.uid() = user_id);
-- -----------------------------------------------------
-- Properties Policies
-- -----------------------------------------------------
-- Everyone can view active properties
CREATE POLICY "Active properties are viewable by everyone" 
ON public.properties FOR SELECT 
USING (status = 'active' AND is_active = true);
-- Providers can insert their own properties
CREATE POLICY "Providers can create properties" 
ON public.properties FOR INSERT 
WITH CHECK (
    auth.uid() = provider_id AND 
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('provider', 'both')
    )
);
-- Providers can update their own properties
CREATE POLICY "Providers can update own properties" 
ON public.properties FOR UPDATE 
USING (auth.uid() = provider_id);
-- Providers can delete their own properties
CREATE POLICY "Providers can delete own properties" 
ON public.properties FOR DELETE 
USING (auth.uid() = provider_id);
-- -----------------------------------------------------
-- Bookings Policies
-- -----------------------------------------------------
-- Users can view their own bookings (as guest or provider)
CREATE POLICY "Users can view own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = guest_id OR auth.uid() = provider_id);
-- Users can create bookings
CREATE POLICY "Users can create bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = guest_id);
-- Users can update their own bookings
CREATE POLICY "Users can update own bookings" 
ON public.bookings FOR UPDATE 
USING (auth.uid() = guest_id OR auth.uid() = provider_id);
-- -----------------------------------------------------
-- Messages Policies
-- -----------------------------------------------------
-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages" 
ON public.messages FOR SELECT 
USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id
);
-- Users can send messages
CREATE POLICY "Users can send messages" 
ON public.messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);
-- Users can update their own messages
CREATE POLICY "Users can update own messages" 
ON public.messages FOR UPDATE 
USING (auth.uid() = sender_id);
-- -----------------------------------------------------
-- Conversations Policies
-- -----------------------------------------------------
-- Users can view their own conversations
CREATE POLICY "Users can view own conversations" 
ON public.conversations FOR SELECT 
USING (
    auth.uid() = participant_1_id OR 
    auth.uid() = participant_2_id
);
-- Users can create conversations
CREATE POLICY "Users can create conversations" 
ON public.conversations FOR INSERT 
WITH CHECK (
    auth.uid() = participant_1_id OR 
    auth.uid() = participant_2_id
);
-- -----------------------------------------------------
-- Notifications Policies
-- -----------------------------------------------------
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);
-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);
-- -----------------------------------------------------
-- Wallets Policies
-- -----------------------------------------------------
-- Users can view their own wallet
CREATE POLICY "Users can view own wallet" 
ON public.wallets FOR SELECT 
USING (auth.uid() = user_id);
-- Users can update their own wallet
CREATE POLICY "Users can update own wallet" 
ON public.wallets FOR UPDATE 
USING (auth.uid() = user_id);
-- -----------------------------------------------------
-- Transactions Policies
-- -----------------------------------------------------
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);
-- Users can insert their own transactions
CREATE POLICY "Users can create transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);
-- -----------------------------------------------------
-- Groups Policies
-- -----------------------------------------------------
-- Users can view groups they're members of
CREATE POLICY "Users can view own groups" 
ON public.groups FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = id AND user_id = auth.uid()
    )
);
-- Users can create groups
CREATE POLICY "Users can create groups" 
ON public.groups FOR INSERT 
WITH CHECK (auth.uid() = admin_id);
-- Group admins can update their groups
CREATE POLICY "Admins can update groups" 
ON public.groups FOR UPDATE 
USING (auth.uid() = admin_id);
-- -----------------------------------------------------
-- Group Members Policies
-- -----------------------------------------------------
-- Users can view members of groups they're in
CREATE POLICY "Users can view group members" 
ON public.group_members FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.group_members gm 
        WHERE gm.group_id = group_id AND gm.user_id = auth.uid()
    )
);
-- Group admins can add members
CREATE POLICY "Admins can add members" 
ON public.group_members FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.groups 
        WHERE id = group_id AND admin_id = auth.uid()
    )
);
-- -----------------------------------------------------
-- Storage Policies
-- -----------------------------------------------------
-- Avatars: Anyone can view, only owner can upload
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
-- Posts: Anyone can view, authenticated users can upload
CREATE POLICY "Post images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'posts');
CREATE POLICY "Authenticated users can upload posts" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'posts' AND 
    auth.role() = 'authenticated'
);
-- Properties: Anyone can view, providers can upload
CREATE POLICY "Property images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'properties');
CREATE POLICY "Providers can upload property images" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'properties' AND 
    auth.role() = 'authenticated'
);
-- Licenses: Only owner and admins can view
CREATE POLICY "Only owner can view license" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'licenses' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can upload their license" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'licenses' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
-- Messages: Only participants can view
CREATE POLICY "Only participants can view message attachments" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'messages' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can upload message attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'messages' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
-- =====================================================
-- 6. FUNCTIONS AND TRIGGERS
-- =====================================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Function to increment/decrement counters
CREATE OR REPLACE FUNCTION increment_counter(
    table_name TEXT,
    column_name TEXT,
    row_id UUID,
    increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', 
        table_name, column_name, column_name)
    USING increment, row_id;
END;
$$ LANGUAGE plpgsql;
-- Trigger to update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_likes_count AFTER INSERT OR DELETE ON public.likes
    FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();
-- Trigger to update followers/following counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
        UPDATE public.users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.users SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
        UPDATE public.users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_follow_counts_trigger AFTER INSERT OR DELETE ON public.follows
    FOR EACH ROW EXECUTE FUNCTION update_follow_counts();
-- Function to create wallet on user signup
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.wallets (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER create_wallet_on_signup AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION create_user_wallet();
-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference = 'BK-' || UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_booking_reference BEFORE INSERT ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION generate_booking_reference();
-- =====================================================
-- 7. ADD DEFERRED FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Add group_id foreign key to transactions (after groups table exists)
ALTER TABLE public.transactions 
ADD CONSTRAINT fk_transactions_group_id 
FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;

-- =====================================================
-- 8. INDEXES FOR PERFORMANCE
-- =====================================================
-- Full-text search indexes
CREATE INDEX idx_users_search ON public.users USING GIN(
    to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(username, '') || ' ' || coalesce(bio, ''))
);
CREATE INDEX idx_destinations_search ON public.destinations USING GIN(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, '') || ' ' || coalesce(country, ''))
);
CREATE INDEX idx_properties_search ON public.properties USING GIN(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, ''))
);
-- =====================================================
-- END OF SCHEMA
-- =====================================================
-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
