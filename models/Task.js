import { kMaxLength } from "buffer";
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'provide a title for this task'],
        MaxLength: [60, 'title cannot be more than 60 chars'],
    },
    description: {
        type: String,
        required: [true, 'provide a description for this task'],
        MaxLength: [200, 'description cannot be more than 200 chars'],
    },
    dueDate: {
        type: Date,
        required: [true, 'provide a due date for this task'],
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
},
{
    timestamps: true,
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);