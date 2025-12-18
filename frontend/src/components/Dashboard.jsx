import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { taskAPI, authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filter, setFilter] = useState('all'); // all, my-tasks, pending, completed
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const tasksResponse = await taskAPI.getAllTasks();
      setTasks(tasksResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        assignedUserId: user?.id
      };
      await taskAPI.createTask(taskData);
      setShowModal(false);
      setFormData({
        title: '',
        description: ''
      });
      fetchData();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleStatusUpdate = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
      await taskAPI.updateTaskStatus(taskId, newStatus);
      fetchData();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await taskAPI.deleteTask(taskToDelete._id);
      setShowDeleteModal(false);
      setTaskToDelete(null);
      fetchData();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'my-tasks') return task.assignedUserId._id === user?.id;
    if (filter === 'pending') return task.status === 'Pending';
    if (filter === 'completed') return task.status === 'Completed';
    return true;
  });

  const stats = {
    total: tasks.length,
    myTasks: tasks.filter(t => t.assignedUserId._id === user?.id).length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    completed: tasks.filter(t => t.status === 'Completed').length
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${isDarkMode ? 'border-yellow-500' : 'border-blue-500'}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow-lg ${isDarkMode ? 'bg-gray-900 border-b-2 border-yellow-600' : 'bg-white border-b-2 border-blue-500'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`}>Task Manager</h1>
              <p className={`mt-1 ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>Welcome back, {user?.name}!</p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg font-bold transition duration-200 ${isDarkMode ? 'bg-yellow-900 hover:bg-yellow-800 text-yellow-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleLogout}
                className={`px-6 py-2 rounded-lg font-bold transition duration-200 ${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-black' : 'bg-red-500 hover:bg-red-600 text-white'}`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className={`px-4 py-3 rounded-lg mb-6 ${isDarkMode ? 'bg-yellow-900 border-2 border-yellow-600 text-yellow-200' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl shadow-lg p-6 border-l-4 ${isDarkMode ? 'bg-gray-900 border-yellow-500' : 'bg-white border-blue-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>Total Tasks</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`}>{stats.total}</p>
              </div>
              <div className={`rounded-full p-3 ${isDarkMode ? 'bg-yellow-900' : 'bg-blue-100'}`}>
                <svg className={`w-8 h-8 ${isDarkMode ? 'text-yellow-500' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg p-6 border-l-4 ${isDarkMode ? 'bg-gray-900 border-yellow-600' : 'bg-white border-purple-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>My Tasks</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-yellow-600' : 'text-purple-600'}`}>{stats.myTasks}</p>
              </div>
              <div className={`rounded-full p-3 ${isDarkMode ? 'bg-yellow-900' : 'bg-purple-100'}`}>
                <svg className={`w-8 h-8 ${isDarkMode ? 'text-yellow-600' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg p-6 border-l-4 ${isDarkMode ? 'bg-gray-900 border-yellow-400' : 'bg-white border-orange-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>Pending</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-yellow-400' : 'text-orange-600'}`}>{stats.pending}</p>
              </div>
              <div className={`rounded-full p-3 ${isDarkMode ? 'bg-yellow-900' : 'bg-orange-100'}`}>
                <svg className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg p-6 border-l-4 ${isDarkMode ? 'bg-gray-900 border-yellow-300' : 'bg-white border-green-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>Completed</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-yellow-300' : 'text-green-600'}`}>{stats.completed}</p>
              </div>
              <div className={`rounded-full p-3 ${isDarkMode ? 'bg-yellow-900' : 'bg-green-100'}`}>
                <svg className={`w-8 h-8 ${isDarkMode ? 'text-yellow-300' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Create Button */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-bold transition duration-200 ${
                filter === 'all'
                  ? isDarkMode ? 'bg-yellow-600 text-black' : 'bg-blue-500 text-white'
                  : isDarkMode ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('my-tasks')}
              className={`px-4 py-2 rounded-lg font-bold transition duration-200 ${
                filter === 'my-tasks'
                  ? isDarkMode ? 'bg-yellow-600 text-black' : 'bg-purple-500 text-white'
                  : isDarkMode ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-bold transition duration-200 ${
                filter === 'pending'
                  ? isDarkMode ? 'bg-yellow-600 text-black' : 'bg-orange-500 text-white'
                  : isDarkMode ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-bold transition duration-200 ${
                filter === 'completed'
                  ? isDarkMode ? 'bg-yellow-600 text-black' : 'bg-green-500 text-white'
                  : isDarkMode ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`px-6 py-2 rounded-lg font-bold transition duration-200 flex items-center ${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task._id} className={`rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden ${isDarkMode ? 'bg-gray-900 border border-yellow-900' : 'bg-white border border-gray-200'}`}>
              <div className={`h-2 ${task.status === 'Completed' ? (isDarkMode ? 'bg-yellow-300' : 'bg-green-500') : (isDarkMode ? 'bg-yellow-600' : 'bg-orange-500')}`}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-xl font-bold flex-1 ${isDarkMode ? 'text-yellow-500' : 'text-gray-900'}`}>{task.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    task.status === 'Completed'
                      ? isDarkMode ? 'bg-yellow-300 text-black' : 'bg-green-100 text-green-800'
                      : isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                
                <p className={`mb-4 line-clamp-3 ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>{task.description}</p>
                
                <div className={`flex items-center text-sm mb-4 ${isDarkMode ? 'text-yellow-400' : 'text-gray-500'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-bold">{task.assignedUserId.name}</span>
                </div>

                {task.assignedUserId._id === user?.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(task._id, task.status)}
                      className={`flex-1 py-2 rounded-lg font-bold transition duration-200 ${
                        task.status === 'Pending'
                          ? isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-black' : 'bg-green-500 hover:bg-green-600 text-white'
                          : isDarkMode ? 'bg-yellow-800 hover:bg-yellow-900 text-yellow-300' : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      {task.status === 'Pending' ? 'Mark Complete' : 'Mark Pending'}
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task)}
                      className={`px-4 py-2 rounded-lg font-bold transition duration-200 ${isDarkMode ? 'bg-black hover:bg-gray-900 text-yellow-500 border border-yellow-600' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className={`text-center py-2 rounded-lg font-bold ${isDarkMode ? 'bg-gray-800 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                    This task is assigned to another user
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <svg className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-yellow-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className={`mt-4 text-lg font-bold ${isDarkMode ? 'text-yellow-500' : 'text-gray-600'}`}>No tasks found</p>
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {showModal && (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${isDarkMode ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-50'}`}>
          <div className={`rounded-2xl shadow-2xl w-full max-w-md p-8 ${isDarkMode ? 'bg-gray-900 border-2 border-yellow-600' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-500' : 'text-gray-900'}`}>Create New Task</h2>
              <button
                onClick={() => setShowModal(false)}
                className={`rounded-full p-2 transition-all duration-200 ${isDarkMode ? 'text-yellow-500 hover:text-yellow-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-yellow-500' : 'text-gray-700'}`}>
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className={`w-full px-4 py-3 rounded-lg transition duration-200 ${isDarkMode ? 'text-yellow-100 bg-gray-800 border-2 border-yellow-900 focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600' : 'text-gray-900 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'}`}
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-yellow-500' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                  className={`w-full px-4 py-3 rounded-lg transition duration-200 resize-none ${isDarkMode ? 'text-yellow-100 bg-gray-800 border-2 border-yellow-900 focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600' : 'text-gray-900 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white'}`}
                  placeholder="Enter task description"
                />
              </div>

              <div className={`rounded-lg p-3 ${isDarkMode ? 'bg-yellow-900 border-2 border-yellow-600' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-gray-700'}`}>
                  <span className="font-bold">Assigned to:</span> {user?.name}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition duration-200 ${isDarkMode ? 'bg-gray-800 border-2 border-yellow-900 text-yellow-500 hover:bg-gray-700 hover:border-yellow-600' : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition duration-200 shadow-lg hover:shadow-xl ${isDarkMode ? 'bg-yellow-600 text-black hover:bg-yellow-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && taskToDelete && (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${isDarkMode ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-50'}`}>
          <div className={`rounded-2xl shadow-2xl w-full max-w-md p-8 ${isDarkMode ? 'bg-gray-900 border-2 border-yellow-600' : 'bg-white'}`}>
            <div className="text-center mb-6">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${isDarkMode ? 'bg-yellow-900' : 'bg-red-100'}`}>
                <svg className={`h-8 w-8 ${isDarkMode ? 'text-yellow-500' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-yellow-500' : 'text-gray-900'}`}>Delete Task</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>Are you sure you want to delete this task? This action cannot be undone.</p>
              <div className={`rounded-lg p-4 text-left ${isDarkMode ? 'bg-gray-800 border border-yellow-900' : 'bg-gray-50'}`}>
                <p className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-yellow-500' : 'text-gray-700'}`}>Task: {taskToDelete.title}</p>
                <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-yellow-300' : 'text-gray-600'}`}>{taskToDelete.description}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className={`flex-1 px-6 py-3 rounded-lg font-bold transition duration-200 ${isDarkMode ? 'bg-gray-800 border-2 border-yellow-900 text-yellow-500 hover:bg-gray-700 hover:border-yellow-600' : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm'}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`flex-1 px-6 py-3 rounded-lg font-bold transition duration-200 shadow-lg hover:shadow-xl ${isDarkMode ? 'bg-yellow-600 text-black hover:bg-yellow-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
