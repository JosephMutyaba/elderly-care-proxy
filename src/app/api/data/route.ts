import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { temperature, humidity } = body;

        if (temperature == null || humidity == null) {
            return NextResponse.json({ error: "Missing temperature or humidity" }, { status: 400 });
        }

        await pool.query(
            "INSERT INTO sensor_data (temperature, humidity) VALUES ($1, $2)",
            [temperature, humidity]
        );

        return NextResponse.json({ message: "Data saved!" }, { status: 200 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}



