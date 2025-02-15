'use server'

// Types for better type safety
import { createClient } from "@/supabase/server";
import { Tables } from "@/supabase/database.types";

export async function getDevices(page: number = 1,
                                 pageSize: number = 10,
                                 searchQuery: string = '',
                                 sortBy: string = 'created_at',
                                 sortOrder: 'asc' | 'desc' = 'desc'
    ): Promise<{
    data: Tables<'devices'>[] | null
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
            .from('devices')
            .select('*', { count: 'exact' });

        // Add search if provided
        if (searchQuery) {
            query = query.or(`device_name.ilike.%${searchQuery}%`);
        }

        // Add sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Add pagination
        query = query.range(start, end);

        // Execute query
        const { data, error, count } = await query;

        if (error) {
            console.error("Error fetching devices:", error);
            return { data: null, count: null, error };
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return { data, count, error: null };

    } catch (error) {
        console.error('Error fetching devices:', error);
        return { data: null, count: null, error: error as Error };
    }
}


export async function getDevicesCount( searchQuery: string = ''): Promise<{
    count: number | null
    error: Error | null
}> {
    try {
        // Initialize Supabase client
        const supabase = await createClient(); // Remove 'await' since createClient() isn't async

        // Create base query
        let query = supabase
            .from('devices')
            .select('*', { count: 'exact' });

        // Add search if provided
        if (searchQuery) {
            query = query.or(`device_name.ilike.%${searchQuery}%`);
        }

        // Execute query
        const { error, count } = await query;

        if (error) {
            console.error("Error fetching devices:", error);
            return { count: null, error };
        }

        return { count, error: null };

    } catch (error) {
        console.error('Error fetching devices', error);
        return { count: null, error: error as Error };
    }
}