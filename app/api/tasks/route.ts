import dbConnect from "../../../lib/dbConnect";
import Task from "../../../models/Task";
import { NextResponse } from "next/server";

// GET /api/tasks
export async function GET() {
  try {
    console.log('API called, MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    await dbConnect();
    console.log('Database connected successfully');
    
    const tasks = await Task.find({});
    console.log('Tasks found:', tasks.length);
    
    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error) {
    console.error('API Error Details:');
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Full error object:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
      errorName: error instanceof Error ? error.name : "Unknown",
    }, { status: 500 });
  }
}

// POST /api/tasks
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, description, dueDate } = body;

    if (!title || !description || !dueDate) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const newTask = new Task({
      title,
      description,
      dueDate: new Date(dueDate),
    });

    await newTask.save();
    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }, { status: 500 });
  }
}
