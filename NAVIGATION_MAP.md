# Complete Navigation Map - Traverse-Visit App

## 🗺️ All Screens & How to Access Them

### ✅ ACCESSIBLE SCREENS

#### 1. **Login Screen** `/login`
- **Access**: App opens here (initial route)
- **Navigation**: 
  - → Sign Up (link at bottom)
  - → Home Feed (after clicking "Log In")

#### 2. **Signup Screen** `/signup`
- **Access**: From Login → "Sign Up" link
- **Navigation**:
  - → Login (link at bottom)

#### 3. **Home Feed** `/(tabs)/index`
- **Access**: Bottom nav "Home" tab OR after login
- **Navigation**:
  - → Chat (chat icon in header)
  - → Plan Trip button → Destination Map

#### 4. **Explore** `/(tabs)/explore`
- **Access**: Bottom nav "Explore" tab
- **Navigation**:
  - → Tap any destination → Destination Map

#### 5. **Create** `/(tabs)/create`
- **Access**: Bottom nav "Create" tab (+ icon)
- **Navigation**:
  - → Group Planning card
  - → Share Post card (placeholder)
  - → Plan Trip card → Destination Map

#### 6. **Notifications** `/(tabs)/notifications`
- **Access**: Bottom nav "Notifications" tab (🔔)
- **Status**: ⚠️ Placeholder screen

#### 7. **Profile** `/(tabs)/profile`
- **Access**: Bottom nav "Profile" tab
- **Navigation**:
  - → Wallet (wallet icon in header)
  - → Search (search icon)
  - → Chat (chat icon)

#### 8. **Chat (AI Assistant)** `/chat`
- **Access**: 
  - Home header → chat icon
  - Profile header → chat icon
  - Destination Map header → chat icon
  - Accommodation Booking header → chat icon
  - Group Planning header → chat icon
  - Wallet header → chat icon
- **Navigation**:
  - → Back button returns to previous screen

#### 9. **Destination Map** `/destination-map`
- **Access**:
  - Home → "Plan Trip" button on posts
  - Explore → Tap any destination card
  - Create → "Plan Trip" card
- **Navigation**:
  - → Chat (header)
  - → Plan Trip button → Accommodation Booking

#### 10. **Accommodation Booking** `/accommodation-booking`
- **Access**:
  - Destination Map → "Plan Trip" button
  - Group Planning → "Book Travel" button
- **Navigation**:
  - → Chat (header)
  - → View Details (per property)
  - → Send Booking Request (per property)

#### 11. **Group Planning** `/group-planning`
- **Access**:
  - Create tab → "Group Planning" card
- **Navigation**:
  - → Chat (header)
  - → Propose Expense button
  - → Book Travel button → Accommodation Booking

#### 12. **Wallet & Rewards** `/wallet`
- **Access**:
  - Profile → Wallet icon in header
- **Navigation**:
  - → Chat (header)
  - → Deposit Funds button
  - → Withdraw Funds button

---

## ⚠️ SCREENS NEEDING ACCESS POINTS

### **Notifications** - Currently just placeholder
**Recommendations**:
- Keep as tab (already accessible)
- Add notification badge when there are new notifications
- Add sample notifications to make it functional

---

## 📊 Navigation Flow Diagram

```
LOGIN
  ↓
HOME FEED (Tab 1)
  ├─→ Chat (header icon)
  └─→ Destination Map (Plan Trip button)
      └─→ Accommodation Booking
  
EXPLORE (Tab 2)
  └─→ Destination Map (tap destination)
      └─→ Accommodation Booking

CREATE (Tab 3)
  ├─→ Group Planning
  │   └─→ Accommodation Booking (Book Travel)
  ├─→ Share Post (placeholder)
  └─→ Plan Trip → Destination Map

NOTIFICATIONS (Tab 4)
  └─→ (Placeholder)

PROFILE (Tab 5)
  ├─→ Wallet (header icon)
  ├─→ Search (header icon)
  └─→ Chat (header icon)
```

---

## 🔍 Quick Access Summary

### From Bottom Navigation (Always Visible):
1. **Home** - Feed with stories and posts
2. **Explore** - Discover destinations
3. **Create** - Group planning, share, plan trips
4. **Notifications** - Updates (placeholder)
5. **Profile** - Your profile and settings

### From Header Icons (Context-Specific):
- **Chat** 💬 - Available on most screens
- **Search** 🔍 - Available on some screens
- **Wallet** 💳 - Available on Profile
- **Back** ← - Available on all sub-screens

### From Action Buttons:
- **Plan Trip** - Home posts → Destination Map
- **View Details** - Accommodation cards
- **Book Travel** - Group Planning → Accommodation
- **Deposit/Withdraw** - Wallet actions
- **Propose Expense** - Group Planning

---

## ✅ All Screens Are Now Accessible!

Every screen can be reached through the UI:
- ✅ Login (initial)
- ✅ Signup (from login)
- ✅ Home (tab + after login)
- ✅ Explore (tab)
- ✅ Create (tab)
- ✅ Notifications (tab)
- ✅ Profile (tab)
- ✅ Chat (header icons)
- ✅ Destination Map (multiple entry points)
- ✅ Accommodation Booking (from map & group planning)
- ✅ Group Planning (from create tab)
- ✅ Wallet (from profile)

---

## 🎯 Recommended Navigation Improvements

### 1. Add Quick Actions to Home:
- "Explore Destinations" button → Explore tab
- "Plan Group Trip" button → Group Planning
- "View Wallet" button → Wallet

### 2. Add to Profile:
- "My Bookings" → Accommodation history
- "My Groups" → Group Planning list
- "Settings" → App settings

### 3. Add to Notifications:
- Sample notifications for:
  - New followers
  - Booking confirmations
  - Group invites
  - Loyalty rewards

### 4. Add Search Functionality:
- Global search for destinations
- User search
- Group search

---

**Last Updated**: 2025-11-25
**Total Screens**: 12
**All Accessible**: ✅ Yes
