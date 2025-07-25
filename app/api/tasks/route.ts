import dbConnect from "../../../lib/dbConnect";
import Task from "../../../models/Task";
import { NextResponse } from "next/server";

export async function GET(_request: Request) { // Added 'export' and ': Request' type, changed to _request
    try {
        await dbConnect();
        const tasks = await Task.find({});
        return NextResponse.json({ success: true, data: tasks }, { status: 200 });
    } catch (error: unknown) { // Changed to 'unknown' for type safety
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
    }
}

export async function POST(_request: Request) { // Added 'export' and ': Request' type, changed to _request
    try {
        await dbConnect();
        const body = await _request.json(); // Use _request here
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
    } catch (error: unknown) { // Changed to 'unknown' for type safety
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
    }
}
