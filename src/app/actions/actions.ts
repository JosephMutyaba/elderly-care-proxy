"use server";

// function to fetch fall-detection values from db
import { createClient } from "@/supabase/server";

import { Tables } from "@/supabase/database.types";
import { retrieveLoggedInUserAccount } from "./useractions";

// Adjust the type if necessary according to your actual table and column types
export async function getFallDetection(date: string = new Date().toISOString().split("T")[0], hour: number = new Date().getHours()):Promise<Tables<'falldetection'>[]|null> {
    const supabase = await createClient();

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

    // querying the db for the device associated with the logged-in user account
    const {data:deviceData, error: deviceError} = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', loggedInUser?.data.user.id)
        .returns<Tables<'devices'>>()
        .single() as { data: Tables<'devices'> | null, error: null };

    // If no device is found for the user, return null
    if (!deviceData) {
        console.log("No device found for the logged-in user.")
        return null
    }

    const { data, error } = await supabase
        .from('falldetection') // adjust table type here
        .select('*')
        .eq('device_id', deviceData.id)
        .gte('created_at', startTime)
        .lt('created_at', endTime)
        .returns<Tables<'falldetection'>[]>();

    if (error) {
        console.error("Error fetching fall detection data:", error);
        return null;
    }

    return data;
}

export async function getHeartbeatAndOxygenLevel(date: string = new Date().toISOString().split("T")[0], hour: number = new Date().getHours()): Promise<Tables<'heartrate'>[] | null> {
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
    console.log(`User acc: ${loggedInUserAccount.device_identifier}`);


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
        .from('heartrate')
        .select('*')
        .eq('device_id', deviceData.device_name)  // adjust column name here if different in your db schema
        .gte('created_at', startTime)
        .lt('created_at', endTime)
        .returns<Tables<'heartrate'>[]>();

    if (error) {
        console.error("Error fetching heartbeat and oxygen level data:", error);
        return null;
    }

    return data;
}


export async function getLocationData(date: string = new Date().toISOString().split("T")[0], hour: number = new Date().getHours()): Promise<Tables<'locationdata'>[] | null> {
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

    // querying the db for the device associated with the logged-in user account
    const {data:deviceData, error: deviceError} = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', loggedInUser?.data.user.id)
        .returns<Tables<'devices'>>()
        .single() as { data: Tables<'devices'> | null, error: null };

    // If no device is found for the user, return null
    if (!deviceData) {
        console.log("No device found for the logged-in user.")
        return null
    }

    // Fetch data within the specified time range
    const { data, error } = await supabase
        .from('locationdata')
        .select('*')
        .eq('device_id', deviceData.id)  // adjust column name here if different in your db schema
        .gte('created_at', startTime)
        .lt('created_at', endTime)
        .returns<Tables<'locationdata'>[]>();

    if (error) {
        console.error("Error fetching location data:", error);
        return null;
    }

    return data;
}
