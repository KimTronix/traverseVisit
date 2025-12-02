import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// ============================================
// PROFILE SCHEMAS
// ============================================

export const profileSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(30),
    full_name: z.string().min(2, 'Full name is required'),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    location: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const providerProfileSchema = profileSchema.extend({
    business_name: z.string().min(2, 'Business name is required'),
    business_email: z.string().email('Invalid business email'),
    business_phone: z.string().min(10, 'Valid phone number is required'),
    service_types: z.array(z.string()).min(1, 'Select at least one service type'),
});

// ============================================
// POST SCHEMAS
// ============================================

export const createPostSchema = z.object({
    caption: z.string().max(2200, 'Caption too long'),
    location_name: z.string().optional(),
    min_budget: z.number().min(0).optional(),
    currency: z.string().default('USD'),
    media_urls: z.array(z.string()).min(1, 'At least one image/video is required'),
});

export const commentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000),
});

// ============================================
// PROPERTY SCHEMAS
// ============================================

export const propertySchema = z.object({
    name: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    property_type: z.string().min(1, 'Property type is required'),
    max_guests: z.number().min(1, 'Must accommodate at least 1 guest'),
    bedrooms: z.number().min(0),
    beds: z.number().min(0),
    bathrooms: z.number().min(0),
    price_per_night: z.number().min(1, 'Price must be greater than 0'),
    currency: z.string().default('USD'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required'),
    amenities: z.array(z.string()).optional(),
    house_rules: z.array(z.string()).optional(),
    check_in_time: z.string(),
    check_out_time: z.string(),
});

// ============================================
// BOOKING SCHEMAS
// ============================================

export const bookingRequestSchema = z.object({
    check_in_date: z.date(),
    check_out_date: z.date(),
    guests: z.object({
        adults: z.number().min(1),
        children: z.number().min(0),
        infants: z.number().min(0),
    }),
    message: z.string().optional(),
    payment_method: z.string().min(1, 'Payment method is required'),
}).refine((data) => data.check_out_date > data.check_in_date, {
    message: "Check-out date must be after check-in date",
    path: ["check_out_date"],
});

// ============================================
// REVIEW SCHEMAS
// ============================================

export const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    title: z.string().optional(),
    content: z.string().min(10, 'Review must be at least 10 characters'),
    cleanliness_rating: z.number().min(1).max(5),
    communication_rating: z.number().min(1).max(5),
    location_rating: z.number().min(1).max(5),
    value_rating: z.number().min(1).max(5),
});

// ============================================
// MESSAGING SCHEMAS
// ============================================

export const messageSchema = z.object({
    content: z.string().min(1, 'Message cannot be empty').optional(),
    media_urls: z.array(z.string()).optional(),
}).refine((data) => data.content || (data.media_urls && data.media_urls.length > 0), {
    message: "Message must have content or media",
    path: ["content"],
});

// ============================================
// GROUP SCHEMAS
// ============================================

export const groupSchema = z.object({
    name: z.string().min(3, 'Group name must be at least 3 characters'),
    description: z.string().optional(),
    destination_id: z.string().optional(),
    trip_start_date: z.date().optional(),
    trip_end_date: z.date().optional(),
});

export const expenseSchema = z.object({
    title: z.string().min(2, 'Title is required'),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    currency: z.string().default('USD'),
    category: z.string().optional(),
    description: z.string().optional(),
});

// ============================================
// WALLET SCHEMAS
// ============================================

export const transactionSchema = z.object({
    amount: z.number().min(1, 'Minimum amount is 1'),
    currency: z.string().default('USD'),
    payment_method: z.string().min(1, 'Payment method is required'),
});

// Types inferred from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PostFormData = z.infer<typeof createPostSchema>;
export type PropertyFormData = z.infer<typeof propertySchema>;
export type BookingFormData = z.infer<typeof bookingRequestSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type GroupFormData = z.infer<typeof groupSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
