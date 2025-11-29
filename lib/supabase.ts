import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

// Database types (auto-generated from Supabase)
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    username: string | null;
                    full_name: string | null;
                    bio: string | null;
                    avatar_url: string | null;
                    cover_photo_url: string | null;
                    location: string | null;
                    location_coordinates: any | null;
                    phone: string | null;
                    phone_verified: boolean;
                    date_of_birth: string | null;
                    role: 'traveler' | 'provider' | 'admin' | 'both';
                    account_status: 'active' | 'suspended' | 'deleted' | 'pending_verification';
                    followers_count: number;
                    following_count: number;
                    posts_count: number;
                    business_name: string | null;
                    business_email: string | null;
                    business_phone: string | null;
                    business_license_url: string | null;
                    service_types: string[] | null;
                    provider_verified: boolean;
                    provider_rating: number;
                    provider_reviews_count: number;
                    travel_preferences: any;
                    notification_settings: any;
                    privacy_settings: any;
                    created_at: string;
                    updated_at: string;
                    last_login_at: string | null;
                };
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['users']['Insert']>;
                Relationships: [];
            };
            destinations: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    country: string;
                    city: string | null;
                    location_coordinates: any;
                    cover_image_url: string | null;
                    images_urls: string[] | null;
                    views_count: number;
                    posts_count: number;
                    bookings_count: number;
                    average_rating: number;
                    reviews_count: number;
                    min_budget_usd: number | null;
                    max_budget_usd: number | null;
                    currency: string | null;
                    categories: string[] | null;
                    tags: string[] | null;
                    weather_data: any | null;
                    weather_updated_at: string | null;
                    meta_title: string | null;
                    meta_description: string | null;
                    is_active: boolean;
                    is_featured: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['destinations']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['destinations']['Insert']>;
                Relationships: [];
            };
            posts: {
                Row: {
                    id: string;
                    user_id: string;
                    destination_id: string | null;
                    caption: string | null;
                    media_urls: string[];
                    media_type: 'photo' | 'video' | 'story' | 'reel' | 'live';
                    location_name: string | null;
                    location_coordinates: any | null;
                    min_budget: number | null;
                    currency: string | null;
                    likes_count: number;
                    comments_count: number;
                    shares_count: number;
                    views_count: number;
                    is_pinned: boolean;
                    is_story: boolean;
                    is_reel: boolean;
                    story_expires_at: string | null;
                    is_reported: boolean;
                    is_removed: boolean;
                    removed_reason: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['posts']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "posts_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "posts_destination_id_fkey";
                        columns: ["destination_id"];
                        isOneToOne: false;
                        referencedRelation: "destinations";
                        referencedColumns: ["id"];
                    }
                ];
            };
            follows: {
                Row: {
                    id: string;
                    follower_id: string;
                    following_id: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['follows']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['follows']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "follows_follower_id_fkey";
                        columns: ["follower_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "follows_following_id_fkey";
                        columns: ["following_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            likes: {
                Row: {
                    id: string;
                    user_id: string;
                    post_id: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['likes']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['likes']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "likes_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "likes_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            comments: {
                Row: {
                    id: string;
                    user_id: string;
                    post_id: string;
                    parent_comment_id: string | null;
                    content: string;
                    likes_count: number;
                    replies_count: number;
                    is_reported: boolean;
                    is_removed: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['comments']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "comments_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comments_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            properties: {
                Row: {
                    id: string;
                    provider_id: string;
                    destination_id: string | null;
                    name: string;
                    description: string | null;
                    property_type: string | null;
                    address: string;
                    city: string;
                    country: string;
                    location_coordinates: any;
                    cover_image_url: string | null;
                    images_urls: string[] | null;
                    virtual_tour_url: string | null;
                    max_guests: number;
                    bedrooms: number | null;
                    beds: number | null;
                    bathrooms: number | null;
                    amenities: string[] | null;
                    house_rules: string[] | null;
                    price_per_night: number;
                    currency: string | null;
                    cleaning_fee: number | null;
                    service_fee_percentage: number | null;
                    min_nights: number | null;
                    max_nights: number | null;
                    check_in_time: string | null;
                    check_out_time: string | null;
                    cancellation_policy: string | null;
                    instant_book: boolean;
                    average_rating: number;
                    reviews_count: number;
                    bookings_count: number;
                    views_count: number;
                    status: 'draft' | 'pending_approval' | 'active' | 'inactive' | 'rejected';
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['properties']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "properties_destination_id_fkey";
                        columns: ["destination_id"];
                        isOneToOne: false;
                        referencedRelation: "destinations";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "properties_provider_id_fkey";
                        columns: ["provider_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            property_availability: {
                Row: {
                    id: string;
                    property_id: string;
                    date: string;
                    is_available: boolean;
                    price_override: number | null;
                    min_nights_override: number | null;
                    notes: string | null;
                };
                Insert: Omit<Database['public']['Tables']['property_availability']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['property_availability']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "property_availability_property_id_fkey";
                        columns: ["property_id"];
                        isOneToOne: false;
                        referencedRelation: "properties";
                        referencedColumns: ["id"];
                    }
                ];
            };
            bookings: {
                Row: {
                    id: string;
                    booking_reference: string;
                    guest_id: string;
                    provider_id: string;
                    property_id: string;
                    check_in_date: string;
                    check_out_date: string;
                    nights: number;
                    adults: number;
                    children: number;
                    infants: number;
                    total_guests: number;
                    price_per_night: number;
                    total_nights_cost: number;
                    cleaning_fee: number | null;
                    service_fee: number | null;
                    total_amount: number;
                    currency: string | null;
                    payment_method: string | null;
                    payment_status: 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';
                    paid_amount: number | null;
                    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
                    guest_message: string | null;
                    special_requests: string | null;
                    cancelled_at: string | null;
                    cancelled_by: string | null;
                    cancellation_reason: string | null;
                    refund_amount: number | null;
                    created_at: string;
                    updated_at: string;
                    confirmed_at: string | null;
                    completed_at: string | null;
                };
                Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "bookings_guest_id_fkey";
                        columns: ["guest_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "bookings_property_id_fkey";
                        columns: ["property_id"];
                        isOneToOne: false;
                        referencedRelation: "properties";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "bookings_provider_id_fkey";
                        columns: ["provider_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            reviews: {
                Row: {
                    id: string;
                    booking_id: string | null;
                    reviewer_id: string;
                    reviewee_id: string;
                    property_id: string | null;
                    destination_id: string | null;
                    rating: number;
                    title: string | null;
                    content: string;
                    cleanliness_rating: number | null;
                    communication_rating: number | null;
                    location_rating: number | null;
                    value_rating: number | null;
                    images_urls: string[] | null;
                    helpful_count: number;
                    response_text: string | null;
                    response_at: string | null;
                    is_verified: boolean;
                    is_reported: boolean;
                    is_removed: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "reviews_booking_id_fkey";
                        columns: ["booking_id"];
                        isOneToOne: false;
                        referencedRelation: "bookings";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reviews_destination_id_fkey";
                        columns: ["destination_id"];
                        isOneToOne: false;
                        referencedRelation: "destinations";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reviews_property_id_fkey";
                        columns: ["property_id"];
                        isOneToOne: false;
                        referencedRelation: "properties";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reviews_reviewee_id_fkey";
                        columns: ["reviewee_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reviews_reviewer_id_fkey";
                        columns: ["reviewer_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    sender_id: string;
                    recipient_id: string;
                    content: string | null;
                    media_urls: string[] | null;
                    message_type: string | null;
                    metadata: any | null;
                    is_read: boolean;
                    read_at: string | null;
                    is_deleted_by_sender: boolean;
                    is_deleted_by_recipient: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['messages']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "messages_conversation_id_fkey";
                        columns: ["conversation_id"];
                        isOneToOne: false;
                        referencedRelation: "conversations";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "messages_recipient_id_fkey";
                        columns: ["recipient_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey";
                        columns: ["sender_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            conversations: {
                Row: {
                    id: string;
                    participant_1_id: string;
                    participant_2_id: string;
                    last_message_id: string | null;
                    last_message_at: string | null;
                    unread_count_p1: number;
                    unread_count_p2: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "conversations_last_message_id_fkey";
                        columns: ["last_message_id"];
                        isOneToOne: false;
                        referencedRelation: "messages";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "conversations_participant_1_id_fkey";
                        columns: ["participant_1_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "conversations_participant_2_id_fkey";
                        columns: ["participant_2_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            notifications: {
                Row: {
                    id: string;
                    user_id: string;
                    type: 'booking' | 'social' | 'system' | 'payment' | 'message';
                    title: string;
                    message: string;
                    related_user_id: string | null;
                    related_post_id: string | null;
                    related_booking_id: string | null;
                    action_url: string | null;
                    action_data: any | null;
                    is_read: boolean;
                    read_at: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "notifications_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            wallets: {
                Row: {
                    id: string;
                    user_id: string;
                    balance: number;
                    currency: string | null;
                    loyalty_points: number;
                    loyalty_tier: string | null;
                    is_active: boolean;
                    is_frozen: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['wallets']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['wallets']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "wallets_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: true;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            transactions: {
                Row: {
                    id: string;
                    wallet_id: string;
                    user_id: string;
                    type: 'deposit' | 'withdrawal' | 'booking_payment' | 'refund' | 'loyalty_reward' | 'group_contribution';
                    amount: number;
                    currency: string | null;
                    balance_before: number;
                    balance_after: number;
                    booking_id: string | null;
                    group_id: string | null;
                    payment_method: string | null;
                    payment_reference: string | null;
                    description: string | null;
                    metadata: any | null;
                    status: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "transactions_booking_id_fkey";
                        columns: ["booking_id"];
                        isOneToOne: false;
                        referencedRelation: "bookings";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "transactions_group_id_fkey";
                        columns: ["group_id"];
                        isOneToOne: false;
                        referencedRelation: "groups";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "transactions_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "transactions_wallet_id_fkey";
                        columns: ["wallet_id"];
                        isOneToOne: false;
                        referencedRelation: "wallets";
                        referencedColumns: ["id"];
                    }
                ];
            };
            groups: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    cover_image_url: string | null;
                    admin_id: string;
                    destination_id: string | null;
                    trip_start_date: string | null;
                    trip_end_date: string | null;
                    wallet_balance: number;
                    members_count: number;
                    max_members: number;
                    requires_approval: boolean;
                    voting_threshold: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['groups']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['groups']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "groups_admin_id_fkey";
                        columns: ["admin_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "groups_destination_id_fkey";
                        columns: ["destination_id"];
                        isOneToOne: false;
                        referencedRelation: "destinations";
                        referencedColumns: ["id"];
                    }
                ];
            };
            group_members: {
                Row: {
                    id: string;
                    group_id: string;
                    user_id: string;
                    role: string | null;
                    contributed_amount: number;
                    status: string | null;
                    joined_at: string;
                };
                Insert: Omit<Database['public']['Tables']['group_members']['Row'], 'id' | 'joined_at'>;
                Update: Partial<Database['public']['Tables']['group_members']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "group_members_group_id_fkey";
                        columns: ["group_id"];
                        isOneToOne: false;
                        referencedRelation: "groups";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "group_members_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            group_expenses: {
                Row: {
                    id: string;
                    group_id: string;
                    proposed_by: string;
                    title: string;
                    description: string | null;
                    amount: number;
                    category: string | null;
                    votes_for: number;
                    votes_against: number;
                    votes_required: number;
                    status: string | null;
                    created_at: string;
                    approved_at: string | null;
                    completed_at: string | null;
                };
                Insert: Omit<Database['public']['Tables']['group_expenses']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['group_expenses']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "group_expenses_group_id_fkey";
                        columns: ["group_id"];
                        isOneToOne: false;
                        referencedRelation: "groups";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "group_expenses_proposed_by_fkey";
                        columns: ["proposed_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            group_expense_votes: {
                Row: {
                    id: string;
                    expense_id: string;
                    user_id: string;
                    vote: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['group_expense_votes']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['group_expense_votes']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "group_expense_votes_expense_id_fkey";
                        columns: ["expense_id"];
                        isOneToOne: false;
                        referencedRelation: "group_expenses";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "group_expense_votes_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            itinerary_items: {
                Row: {
                    id: string;
                    group_id: string;
                    created_by: string;
                    title: string;
                    description: string | null;
                    location: string | null;
                    location_coordinates: any | null;
                    date: string;
                    start_time: string | null;
                    end_time: string | null;
                    duration_minutes: number | null;
                    estimated_cost: number | null;
                    booking_id: string | null;
                    order_index: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['itinerary_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['itinerary_items']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "itinerary_items_booking_id_fkey";
                        columns: ["booking_id"];
                        isOneToOne: false;
                        referencedRelation: "bookings";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "itinerary_items_created_by_fkey";
                        columns: ["created_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "itinerary_items_group_id_fkey";
                        columns: ["group_id"];
                        isOneToOne: false;
                        referencedRelation: "groups";
                        referencedColumns: ["id"];
                    }
                ];
            };
            reports: {
                Row: {
                    id: string;
                    reporter_id: string;
                    reported_post_id: string | null;
                    reported_comment_id: string | null;
                    reported_user_id: string | null;
                    reason: string;
                    description: string | null;
                    status: string | null;
                    reviewed_by: string | null;
                    reviewed_at: string | null;
                    resolution: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['reports']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "reports_reported_comment_id_fkey";
                        columns: ["reported_comment_id"];
                        isOneToOne: false;
                        referencedRelation: "comments";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reports_reported_post_id_fkey";
                        columns: ["reported_post_id"];
                        isOneToOne: false;
                        referencedRelation: "posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reports_reported_user_id_fkey";
                        columns: ["reported_user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reports_reporter_id_fkey";
                        columns: ["reporter_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reports_reviewed_by_fkey";
                        columns: ["reviewed_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
    };
};

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Helper function to get current user
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

// Helper function to get current session
export const getCurrentSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
};

// Upload file to storage
export const uploadFile = async (
    bucket: string,
    path: string,
    file: Blob | File,
    options?: { contentType?: string; cacheControl?: string }
) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, options);

    if (error) throw error;
    return data;
};

// Get public URL for file
export const getPublicUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
};

// Delete file from storage
export const deleteFile = async (bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
};

// Real-time subscription helper
export const subscribeToTable = <T = any>(
    table: string,
    callback: (payload: any) => void,
    filter?: string
) => {
    const channel = supabase
        .channel(`${table}_changes`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table, filter },
            callback
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
