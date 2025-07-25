import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "API is working",
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      HAS_MONGODB_URI: !!process.env.MONGODB_URI,
    }
  });
}
