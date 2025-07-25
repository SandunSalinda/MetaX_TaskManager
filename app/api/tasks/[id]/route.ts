import dbConnect from "../../../../lib/dbConnect";
import Task from "../../../../models/Task";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Import mongoose to access its Error types

const handleError = (error: unknown, message = "internal server error", status = 500) => {
    console.error(error);
    return NextResponse.json({ error: message }, { status });
};

// GET task by ID
export async function GET(_request: Request, { params }: { params: { id: string } }) { // Added 'export' and types
    try {
        await dbConnect();
        const { id } = params;

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({success: false, error: "Task not found"}, { status: 404 });
        }
        return NextResponse.json({success: true, data: task}, { status: 200 });
    } catch (error: unknown) { // Changed to 'unknown'
        // More robust type checking for Mongoose errors
        if (error instanceof mongoose.Error.CastError) { // Check for Mongoose CastError
            return handleError(error, "Invalid task ID format.", 400);
        }
        return handleError(error, "Error fetching task.");
    }
}

// PUT update task by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) { // Changed to 'request' and typed
    await dbConnect();
    const { id } = params;

    try {
        const body = await request.json(); // Using 'request' here

        const updatedTask = await Task.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedTask) {
            return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) { // Check for Mongoose CastError
            return handleError(error, "Invalid Task ID format.", 400);
        }
        if (error instanceof mongoose.Error.ValidationError) { // Check for Mongoose ValidationError
            const messages = Object.values(error.errors).map(val => (val as any).message); // Still need 'any' for 'val.message' due to complex Mongoose ValidationError structure
            return handleError(error, messages.join(', '), 400);
        }
        return handleError(error, "Error updating task.");
    }
}

// DELETE /api/tasks/:id - Remove a task
export async function DELETE(_request: Request, { params }: { params: { id: string } }) { // '_request' explicitly typed
    await dbConnect();
    const { id } = params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Task deleted successfully." }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) { // Check for Mongoose CastError
            return handleError(error, "Invalid Task ID format.", 400);
        }
        return handleError(error, "Error deleting task.");
    }
}
