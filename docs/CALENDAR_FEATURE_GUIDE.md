# Calendar Feature Guide

## 📅 Overview
A beautiful, interactive calendar has been added to both the Teacher and Student dashboards, showing upcoming classes and payments in a monthly view.

## ✨ Features

### 📊 **Monthly Calendar View**
- Navigate between months using left/right arrows
- Clean grid layout with day names
- Current day highlighted with orange ring
- Days with events are clickable and highlighted on hover

### 🎨 **Visual Indicators**
- **Blue badges** - Scheduled classes
- **Green badges** - Payment notifications
- **Orange ring** - Today's date
- **Event preview** - Shows first 2-3 events per day
- **"+X more"** indicator for days with many events

### 🔍 **Day Details Modal**
Click any day with events to see:
- **Classes section:**
  - Student name and email
  - Time and duration
  - Topic
  - Status badge (scheduled/completed/cancelled)
  - Payment status and amount
- **Payments section:**
  - Student name and email
  - Amount paid
  - Payment method
  - Reference number
  - Status (pending/confirmed/rejected)

### 🌐 **Bilingual Support**
- Full English and Russian translations
- Month names localized
- Day names localized
- All UI text translated

## 📱 Where to Find It

### **Teacher Dashboard** (`/admin/dashboard`)
1. New **"Calendar"** tab (first tab)
2. Shows ALL classes and payments from all students
3. Can see entire business overview at a glance

### **Student Dashboard** (`/dashboard`)
1. Appears right after the welcome section
2. Shows only the student's own classes
3. Doesn't show payment notifications (students see payments in other sections)

## 🎯 How It Works

### **For Teachers:**
```
1. Go to Admin Dashboard
2. Click "Calendar" tab
3. See monthly view with all classes and payments
4. Click any day to see detailed schedule
5. Navigate months with arrow buttons
```

### **For Students:**
```
1. Go to Student Dashboard  
2. Calendar appears at top
3. See your upcoming classes
4. Click any day to see details
5. Navigate months with arrow buttons
```

## 🎨 **Visual Design**

### **Color Coding:**
- **Blue** (`bg-blue-100`) - Classes
- **Green** (`bg-green-100`) - Payments
- **Yellow** (`bg-yellow-100`) - Pending payments
- **Orange** (`ring-primary-500`) - Today

### **Status Colors:**
**Classes:**
- 🔵 Scheduled (blue)
- 🟢 Completed (green)
- 🔴 Cancelled (red)

**Payments:**
- 🟢 Confirmed (green)
- 🟡 Pending (yellow)
- 🔴 Rejected (red)

## 📦 **Component Structure**

### **File:** `components/shared/Calendar.tsx`

**Props:**
```typescript
interface CalendarProps {
  classes: Class[];           // Array of class objects
  payments?: PaymentNotification[];  // Optional payment array
  isAdmin?: boolean;          // Shows different views
}
```

**Key Functions:**
- `getDaysInMonth()` - Calculates days in current month
- `getFirstDayOfMonth()` - Gets starting day of week
- `getClassesForDay()` - Filters classes for specific day
- `getPaymentsForDay()` - Filters payments for specific day
- `handleDayClick()` - Opens detail modal
- `previousMonth()` / `nextMonth()` - Month navigation

## 🌍 **Translations**

### Added to `locales/en.json` and `locales/ru.json`:

```json
"calendar": {
  "title": "Calendar",
  "legend": {
    "classes": "Classes",
    "payments": "Payments",
    "today": "Today"
  },
  "detail": {
    "classes": "Classes",
    "payments": "Payments"
  }
}
```

## 📊 **Data Flow**

### **Admin Dashboard:**
```
1. Fetch all classes → db.getClasses()
2. Fetch all payments → db.getPaymentNotifications()
3. Pass to Calendar component
4. Calendar filters by day when needed
```

### **Student Dashboard:**
```
1. Classes already filtered by student_id
2. Payments not shown (use empty array)
3. Pass to Calendar component
4. Calendar shows student's own schedule
```

## 🎭 **Interactive Elements**

### **Clickable Days:**
- Days with events have `cursor-pointer`
- Hover effect: `hover:bg-blue-50 hover:shadow-md`
- Click opens modal with full details

### **Modal Features:**
- Scrollable content for many events
- Close button (X icon)
- Organized sections for classes and payments
- Detailed information for each event

## 🔧 **Customization Options**

### **Show Different Data:**
```tsx
// Show only specific class types
<Calendar 
  classes={classes.filter(c => c.class_type === 'Individual')} 
  payments={payments}
  isAdmin={true}
/>
```

### **Hide Payments:**
```tsx
// Student view without payments
<Calendar 
  classes={classes} 
  payments={[]}  // Empty array
  isAdmin={false}
/>
```

## 💡 **Usage Examples**

### **Teacher Use Cases:**
1. ✅ See all classes for the week
2. ✅ Check which students paid
3. ✅ Plan upcoming schedule
4. ✅ Identify busy days
5. ✅ Track payment confirmations

### **Student Use Cases:**
1. ✅ See upcoming classes
2. ✅ Remember class times
3. ✅ Check past classes
4. ✅ Plan homework schedule
5. ✅ Track progress

## 🎉 **Key Benefits**

1. **Visual Overview** - See entire month at a glance
2. **Easy Navigation** - Simple month-to-month browsing
3. **Detailed Info** - Click for complete schedule
4. **Color Coded** - Instant recognition of event types
5. **Responsive** - Works on desktop and mobile
6. **Bilingual** - Full English/Russian support
7. **Real-time** - Shows latest data from database

## 📱 **Responsive Design**

- Desktop: Full calendar grid
- Tablet: Adjusted spacing
- Mobile: Scrollable, maintains functionality

## 🚀 **Performance**

- Efficient day filtering
- Only renders current month
- Lazy modal loading
- Minimal re-renders

## 📝 **Files Modified**

1. ✅ `components/shared/Calendar.tsx` - NEW component
2. ✅ `app/admin/dashboard/page.tsx` - Added calendar tab
3. ✅ `app/dashboard/page.tsx` - Added calendar section
4. ✅ `locales/en.json` - Added translations
5. ✅ `locales/ru.json` - Added translations

## 🎨 **Design Highlights**

- Clean, modern interface
- Orange/Navy color scheme
- Smooth transitions
- Shadow effects on hover
- Professional modal design
- Clear visual hierarchy

---

## 🎯 **Next Steps (Optional Enhancements)**

1. Add week view option
2. Export calendar to PDF
3. Add recurring classes
4. Email reminders for upcoming classes
5. Drag-and-drop to reschedule
6. Integration with Google Calendar

The calendar is now fully functional and ready to use! 🎉

