'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { Class, ClassRequest } from '@/types';
import { 
  CalendarIcon, 
  ClockIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

export default function ScheduleManager() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [classRequests, setClassRequests] = useState<ClassRequest[]>([]);
  const [users, setUsers] = useState<{ student_id: string; student_name: string; student_email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [approvingRequest, setApprovingRequest] = useState<ClassRequest | null>(null);
  const [useExistingStudent, setUseExistingStudent] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    student_id: '',
    class_date: '',
    duration_minutes: 60,
    class_type: 'Individual',
    topic: '',
    notes: '',
    payment_amount: '',
  });

  useEffect(() => {
    fetchClasses();
    fetchClassRequests();
    fetchUsers();

    const classesSubscription = db.subscribeToClasses(() => {
      fetchClasses();
    });

    const requestsSubscription = db.subscribeToClassRequests(() => {
      fetchClassRequests();
    });

    return () => {
      classesSubscription.unsubscribe();
      requestsSubscription.unsubscribe();
    };
  }, []);

  const fetchClasses = async () => {
    const { data, error } = await db.getClasses();
    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      setClasses(data || []);
    }
    setLoading(false);
  };

  const fetchClassRequests = async () => {
    const { data, error } = await db.getClassRequests();
    if (error) {
      console.error('Error fetching class requests:', error);
    } else {
      setClassRequests(data || []);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await db.getAllUsers();
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const classData = {
      ...formData,
      payment_amount: formData.payment_amount ? parseFloat(formData.payment_amount) : null,
      status: 'scheduled',
      payment_status: 'unpaid',
    };

    try {
      if (editingClass) {
        await db.updateClass(editingClass.id, classData);
      } else {
        await db.createClass(classData);
      }
      
      // If this was from a request approval, mark the request as approved
      if (approvingRequest) {
        await db.updateClassRequest(approvingRequest.id, { status: 'approved' });
      }
      
      resetForm();
      fetchClasses();
      fetchClassRequests();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      student_name: '',
      student_email: '',
      student_id: '',
      class_date: '',
      duration_minutes: 60,
      class_type: 'Individual',
      topic: '',
      notes: '',
      payment_amount: '',
    });
    setUseExistingStudent(false);
    setSelectedStudentId('');
    setEditingClass(null);
    setApprovingRequest(null);
    setShowForm(false);
  };

  const handleRequestApprove = async (request: ClassRequest) => {
    // Store the request being approved
    setApprovingRequest(request);
    
    // Pre-fill form with request data
    setFormData({
      student_id: request.student_id,
      student_name: request.student_name,
      student_email: request.student_email,
      class_date: request.preferred_date ? new Date(request.preferred_date).toISOString().slice(0, 16) : '',
      duration_minutes: 60,
      class_type: 'Individual',
      topic: request.topic || '',
      notes: request.message || '',
      payment_amount: '',
    });
    setShowForm(true);
  };

  const handleRequestReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this class request?')) return;
    
    try {
      await db.updateClassRequest(id, { status: 'rejected' });
      fetchClassRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };


  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setApprovingRequest(null); // Clear any pending request approval
    setFormData({
      student_name: classItem.student_name,
      student_email: classItem.student_email,
      student_id: classItem.student_id,
      class_date: classItem.class_date.slice(0, 16),
      duration_minutes: classItem.duration_minutes,
      class_type: classItem.class_type || 'Individual',
      topic: classItem.topic || '',
      notes: classItem.notes || '',
      payment_amount: classItem.payment_amount?.toString() || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    
    try {
      await db.deleteClass(id);
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await db.updateClass(id, { status });
      fetchClasses();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Schedule</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Schedule New Class
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {editingClass ? 'Edit Class' : approvingRequest ? 'Approve Class Request' : 'Schedule New Class'}
            </h3>
            {approvingRequest && (
              <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                Approving Request
              </span>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingClass && !approvingRequest && (
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.class_date}
                  onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  required
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
                <select
                  value={formData.class_type}
                  onChange={(e) => setFormData({ ...formData, class_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option>Individual</option>
                  <option>Group</option>
                  <option>Trial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Grammar: Past Perfect Tense"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (₽)</label>
              <input
                type="number"
                step="0.01"
                value={formData.payment_amount}
                onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="2500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Any special notes for this class..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {editingClass ? 'Update Class' : approvingRequest ? 'Approve & Schedule Class' : 'Schedule Class'}
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

      {/* Class Requests */}
      {classRequests.filter(r => r.status === 'pending').length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BellAlertIcon className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Class Requests ({classRequests.filter(r => r.status === 'pending').length})
            </h3>
          </div>
          <div className="space-y-3">
            {classRequests.filter(r => r.status === 'pending').map((request) => (
              <div key={request.id} className="bg-white rounded-lg p-4 border border-yellow-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <UserIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">{request.student_name}</span>
                      <span className="text-sm text-gray-500">({request.student_email})</span>
                    </div>
                    {request.preferred_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Preferred: {new Date(request.preferred_date).toLocaleString()}</span>
                        {request.preferred_time && <span className="ml-2">at {request.preferred_time}</span>}
                      </div>
                    )}
                    {request.topic && (
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>Topic:</strong> {request.topic}
                      </div>
                    )}
                    {request.message && (
                      <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                        {request.message}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Requested: {new Date(request.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleRequestApprove(request)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm flex items-center gap-1"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRequestReject(request.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm flex items-center gap-1"
                    >
                      <XCircleIcon className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No classes scheduled yet
                  </td>
                </tr>
              ) : (
                classes.map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{classItem.student_name}</div>
                          <div className="text-sm text-gray-500">{classItem.student_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(classItem.class_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {new Date(classItem.class_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {' '}({classItem.duration_minutes}min)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{classItem.topic || '-'}</div>
                      <div className="text-xs text-gray-500">{classItem.class_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={classItem.status}
                        onChange={(e) => updateStatus(classItem.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(classItem.status)}`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${getPaymentColor(classItem.payment_status)}`}>
                        {classItem.payment_status}
                      </div>
                      {classItem.payment_amount && (
                        <div className="text-sm text-gray-600 mt-1">₽{classItem.payment_amount}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(classItem)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(classItem.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

