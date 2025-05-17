import {NextRequest, NextResponse} from "next/server";
import {Pool} from "pg";
import {createClient} from "@/supabase/server";
import {Tables} from "@/supabase/database.types";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            heart_rate,
            spo2,
            latitude,
            longitude,
            accel_x,
            accel_y,
            accel_z,
            gyro_x,
            gyro_y,
            gyro_z,
            temperature,
            device_id,
            fall_detected
        } = body;
        const supabase = await createClient();

        if (heart_rate == null || device_id == null) {
            return NextResponse.json({error: "Missing data values"}, {status: 400});
        }

        const {error: insertError} = await supabase
            .from('heartrate')
            .insert({heart_rate, spo2, device_id});

        if ((longitude !== null && longitude !== 0) || (latitude !== null && latitude !== 0)) {
            const {error: insertLocationError} = await supabase
                .from('locationdata')
                .insert({longitude, latitude, device_id});
        }

        const {error: insertMotionError} = await supabase
            .from('motion_data')
            .insert({
                device_id,
                accel_x,
                accel_y,
                accel_z,
                gyro_x,
                gyro_y,
                gyro_z,
                temperature,
            });

        const {error: insertFallError} = await supabase
            .from('falldetection')
            .insert({device_id, fall_detected});

        // === STEP: Threshold Checks for Notification ===
        const LOW_HEART_RATE = 60;
        const LOW_SPO2 = 90;

        const notifications: Tables<'Notification'>[] = [];

        if (heart_rate < LOW_HEART_RATE) {
            notifications.push({
                created_at: new Date().toISOString(),
                id: 0, // this will be ignored (auto-generated)
                is_read: false,
                link_URL: null,
                message: `Heart rate is low: ${heart_rate} bpm`,
                user_id: device_id,
                title: "Low Heart Rate"
            });
        }

        // check if fall detected
        if (fall_detected) {
            notifications.push({
                created_at: new Date().toISOString(),
                id: 0,
                is_read: false,
                link_URL: null,
                message: `Fall detected!`,
                user_id: device_id,
                title: "Fall Detected"
            });
        }

        if (spo2 !== null && spo2 < LOW_SPO2) {
            notifications.push({
                created_at: new Date().toISOString(),
                id: 0,
                is_read: false,
                link_URL: null,
                message: `SpO2 level is low: ${spo2}%`,
                user_id: device_id,
                title: "Low SpO2 Level"
            });
        }

        if (notifications.length > 0) {
            const {error: notifError} = await supabase
                .from('Notification')
                .insert(notifications.map(({id, ...rest}) => rest)); // skip `id` if auto-generated

            if (notifError) {
                console.error("Notification insert error:", notifError);
            }
        }

        if (insertError) {
            console.error("Error inserting data:", insertError);
            return NextResponse.json({error: "Error inserting data"}, {status: 500});
        }

        return NextResponse.json({message: "Data saved!"}, {status: 200});

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}































// import {NextRequest, NextResponse} from "next/server";
// import {Pool} from "pg";
// import {createClient} from "@/supabase/server";
// import {Tables} from "@/supabase/database.types";

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const {
//             heart_rate,
//             spo2,
//             latitude,
//             longitude,
//             accel_x,
//             accel_y,
//             accel_z,
//             gyro_x,
//             gyro_y,
//             gyro_z,
//             temperature,
//             device_id,
//             fall_detected
//         } = body;
//         const supabase = await createClient();

//         if (heart_rate == null || device_id == null) {
//             return NextResponse.json({error: "Missing data values"}, {status: 400});
//         }

//         // Insert heartrate data into Supabase
//         const {error: insertError} = await supabase
//             .from('heartrate')
//             .insert({heart_rate: heart_rate, spo2: spo2, device_id: device_id});


//         // persisting location-data data into supabase
//         if ((longitude !== null && longitude !== 0) || (latitude !== null && latitude !== 0)) {
//             const {error: insertLocationError} = await supabase
//                 .from('locationdata')
//                 .insert({longitude: longitude, latitude: latitude, device_id: device_id});
//         }

//         // persisting motion data into supabase
//         const {error: insertMotionError} = await supabase
//             .from('motion_data')
//             .insert({
//                 device_id: device_id,
//                 accel_x: accel_x,
//                 accel_y: accel_y,
//                 accel_z: accel_z,
//                 gyro_x: gyro_x,
//                 gyro_y: gyro_y,
//                 gyro_z: gyro_z,
//                 temperature: temperature,
//             });

//         // insert fall detection data
//         const {error: insertFallError} = await supabase
//             .from('falldetection')
//             .insert({
//                 device_id: device_id,
//                 fall_detected: fall_detected,
//             });

//         if (insertError) {
//             console.error("Error inserting data:", insertError);
//             return NextResponse.json({error: "Error inserting data"}, {status: 500});
//         }

//         return NextResponse.json({message: "Data saved!"}, {status: 200});

//     } catch (error) {
//         console.error("Database error:", error);
//         return NextResponse.json({error: "Internal server error"}, {status: 500});
//     }
// }



