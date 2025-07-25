import dbConnect from "../../../../lib/dbConnect";
import Task from "../../../../models/Task";
import { NextResponse } from "next/server";

const handleError = (error, message = "internal server error", status = 500) => {
    console.error(error);
    return NextResponse.json({ error: message }, { status });
};

// GET task by ID
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({success: false, error: "Task not found"}, { status: 404 });
        }
        return NextResponse.json({success: true, data: task}, { status: 200 });
    } catch (error) {
        return handleError(error, "Invalid task ID", 400);
    }
}

// PUT update task by ID
export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();

        const updatedTask = await Task.findByIdAndUpdate(id, body, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validators on the update (e.g., enum for status)
        });

        if (!updatedTask) {
            return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return handleError(error, "Invalid Task ID format.", 400);
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return handleError(error, messages.join(', '), 400);
        }
        return handleError(error, "Error updating task.");
    }

}

// DELETE /api/tasks/:id - Remove a task
export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params; // Get the ID from the dynamic route parameter

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
        }

        // Return a 204 No Content status for successful deletion with no body
        return NextResponse.json({ success: true, message: "Task deleted successfully." }, { status: 200 }); // Changed to 200 for consistency, 204 is also valid
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return handleError(error, "Invalid Task ID format.", 400);
        }
        return handleError(error, "Error deleting task.");
    }
}
