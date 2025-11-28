# Supabase Database Schema Documentation

## 📊 Database Overview

This schema supports the complete Traverse-Visit application with **20+ tables**, **8 storage buckets**, and comprehensive **Row Level Security (RLS)** policies.

---

## 🗂️ Tables Summary

### Core Tables (6)
1. **users** - User profiles (travelers, providers, admins)
2. **destinations** - Travel destinations
3. **posts** - Social media posts (photos, videos, stories, reels)
4. **properties** - Accommodation listings
5. **bookings** - Reservation management
6. **reviews** - User reviews and ratings

### Social Tables (4)
7. **follows** - User follow relationships
8. **likes** - Post likes
9. **comments** - Post comments with replies
10. **reports** - Content moderation reports

### Messaging Tables (2)
11. **messages** - Direct messages
12. **conversations** - Message threads

### Financial Tables (2)
13. **wallets** - User wallet balances
14. **transactions** - Financial transactions

### Group Planning Tables (4)
15. **groups** - Trip planning groups
16. **group_members** - Group membership
17. **group_expenses** - Expense proposals
18. **group_expense_votes** - Voting on expenses
19. **itinerary_items** - Trip itinerary

### System Tables (2)
20. **notifications** - User notifications
21. **property_availability** - Property calendar

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with policies for:

- ✅ **Public Read** - Destinations, active posts, properties
- ✅ **Owner Access** - Users can manage their own data
- ✅ **Participant Access** - Messages, bookings, groups
- ✅ **Role-Based Access** - Admin-only operations

---

## 📦 Storage Buckets

### Public Buckets
1. **avatars** - User profile pictures
2. **covers** - Cover photos
3. **posts** - Post media (photos/videos)
4. **properties** - Property images
5. **reviews** - Review images
6. **destinations** - Destination images

### Private Buckets
7. **licenses** - Business licenses (provider-only)
8. **messages** - Message attachments (participants-only)

---

## 🔗 Key Relationships

```
users
  ├── posts (1:many)
  ├── properties (1:many)
  ├── bookings (1:many as guest)
  ├── bookings (1:many as provider)
  ├── follows (many:many)
  ├── messages (1:many)
  ├── groups (1:many)
  └── wallet (1:1)

destinations
  ├── posts (1:many)
  ├── properties (1:many)
  └── reviews (1:many)

properties
  ├── bookings (1:many)
  ├── reviews (1:many)
  └── availability (1:many)

bookings
  ├── reviews (1:1)
  └── transactions (1:many)

groups
  ├── members (1:many)
  ├── expenses (1:many)
  └── itinerary (1:many)
```

---

## 🎯 User Roles

### Traveler
- Browse destinations
- Book accommodations
- Post content
- Join groups
- Use wallet

### Provider
- All traveler features
- List properties
- Manage bookings
- View earnings
- Respond to reviews

### Admin
- All features
- Approve providers
- Moderate content
- Manage users
- View analytics

### Both
- Can switch between traveler and provider modes
- Separate data views for each role

---

## 🚀 Key Features

### 1. Social Features
- Follow/unfollow users
- Like, comment, share posts
- Stories (24hr expiry)
- Reels and live video support
- Content reporting

### 2. Booking System
- Property search and filtering
- Date-based availability
- Multi-currency support
- Escrow payments
- Review system

### 3. Messaging
- Direct user-to-user chat
- Conversation threads
- Read receipts
- File attachments
- Travel recommendations

### 4. Group Planning
- Create trip groups (5-25 members)
- Shared group wallet
- Expense proposals with voting (75% threshold)
- Collaborative itinerary
- Member contributions tracking

### 5. Wallet System
- Multi-currency balance
- Deposit/withdrawal
- Booking payments
- Loyalty points
- Transaction history

### 6. Provider Features
- Property management
- Availability calendar
- Booking requests
- Earnings tracking
- Review responses

---

