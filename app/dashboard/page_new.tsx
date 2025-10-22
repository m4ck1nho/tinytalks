'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Class, Homework, ClassRequest } from '@/types';
import Calendar from '@/components/shared/Calendar';
import { 
  BookOpenIcon, 
  CalendarIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PlusCircleIcon,
  HomeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

type Tab = 'overview' | 'calendar' | 'classes' | 'homework' | 'requests';

export default function UserDashboard() {
  const { t } = useLanguage();
  const [user, setUser] = useState<{ id?: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [classes, setClasses] = useState<Class[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [classRequests, setClassRequests] = useState<ClassRequest[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        const userRole = user.user_metadata?.role || 'student';
        if (userRole === 'admin') {
          router.push('/admin/dashboard');
          return;
        }
        setUser(user);
        fetchStudentData(user.id!);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const fetchStudentData = async (userId: string) => {
    const { data: classesData } = await db.getClasses();
    const { data: homeworkData } = await db.getHomework();
    const { data: requestsData } = await db.getClassRequests();
    
    setClasses((classesData || []).filter((c: Class) => c.student_id === userId));
    setHomework((homeworkData || []).filter((h: Homework) => h.student_id === userId));
    setClassRequests((requestsData || []).filter((r: ClassRequest) => r.student_id === userId));
  };

  const submitClassRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const form = e.target as HTMLFormElement;
    const formData = {
      student_id: user.id!,
      student_name: user.user_metadata?.full_name || user.email!.split('@')[0],
      student_email: user.email!,
      preferred_date: (form.elements.namedItem('preferred_date') as HTMLInputElement).value || null,
      preferred_time: (form.elements.namedItem('preferred_time') as HTMLInputElement).value || null,
      topic: (form.elements.namedItem('topic') as HTMLInputElement).value || null,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value || null,
      status: 'pending',
    };

    try {
      await db.createClassRequest(formData);
      alert(t('classRequest.success'));
      setShowRequestForm(false);
      fetchStudentData(user.id!);
    } catch (error) {
      console.error('Error submitting class request:', error);
      alert(t('classRequest.error'));
    }
  };

  const submitPaymentNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedClass) return;

    const form = e.target as HTMLFormElement;
    const formData = {
      student_id: user.id!,
      student_name: user.user_metadata?.full_name || user.email!.split('@')[0],
      student_email: user.email!,
      class_id: selectedClass.id,
      amount: parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value),
      payment_method: (form.elements.namedItem('payment_method') as HTMLSelectElement).value,
      payment_date: (form.elements.namedItem('payment_date') as HTMLInputElement).value,
      reference_number: (form.elements.namedItem('reference_number') as HTMLInputElement).value || null,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value || null,
      status: 'pending',
    };

    try {
      await db.createPaymentNotification(formData);
      alert(t('payment.modal.success'));
      setShowPaymentForm(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert(t('payment.modal.error'));
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';

  const tabs = [
    { id: 'overview' as Tab, name: 'Overview', icon: HomeIcon },
    { id: 'calendar' as Tab, name: 'Calendar', icon: CalendarDaysIcon },
    { id: 'classes' as Tab, name: 'My Classes', icon: CalendarIcon },
    { id: 'homework' as Tab, name: 'Homework', icon: BookOpenIcon },
    { id: 'requests' as Tab, name: 'Requests', icon: ChatBubbleBottomCenterTextIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-800 rounded-lg flex items-center justify-center font-bold text-white">
                  TT
                </div>
                <span className="text-xl font-bold text-gray-900">TinyTalks</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{t('dashboard.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-800 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.welcome')}, {userName}!</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex gap-2 px-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary-500 border-primary-500'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-lg">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-8 space-y-6">
              {/* Summary Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
                  <div className="text-3xl font-bold text-primary-600 mb-1">{classes.filter(c => c.status === 'completed').length}</div>
                  <div className="text-sm text-gray-700 font-medium">{t('dashboard.stats.completed')}</div>
                </div>
                <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6">
                  <div className="text-3xl font-bold text-secondary-900 mb-1">{homework.filter(h => h.status === 'completed').length}</div>
                  <div className="text-sm text-gray-700 font-medium">{t('dashboard.stats.homeworkCompleted')}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="text-3xl font-bold text-green-600 mb-1">{classes.filter(c => c.payment_status === 'paid').length}</div>
                  <div className="text-sm text-gray-700 font-medium">{t('dashboard.stats.paidClasses')}</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 rounded-xl transition-all"
                >
                  <PlusCircleIcon className="w-8 h-8 text-primary-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{t('classRequest.button')}</div>
                    <div className="text-sm text-gray-600">Schedule a new class with your teacher</div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('homework')}
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 rounded-xl transition-all"
                >
                  <BookOpenIcon className="w-8 h-8 text-secondary-900" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">View Homework</div>
                    <div className="text-sm text-gray-600">{homework.filter(h => h.status !== 'completed').length} pending assignments</div>
                  </div>
                </button>
              </div>

              {/* Upcoming Classes Preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Classes</h2>
                  <button
                    onClick={() => setActiveTab('classes')}
                    className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                {classes.filter(c => c.status === 'scheduled').slice(0, 3).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">{t('dashboard.noClasses')}</p>
                ) : (
                  <div className="space-y-3">
                    {classes.filter(c => c.status === 'scheduled').slice(0, 3).map((classItem) => (
                      <div key={classItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="w-5 h-5 text-primary-500" />
                          <div>
                            <div className="font-medium text-gray-900">{classItem.topic || t('dashboard.englishClass')}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(classItem.class_date).toLocaleDateString()} at {new Date(classItem.class_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        {classItem.payment_status === 'unpaid' && classItem.payment_amount && (
                          <button
                            onClick={() => {
                              setSelectedClass(classItem);
                              setShowPaymentForm(true);
                            }}
                            className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors"
                          >
                            Notify Payment
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="p-8">
              <Calendar classes={classes} payments={[]} isAdmin={false} />
            </div>
          )}

          {/* My Classes Tab */}
          {activeTab === 'classes' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.upcomingClasses')}</h2>
              {classes.filter(c => c.status === 'scheduled').length === 0 ? (
                <p className="text-gray-500 text-center py-12">{t('dashboard.noClasses')}</p>
              ) : (
                <div className="space-y-4">
                  {classes.filter(c => c.status === 'scheduled').map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{classItem.topic || t('dashboard.englishClass')}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(classItem.class_date).toLocaleDateString()} at {new Date(classItem.class_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{classItem.duration_minutes} {t('dashboard.minutes')} • {classItem.class_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {classItem.payment_amount && (
                          <div className="text-right mr-4">
                            <div className="text-lg font-bold text-gray-900">₽{classItem.payment_amount}</div>
                            <div className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              classItem.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                              classItem.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {classItem.payment_status === 'paid' ? t('dashboard.paid') :
                               classItem.payment_status === 'pending' ? t('dashboard.paymentPending') :
                               'Unpaid'}
                            </div>
                          </div>
                        )}
                        {classItem.payment_status === 'unpaid' && classItem.payment_amount && (
                          <button
                            onClick={() => {
                              setSelectedClass(classItem);
                              setShowPaymentForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                          >
                            <CurrencyDollarIcon className="w-5 h-5" />
                            {t('dashboard.notifyPayment')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Homework Tab */}
          {activeTab === 'homework' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.homework')}</h2>
              {homework.filter(h => h.status !== 'completed').length === 0 ? (
                <p className="text-gray-500 text-center py-12">{t('dashboard.noHomework')}</p>
              ) : (
                <div className="space-y-4">
                  {homework.filter(h => h.status !== 'completed').map((hw) => (
                    <div key={hw.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <BookOpenIcon className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">{hw.title}</h3>
                            <p className="text-gray-700 mb-3">{hw.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <ClockIcon className="w-4 h-4" />
                              {t('dashboard.due')}: {new Date(hw.due_date).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${
                          hw.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 
                          hw.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t(`dashboard.status.${hw.status}`)}
                        </span>
                      </div>
                      {hw.teacher_feedback && (
                        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-1">{t('dashboard.teacherFeedback')}: {hw.grade}</p>
                          <p className="text-sm text-blue-800">{hw.teacher_feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Class Requests Tab */}
          {activeTab === 'requests' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t('classRequest.title')}</h2>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 transition-colors"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  {t('classRequest.button')}
                </button>
              </div>
              
              {classRequests.length === 0 ? (
                <div className="text-center py-12">
                  <ChatBubbleBottomCenterTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t('classRequest.noRequests')}</p>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    {t('classRequest.button')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {classRequests.map((request) => (
                    <div key={request.id} className={`p-6 rounded-lg border ${
                      request.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                      request.status === 'approved' ? 'bg-green-50 border-green-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          {request.preferred_date && (
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                              <CalendarIcon className="w-4 h-4" />
                              <span className="font-medium">{t('classRequest.preferredDate')}:</span>
                              <span>{new Date(request.preferred_date).toLocaleDateString()}</span>
                              {request.preferred_time && <span className="ml-2">{request.preferred_time}</span>}
                            </div>
                          )}
                          {request.topic && (
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>{t('classRequest.topic')}:</strong> {request.topic}
                            </div>
                          )}
                          {request.message && (
                            <div className="text-sm text-gray-600 bg-white p-3 rounded mt-3">
                              {request.message}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-3">
                            {t('classRequest.submitted')}: {new Date(request.created_at).toLocaleString()}
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ml-4 flex-shrink-0 ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {t(`classRequest.status.${request.status}`)}
                        </span>
                      </div>
                      {request.admin_notes && (
                        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-1">{t('classRequest.adminNotes')}</p>
                          <p className="text-sm text-blue-800">{request.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Class Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">{t('classRequest.modal.title')}</h3>
            <form onSubmit={submitClassRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('classRequest.modal.preferredDate')}
                </label>
                <input
                  type="date"
                  name="preferred_date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('classRequest.modal.preferredTime')}
                </label>
                <input
                  type="time"
                  name="preferred_time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('classRequest.modal.topic')}
                </label>
                <input
                  type="text"
                  name="topic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('classRequest.modal.topicPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('classRequest.modal.message')}
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('classRequest.modal.messagePlaceholder')}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {t('classRequest.modal.submit')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('classRequest.modal.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Notification Modal */}
      {showPaymentForm && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">{t('payment.modal.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('payment.modal.class')}: {selectedClass.topic || t('dashboard.englishClass')} on {new Date(selectedClass.class_date).toLocaleDateString()}
              {selectedClass.payment_amount && ` - ₽${selectedClass.payment_amount}`}
            </p>
            <form onSubmit={submitPaymentNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.modal.amount')}</label>
                <input
                  type="number"
                  name="amount"
                  required
                  step="0.01"
                  defaultValue={selectedClass.payment_amount || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.modal.method')}</label>
                <select
                  name="payment_method"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Bank Transfer">{t('payment.methods.bankTransfer')}</option>
                  <option value="Cash">{t('payment.methods.cash')}</option>
                  <option value="PayPal">{t('payment.methods.paypal')}</option>
                  <option value="Venmo">{t('payment.methods.venmo')}</option>
                  <option value="Other">{t('payment.methods.other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.modal.date')}</label>
                <input
                  type="date"
                  name="payment_date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.modal.reference')}</label>
                <input
                  type="text"
                  name="reference_number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('payment.modal.referencePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('payment.modal.message')}</label>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('payment.modal.messagePlaceholder')}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {t('payment.modal.submit')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedClass(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('payment.modal.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

