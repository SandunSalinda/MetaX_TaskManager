import dbConnect from "../../../../lib/dbConnect";
import Task from "../../../../models/Task";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Import mongoose to access its Error types

// Define an interface for the route handler context, including params
interface RouteContext {
    params: {
        id: string;
    };
}

const handleError = (error: unknown, message = "internal server error", status = 500) => {
    console.error(error);
    return NextResponse.json({ error: message }, { status });
};

// GET task by ID
// Using the defined RouteContext interface
export async function GET(_request: Request, context: RouteContext) {
    try {
        await dbConnect();
        const { id } = context.params; // Destructure id from context.params

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({success: false, error: "Task not found"}, { status: 404 });
        }
        return NextResponse.json({success: true, data: task}, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) {
            return handleError(error, "Invalid task ID format.", 400);
        }
        return handleError(error, "Error fetching task.");
    }
}

// PUT update task by ID
// Using the defined RouteContext interface
export async function PUT(request: Request, context: RouteContext) {
    await dbConnect();
    const { id } = context.params; // Destructure id from context.params

    try {
        const body = await request.json();

        const updatedTask = await Task.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedTask) {
            return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) {
            return handleError(error, "Invalid Task ID format.", 400);
        }
        if (error instanceof mongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map((val: { message?: string }) => val.message).filter(Boolean);
            return handleError(error, messages.join(', '), 400);
        }
        return handleError(error, "Error updating task.");
    }
}

// DELETE /api/tasks/:id - Remove a task
// Using the defined RouteContext interface
export async function DELETE(_request: Request, context: RouteContext) {
    await dbConnect();
    const { id } = context.params; // Destructure id from context.params

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Task deleted successfully." }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) {
            return handleError(error, "Invalid Task ID format.", 400);
        }
        return handleError(error, "Error deleting task.");
    }
}
