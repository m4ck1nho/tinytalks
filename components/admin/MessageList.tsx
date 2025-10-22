'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { ContactMessage } from '@/types';
import { EnvelopeIcon, EnvelopeOpenIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MessageList() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time changes
    const subscription = db.subscribeToMessages(() => {
      fetchMessages();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await db.getContactMessages();
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const markAsRead = async (messageId: string, read: boolean) => {
    try {
      await db.updateContactMessage(messageId, { read });
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await db.deleteContactMessage(messageId);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id, true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Messages List */}
      <div className="md:col-span-1 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Messages ({messages.filter(m => !m.read).length} unread)
          </h3>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {messages.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No messages yet</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                } ${!message.read ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {message.read ? (
                      <EnvelopeOpenIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                    )}
                    <span className={`font-semibold ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.name}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 truncate mb-1">{message.email}</div>
                <div className="text-sm text-gray-500 truncate">{message.message}</div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(message.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Details */}
      <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
        {selectedMessage ? (
          <>
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedMessage.name}
                  </h3>
                  <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(selectedMessage.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAsRead(selectedMessage.id, !selectedMessage.read)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Mark as {selectedMessage.read ? 'Unread' : 'Read'}
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Message:</h4>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Your message to TinyTalks`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a message to view details
          </div>
        )}
      </div>
    </div>
  );
}
