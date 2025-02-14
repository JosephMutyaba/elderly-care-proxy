"use server";

// function to fetch fall-detection values from db
import { createClient } from "@/supabase/server";

import { Tables } from "@/supabase/database.types";
import { retrieveLoggedInUserAccount } from "./useractions";

export async function getMotionValues(date: string = new Date().toISOString().split("T")[0], hour: number = new Date().getHours()): Promise<Tables<'motion_data'>[] | null> {
    const supabase =await createClient();

    // Calculate the start and end timestamps for the given date and hour
    const startTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`).toISOString();
    const endTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:59:59`).toISOString();

    // getting logged in user
    const loggedInUser = await supabase.auth.getUser()

    // If the user is not logged in, return null
    if (!loggedInUser.data.user) {
        console.log("User is not logged in.")
        return null
    }

    const loggedInUserAccount = await retrieveLoggedInUserAccount();
    if (!loggedInUserAccount) {
        console.log("No user account found for the logged-in user.")
        return null;
    }

    // Check if the device identifier is not null
    if (!loggedInUserAccount.device_identifier) {
        console.log("Device identifier is null.")
        return null;
    }
    // querying the db for the device associated with the logged-in user account
    const {data:deviceData, error: deviceError} = await supabase
        .from('devices')
        .select('*')
        .eq('device_name', loggedInUserAccount.device_identifier)
        .eq('status', true)
        .returns<Tables<'devices'>>()
        .single() as { data: Tables<'devices'> | null, error: null };

    // If no device is found for the user, return null
    if (!deviceData) {
        console.log("No device found for the logged-in user.")
        return null
    }


    // Fetch data within the specified time range
    const { data, error } = await supabase
        .from('motion_data')
        .select('*')
        .eq('device_id', deviceData.device_name)  // adjust column name here if different in your db schema
        .gte('created_at', startTime)
        .lt('created_at', endTime)
        .returns<Tables<'motion_data'>[]>();

    if (error) {
        console.error("Error fetching heartbeat and oxygen level data:", error);
        return null;
    }

    return data;
}
