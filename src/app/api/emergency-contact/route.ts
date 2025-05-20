'use server'

// pages/api/emergency-contact/[deviceId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import {createClient} from "@/supabase/server";
import {Tables} from "@/supabase/database.types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const supabase = await createClient()
        const { deviceId } = req.query;

        if (!deviceId || Array.isArray(deviceId)) {
            return res.status(400).json({ message: 'Invalid device ID' });
        }

        // Query the database for the user with this device ID
        const { data, error } = await supabase
            .from('users')
            .select('emergency_contact')
            .eq('device_id', deviceId)
            .single<Tables<'users'>>();

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database error', error: error.message });
        }

        if (!data) {
            return res.status(404).json({ message: 'No user found with this device ID' });
        }

        // Return the emergency contact information
        return res.status(200).json({
            message: 'Emergency contact retrieved successfully',
            emergency_contact: data.phone_number || null
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}