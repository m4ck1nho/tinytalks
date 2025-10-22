'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { Homework } from '@/types';
import { 
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function HomeworkManager() {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [users, setUsers] = useState<{ student_id: string; student_name: string; student_email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [useExistingStudent, setUseExistingStudent] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    student_id: '',
    title: '',
    description: '',
    due_date: '',
  });

  useEffect(() => {
    fetchHomework();
    fetchUsers();

    const subscription = db.subscribeToHomework(() => {
      fetchHomework();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchHomework = async () => {
    const { data, error} = await db.getHomework();
    if (error) {
      console.error('Error fetching homework:', error);
    } else {
      setHomework(data || []);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data, error } = await db.getAllUsers();
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingHomework) {
        await db.updateHomework(editingHomework.id, formData);
      } else {
        await db.createHomework({
          ...formData,
          status: 'assigned',
        });
      }
      
      resetForm();
      fetchHomework();
    } catch (error) {
      console.error('Error saving homework:', error);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = users.find(u => u.student_id === studentId);
    if (student) {
      setFormData({
        ...formData,
        student_id: student.student_id,
        student_name: student.student_name,
        student_email: student.student_email,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      student_name: '',
      student_email: '',
      student_id: '',
      title: '',
      description: '',
      due_date: '',
    });
    setUseExistingStudent(false);
    setSelectedStudentId('');
    setEditingHomework(null);
    setShowForm(false);
  };

  const handleEdit = (hw: Homework) => {
    setEditingHomework(hw);
    setFormData({
      student_name: hw.student_name,
      student_email: hw.student_email,
      student_id: hw.student_id || '',
      title: hw.title,
      description: hw.description,
      due_date: hw.due_date.slice(0, 16),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this homework?')) return;
    
    try {
      await db.deleteHomework(id);
      fetchHomework();
    } catch (error) {
      console.error('Error deleting homework:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await db.updateHomework(id, { status });
      fetchHomework();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const saveFeedback = async (id: string, feedback: string, grade: string) => {
    try {
      await db.updateHomework(id, { 
        teacher_feedback: feedback,
        grade,
        status: 'reviewed'
      });
      fetchHomework();
      setSelectedHomework(null);
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Homework</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Assign Homework
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{editingHomework ? 'Edit Homework' : 'Assign New Homework'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingHomework && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useExistingStudent}
                    onChange={(e) => setUseExistingStudent(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Select from registered students</span>
                </label>
                
                {useExistingStudent && users.length > 0 && (
                  <div className="mt-3">
                    <select
                      value={selectedStudentId}
                      onChange={(e) => handleStudentSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Choose a student...</option>
                      {users.map((user) => (
                        <option key={user.student_id} value={user.student_id}>
                          {user.student_name} ({user.student_email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  disabled={useExistingStudent && selectedStudentId !== ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                <input
                  type="email"
                  required
                  value={formData.student_email}
                  onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
                  disabled={useExistingStudent && selectedStudentId !== ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Essay: My Summer Vacation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Instructions</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Provide detailed instructions for the homework..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {editingHomework ? 'Update Homework' : 'Assign Homework'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {homework.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No homework assigned yet
          </div>
        ) : (
          homework.map((hw) => (
            <div key={hw.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpenIcon className="w-6 h-6 text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{hw.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(hw.status)}`}>
                      {hw.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      {hw.student_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      Due: {new Date(hw.due_date).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{hw.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(hw)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(hw.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {hw.status === 'submitted' && hw.submission_text && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Student Submission:</h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{hw.submission_text}</p>
                    {hw.submitted_at && (
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(hw.submitted_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setSelectedHomework(hw)}
                    className="text-primary-500 hover:text-primary-600 font-semibold"
                  >
                    Add Feedback & Grade
                  </button>
                </div>
              )}

              {(hw.status === 'reviewed' || hw.status === 'completed') && hw.teacher_feedback && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Your Feedback:</h4>
                    {hw.grade && (
                      <span className="text-lg font-bold text-primary-500">{hw.grade}</span>
                    )}
                  </div>
                  <p className="text-gray-700">{hw.teacher_feedback}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <select
                  value={hw.status}
                  onChange={(e) => updateStatus(hw.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="assigned">Assigned</option>
                  <option value="submitted">Submitted</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Feedback Modal */}
      {selectedHomework && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">Add Feedback for: {selectedHomework.title}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const feedback = (form.elements.namedItem('feedback') as HTMLTextAreaElement).value;
                const grade = (form.elements.namedItem('grade') as HTMLInputElement).value;
                saveFeedback(selectedHomework.id, feedback, grade);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <input
                  type="text"
                  name="grade"
                  required
                  defaultValue={selectedHomework.grade || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., A+, 95%, Excellent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea
                  name="feedback"
                  required
                  defaultValue={selectedHomework.teacher_feedback || ''}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Provide detailed feedback for the student..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Save Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedHomework(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

