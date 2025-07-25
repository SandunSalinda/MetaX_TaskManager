// components/TaskActions.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TaskActionsProps {
  taskId: string;
}

export default function TaskActions({ taskId }: TaskActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      // Use relative URL in production, full URL in development
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? '' 
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
      const res = await fetch(`${baseUrl}/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Task deleted successfully!');
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to delete task.');
      }
    } catch (err: unknown) { // Changed to 'unknown'
      console.error('Error deleting task:', err);
      alert(err instanceof Error ? `An error occurred while deleting the task: ${err.message}` : 'An unknown error occurred while deleting the task.');
    }
  };

  return (
    <div className="flex justify-end space-x-3">
      <Link href={`/tasks/edit/${taskId}`} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-3 rounded-md text-sm transition duration-300">
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-md text-sm transition duration-300"
      >
        Delete
      </button>
    </div>
  );
}
