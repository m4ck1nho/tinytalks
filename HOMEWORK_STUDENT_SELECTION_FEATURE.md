# Homework Manager - Student Selection Feature

## ✨ Overview
Added "Select from registered students" feature to the Homework Manager, matching the functionality in the Schedule Manager.

## 🎯 What It Does

When creating new homework assignments, teachers can now:
1. ✅ **Select from existing registered students** via a dropdown
2. ✅ **Auto-fill student information** (name, email, ID)
3. ✅ **Or manually enter** student details for new students

## 📋 Features

### **1. Student Selection Checkbox**
- Appears when creating **new** homework (not when editing)
- Blue highlighted section at the top of the form
- Toggle on/off to enable student dropdown

### **2. Student Dropdown**
- Lists all registered students from the system
- Format: `Name (email@example.com)`
- Auto-populated from `classes` table (unique students)

### **3. Auto-Fill Form Fields**
When a student is selected:
- ✅ Student Name → Auto-filled & disabled
- ✅ Student Email → Auto-filled & disabled
- ✅ Student ID → Stored (hidden field)

### **4. Manual Entry**
If checkbox is unchecked:
- ✅ All fields remain editable
- ✅ Works for students not yet in the system

## 🎨 Visual Example

```
┌─────────────────────────────────────────────┐
│ Assign New Homework                         │
├─────────────────────────────────────────────┤
│ ☑ Select from registered students           │
│                                              │
│ [Choose a student... ▼]                     │
│   - Anna Karenina (anna@example.com)        │
│   - John Doe (john@example.com)             │
│   - Maria Smith (maria@example.com)         │
└─────────────────────────────────────────────┘

Student Name: [Anna Karenina        ] 🔒
Student Email: [anna@example.com    ] 🔒

Title: [Essay: My Summer Vacation ]
Due Date: [2025-10-30 23:59 ]
Description: [Write about...       ]

[Assign Homework] [Cancel]
```

## 🔧 Technical Implementation

### **Files Modified:**
- ✅ `components/admin/HomeworkManager.tsx`

### **New State Variables:**
```typescript
const [users, setUsers] = useState<{ student_id: string; student_name: string; student_email: string }[]>([]);
const [useExistingStudent, setUseExistingStudent] = useState(false);
const [selectedStudentId, setSelectedStudentId] = useState('');
```

### **New Functions:**
```typescript
// Fetch registered users
const fetchUsers = async () => {
  const { data, error } = await db.getAllUsers();
  // ...
};

// Handle student selection from dropdown
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
```

### **Form Data Extended:**
```typescript
const [formData, setFormData] = useState({
  student_name: '',
  student_email: '',
  student_id: '',    // ← NEW: Store student's user ID
  title: '',
  description: '',
  due_date: '',
});
```

## 🚀 How to Use

### **For Teachers:**

**Option 1: Select Existing Student**
1. Click "Assign Homework" button
2. Check ☑ "Select from registered students"
3. Choose a student from dropdown
4. Student fields auto-fill and lock
5. Enter homework title, description, and due date
6. Click "Assign Homework"

**Option 2: Manual Entry (New Student)**
1. Click "Assign Homework" button
2. Leave checkbox unchecked
3. Manually type student name and email
4. Enter homework details
5. Click "Assign Homework"

### **For Students:**
- No changes to student view
- Students still see their assigned homework in their dashboard
- Homework properly linked to their account (via `student_id`)

## 📊 Data Flow

```
1. Teacher opens "Assign Homework" form
   ↓
2. System fetches all registered students from classes
   ↓
3. Teacher selects student OR enters manually
   ↓
4. Form data includes student_id for proper linking
   ↓
5. Homework created in database
   ↓
6. Student sees homework in their dashboard
```

## ✅ Benefits

1. **Faster Assignment** - No need to retype student info
2. **Fewer Errors** - No typos in names/emails
3. **Better Linking** - Homework properly linked via student_id
4. **Flexibility** - Still allows manual entry for new students
5. **Consistency** - Matches Schedule Manager UI/UX

## 🔗 Integration

This feature integrates with:
- ✅ `db.getAllUsers()` - Fetches registered students
- ✅ Existing homework creation workflow
- ✅ Student dashboard homework display
- ✅ Real-time subscriptions for updates

## 🎯 Matching Features

**Schedule Manager:**
- ✅ Select from registered students
- ✅ Auto-fill student info
- ✅ Disabled fields when selected
- ✅ Manual entry option

**Homework Manager:**
- ✅ Select from registered students ← **NEW!**
- ✅ Auto-fill student info ← **NEW!**
- ✅ Disabled fields when selected ← **NEW!**
- ✅ Manual entry option ← **Already existed**

## 📝 Notes

1. **Only shows on new homework** - When editing, fields stay editable
2. **Uses existing user data** - Pulls from classes table
3. **No database changes** - Uses existing `student_id` field
4. **Backward compatible** - Works with old homework records
5. **TypeScript safe** - All types properly defined

## 🎉 Summary

The Homework Manager now has full parity with the Schedule Manager for student selection, making it easier and faster for teachers to assign homework to registered students while maintaining the flexibility to manually enter information for new students!

