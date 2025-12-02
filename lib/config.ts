// Supabase Configuration
// Add your Supabase credentials here

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://supabasekong-rwkgssg8css8s84occsk0c0k.xdots.co.zw';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1OTUwODEwMCwiZXhwIjo0OTE1MTgxNzAwLCJyb2xlIjoiYW5vbiJ9.4LBSKKKFxpL7HwFm4IcU7Fap3VvwCDNukHZhBRGlvDw';

// API Configuration
export const API_CONFIG = {
    timeout: 30000,
    retries: 3,
};

// Storage bucket names
export const STORAGE_BUCKETS = {
    AVATARS: 'avatars',
    COVERS: 'covers',
    POSTS: 'posts',
    PROPERTIES: 'properties',
    LICENSES: 'licenses',
    REVIEWS: 'reviews',
    MESSAGES: 'messages',
    DESTINATIONS: 'destinations',
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
    // Auth
    USER: 'user',
    SESSION: 'session',

    // Users
    USERS: 'users',
    USER_PROFILE: 'userProfile',
    USER_POSTS: 'userPosts',
    FOLLOWERS: 'followers',
    FOLLOWING: 'following',

    // Posts
    POSTS: 'posts',
    POST: 'post',
    POST_COMMENTS: 'postComments',
    POST_LIKES: 'postLikes',
    FEED: 'feed',
    STORIES: 'stories',

    // Destinations
    DESTINATIONS: 'destinations',
    DESTINATION: 'destination',
    DESTINATION_POSTS: 'destinationPosts',

    // Properties
    PROPERTIES: 'properties',
    PROPERTY: 'property',
    PROPERTY_AVAILABILITY: 'propertyAvailability',
    MY_PROPERTIES: 'myProperties',

    // Bookings
    BOOKINGS: 'bookings',
    BOOKING: 'booking',
    MY_BOOKINGS: 'myBookings',
    PROVIDER_BOOKINGS: 'providerBookings',

    // Reviews
    REVIEWS: 'reviews',
    PROPERTY_REVIEWS: 'propertyReviews',

    // Messages
    CONVERSATIONS: 'conversations',
    MESSAGES: 'messages',
    UNREAD_COUNT: 'unreadCount',

    // Notifications
    NOTIFICATIONS: 'notifications',
    UNREAD_NOTIFICATIONS: 'unreadNotifications',

    // Wallet
    WALLET: 'wallet',
    TRANSACTIONS: 'transactions',

    // Groups
    GROUPS: 'groups',
    GROUP: 'group',
    GROUP_MEMBERS: 'groupMembers',
    GROUP_EXPENSES: 'groupExpenses',
    ITINERARY: 'itinerary',
} as const;

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    POSTS_PAGE_SIZE: 10,
    MESSAGES_PAGE_SIZE: 50,
    NOTIFICATIONS_PAGE_SIZE: 30,
} as const;
