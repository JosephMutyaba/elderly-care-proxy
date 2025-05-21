// app/api/get-emergency-contact/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';
import { Tables } from '@/supabase/database.types';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const deviceId = searchParams.get('deviceId');

        if (!deviceId) {
            return NextResponse.json({ message: 'Invalid device ID' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('users')
            .select('phone_number')
            .eq('device_identifier', deviceId)
            .single<Tables<'users'>>();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ message: 'No user found with this device ID' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Emergency contact retrieved successfully',
            emergency_contact: data.phone_number || null,
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
