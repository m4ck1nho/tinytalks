'use client';

import { useEffect, useState, useCallback } from 'react';
import { auth, db } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Class, Homework, ClassRequest, PaymentNotification } from '@/types';
import { formatDate, formatTime, formatDateTime } from '@/lib/dateUtils';
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
import Notification from '@/components/shared/Notification';

type Tab = 'overview' | 'calendar' | 'classes' | 'homework' | 'requests' | 'notifications';

export default function UserDashboard() {
  // All text is hardcoded in Russian
  const isRu = true; // Always Russian
  const [user, setUser] = useState<{ id?: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [classes, setClasses] = useState<Class[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [classRequests, setClassRequests] = useState<ClassRequest[]>([]);
  const [paymentNotifications, setPaymentNotifications] = useState<PaymentNotification[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
  } | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showSubmitHomework, setShowSubmitHomework] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedClassRequest, setSelectedClassRequest] = useState<ClassRequest | null>(null);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<Array<{ day_of_week: number; time: string }>>([{ day_of_week: 1, time: '' }]);
  const [lessonsPerWeek, setLessonsPerWeek] = useState<number>(1);
  const [totalLessons, setTotalLessons] = useState(4);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [paymentPreference, setPaymentPreference] = useState<'weekly' | 'all_at_once'>('all_at_once');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completedPackage, setCompletedPackage] = useState<{ id: string; weekly_schedule: string } | null>(null);
  const router = useRouter();

  const text = {
    sidebarSubtitle: isRu ? 'Личный кабинет' : 'Student Dashboard',
    defaultStudent: isRu ? 'Студент' : 'Student',
    tabs: {
      overview: isRu ? 'Обзор' : 'Overview',
      calendar: isRu ? 'Календарь' : 'Calendar',
      classes: isRu ? 'Мои занятия' : 'My Classes',
      homework: isRu ? 'Домашние задания' : 'Homework',
      requests: isRu ? 'Записаться' : 'Book a Class',
      notifications: isRu ? 'Уведомления' : 'Notifications',
    },
    overview: {
      title: isRu ? 'Ближайшие занятия' : 'Upcoming Classes',
      viewAll: isRu ? 'Смотреть все' : 'View All',
      paymentPendingTitle: isRu ? 'Ожидает оплаты' : 'Payment Pending',
      paymentPendingDescription: isRu
        ? 'У вас есть занятия, ожидающие подтверждения оплаты. Свяжитесь с преподавателем, завершите оплату и отправьте уведомление об оплате.'
        : 'You have classes waiting for payment confirmation. Please contact your teacher to complete the payment and then submit a payment notification.',
    },
    classes: {
      waitingTitle: isRu ? 'Ожидаем оплату' : 'Waiting for Payment',
      waitingDescription: isRu
        ? 'Свяжитесь с преподавателем, чтобы оформить оплату. После оплаты отправьте уведомление, чтобы преподаватель подтвердил платеж и открыл расписание.'
        : 'Contact your teacher to arrange payment. After you pay, submit a payment notification so the teacher can confirm it and release the schedule.',
      waitingBadge: isRu ? 'Ожидает оплаты' : 'Waiting for payment',
      paymentConfirmed: isRu
        ? 'Оплата подтверждена! Занятия добавлены в календарь.'
        : 'Payment confirmed! Your classes are on the calendar.',
    },
    notifications: {
      teacherEditsApprovedTitle: isRu ? 'Изменения одобрены!' : 'Changes Approved!',
      teacherEditsApprovedMessage: isRu
        ? 'Изменения преподавателя сохранены и запрос обновлён.'
        : "The teacher's changes have been approved and the request has been updated.",
      teacherEditsApproveErrorTitle: isRu ? 'Не удалось одобрить изменения' : 'Error Approving Changes',
      teacherEditsRejectedTitle: isRu ? 'Изменения отклонены' : 'Changes Rejected',
      teacherEditsRejectedMessage: isRu
        ? 'Запрос оставлен без изменений.'
        : 'The original request remains unchanged.',
      teacherEditsRejectErrorTitle: isRu ? 'Не удалось отклонить изменения' : 'Error Rejecting Changes',
      minLessonsTitle: isRu ? 'Минимум занятий' : 'Minimum Lessons Required',
      minLessonsMessage: isRu
        ? 'Минимальное количество занятий — 4. Первое занятие бесплатно!'
        : 'Minimum 4 lessons required. First lesson is free!',
      scheduleIncompleteTitle: isRu ? 'Не выбран график' : 'Schedule Incomplete',
      scheduleIncompleteMessage: (count: number) =>
        isRu
          ? `Выберите ${count} день(дней) и время для еженедельного расписания.`
          : `Please select ${count} day(s) and time(s) for your weekly schedule.`,
      requestSuccessMessage: isRu
        ? 'Бронирование успешно отправлено! Преподаватель скоро его рассмотрит.'
        : 'Your class booking has been submitted successfully!',
      requestErrorMessage: isRu ? 'Не удалось отправить бронирование. Попробуйте ещё раз.' : 'Please try again.',
      paymentSuccessMessage: isRu
        ? 'Уведомление об оплате успешно отправлено!'
        : 'Your payment notification has been submitted successfully!',
      paymentErrorMessage: isRu ? 'Не удалось отправить уведомление. Попробуйте ещё раз.' : 'Please try again.',
      homeworkSuccessTitle: isRu ? 'Домашнее задание отправлено!' : 'Homework Submitted!',
      homeworkSuccessMessage: isRu
        ? 'Домашнее задание успешно отправлено.'
        : 'Your homework has been submitted successfully!',
      homeworkErrorTitle: isRu ? 'Ошибка отправки' : 'Submission Failed',
      homeworkErrorMessage: isRu
        ? 'Не удалось отправить домашнее задание. Попробуйте ещё раз.'
        : 'Failed to submit homework. Please try again.',
      tryAgain: isRu ? 'Попробуйте ещё раз.' : 'Please try again.',
    },
    schedule: {
      title: isRu ? 'Выберите еженедельное расписание *' : 'Select Your Weekly Schedule *',
      chooseHint: (count: number) =>
        isRu
          ? `Выберите ${count} день(дней) и время в неделю. По этому расписанию занятия будут ставиться автоматически.`
          : `Choose ${count} day(s) and time(s) per week. System will automatically schedule all classes based on this pattern.`,
      classLabel: (index: number) => (isRu ? `Занятие ${index + 1} в неделю` : `Class ${index + 1} per week`),
      remove: isRu ? 'Удалить' : 'Remove',
      dayOfWeek: isRu ? 'День недели *' : 'Day of Week *',
      time: isRu ? 'Время * (08:00–20:00)' : 'Time * (8 AM - 8 PM)',
      addAnother: isRu ? '+ Добавить ещё день/время' : '+ Add Another Day/Time',
    },
    paymentPreference: {
      title: isRu ? 'Предпочтительный способ оплаты *' : 'Payment Preference *',
      allAtOnce: isRu ? 'Оплатить сразу' : 'Pay All at Once',
      allAtOnceDescription: (lessonCount: number) =>
        isRu
          ? `Оплатите сразу все ${lessonCount} занят${lessonCount === 1 ? 'ие' : lessonCount < 5 ? 'ия' : 'ий'} (первое бесплатно, оплачиваете ${Math.max(lessonCount - 1, 0)}).`
          : (() => {
              const lessonWord = lessonCount === 1 ? 'lesson' : 'lessons';
              const payableCount = Math.max(lessonCount - 1, 0);
              const payableWord = payableCount === 1 ? 'lesson' : 'lessons';
              return `Pay for all ${lessonCount} ${lessonWord} upfront (first lesson is free, so you pay for ${payableCount} ${payableWord})`;
            })(),
      weekly: isRu ? 'Оплата каждую неделю' : 'Pay Weekly',
      weeklyDescription: isRu
        ? 'Сначала оплачиваются первые 4 занятия (3 оплаченных + 1 бесплатно). Далее оплата проходит каждую неделю.'
        : 'First, pay for the first 4 classes (3 paid + 1 free). Then pay weekly for remaining classes.',
      summaryLabel: isRu ? 'Оплата:' : 'Payment:',
    },
    homework: {
      yourSubmission: isRu ? 'Ваш ответ:' : 'Your Submission:',
      submittedLabel: isRu ? 'Отправлено:' : 'Submitted:',
      submitButton: isRu ? 'Отправить домашнее задание' : 'Submit Homework',
      modalTitle: isRu ? 'Отправить домашнее задание' : 'Submit Homework',
      modalSubmit: isRu ? 'Отправить' : 'Submit Homework',
      modalCancel: isRu ? 'Отмена' : 'Cancel',
      assignmentLabel: isRu ? 'Задание:' : 'Assignment:',
      answerLabel: isRu ? 'Ваш ответ' : 'Your Answer / Submission',
      placeholder: isRu ? 'Напишите ваш ответ на домашнее задание...' : 'Write your homework answer here...',
    },
    requests: {
      awaitingPaymentInfo: isRu
        ? 'Свяжитесь с преподавателем, чтобы завершить оплату. После оплаты отправьте уведомление — преподаватель подтвердит платёж, и занятия появятся в календаре.'
        : 'Please contact your teacher to complete payment. Once you pay, submit a payment notification so the teacher can confirm it. Classes will appear on your calendar after confirmation.',
      paymentConfirmed: isRu
        ? 'Оплата подтверждена! Занятия добавлены в расписание.'
        : 'Payment confirmed! Your classes are on the calendar.',
      teacherEditsTitle: isRu ? 'Предложения преподавателя:' : "Teacher's Proposed Changes:",
      teacherNote: isRu ? 'Комментарий преподавателя:' : "Teacher's Note:",
      approveChanges: isRu ? 'Одобрить изменения' : 'Approve Changes',
      rejectChanges: isRu ? 'Отклонить изменения' : 'Reject Changes',
      parseError: isRu ? 'Не удалось обработать изменения преподавателя' : 'Unable to parse teacher edits',
    },
    submitting: isRu ? 'Отправляем…' : 'Submitting…',
    completion: {
      title: isRu ? 'Все занятия завершены!' : 'All Classes Completed!',
      subtitle: isRu ? 'Поздравляем с завершением программы' : 'Congratulations on finishing your package',
      description: isRu
        ? 'Вы прошли все занятия! Хотите продолжить по тому же расписанию или изменить его?'
        : "You've completed all your classes! Would you like to continue with the same schedule or change it?",
      keepSame: isRu ? 'Продолжить по тому же расписанию' : 'Keep Same Schedule',
      change: isRu ? 'Изменить расписание' : 'Change Schedule',
      later: isRu ? 'Позже' : 'Later',
    },
  };

  const dayNames = isRu
    ? ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOptions = dayNames.map((label, value) => ({ value, label }));

  const checkForCompletedPackages = useCallback((studentClasses: Class[]) => {
    // Check if all scheduled classes are completed (indicating a finished package)
    const scheduledClasses = studentClasses.filter(c => c.status === 'scheduled');
    const completedClasses = studentClasses.filter(c => c.status === 'completed');
    
    // If there are no scheduled classes and there are completed classes, check if we should show completion modal
    if (scheduledClasses.length === 0 && completedClasses.length >= 4) {
      // Check if we've already shown this modal today (store in localStorage)
      const lastShown = localStorage.getItem('completionModalShown');
      const today = new Date().toDateString();
      
      if (lastShown !== today) {
        // Get the most recent completed class to extract schedule info
        const mostRecentCompleted = completedClasses.sort((a, b) => 
          new Date(b.class_date).getTime() - new Date(a.class_date).getTime()
        )[0];
        
        // Show completion modal
        setCompletedPackage({
          id: mostRecentCompleted.id,
          weekly_schedule: '', // We'd store this in a package table in production
        });
        setShowCompletionModal(true);
        localStorage.setItem('completionModalShown', today);
      }
    }
  }, []);

  const fetchStudentData = useCallback(async (userId: string) => {
    const { data: classesData } = await db.getClasses();
    const { data: homeworkData } = await db.getHomework();
    const { data: requestsData } = await db.getClassRequests();
    const { data: paymentsData } = await db.getPaymentNotifications();
    
    const studentClasses = (classesData || []).filter((c: Class) => c.student_id === userId);
    setClasses(studentClasses);
    setHomework((homeworkData || []).filter((h: Homework) => h.student_id === userId));
    setClassRequests((requestsData || []).filter((r: ClassRequest) => r.student_id === userId));
    setPaymentNotifications((paymentsData || []).filter((p: PaymentNotification) => p.student_id === userId));

    // Check if all classes in a package are completed
    checkForCompletedPackages(studentClasses);
  }, [checkForCompletedPackages]);

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
  }, [router, fetchStudentData]);

  useEffect(() => {
    if (!user?.id) return;

    const handleRealtimeUpdate = () => {
      fetchStudentData(user.id!);
    };

    const classesSubscription = db.subscribeToClasses(handleRealtimeUpdate);
    const homeworkSubscription = db.subscribeToHomework(handleRealtimeUpdate);
    const requestsSubscription = db.subscribeToClassRequests(handleRealtimeUpdate);
    const paymentsSubscription = db.subscribeToPaymentNotifications(handleRealtimeUpdate);

    return () => {
      classesSubscription?.unsubscribe?.();
      homeworkSubscription?.unsubscribe?.();
      requestsSubscription?.unsubscribe?.();
      paymentsSubscription?.unsubscribe?.();
    };
  }, [user?.id, fetchStudentData]);

  const handleRenewSchedule = () => {
    // Open request form with same schedule
    setShowCompletionModal(false);
    setShowRequestForm(true);
    // In production, you'd pre-fill the form with the previous schedule
  };

  const handleChangeSchedule = () => {
    // Open request form for new schedule
    setShowCompletionModal(false);
    setShowRequestForm(true);
  };

  const handleApproveTeacherEdits = async (requestId: string) => {
    try {
      // Get the request to find teacher edits
      const request = classRequests.find(r => r.id === requestId);
      if (!request || !request.teacher_edits) return;

      const edits = JSON.parse(request.teacher_edits);
      
      // Update request with teacher's edits and set status back to approved
      await db.updateClassRequest(requestId, {
        status: 'awaiting_payment',
        weekly_schedule: edits.weekly_schedule || request.weekly_schedule,
        total_lessons: edits.total_lessons || request.total_lessons,
        lessons_per_week: edits.lessons_per_week || request.lessons_per_week,
        payment_preference: edits.payment_preference || request.payment_preference,
        topic: edits.topic || request.topic,
        message: edits.message || request.message,
        admin_notes: edits.admin_notes || request.admin_notes,
        teacher_edits: null, // Clear teacher edits
      });

      setNotification({
        type: 'success',
        title: text.notifications.teacherEditsApprovedTitle,
        message: text.notifications.teacherEditsApprovedMessage,
      });
      if (user?.id) {
        fetchStudentData(user.id);
      }
    } catch (error) {
      console.error('Error approving teacher edits:', error);
      setNotification({
        type: 'error',
        title: text.notifications.teacherEditsApproveErrorTitle,
        message: text.notifications.tryAgain,
      });
    }
  };

  const handleRejectTeacherEdits = async (requestId: string) => {
    try {
      // Reject teacher edits - set status back to approved without changes
      await db.updateClassRequest(requestId, {
        status: 'awaiting_payment',
        teacher_edits: null, // Clear teacher edits
      });

      setNotification({
        type: 'info',
        title: text.notifications.teacherEditsRejectedTitle,
        message: text.notifications.teacherEditsRejectedMessage,
      });
      if (user?.id) {
        fetchStudentData(user.id);
      }
    } catch (error) {
      console.error('Error rejecting teacher edits:', error);
      setNotification({
        type: 'error',
        title: text.notifications.teacherEditsRejectErrorTitle,
        message: text.notifications.tryAgain,
      });
    }
  };

  const submitClassRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmittingRequest) return;

    const form = e.target as HTMLFormElement;
    const lessonsPerWeekValue = parseInt((form.elements.namedItem('lessons_per_week') as HTMLInputElement).value);
    const totalLessonsValue = parseInt((form.elements.namedItem('total_lessons') as HTMLInputElement).value);

    setIsSubmittingRequest(true);

    try {
      // Validate minimum lessons
      if (totalLessonsValue < 4) {
        setNotification({
          type: 'warning',
          title: text.notifications.minLessonsTitle,
          message: text.notifications.minLessonsMessage,
        });
        return;
      }

      // Validate weekly schedule matches lessons per week
      const validWeeklySchedules = weeklySchedule.filter(s => s.day_of_week !== undefined && s.time);
      if (validWeeklySchedules.length !== lessonsPerWeekValue) {
        setNotification({
          type: 'warning',
          title: text.notifications.scheduleIncompleteTitle,
          message: text.notifications.scheduleIncompleteMessage(lessonsPerWeekValue),
        });
        return;
      }

      // Store weekly schedule as JSON
      const weeklyScheduleJson = JSON.stringify(validWeeklySchedules);

      const formData = {
        student_id: user.id!,
        student_name: user.user_metadata?.full_name || user.email!.split('@')[0],
        student_email: user.email!,
        weekly_schedule: weeklyScheduleJson,
        payment_preference: paymentPreference,
        topic: (form.elements.namedItem('topic') as HTMLInputElement).value || null,
        message: (form.elements.namedItem('message') as HTMLTextAreaElement).value || null,
        lessons_per_week: lessonsPerWeekValue,
        total_lessons: totalLessonsValue,
        first_class_free: true,
        status: 'pending',
      };

      await db.createClassRequest(formData);
      setNotification({
        type: 'success',
        title: 'Бронирование успешно отправлено! Преподаватель скоро его рассмотрит.',
        message: text.notifications.requestSuccessMessage,
      });
      setShowRequestForm(false);
      setWeeklySchedule([{ day_of_week: 1, time: '' }]); // Reset
      setLessonsPerWeek(1);
      setTotalLessons(4); // Reset
      setPaymentPreference('all_at_once'); // Reset
      fetchStudentData(user.id!);
    } catch (error) {
      console.error('Error submitting class request:', error);
      setNotification({
        type: 'error',
        title: 'Не удалось отправить бронирование. Пожалуйста, попробуйте снова.',
        message: text.notifications.requestErrorMessage,
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleLessonsPerWeekChange = (value: number) => {
    const normalized = Number.isFinite(value) && value > 0 ? value : 1;
    setLessonsPerWeek(normalized);
    setWeeklySchedule((prev) => {
      let next = [...prev];
      if (normalized > prev.length) {
        const additional = Array.from({ length: normalized - prev.length }, () => ({
          day_of_week: 1,
          time: '',
        }));
        next = [...prev, ...additional];
      } else if (normalized < prev.length) {
        next = prev.slice(0, normalized);
      }

      if (!next.length) {
        next = [{ day_of_week: 1, time: '' }];
      }

      return next;
    });
  };

  const addWeeklyScheduleSlot = () => {
    setWeeklySchedule((prev) => {
      if (prev.length >= (lessonsPerWeek || 1)) {
        return prev;
      }
      return [...prev, { day_of_week: 1, time: '' }];
    });
  };

  const removeWeeklyScheduleSlot = (index: number) => {
    setWeeklySchedule((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ day_of_week: 1, time: '' }];
    });
  };

  const updateWeeklyScheduleSlot = (index: number, field: 'day_of_week' | 'time', value: number | string) => {
    const updated = [...weeklySchedule];
    updated[index] = { ...updated[index], [field]: value };
    setWeeklySchedule(updated);
  };

  const submitPaymentNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const form = e.target as HTMLFormElement;
    
    // If paying for a class request, calculate total from all pending classes
    if (selectedClassRequest) {
      const requestClasses = classes.filter(c => {
        // Find classes that belong to this request by matching student and similar dates
        // We'll match by checking if classes are pending_payment and were created around the same time
        return c.student_id === user.id && c.status === 'pending_payment';
      });
      
      const totalAmount = requestClasses.reduce((sum, c) => sum + (c.payment_amount || 0), 0);
      
      // Create payment notification for the request (without class_id since it's for multiple classes)
      const formData = {
        student_id: user.id!,
        student_name: user.user_metadata?.full_name || user.email!.split('@')[0],
        student_email: user.email!,
        class_id: null, // No specific class_id for request payments
        amount: parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value) || totalAmount,
        payment_method: (form.elements.namedItem('payment_method') as HTMLSelectElement).value,
        payment_date: (form.elements.namedItem('payment_date') as HTMLInputElement).value,
        reference_number: (form.elements.namedItem('reference_number') as HTMLInputElement).value || null,
        message: (form.elements.namedItem('message') as HTMLTextAreaElement).value || `Payment for class request ${selectedClassRequest.id}. ${requestClasses.length} classes.` || null,
        status: 'pending',
      };

      try {
        await db.createPaymentNotification(formData);
        setNotification({
          type: 'success',
          title: 'Уведомление об оплате отправлено преподавателю!',
          message: text.notifications.paymentSuccessMessage,
        });
        setShowPaymentForm(false);
        setSelectedClassRequest(null);
        if (user.id) {
          fetchStudentData(user.id);
        }
      } catch (error) {
        console.error('Error submitting payment:', error);
        setNotification({
          type: 'error',
          title: 'Не удалось отправить уведомление об оплате',
          message: text.notifications.paymentErrorMessage,
        });
      }
    } else if (selectedClass) {
      // Existing logic for single class payment
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
        setNotification({
          type: 'success',
          title: 'Уведомление об оплате отправлено преподавателю!',
          message: text.notifications.paymentSuccessMessage,
        });
        setShowPaymentForm(false);
        setSelectedClass(null);
        if (user.id) {
          fetchStudentData(user.id);
        }
      } catch (error) {
        console.error('Error submitting payment:', error);
        setNotification({
          type: 'error',
          title: 'Не удалось отправить уведомление об оплате',
          message: text.notifications.paymentErrorMessage,
        });
      }
    }
  };

  // Calculate total payment for a class request
  const calculateRequestTotal = (request: ClassRequest): number => {
    // Find all classes that belong to this request
    const requestClasses = classes.filter(c => {
      // Match by student_id and pending_payment status
      // In a real system, we'd have a request_id on classes, but for now we'll use a heuristic
      return c.student_id === request.student_id && c.status === 'pending_payment';
    });
    
    return requestClasses.reduce((sum, c) => sum + (c.payment_amount || 0), 0);
  };

  // Check if there's a pending payment notification for a class
  const hasPendingNotificationForClass = (classId: string): boolean => {
    return paymentNotifications.some(
      p => p.class_id === classId && p.status === 'pending'
    );
  };

  // Check if there's a pending payment notification for a class request
  const hasPendingNotificationForRequest = (request: ClassRequest): boolean => {
    // Check if there's a pending notification with class_id === null that mentions this request
    const hasRequestNotification = paymentNotifications.some(
      p => p.class_id === null && 
           p.status === 'pending' && 
           p.message?.includes(request.id)
    );
    
    if (hasRequestNotification) return true;
    
    // Also check if any classes from this request have pending notifications
    // Find classes that belong to this request
    const requestClasses = classes.filter(c => {
      return c.student_id === request.student_id && c.status === 'pending_payment';
    });
    
    // Check if any of these classes have pending notifications
    return requestClasses.some(classItem => 
      hasPendingNotificationForClass(classItem.id)
    );
  };

  const submitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedHomework) return;

    const form = e.target as HTMLFormElement;
    const submissionText = (form.elements.namedItem('submission_text') as HTMLTextAreaElement).value;

    try {
      await db.updateHomework(selectedHomework.id, {
        submission_text: submissionText,
        submitted_at: new Date().toISOString(),
        status: 'submitted',
      });
      setNotification({
        type: 'success',
        title: text.notifications.homeworkSuccessTitle,
        message: text.notifications.homeworkSuccessMessage,
      });
      setShowSubmitHomework(false);
      setSelectedHomework(null);
      if (user.id) {
        fetchStudentData(user.id);
      }
    } catch (error) {
      console.error('Error submitting homework:', error);
      setNotification({
        type: 'error',
        title: text.notifications.homeworkErrorTitle,
        message: text.notifications.homeworkErrorMessage,
      });
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

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || text.defaultStudent;

  // Check if selected class/request has pending notification (computed before render)
  const getSelectedHasPendingNotification = (): boolean => {
    if (selectedClass) {
      return hasPendingNotificationForClass(selectedClass.id);
    }
    if (selectedClassRequest) {
      return hasPendingNotificationForRequest(selectedClassRequest);
    }
    return false;
  };

  const selectedHasPendingNotification = showPaymentForm ? getSelectedHasPendingNotification() : false;

  const tabs = [
    { id: 'overview' as Tab, name: text.tabs.overview, icon: HomeIcon },
    { id: 'calendar' as Tab, name: text.tabs.calendar, icon: CalendarDaysIcon },
    { id: 'classes' as Tab, name: text.tabs.classes, icon: CalendarIcon },
    { id: 'homework' as Tab, name: text.tabs.homework, icon: BookOpenIcon },
    { id: 'requests' as Tab, name: text.tabs.requests, icon: ChatBubbleBottomCenterTextIcon },
    { id: 'notifications' as Tab, name: text.tabs.notifications, icon: CurrencyDollarIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-xl border-r border-white/60 shadow-2xl hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo & User */}
          <div className="p-6 border-b border-gray-200/50">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-900 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/30">
                TT
              </div>
              <div>
                <div className="font-black text-lg bg-gradient-to-r from-primary-500 to-secondary-900 bg-clip-text text-transparent">
                  TinyTalks
                </div>
                <div className="text-xs text-gray-500">{text.sidebarSubtitle}</div>
              </div>
            </Link>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50/80 to-blue-50/80 rounded-xl border border-white/70">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-800 rounded-full flex items-center justify-center shadow-lg shadow-primary-400/30">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-secondary-900 truncate">{userName}</div>
                <div className="text-xs text-gray-600 truncate">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-900 text-white shadow-lg shadow-primary-500/30'
                      : 'text-secondary-900 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-primary-500'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-secondary-900 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-xl transition-all duration-300 font-semibold"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-primary-500" />
              Выход
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header & Tabs */}
        <div className="lg:hidden px-4 pt-4 space-y-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-800 rounded-full flex items-center justify-center shadow-lg shadow-primary-400/30">
              <UserCircleIcon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-secondary-900 truncate text-base">{userName}</div>
              <div className="text-xs text-gray-600 truncate">{user?.email}</div>
              <div className="text-[11px] text-gray-500 mt-1">{text.sidebarSubtitle}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Выйти
            </button>
          </div>
          <div className="-mx-4 px-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-900 text-white border-transparent shadow-lg shadow-primary-500/30'
                        : 'bg-white text-secondary-900 border-gray-200 shadow-sm'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary-500'}`} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <section className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60">

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-8 space-y-6">
                {/* Summary Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-white/70">
                    <div className="text-3xl font-bold text-primary-600 mb-1">{classes.filter(c => c.status === 'completed').length}</div>
                    <div className="text-sm text-gray-700 font-medium">Уроков завершено</div>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-white/70">
                    <div className="text-3xl font-bold text-secondary-900 mb-1">{homework.filter(h => h.status === 'completed').length}</div>
                    <div className="text-sm text-gray-700 font-medium">Заданий выполнено</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-white/70">
                    <div className="text-3xl font-bold text-green-600 mb-1">{classes.filter(c => c.payment_status === 'paid').length}</div>
                    <div className="text-sm text-gray-700 font-medium">Оплаченных занятий</div>
                  </div>
                </div>

                {/* Upcoming Classes Preview */}
                <div className="bg-gray-50/70 rounded-2xl border border-white/70 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl font-bold text-secondary-900">{text.overview.title}</h2>
                    <button
                      onClick={() => setActiveTab('classes')}
                      className="text-primary-500 hover:text-primary-600 text-sm font-semibold"
                    >
                      {`${text.overview.viewAll} →`}
                    </button>
                  </div>
                  {classes.filter(c => c.status === 'scheduled').length === 0 ? (
                    <div className="text-center py-6 space-y-3 text-gray-600">
                      {classes.filter(c => c.status === 'pending_payment').length > 0 ? (
                        <>
                          <p className="font-semibold text-secondary-900">{text.overview.paymentPendingTitle}</p>
                          <p>{text.overview.paymentPendingDescription}</p>
                        </>
                      ) : (
                        <p className="text-gray-500">Нет запланированных занятий</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {classes.filter(c => c.status === 'scheduled').slice(0, 3).map((classItem) => (
                        <div key={classItem.id} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-white/80 shadow-sm">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="w-6 h-6 text-primary-500" />
                            <div>
                              <div className="font-semibold text-secondary-900">{classItem.topic || 'Урок английского'}</div>
                              <div className="text-sm text-gray-600">
                                {formatDate(classItem.class_date)} · {formatTime(classItem.class_date)}
                              </div>
                            </div>
                          </div>
                          {classItem.payment_status === 'unpaid' && classItem.payment_amount && (
                            hasPendingNotificationForClass(classItem.id) ? (
                              <div className="px-4 py-2 bg-gray-300 text-gray-600 text-sm rounded-lg cursor-not-allowed">
                                Ожидает
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedClass(classItem);
                                  setShowPaymentForm(true);
                                }}
                                className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 shadow-sm transition-colors"
                              >
                                Уведомить об оплате
                              </button>
                            )
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
              <div className="p-4 sm:p-6 lg:p-8">
                <Calendar classes={classes} payments={[]} />
              </div>
            )}

            {/* My Classes Tab */}
            {activeTab === 'classes' && (
              <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Предстоящие занятия</h2>
            <div className="space-y-6">
              {classes.filter(c => c.status === 'pending_payment').length > 0 && (
                <div className="p-6 bg-red-50 border-2 border-red-300 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <CurrencyDollarIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-900">{text.classes.waitingTitle}</h3>
                      <p className="text-sm text-red-700 mt-1">
                        {text.classes.waitingDescription}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {classes.filter(c => c.status === 'pending_payment').map((classItem) => (
                      <div key={classItem.id} className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white rounded-lg border-2 border-red-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CalendarIcon className="w-6 h-6 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{classItem.topic || 'Урок английского'}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                              {formatDate(classItem.class_date)} {isRu ? 'в' : 'at'} {formatTime(classItem.class_date)}
                            </p>
                            <p className="text-xs text-gray-500">{classItem.duration_minutes} минут • {classItem.class_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {classItem.payment_amount && (
                            <div className="text-right">
                              <div className="text-xl font-bold text-red-600">₽{classItem.payment_amount}</div>
                              <div className="text-xs px-3 py-1 rounded-full font-semibold bg-red-100 text-red-800 mt-1">
                                Ожидает подтверждения
                              </div>
                            </div>
                          )}
                          {hasPendingNotificationForClass(classItem.id) ? (
                            <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-300 text-gray-600 rounded-lg font-semibold shadow-sm cursor-not-allowed">
                              <CurrencyDollarIcon className="w-5 h-5" />
                              Ожидает
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedClass(classItem);
                                setShowPaymentForm(true);
                              }}
                              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-sm hover:shadow-md"
                            >
                              <CurrencyDollarIcon className="w-5 h-5" />
                              Уведомить об оплате
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {classes.filter(c => c.status === 'scheduled').length === 0 && classes.filter(c => c.status === 'pending_payment').length === 0 ? (
                <p className="text-gray-500 text-center py-12">Нет запланированных занятий</p>
              ) : classes.filter(c => c.status === 'scheduled').length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Запланированные занятия</h3>
                  {classes.filter(c => c.status === 'scheduled').map((classItem) => (
                    <div key={classItem.id} className={`flex items-center justify-between p-6 rounded-lg hover:shadow-md transition-all border-2 ${
                      classItem.payment_status === 'unpaid' || classItem.payment_status === 'pending'
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          classItem.payment_status === 'unpaid' || classItem.payment_status === 'pending'
                            ? 'bg-red-100'
                            : 'bg-blue-100'
                        }`}>
                          <CalendarIcon className={`w-6 h-6 ${
                            classItem.payment_status === 'unpaid' || classItem.payment_status === 'pending'
                              ? 'text-red-600'
                              : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{classItem.topic || 'Урок английского'}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(classItem.class_date)} в {formatTime(classItem.class_date)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{classItem.duration_minutes} минут • {classItem.class_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {classItem.payment_amount && (
                          <div className="text-right mr-4">
                            <div className="text-lg font-bold text-gray-900">₽{classItem.payment_amount}</div>
                            <div className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              classItem.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                              classItem.payment_status === 'pending' ? 'bg-red-100 text-red-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {classItem.payment_status === 'paid' ? 'Оплачено' :
                               classItem.payment_status === 'pending' ? 'Ожидает подтверждения' :
                               'Не оплачено'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
              </div>
            )}

            {/* Homework Tab */}
            {activeTab === 'homework' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Домашние задания</h2>
              {homework.filter(h => h.status !== 'completed').length === 0 ? (
                <p className="text-gray-500 text-center py-12">Нет ожидающих заданий</p>
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
                              Срок: {formatDateTime(hw.due_date)}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${
                          hw.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 
                          hw.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {hw.status === 'assigned' ? 'Назначено' :
                           hw.status === 'completed' ? 'Завершено' :
                           hw.status === 'submitted' ? 'Отправлено' :
                           hw.status === 'reviewed' ? 'Проверено' : hw.status}
                        </span>
                      </div>

                      {/* Show submission if exists */}
                      {hw.submission_text && hw.status !== 'assigned' && (
                        <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                          <p className="text-sm font-semibold text-gray-900 mb-2">{text.homework.yourSubmission}</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{hw.submission_text}</p>
                          {hw.submitted_at && (
                            <p className="text-xs text-gray-500 mt-2">
                              {text.homework.submittedLabel} {formatDateTime(hw.submitted_at)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Submit button for assigned homework */}
                      {hw.status === 'assigned' && (
                        <div className="mt-4">
                          <button
                            onClick={() => {
                              setSelectedHomework(hw);
                              setShowSubmitHomework(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                        {text.homework.submitButton}
                          </button>
                        </div>
                      )}

                      {/* Teacher feedback */}
                      {hw.teacher_feedback && (
                        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Отзыв преподавателя: {hw.grade}</p>
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
                <h2 className="text-2xl font-bold text-gray-900">Мои бронирования</h2>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 transition-colors"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Записаться на занятие
                </button>
              </div>
              
              {classRequests.length === 0 ? (
                <div className="text-center py-12">
                  <ChatBubbleBottomCenterTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Пока нет бронирований. Нажмите &apos;Записаться на занятие&apos;, чтобы оставить первую заявку!</p>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Записаться на занятие
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {classRequests.map((request) => {
                    const weeklySlots = (() => {
                      if (!request.weekly_schedule) return [];
                      try {
                        const parsed = JSON.parse(request.weekly_schedule);
                        return Array.isArray(parsed) ? parsed : [];
                      } catch {
                        return [];
                      }
                    })();

                    const formatSlotLabel = (slot: { day_of_week: number; time: string }) => {
                      const dayIndex = Number(slot.day_of_week);
                      const locale = isRu ? 'ru-RU' : 'en-US';
                      const dayName = new Date(2024, 0, dayIndex + 7).toLocaleDateString(locale, { weekday: 'long' });
                      return `${dayName} • ${slot.time}`;
                    };

                    const statusStyle =
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'awaiting_payment' ? 'bg-orange-100 text-orange-800' :
                      request.status === 'payment_confirmed' ? 'bg-green-100 text-green-800' :
                      request.status === 'teacher_edited' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800';

                    const translatedStatus = request.status === 'pending' ? 'Ожидает одобрения' :
                                              request.status === 'approved' ? 'Одобрено' :
                                              request.status === 'awaiting_payment' ? 'Ожидает оплаты' :
                                              request.status === 'payment_confirmed' ? 'Оплата подтверждена' :
                                              request.status === 'teacher_edited' ? 'Изменено преподавателем' :
                                              request.status === 'rejected' ? 'Отклонено' : request.status;
                    const statusLabel = translatedStatus;

                    return (
                      <div key={request.id} className={`p-6 rounded-lg border ${
                        request.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                        request.status === 'awaiting_payment' ? 'bg-orange-50 border-orange-200' :
                        request.status === 'payment_confirmed' ? 'bg-green-50 border-green-200' :
                        request.status === 'teacher_edited' ? 'bg-blue-50 border-blue-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span className="font-medium">
                                  Занятий в неделю: {request.lessons_per_week || 1}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ClockIcon className="w-4 h-4" />
                                <span className="font-medium">
                                  Всего занятий: {request.total_lessons || 4}
                                </span>
                              </div>
                              {request.first_class_free && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                  <CheckCircleIcon className="w-4 h-4" />
                                  Первое занятие бесплатно!
                                </span>
                              )}
                            </div>
                            {weeklySlots.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {weeklySlots.map((slot: { day_of_week: number; time: string }, idx: number) => (
                                  <span
                                    key={`${slot.day_of_week}-${slot.time}-${idx}`}
                                    className="px-3 py-1 bg-white text-sm text-blue-700 border border-blue-200 rounded-full shadow-sm"
                                  >
                                    {formatSlotLabel(slot)}
                                  </span>
                                ))}
                              </div>
                            )}
                            {request.topic && (
                              <div className="text-sm text-gray-700">
                                <strong>Тема:</strong> {request.topic}
                              </div>
                            )}
                            {request.message && (
                              <div className="text-sm text-gray-600 bg-white p-3 rounded">
                                {request.message}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              Отправлено: {formatDateTime(request.created_at)}
                            </div>
                            {request.status === 'awaiting_payment' && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200 text-sm text-orange-800">
                                {text.requests.awaitingPaymentInfo}
                              </div>
                            )}
                            {request.status === 'payment_confirmed' && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-green-200 text-sm text-green-800">
                                {text.requests.paymentConfirmed}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${statusStyle}`}>
                              {statusLabel}
                            </span>
                            {request.status === 'awaiting_payment' && (
                              hasPendingNotificationForRequest(request) ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-semibold shadow-sm cursor-not-allowed text-sm">
                                  <CurrencyDollarIcon className="w-4 h-4" />
                                  Ожидает
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedClassRequest(request);
                                    setSelectedClass(null);
                                    setShowPaymentForm(true);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-sm hover:shadow-md text-sm"
                                >
                                  <CurrencyDollarIcon className="w-4 h-4" />
                                  Уведомить об оплате
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      {request.status === 'teacher_edited' && request.teacher_edits && (
                        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-2">{text.requests.teacherEditsTitle}</p>
                          {(() => {
                            try {
                              const edits = JSON.parse(request.teacher_edits);
                              return (
                                <div className="space-y-2 text-sm text-blue-800">
                                  {edits.total_lessons && (
                                    <div><strong>Всего занятий:</strong> {edits.total_lessons}</div>
                                  )}
                                  {edits.lessons_per_week && (
                                    <div><strong>Занятий в неделю:</strong> {edits.lessons_per_week}</div>
                                  )}
                                  {edits.payment_preference && (
                                    <div><strong>{text.paymentPreference.summaryLabel}</strong> {edits.payment_preference === 'weekly' ? text.paymentPreference.weekly : text.paymentPreference.allAtOnce}</div>
                                  )}
                                  {edits.topic && (
                                    <div><strong>Тема:</strong> {edits.topic}</div>
                                  )}
                                  {edits.admin_notes && (
                                    <div className="mt-2 p-2 bg-white rounded">
                                      <strong>{text.requests.teacherNote}</strong> {edits.admin_notes}
                                    </div>
                                  )}
                                </div>
                              );
                            } catch {
                              return <p className="text-sm text-blue-800">{text.requests.parseError}</p>;
                            }
                          })()}
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleApproveTeacherEdits(request.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                            >
                              {text.requests.approveChanges}
                            </button>
                            <button
                              onClick={() => handleRejectTeacherEdits(request.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                            >
                              {text.requests.rejectChanges}
                            </button>
                          </div>
                        </div>
                      )}
                      {request.admin_notes && request.status !== 'teacher_edited' && (
                        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Заметки преподавателя</p>
                          <p className="text-sm text-blue-800">{request.admin_notes}</p>
                        </div>
                      )}
                      </div>
                    );
                  })}
                </div>
              )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Уведомления</h2>
                {paymentNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <CurrencyDollarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Пока нет уведомлений об оплате</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentNotifications.map((payment) => {
                      const relatedClass = payment.class_id ? classes.find(c => c.id === payment.class_id) : null;
                      const statusStyle =
                        payment.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                        payment.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200';
                      
                      return (
                        <div key={payment.id} className={`p-6 rounded-xl border-2 ${statusStyle} bg-white`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CurrencyDollarIcon className="w-6 h-6 text-primary-500" />
                                <h3 className="text-lg font-bold text-gray-900">
                                  Уведомление об оплате
                                </h3>
                              </div>
                              {relatedClass && (
                                <p className="text-sm text-gray-600 mb-2">
                                  Занятие: {relatedClass.topic || 'Урок английского'} - {formatDate(relatedClass.class_date)} в {formatTime(relatedClass.class_date)}
                                </p>
                              )}
                              <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">Сумма</p>
                                  <p className="text-xl font-bold text-gray-900">₽{payment.amount}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">Способ оплаты</p>
                                  <p className="text-gray-900">{payment.payment_method || 'Не указано'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">Дата оплаты</p>
                                  <p className="text-gray-900">{formatDate(payment.payment_date)}</p>
                                </div>
                                {payment.reference_number && (
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Номер транзакции</p>
                                    <p className="text-gray-900">{payment.reference_number}</p>
                                  </div>
                                )}
                              </div>
                              {payment.message && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-semibold text-gray-700 mb-1">Сообщение</p>
                                  <p className="text-sm text-gray-600">{payment.message}</p>
                                </div>
                              )}
                              {payment.teacher_notes && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-sm font-semibold text-blue-900 mb-1">Заметки преподавателя</p>
                                  <p className="text-sm text-blue-800">{payment.teacher_notes}</p>
                                </div>
                              )}
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${statusStyle}`}>
                              {payment.status === 'confirmed' ? 'Подтверждено' :
                               payment.status === 'rejected' ? 'Отклонено' :
                               'Ожидает'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-4">
                            Отправлено: {formatDateTime(payment.created_at)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Class Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">Записаться на новое занятие</h3>
              <p className="text-sm text-gray-600">{text.notifications.minLessonsMessage}</p>
            </div>
            <form onSubmit={submitClassRequest} className="space-y-5">
              {/* Lessons per week */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Сколько занятий в неделю? *
                </label>
                <select
                  name="lessons_per_week"
                  required
                  value={lessonsPerWeek ? lessonsPerWeek.toString() : ''}
                  onChange={(e) => handleLessonsPerWeekChange(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                      <option value="">{isRu ? 'Выберите...' : 'Select...'}</option>
                  <option value="1">1 lesson per week</option>
                  <option value="2">2 lessons per week</option>
                  <option value="3">3 lessons per week</option>
                  <option value="4">4 lessons per week</option>
                  <option value="5">5 lessons per week</option>
                </select>
              </div>

              {/* Total lessons */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Сколько занятий вы хотите купить? * (Минимум 4, первое бесплатно)
                </label>
                <input
                  type="number"
                  name="total_lessons"
                  required
                  min="4"
                  defaultValue="4"
                  onChange={(e) => {
                    const count = parseInt(e.target.value) || 4;
                    setTotalLessons(count);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Минимум 4 занятия требуется"
                />
                <p className="text-xs text-gray-500 mt-1">Первое занятие бесплатно! Вы заплатите за оставшиеся занятия.</p>
              </div>

              {/* Weekly Schedule Section */}
              <div className="border-t border-gray-200 pt-5 mt-5">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {text.schedule.title}
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  {text.schedule.chooseHint(lessonsPerWeek || 1)}
                </p>
                
                <div className="space-y-4">
                  {weeklySchedule.map((schedule, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-900">{text.schedule.classLabel(index)}</span>
                        {weeklySchedule.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWeeklyScheduleSlot(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            {text.schedule.remove}
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {text.schedule.dayOfWeek}
                          </label>
                          <select
                            required
                            value={schedule.day_of_week}
                            onChange={(e) => updateWeeklyScheduleSlot(index, 'day_of_week', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                          >
                            {dayOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {text.schedule.time}
                          </label>
                          <input
                            type="time"
                            required
                            value={schedule.time}
                            onChange={(e) => updateWeeklyScheduleSlot(index, 'time', e.target.value)}
                            min="08:00"
                            max="20:00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {weeklySchedule.length < (lessonsPerWeek || 1) && (
                    <button
                      type="button"
                      onClick={addWeeklyScheduleSlot}
                      className="w-full px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-xl font-semibold hover:from-primary-100 hover:to-secondary-100 transition-all duration-300 border border-primary-200"
                    >
                      {text.schedule.addAnother}
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Preference */}
              <div className="border-t border-gray-200 pt-5 mt-5">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  {text.paymentPreference.title}
                </p>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 cursor-pointer hover:border-primary-300 transition-all">
                    <input
                      type="radio"
                      name="payment_preference"
                      value="all_at_once"
                      checked={paymentPreference === 'all_at_once'}
                      onChange={(e) => setPaymentPreference(e.target.value as 'weekly' | 'all_at_once')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{text.paymentPreference.allAtOnce}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {text.paymentPreference.allAtOnceDescription(totalLessons)}
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 cursor-pointer hover:border-primary-300 transition-all">
                    <input
                      type="radio"
                      name="payment_preference"
                      value="weekly"
                      checked={paymentPreference === 'weekly'}
                      onChange={(e) => setPaymentPreference(e.target.value as 'weekly' | 'all_at_once')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{text.paymentPreference.weekly}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {text.paymentPreference.weeklyDescription}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тема (необязательно)
                </label>
                <input
                  type="text"
                  name="topic"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="например, Деловой английский, Практика грамматики"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дополнительное сообщение (необязательно)
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Сообщите преподавателю о своих целях обучения, предпочтениях по расписанию или особых пожеланиях..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestForm(false);
                    setWeeklySchedule([{ day_of_week: 1, time: '' }]);
                    setLessonsPerWeek(1);
                    setTotalLessons(4);
                    setPaymentPreference('all_at_once');
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRequest}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 ${
                    isSubmittingRequest
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-500 to-secondary-900 text-white hover:from-primary-600 hover:to-secondary-800'
                  }`}
                >
                  {isSubmittingRequest ? 'Отправляем…' : 'Отправить бронирование'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Notification Modal */}
      {showPaymentForm && (selectedClass || selectedClassRequest) && (
        selectedHasPendingNotification ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Уведомление об оплате уже отправлено</h3>
              <p className="text-sm text-gray-600 mb-4">
                Вы уже отправили уведомление об оплате для этого занятия/запроса. Пожалуйста, дождитесь ответа преподавателя перед отправкой нового уведомления.
              </p>
              <button
                onClick={() => {
                  setShowPaymentForm(false);
                  setSelectedClass(null);
                  setSelectedClassRequest(null);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Уведомить преподавателя об оплате</h3>
              {selectedClassRequest ? (
                <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-semibold text-orange-900 mb-2">Оплата за запрос на занятие</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Всего занятий: {selectedClassRequest.total_lessons || 4}
                  </p>
                  <p className="text-sm text-gray-600">
                    Общая сумма: ₽{calculateRequestTotal(selectedClassRequest)}
                  </p>
                </div>
              ) : selectedClass ? (
                <p className="text-sm text-gray-600 mb-4">
                  Занятие: {selectedClass.topic || 'Урок английского'} на {formatDate(selectedClass.class_date)}
                  {selectedClass.payment_amount && ` - ₽${selectedClass.payment_amount}`}
                </p>
              ) : null}
              <form onSubmit={submitPaymentNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Оплаченная сумма (₽)</label>
                <input
                  type="number"
                  name="amount"
                  required
                  step="0.01"
                  defaultValue={selectedClassRequest ? calculateRequestTotal(selectedClassRequest) : (selectedClass?.payment_amount || '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Способ оплаты</label>
                <select
                  name="payment_method"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Bank Transfer">Банковский перевод</option>
                  <option value="Cash">Наличные</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Venmo">Venmo</option>
                  <option value="Other">Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата оплаты</label>
                <input
                  type="date"
                  name="payment_date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Номер транзакции (необязательно)</label>
                <input
                  type="text"
                  name="reference_number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="например, ID транзакции"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сообщение преподавателю (необязательно)</label>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Любая дополнительная информация..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Отправить уведомление
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedClass(null);
                    setSelectedClassRequest(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
        )
      )}

      {/* Homework Submission Modal */}
      {showSubmitHomework && selectedHomework && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">{text.homework.modalTitle}: {selectedHomework.title}</h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">{text.homework.assignmentLabel}</p>
              <p className="text-sm text-gray-600">{selectedHomework.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <ClockIcon className="w-4 h-4" />
                Срок: {formatDateTime(selectedHomework.due_date)}
              </div>
            </div>
            <form onSubmit={submitHomework} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{text.homework.answerLabel}</label>
                <textarea
                  name="submission_text"
                  required
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={text.homework.placeholder}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {text.homework.modalSubmit}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitHomework(false);
                    setSelectedHomework(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {text.homework.modalCancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completion Notification Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900">{text.completion.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{text.completion.subtitle}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              {text.completion.description}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRenewSchedule}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-900 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-800 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
              >
                {text.completion.keepSame}
              </button>
              <button
                onClick={handleChangeSchedule}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                {text.completion.change}
              </button>
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setCompletedPackage(null);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm"
              >
                {text.completion.later}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

