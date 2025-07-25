// API route to test MongoDB connection from Vercel
import dbConnect from "../../../lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI preview:', process.env.MONGODB_URI?.substring(0, 20) + '...');
    
    await dbConnect();
    console.log('✅ MongoDB connected successfully');
    return NextResponse.json({ 
      success: true, 
      message: "MongoDB connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
