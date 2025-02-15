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






// 'use server'
//
// import {Tables} from "@/supabase/database.types";
// import {createClient} from "@/supabase/server";
// import {retrieveLoggedInUserAccount} from "@/app/actions/useractions";
//
// export async function getLocationData(date: string = new Date().toISOString().split("T")[0], hour: number = new Date().getHours()): Promise<Tables<'locationdata'>[] | null> {
//     const supabase =await createClient();
//
//     // Calculate the start and end timestamps for the given date and hour
//     const startTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`).toISOString();
//     const endTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:59:59`).toISOString();
//
//     // getting logged in user
//     const loggedInUser = await supabase.auth.getUser()
//     console.log(`Logged in user ${loggedInUser.data.user?.email}`)
//
//     // If the user is not logged in, return null
//     if (!loggedInUser.data.user) {
//         console.log("User is not logged in.")
//         return null
//     }
//
//     const loggedInUserAccount = await retrieveLoggedInUserAccount();
//     if (!loggedInUserAccount) {
//         console.log("No user account found for the logged-in user.")
//         return null;
//     }
//
//     // Check if the device identifier is not null
//     if (!loggedInUserAccount.device_identifier) {
//         console.log("Device identifier is null.")
//         return null;
//     }
//     // querying the db for the device associated with the logged-in user account
//     const {data:deviceData, error: deviceError} = await supabase
//         .from('devices')
//         .select('*')
//         .eq('device_name', loggedInUserAccount.device_identifier)
//         .eq('status', true)
//         .returns<Tables<'devices'>>()
//         .single() as { data: Tables<'devices'> | null, error: null };
//
//     // If no device is found for the user, return null
//     if (!deviceData) {
//         console.log("No device found for the logged-in user.")
//         return null
//     }
//
//
//
//     // Fetch data within the specified time range
//     const { data, error } = await supabase
//         .from('locationdata')
//         .select('*')
//         .eq('device_id', deviceData.device_name)  // adjust column name here if different in your db schema
//         .gte('created_at', startTime)
//         .lt('created_at', endTime)
//         .returns<Tables<'locationdata'>[]>();
//
//     if (error) {
//         console.error("Error fetching location data:", error);
//         return null;
//     }
//
//     return data;
// }