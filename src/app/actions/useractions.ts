'use server'

import { Tables } from "@/supabase/database.types";
import { createClient } from "@/supabase/server";

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
