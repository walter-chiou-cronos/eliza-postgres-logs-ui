import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Query the database
    const data = await query(
      `SELECT * FROM logs ORDER BY "createdAt" DESC LIMIT 10`
    );

    // Return the data as JSON
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
