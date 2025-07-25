// components/TaskStatusDropdown.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TaskStatusDropdownProps {
  taskId: string;
  initialStatus: 'pending' | 'in-progress' | 'completed';
}

export default function TaskStatusDropdown({ taskId, initialStatus }: TaskStatusDropdownProps) {
  const [status, setStatus] = useState(initialStatus);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'pending' | 'in-progress' | 'completed';
    setStatus(newStatus);
    setUpdating(true);

    try {
      // Use relative URL for client-side requests
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus(initialStatus);
        throw new Error(data.error || 'Failed to update task status.');
      }

      router.refresh();

    } catch (err: unknown) { // Changed to 'unknown'
      console.error('Error updating task status:', err);
      alert(err instanceof Error ? `Error updating status: ${err.message}` : 'An unknown error occurred while updating status.');
      setStatus(initialStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative inline-block">
      <select
        id={`status-${taskId}`}
        value={status}
        onChange={handleStatusChange}
        disabled={updating}
        className={`
          appearance-none px-3.5 py-1.5 text-sm font-semibold rounded-full border-2 focus:outline-none focus:ring-2
          transition-all duration-200 cursor-pointer
          ${updating ? 'opacity-70 cursor-not-allowed' : ''}
          ${
            status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 focus:ring-yellow-300' :
            status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200 focus:ring-blue-300' :
            'bg-green-100 text-green-700 border-green-200 focus:ring-green-300'
          }
        `}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In-Progress</option>
        <option value="completed">Completed</option>
      </select>
      {updating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
}
