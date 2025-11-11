'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/supabase';
import { TeacherAvailability } from '@/types';
import { 
  ClockIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function AvailabilityManager() {
  const [availability, setAvailability] = useState<TeacherAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TeacherAvailability | null>(null);
  const [formData, setFormData] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
    is_available: true,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      
      // First, verify user is authenticated and admin
      const { data: { user }, error: authError } = await auth.getUser();
      
      if (authError) {
        console.error('Authentication error:', authError);
        setAvailability([]);
        setLoading(false);
        return;
      }
      
      if (!user) {
        console.error('No user found. Please log in.');
        setAvailability([]);
        setLoading(false);
        return;
      }
      
      const userRole = user.user_metadata?.role || 'student';
      console.log('Current user role:', userRole, 'User ID:', user.id);
      
      if (userRole !== 'admin') {
        console.warn('⚠️ Non-admin user attempting to access availability manager. Role:', userRole);
        console.warn('Please ensure your user has role="admin" in user_metadata in Supabase Dashboard.');
        // Still try to fetch, RLS will block if not admin
      }

      const result = await db.getTeacherAvailability();
      const { data, error } = result;
      
      if (error) {
        // Log comprehensive error information
        const errorDetails: Record<string, unknown> = {
          hasError: true,
          message: error?.message || 'No error message',
          details: error?.details || 'No error details',
          hint: error?.hint || 'No error hint',
          code: error?.code || 'No error code',
        };
        
        // Try to extract all error properties
        try {
          if (error && typeof error === 'object') {
            errorDetails.allProperties = Object.getOwnPropertyNames(error);
            errorDetails.errorKeys = Object.keys(error);
            errorDetails.errorValues = Object.values(error);
          }
          errorDetails.errorString = JSON.stringify(error, null, 2);
        } catch (e) {
          errorDetails.stringifyError = 'Could not stringify error: ' + String(e);
        }
        
        console.error('❌ Error fetching availability:', errorDetails);
        
        // Provide specific error messages based on error code
        if (error?.code === '42P01' || error?.code === 'PGRST116') {
          console.error('❌ TABLE DOES NOT EXIST');
          console.error('The teacher_availability table does not exist in your database.');
          console.error('Solution: Run the migration script in Supabase SQL Editor:');
          console.error('  docs/teacher-availability-schema.sql');
        } else if (error?.code === '42501') {
          console.error('❌ PERMISSION DENIED (RLS Policy Issue)');
          console.error('Your user does not have permission to access this table.');
          console.error('Solutions:');
          console.error('1. Verify your user has role="admin" in user_metadata');
          console.error('2. Run the fix script: docs/fix-teacher-availability-policies.sql');
          console.error('3. Check RLS policies in Supabase Dashboard');
        } else if (error?.message) {
          console.error('❌ Error:', error.message);
          if (error.details) console.error('Details:', error.details);
          if (error.hint) console.error('Hint:', error.hint);
        } else {
          console.error('❌ Unknown error occurred. Error object:', error);
          console.error('This might indicate:');
          console.error('1. Table does not exist');
          console.error('2. RLS policies are blocking access');
          console.error('3. Network/connection issue');
          console.error('Please check the Supabase dashboard and run the migration scripts.');
        }
        
        // Set empty array to prevent UI from breaking
        setAvailability([]);
      } else {
        // Success - set the data
        setAvailability(data || []);
        if (!data || data.length === 0) {
          console.log('ℹ️ No availability slots found. This is normal if you haven\'t added any yet.');
        } else {
          console.log(`✅ Successfully loaded ${data.length} availability slot(s)`);
        }
      }
    } catch (err) {
      console.error('❌ Unexpected error fetching availability:', err);
      // Try to extract more info from the error
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      } else {
        console.error('Error type:', typeof err);
        console.error('Error value:', err);
      }
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSlot) {
        await db.updateTeacherAvailability(editingSlot.id, formData);
      } else {
        await db.createTeacherAvailability(formData);
      }
      
      resetForm();
      fetchAvailability();
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      day_of_week: 1,
      start_time: '09:00',
      end_time: '17:00',
      is_available: true,
    });
    setEditingSlot(null);
    setShowForm(false);
  };

  const handleEdit = (slot: TeacherAvailability) => {
    setEditingSlot(slot);
    setFormData({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_available: slot.is_available,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    
    try {
      await db.deleteTeacherAvailability(pendingDeleteId);
      fetchAvailability();
      setShowDeleteModal(false);
      setPendingDeleteId(null);
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  const groupedAvailability = DAYS_OF_WEEK.map(day => ({
    ...day,
    slots: availability.filter(slot => slot.day_of_week === day.value),
  }));

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teacher Availability</h2>
          <p className="text-gray-600 mt-1">Manage your weekly schedule. Students can only book available times.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-900 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-800 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
        >
          <PlusIcon className="w-5 h-5" />
          Add Availability
        </button>
      </div>

      {showForm && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingSlot ? 'Edit Availability' : 'Add Availability'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
              <select
                value={formData.day_of_week}
                onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                Available
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-900 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-800 transition-all duration-300 shadow-lg shadow-primary-500/30"
              >
                {editingSlot ? 'Update' : 'Add'} Availability
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Availability List */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
        {groupedAvailability.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No availability set. Add your available times above.</p>
        ) : (
          <div className="space-y-4">
            {groupedAvailability.map((day) => (
              <div key={day.value} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                <h4 className="font-semibold text-gray-900 mb-3">{day.label}</h4>
                {day.slots.length === 0 ? (
                  <p className="text-sm text-gray-500">No availability set</p>
                ) : (
                  <div className="space-y-2">
                    {day.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          slot.is_available
                            ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200'
                            : 'bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <ClockIcon className={`w-5 h-5 ${slot.is_available ? 'text-green-600' : 'text-gray-400'}`} />
                          <div>
                            <span className="font-medium text-gray-900">
                              {slot.start_time} - {slot.end_time}
                            </span>
                            {!slot.is_available && (
                              <span className="ml-2 text-xs text-gray-500">(Unavailable)</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(slot)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(slot.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900">Delete Availability?</h3>
                <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this availability slot? Students will no longer be able to book this time.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPendingDeleteId(null);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

