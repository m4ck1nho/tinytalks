'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { PaymentNotification, Class } from '@/types';
import { 
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function PaymentManager() {
  const [payments, setPayments] = useState<PaymentNotification[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentNotification | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    fetchData();

    const paymentsSubscription = db.subscribeToPaymentNotifications(() => {
      fetchData();
    });

    const classesSubscription = db.subscribeToClasses(() => {
      fetchClasses();
    });

    return () => {
      paymentsSubscription.unsubscribe();
      classesSubscription.unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchPayments(), fetchClasses()]);
    setLoading(false);
  };

  const fetchPayments = async () => {
    const { data, error } = await db.getPaymentNotifications();
    if (error) {
      console.error('Error fetching payments:', error);
    } else {
      setPayments(data || []);
    }
  };

  const fetchClasses = async () => {
    const { data, error } = await db.getClasses();
    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      setClasses(data || []);
    }
  };

  const confirmPayment = async (paymentId: string, classId?: string) => {
    try {
      await db.updatePaymentNotification(paymentId, {
        status: 'confirmed',
      });

      if (classId) {
        await db.updateClass(classId, {
          payment_status: 'paid',
        });
      }

      fetchData();
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  const rejectPayment = async (paymentId: string, notes: string) => {
    try {
      await db.updatePaymentNotification(paymentId, {
        status: 'rejected',
        teacher_notes: notes,
      });

      fetchData();
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error rejecting payment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'rejected': return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default: return <ClockIcon className="w-5 h-5 text-yellow-600" />;
    }
  };

  const markClassAsPaid = async (classId: string) => {
    try {
      // Find the class to get student info and amount
      const classItem = classes.find(c => c.id === classId);
      if (!classItem) {
        console.error('Class not found:', classId);
        return;
      }

      console.log('Marking class as paid:', classItem);

      // Check if a payment notification already exists for this class
      const existingPayment = payments.find(p => p.class_id === classId);
      
      if (existingPayment) {
        // If payment exists but is pending, just confirm it
        if (existingPayment.status === 'pending') {
          console.log('Confirming existing payment:', existingPayment);
          await db.updatePaymentNotification(existingPayment.id, {
            status: 'confirmed',
          });
        } else {
          console.log('Payment already confirmed:', existingPayment);
        }
      } else if (classItem.payment_amount) {
        // Create a new payment notification record
        console.log('Creating new payment notification for amount:', classItem.payment_amount);
        const result = await db.createPaymentNotification({
          student_id: classItem.student_id,
          student_name: classItem.student_name,
          student_email: classItem.student_email,
          class_id: classId,
          amount: classItem.payment_amount,
          payment_method: 'Cash', // Default to cash for teacher-confirmed payments
          payment_date: new Date().toISOString().split('T')[0], // Today's date
          status: 'confirmed', // Auto-confirmed since teacher is marking it
          message: 'Payment confirmed by teacher',
        });
        console.log('Payment notification created:', result);
      }

      // Update class payment status
      await db.updateClass(classId, {
        payment_status: 'paid',
      });

      // Refresh data
      await fetchData();
      console.log('Data refreshed. Total payments:', payments.length);
    } catch (error) {
      console.error('Error updating class payment:', error);
      alert('Error marking class as paid. Check console for details.');
    }
  };

  // Calculate monthly income
  const getMonthlyIncome = (month: Date) => {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);
    
    console.log('=== MONTHLY INCOME CALCULATION ===');
    console.log('Selected month:', month.toLocaleDateString());
    console.log('Month range:', monthStart.toLocaleDateString(), 'to', monthEnd.toLocaleDateString());
    console.log('Total payments in state:', payments.length);
    
    const confirmedPayments = payments.filter(p => p.status === 'confirmed');
    console.log('Confirmed payments:', confirmedPayments.length);
    
    confirmedPayments.forEach(p => {
      const paymentDate = new Date(p.payment_date);
      const isInMonth = paymentDate >= monthStart && paymentDate <= monthEnd;
      console.log(`Payment ₽${p.amount} - Date: ${p.payment_date} (${paymentDate.toLocaleDateString()}) - In month: ${isInMonth} - Student: ${p.student_name}`);
    });
    
    const income = payments
      .filter(p => {
        const paymentDate = new Date(p.payment_date);
        return p.status === 'confirmed' && paymentDate >= monthStart && paymentDate <= monthEnd;
      })
      .reduce((sum, p) => sum + p.amount, 0);
    
    console.log('TOTAL INCOME:', income);
    console.log('================================');
    
    return income;
  };

  const getCurrentMonthIncome = () => getMonthlyIncome(selectedMonth);
  
  const getPreviousMonthIncome = () => {
    const prevMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
    return getMonthlyIncome(prevMonth);
  };

  const getMonthlyPaymentCount = (month: Date) => {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);
    
    return payments.filter(p => {
      const paymentDate = new Date(p.payment_date);
      return p.status === 'confirmed' && paymentDate >= monthStart && paymentDate <= monthEnd;
    }).length;
  };

  const calculateGrowth = () => {
    const current = getCurrentMonthIncome();
    const previous = getPreviousMonthIncome();
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const filteredPayments = payments.filter(p => filter === 'all' || p.status === filter);

  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const currentIncome = getCurrentMonthIncome();
  const growth = calculateGrowth();
  const monthlyPaymentCount = getMonthlyPaymentCount(selectedMonth);

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Tracking</h2>
          <p className="text-gray-600 mt-1">Track payment notifications and monthly income</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
            {pendingCount} Pending {pendingCount === 1 ? 'Payment' : 'Payments'}
          </div>
        )}
      </div>

      {/* Monthly Income Statistics */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BanknotesIcon className="w-6 h-6 text-primary-600" />
            Monthly Income
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-semibold text-gray-900 min-w-[120px] text-center">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Month Income */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Income</span>
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₽{currentIncome.toFixed(2)}
            </div>
            <div className={`flex items-center gap-1 text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              )}
              <span className="font-medium">
                {Math.abs(growth).toFixed(1)}% {growth >= 0 ? 'increase' : 'decrease'}
              </span>
            </div>
          </div>

          {/* Number of Payments */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Confirmed Payments</span>
              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {monthlyPaymentCount}
            </div>
            <div className="text-sm text-gray-500">
              {monthlyPaymentCount === 1 ? 'payment' : 'payments'} this month
            </div>
          </div>

          {/* Average Payment */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Average Payment</span>
              <BanknotesIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₽{monthlyPaymentCount > 0 ? (currentIncome / monthlyPaymentCount).toFixed(2) : '0.00'}
            </div>
            <div className="text-sm text-gray-500">
              per transaction
            </div>
          </div>
        </div>

        {/* Previous Month Comparison */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Previous Month Income:</span>
            <span className="font-semibold text-gray-900">₽{getPreviousMonthIncome().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'all' 
              ? 'text-primary-500 border-b-2 border-primary-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All ({payments.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'pending' 
              ? 'text-primary-500 border-b-2 border-primary-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending ({payments.filter(p => p.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'confirmed' 
              ? 'text-primary-500 border-b-2 border-primary-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Confirmed ({payments.filter(p => p.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'rejected' 
              ? 'text-primary-500 border-b-2 border-primary-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Rejected ({payments.filter(p => p.status === 'rejected').length})
        </button>
      </div>

      {/* Payments List */}
      <div className="grid gap-4">
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No {filter !== 'all' ? filter : ''} payment notifications
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        ₽{payment.amount.toFixed(2)}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserIcon className="w-4 h-4" />
                        <span className="font-medium">{payment.student_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Method:</span> {payment.payment_method || 'Not specified'}
                      </div>
                      {payment.reference_number && (
                        <div className="text-gray-600">
                          <span className="font-medium">Ref:</span> {payment.reference_number}
                        </div>
                      )}
                    </div>

                    {payment.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{payment.message}</p>
                      </div>
                    )}

                    {payment.status === 'rejected' && payment.teacher_notes && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-700">{payment.teacher_notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {payment.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmPayment(payment.id, payment.class_id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Confirm
                    </button>
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
                Submitted: {new Date(payment.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* All Classes Payment Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Classes Payment Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.filter(c => c.status !== 'cancelled').map((classItem) => (
                <tr key={classItem.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{classItem.student_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(classItem.class_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{classItem.topic || '-'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {classItem.payment_amount ? `₽${classItem.payment_amount}` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(classItem.payment_status)}`}>
                      {classItem.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {classItem.payment_status === 'unpaid' && classItem.payment_amount && (
                      <button
                        onClick={() => markClassAsPaid(classItem.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        <CheckCircleIcon className="w-3 h-3" />
                        Mark as Paid
                      </button>
                    )}
                    {classItem.payment_status === 'pending' && (
                      <button
                        onClick={() => markClassAsPaid(classItem.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        <CheckCircleIcon className="w-3 h-3" />
                        Confirm Paid
                      </button>
                    )}
                    {classItem.payment_status === 'paid' && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircleIcon className="w-3 h-3" />
                        Confirmed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reject Payment</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this ₽{selectedPayment.amount} payment from {selectedPayment.student_name}.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;
                rejectPayment(selectedPayment.id, notes);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  name="notes"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Incorrect amount, wrong reference number..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject Payment
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
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