## 📈 Performance Optimizations

### Indexes Created
- **Geographic indexes** (PostGIS) for location-based queries
- **Full-text search** indexes for users, destinations, properties
- **Composite indexes** for common query patterns
- **Foreign key indexes** for join performance

### Triggers
- Auto-update `updated_at` timestamps
- Auto-increment counters (likes, followers, etc.)
- Auto-create wallet on user signup
- Auto-generate booking references

---

## 🔧 How to Use

### 1. Setup Supabase Project
```bash
# Create new project at supabase.com
# Copy your project URL and anon key
```

### 2. Run Schema
```sql
-- Open Supabase SQL Editor
-- Copy entire supabase_schema.sql content
-- Paste and run
```

### 3. Verify Tables
```sql
-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 4. Test Storage Buckets
```sql
-- Check buckets created
SELECT * FROM storage.buckets;
```

---

## 🔒 Security Features

### Row Level Security
- ✅ Users can only see active accounts
- ✅ Users can only edit their own data
- ✅ Messages visible only to participants
- ✅ Bookings visible to guest and provider
- ✅ Group data visible to members only
- ✅ Admin-only operations protected

### Storage Security
- ✅ Public buckets for user-generated content
- ✅ Private buckets for sensitive documents
- ✅ Owner-only access for licenses
- ✅ Participant-only access for messages

---

## 📊 Data Types

### Custom Enums
- `user_role` - User account types
- `account_status` - Account states
- `booking_status` - Booking lifecycle
- `payment_status` - Payment states
- `property_status` - Property approval states
- `notification_type` - Notification categories
- `transaction_type` - Transaction categories
- `service_type` - Provider service types
- `post_type` - Content types

### Geographic Data
- Uses PostGIS extension
- `GEOGRAPHY(POINT, 4326)` for coordinates
- Supports distance queries
- Location-based search

---

## 🎨 Sample Queries

### Get User Feed
```sql
SELECT p.*, u.username, u.avatar_url, d.name as destination_name
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN destinations d ON p.destination_id = d.id
WHERE p.user_id IN (
    SELECT following_id FROM follows WHERE follower_id = 'user-id'
)
AND p.is_removed = false
ORDER BY p.created_at DESC
LIMIT 20;
```

### Search Properties
```sql
SELECT p.*, u.business_name, d.name as destination_name
FROM properties p
JOIN users u ON p.provider_id = u.id
LEFT JOIN destinations d ON p.destination_id = d.id
WHERE p.status = 'active'
AND p.is_active = true
AND p.max_guests >= 2
AND p.price_per_night BETWEEN 50 AND 200
ORDER BY p.average_rating DESC;
```

### Get User Bookings
```sql
SELECT b.*, p.name as property_name, p.cover_image_url
FROM bookings b
JOIN properties p ON b.property_id = p.id
WHERE b.guest_id = 'user-id'
AND b.status IN ('confirmed', 'pending')
ORDER BY b.check_in_date ASC;
```

---

## 🐛 Troubleshooting

### Issue: RLS blocking queries
**Solution**: Ensure user is authenticated and policies match your use case

### Issue: Storage upload fails
**Solution**: Check bucket policies and user authentication

### Issue: Triggers not firing
**Solution**: Verify trigger function exists and is attached to correct table

### Issue: Geographic queries slow
**Solution**: Ensure PostGIS extension is enabled and indexes created

---

## 📚 Next Steps

1. ✅ Run schema in Supabase
2. ✅ Test with sample data
3. ✅ Configure authentication providers
4. ✅ Set up storage buckets
5. ✅ Connect to React Native app
6. ✅ Implement API calls
7. ✅ Test RLS policies
8. ✅ Add sample destinations

---

**Schema Version**: 1.0.0  
**Last Updated**: 2025-11-28  
**Tables**: 21  
**Storage Buckets**: 8  
**RLS Policies**: 50+  
**Triggers**: 10+
