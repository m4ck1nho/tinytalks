'use client';

import MessageList from '@/components/admin/MessageList';

export default function MessagesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
        <p className="text-gray-600">Manage messages from your contact form</p>
      </div>

      <MessageList />
    </div>
  );
}
