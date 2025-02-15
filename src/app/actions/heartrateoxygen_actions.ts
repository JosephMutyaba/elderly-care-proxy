'use server'

import {Tables} from "@/supabase/database.types";
import {retrieveLoggedInUserAccount} from "@/app/actions/useractions";
import {createClient} from "@/supabase/server";

export async function getHeartbeatAndOxygenLevel(
    date: string = new Date().toLocaleDateString('en-CA'), // Format: YYYY-MM-DD in local time
    hour: number = new Date().getHours() // Local hour
): Promise<Tables<'heartrate'>[] | null> {
    const supabase = await createClient();

    // Convert local date and hour to UTC for database query
    const localDate = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);

    // Create UTC start and end times
    const startTime = new Date(localDate);
    const endTime = new Date(localDate);
    endTime.setHours(endTime.getHours() + 1); // Add one hour

    // Convert to ISO strings for database query
    const startTimeUTC = startTime.toISOString();
    const endTimeUTC = endTime.toISOString();

    console.log(`Querying for time range: ${startTimeUTC} to ${endTimeUTC}`);
    console.log(`Local time was: ${date} ${hour}:00`);

    // Get logged-in user
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

    // Fetch device associated with the logged-in user
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
        .from('heartrate')
        .select('*')
        .eq('device_id', deviceData.device_name)
        .gte('created_at', startTimeUTC)
        .lt('created_at', endTimeUTC)
        .returns<Tables<'heartrate'>[]>();

    if (error) {
        console.error("Error fetching heartbeat and oxygen level data:", error);
        return null;
    }

    return data;
}
