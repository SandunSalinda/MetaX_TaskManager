import dbConnect from "../../../../lib/dbConnect";
import Task from "../../../../models/Task";
import { NextResponse } from "next/server";

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
        if (error instanceof Error && error.name === 'CastError' && (error as any).kind === 'ObjectId') { // Type assertion for 'kind'
            return handleError(error, "Invalid task ID format.", 400);
        }
        return handleError(error, "Error fetching task.");
    }
}

// PUT update task by ID
export async function PUT(_request: Request, { params }: { params: { id: string } }) { // Added 'export' and types
    await dbConnect();
    const { id } = params;

    try {
        const body = await _request.json(); // Use _request here

        const updatedTask = await Task.findByIdAndUpdate(id, body, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validators on the update (e.g., enum for status)
        });

        if (!updatedTask) {
            return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
    } catch (error: unknown) { // Changed to 'unknown'
        if (error instanceof Error && error.name === 'CastError' && (error as any).kind === 'ObjectId') {
            return handleError(error, "Invalid Task ID format.", 400);
        }
        if (error instanceof Error && error.name === 'ValidationError') {
            const messages = Object.values((error as any).errors).map((val: any) => val.message); // Type assertion for 'errors'
            return handleError(error, messages.join(', '), 400);
        }
        return handleError(error, "Error updating task.");
    }
}

// DELETE /api/tasks/:id - Remove a task
export async function DELETE(_request: Request, { params }: { params: { id: string } }) { // Added 'export' and types
    await dbConnect();
    const { id } = params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Task deleted successfully." }, { status: 200 });
    } catch (error: unknown) { // Changed to 'unknown'
        if (error instanceof Error && error.name === 'CastError' && (error as any).kind === 'ObjectId') {
            return handleError(error, "Invalid Task ID format.", 400);
        }
        return handleError(error, "Error deleting task.");
    }
}
