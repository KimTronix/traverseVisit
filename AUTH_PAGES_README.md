# Traverse-Visit Authentication Pages

## Overview
This project now includes beautiful, modern authentication pages for login and signup, matching the design aesthetic shown in the reference image.

## Features

### 🎨 Design Highlights
- **Stunning Background**: Scenic mountain landscape background image
- **Glassmorphic Design**: Semi-transparent form containers with blur effects
- **Modern UI Elements**: Rounded inputs with icons, smooth shadows, and elegant typography
- **Responsive Layout**: Works seamlessly on mobile, tablet, and web
- **Social Authentication**: Integration points for Google, Twitter, and Facebook login

### 📱 Pages Created

#### 1. **Login Page** (`app/login.tsx`)
- Email/Username input with mail icon
- Password input with lock icon and show/hide toggle
- "Forgot Password?" link
- Primary "Log In" button
- Social login options (Google, Twitter, Facebook)
- "Sign Up" link for new users

#### 2. **Signup Page** (`app/signup.tsx`)
- Full Name input with person icon
- Email/Username input with mail icon
- Password input with lock icon and show/hide toggle
- Confirm Password input with show/hide toggle
- Primary "Sign Up" button
- Social signup options (Google, Twitter, Facebook)
- "Log In" link for existing users

## Navigation

### Accessing the Pages
From the home screen, you can navigate to:
- **Login Page**: `/login`
- **Signup Page**: `/signup`

The pages are linked together:
- From Login → Click "Sign Up" to go to Signup
- From Signup → Click "Log In" to go to Login

## Technical Details

### Dependencies Used
- `expo-router` - For navigation
- `@expo/vector-icons` - For icons (Ionicons)
- `expo-status-bar` - For status bar styling
- `react-native` - Core components

### Key Components
- `ImageBackground` - For the scenic background
- `KeyboardAvoidingView` - For proper keyboard handling
- `ScrollView` - For scrollable content
- `TextInput` - For form inputs
- `TouchableOpacity` - For buttons and links

### Styling Features
- Semi-transparent overlays for readability
- Glassmorphic form containers (95% opacity white)
- Consistent spacing and padding
- Shadow effects for depth
- Rounded corners throughout
- Color scheme: Teal accent (#4ECDC4) for branding

## Customization

### Changing the Background Image
Edit the `ImageBackground` source in either file:
```typescript
<ImageBackground
  source={{ uri: 'YOUR_IMAGE_URL_HERE' }}
  // or use a local image:
  // source={require('@/assets/images/your-background.jpg')}
  style={styles.background}
  resizeMode="cover"
>
```

### Updating Brand Colors
The primary brand color is `#4ECDC4` (teal). To change it, search and replace this color in:
- Logo icon color
- Link text colors
- Any accent elements

### Implementing Authentication Logic
Add your authentication logic in the handler functions:
- `handleLogin()` in `login.tsx`
- `handleSignUp()` in `signup.tsx`
- `handleSocialLogin(provider)` / `handleSocialSignUp(provider)` for social auth

Example:
```typescript
const handleSignUp = async () => {
  try {
    // Your authentication API call here
    const response = await yourAuthService.signUp({
      fullName,
      email,
      password,
    });
    // Navigate to home or dashboard
  } catch (error) {
    // Handle errors
  }
};
```

## Next Steps

1. **Connect to Backend**: Implement actual authentication logic
2. **Add Validation**: Add form validation for email, password strength, etc.
3. **Error Handling**: Display error messages for failed login/signup attempts
4. **Loading States**: Add loading indicators during authentication
5. **Password Reset**: Implement the "Forgot Password?" functionality
6. **Social Auth**: Integrate actual OAuth providers (Google, Twitter, Facebook)
7. **Secure Storage**: Store authentication tokens securely
8. **Protected Routes**: Add route guards for authenticated pages

## Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Screenshots
The design matches the reference image with:
- Beautiful scenic background
- Clean, modern form design
- Professional typography
- Smooth user experience
- Consistent branding

---

**Created with ❤️ for Traverse-Visit**
