import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Task from "../../../../models/Task";
import mongoose from "mongoose";

interface Context {
  params: { id: string };
}

const handleError = (error: unknown, message = "Internal server error", status = 500) => {
  console.error(error);
  return NextResponse.json({ error: message }, { status });
};

// GET /api/tasks/[id]
export async function GET(_req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const { id } = params;
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(error, "Invalid task ID format.", 400);
    }
    return handleError(error, "Error fetching task.");
  }
}

// PUT /api/tasks/[id]
export async function PUT(req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id } = params;

    const updatedTask = await Task.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(error, "Invalid task ID format.", 400);
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors)
        .map((val) =>
          val instanceof mongoose.Error.ValidatorError || val instanceof mongoose.Error.CastError
            ? val.message
            : "Validation error"
        )
        .filter(Boolean);
      return handleError(error, messages.join(", "), 400);
    }

    return handleError(error, "Error updating task.");
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(_req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const { id } = params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Task deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(error, "Invalid task ID format.", 400);
    }
    return handleError(error, "Error deleting task.");
  }
}
