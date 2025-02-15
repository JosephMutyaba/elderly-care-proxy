'use server'

import { Tables } from "@/supabase/database.types";
import { createClient } from "@/supabase/server";
import { retrieveLoggedInUserAccount } from "@/app/actions/useractions";

export async function getLocationData(
    date: string = new Date().toLocaleDateString('en-CA'), // Format: YYYY-MM-DD in local time
    hour: number = new Date().getHours() // Local hour
): Promise<Tables<'locationdata'>[] | null> {
    const supabase = await createClient();

    // Convert local date and hour to UTC for database query
    const localDate = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);

    // Create UTC start and end times
    const startTime = new Date(localDate);
    const endTime = new Date(localDate);
    endTime.setHours(endTime.getHours() + 1);

    // Convert to ISO strings for database query
    const startTimeUTC = startTime.toISOString();
    const endTimeUTC = endTime.toISOString();

    console.log(`Querying for time range: ${startTimeUTC} to ${endTimeUTC}`);
    console.log(`Local time was: ${date} ${hour}:00`);

    // getting logged in user
    const loggedInUser = await supabase.auth.getUser();
    if (!loggedInUser.data.user) {
        console.log("User is not logged in.");
        return null;
    }

    const loggedInUserAccount = await retrieveLoggedInUserAccount();
    if (!loggedInUserAccount) {
        console.log("No user account found for the logged-in user.");
        return null;
    }

    if (!loggedInUserAccount.device_identifier) {
        console.log("Device identifier is null.");
        return null;
    }

    const { data: deviceData, error: deviceError } = await supabase
        .from('devices')
        .select('*')
        .eq('device_name', loggedInUserAccount.device_identifier)
        .eq('status', true)
        .returns<Tables<'devices'>>()
        .single() as { data: Tables<'devices'> | null, error: null };

    if (!deviceData) {
        console.log("No device found for the logged-in user.");
        return null;
    }

    // Fetch data within the specified UTC time range
    const { data, error } = await supabase
        .from('locationdata')
        .select('*')
        .eq('device_id', deviceData.device_name)
        .gte('created_at', startTimeUTC)
        .lt('created_at', endTimeUTC)
        .returns<Tables<'locationdata'>[]>();

    if (error) {
        console.error("Error fetching location data:", error);
        return null;
    }

    return data;
}

export async function getLocationsAdmin(page: number = 1,
                                    pageSize: number = 10,
                                    searchQuery: string = '',
                                    sortBy: string = 'created_at',
                                    sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{
    data: Tables<'locationdata'>[] | null
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
            .from('locationdata')
            .select('*', { count: 'exact' });

        // Add search if provided
        if (searchQuery) {
            query = query.or(`device_id.ilike.%${searchQuery}%`);
        }

        // Add sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Add pagination
        query = query.range(start, end);

        // Execute query
        const { data, error, count } = await query;

        if (error) {
            console.error("Error fetching locationdata:", error);
            return { data: null, count: null, error };
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return { data, count, error: null };

    } catch (error) {
        console.error('Error fetching locationdata:', error);
        return { data: null, count: null, error: error as Error };
    }
}


export async function getLocationsAdminCount( searchQuery: string = ''): Promise<{
    count: number | null
    error: Error | null
}> {
    try {
        // Initialize Supabase client
        const supabase = await createClient(); // Remove 'await' since createClient() isn't async

        // Create base query
        let query = supabase
            .from('locationdata')
            .select('*', { count: 'exact' });

        // Add search if provided
        if (searchQuery) {
            query = query.or(`device_id.ilike.%${searchQuery}%`);
        }

        // Execute query
        const { data, error, count } = await query;

        if (error) {
            console.error("Error fetching locationdata:", error);
            return { count: null, error };
        }

        return { count, error: null };

    } catch (error) {
        console.error('Error fetching locationdata:', error);
        return { count: null, error: error as Error };
    }
}



