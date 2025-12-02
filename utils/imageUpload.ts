import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

/**
 * Upload an image to Supabase Storage
 * @param uri - Local file URI
 * @param bucket - Storage bucket name ('avatars', 'posts', 'covers', 'properties', 'licenses', 'reviews', 'messages', 'destinations')
 * @param userId - User ID for organizing files
 * @returns Public URL of uploaded image
 */
export async function uploadImage(
    uri: string,
    bucket: 'avatars' | 'posts' | 'covers' | 'properties' | 'licenses' | 'reviews' | 'messages' | 'destinations',
    userId: string
): Promise<string> {
    try {
        // Read file as base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
        });

        // Generate unique filename
        const fileExt = uri.split('.').pop() || 'jpg';
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Convert base64 to ArrayBuffer
        const arrayBuffer = decode(base64);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, arrayBuffer, {
                contentType: `image/${fileExt}`,
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        console.log('✅ Image uploaded successfully:', publicUrl);
        return publicUrl;
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        throw error;
    }
}

/**
 * Delete an image from Supabase Storage
 * @param url - Public URL of the image
 * @param bucket - Storage bucket name
 */
export async function deleteImage(
    url: string,
    bucket: 'avatars' | 'posts' | 'covers' | 'properties' | 'licenses' | 'reviews' | 'messages' | 'destinations'
): Promise<void> {
    try {
        // Extract file path from URL
        const urlParts = url.split(`/${bucket}/`);
        if (urlParts.length < 2) {
            throw new Error('Invalid image URL');
        }
        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) throw error;

        console.log('✅ Image deleted successfully');
    } catch (error) {
        console.error('❌ Error deleting image:', error);
        throw error;
    }
}

/**
 * Upload profile avatar
 * @param uri - Local file URI
 * @param userId - User ID
 * @returns Public URL of uploaded avatar
 */
export async function uploadAvatar(uri: string, userId: string): Promise<string> {
    return uploadImage(uri, 'avatars', userId);
}

/**
 * Upload post image
 * @param uri - Local file URI
 * @param userId - User ID
 * @returns Public URL of uploaded image
 */
export async function uploadPostImage(uri: string, userId: string): Promise<string> {
    return uploadImage(uri, 'posts', userId);
}

/**
 * Upload story image
 * @param uri - Local file URI
 * @param userId - User ID
 * @returns Public URL of uploaded image
 */
export async function uploadStoryImage(uri: string, userId: string): Promise<string> {
    return uploadImage(uri, 'posts', userId);
}
