import Link from 'next/link';
import TaskActions from '@/components/TaskActions';
import TaskStatusDropdown from '@/components/TaskStatusDropdown';
import SimpleCalendar from '@/components/SimpleCalender';
import { getBaseUrl } from '@/lib/getBaseUrl';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export default async function HomePage() {
  let tasks: Task[] = [];
  let error: string | null = null;

  try{
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/tasks`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      // Read the response body once as text first
      const responseText = await res.text();
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      
      try {
        // Try to parse the text as JSON
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use the raw text
        errorMessage = responseText.substring(0, 200) || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    if (data.success) {
      tasks = data.data;
    } else {
      throw new Error(data.error || 'Failed to fetch tasks: success was false');
    }
  }
  catch (err: unknown) { // Changed to 'unknown'
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching tasks:', err);
    }
    error = err instanceof Error ? err.message : 'An unknown error occurred while fetching tasks.';
  }

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-12 p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-6 sm:mb-0 text-center sm:text-left tracking-tight">
            Task Manager
          </h1>
          <Link href="/tasks/new" className="
            bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl
            transition-all duration-300 transform hover:scale-105
            text-lg whitespace-nowrap flex items-center justify-center space-x-2
          ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Create New Task</span>
          </Link>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-10 shadow-md" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2"> {error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SimpleCalendar />
          </div>

          <div className="lg:col-span-3">
            {tasks.length === 0 && !error ? (
              <div className="bg-white p-12 rounded-2xl shadow-lg border border-blue-100 text-center mt-0">
                <p className="text-gray-700 text-3xl font-semibold mb-4">
                  No tasks found.
                </p>
                <p className="text-gray-600 text-xl">
                  Start by creating your first task to organize your day!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {tasks.map((task) => (
                  <div key={task._id} className={`
                    bg-white rounded-2xl shadow-md p-6 border border-blue-100
                    transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg
                    flex flex-col relative overflow-hidden
                    ${
                      task.status === 'pending' ? 'border-t-4 border-yellow-500' :
                      task.status === 'in-progress' ? 'border-t-4 border-blue-500' :
                      'border-t-4 border-green-500'
                    }
                  `}>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 leading-tight">{task.title}</h2>
                    <p className="text-gray-700 mb-5 text-base flex-grow leading-relaxed">{task.description}</p>

                    <div className="flex items-center justify-between mb-5 mt-auto">
                      <TaskStatusDropdown taskId={task._id} initialStatus={task.status} />

                      <span className="text-sm text-gray-600">
                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <TaskActions taskId={task._id} />

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
