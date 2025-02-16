'use server'

import { Tables } from "@/supabase/database.types";
import { createClient } from "@/supabase/server";
import {revalidatePath} from "next/cache";

// fetch the logged-n useraccount
export async function retrieveLoggedInUserAccount() : Promise<Tables<'users'> | null> {
    const supabase = await createClient();
    const loggedInUser = await supabase.auth.getUser()
    if(loggedInUser ){
        // fetchAssociated User Account
        const {data, error} = await supabase.from('users').select('*').eq('id', loggedInUser.data.user?.id).returns<Tables<'users'>>().single();
        if (error) {
            console.error("Error fetching user account:", error);
            return null;
        }
        return data;
    }
    return null;
}

export async function getUsers(page: number = 1,
                                 pageSize: number = 10,
                                 searchQuery: string = '',
                                 sortBy: string = 'created_at',
                                 sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{
    data: Tables<'users'>[] | null
    count: number | null
    error: Error | null
}> {
    try {
        // Initialize Supabase client
        const supabase = await createClient(); // Remove 'await' since createClient() isn't async

        // Calculate the range for pagination
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;

        // Create base query
        let query = supabase
            .from('users')
            .select('*', { count: 'exact' });

        // Add search if provided
        if (searchQuery) {
            query = query.or(`name.ilike.%${searchQuery}%`);
        }

        // Add sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Add pagination
        query = query.range(start, end);

        // Execute query
        const { data, error, count } = await query;

        if (error) {
            console.error("Error fetching users:", error);
            return { data: null, count: null, error };
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return { data, count, error: null };

    } catch (error) {
        console.error('Error fetching users:', error);
        return { data: null, count: null, error: error as Error };
    }
}

export async function getUsersCount( searchQuery: string = ''): Promise<{
    count: number | null
    error: Error | null
}> {
    try {
        // Initialize Supabase client
        const supabase = await createClient(); // Remove 'await' since createClient() isn't async

        // Create base query
        let query = supabase
            .from('users')
            .select('*', { count: 'exact' });

        // Add search if provided
        if (searchQuery) {
            query = query.or(`name.ilike.%${searchQuery}%`);
        }

        // Execute query
        const { error, count } = await query;

        if (error) {
            console.error("Error fetching users:", error);
            return { count: null, error };
        }

        return { count, error: null };

    } catch (error) {
        console.error('Error fetching users', error);
        return { count: null, error: error as Error };
    }
}

interface UserProps{
    name:string
    email: string
    password: string
    device_id: string | null
}

export async function updateUserProfile(data: UserProps) {
    const supabase = await createClient()

    const currentlyLoggedInUser = await retrieveLoggedInUserAccount();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('Authentication error: ' + userError?.message)
    }

    // Start with auth updates if email or password changed
    const authUpdateData: { email?: string; password?: string } = {}

    if (data.email !== user.email) {
        authUpdateData.email = data.email
    }

    // Only include password in auth update if it's a new password
    // Don't include password at all if it's not being changed
    if (data.password?.trim() && (data.password !== currentlyLoggedInUser?.password)) {
        authUpdateData.password = data.password
    }

    // Update auth user if needed
    if (Object.keys(authUpdateData).length > 0) {
        const { error: updateAuthError } = await supabase.auth.updateUser(authUpdateData)

        if (updateAuthError) {
            throw new Error('Auth update error: ' + updateAuthError.message)
        }
    }

    // Update custom user profile in the users table
    // Remove password from profile update as it should only be handled by auth
    const { error: profileError } = await supabase
        .from('users')
        .update({
            name: data.name,
            email: data.email,
            password: data.password,
            device_identifier: data.device_id,
        })
        .eq('id', user.id)

    if (profileError) {
        throw new Error('Profile update error: ' + profileError.message)
    }

    // Revalidate the profile page to show updated data
    revalidatePath('/systeminfo/profile')

    return { success: true, error: null }
}