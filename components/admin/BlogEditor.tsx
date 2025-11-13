'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  LinkIcon,
  PhotoIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { storage } from '@/lib/supabase';

interface BlogEditorProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
}

export default function BlogEditor({ initialContent = '', onContentChange }: BlogEditorProps) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent,
    immediatelyRender: false, // Fix for Next.js SSR
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const url = await storage.uploadImage('blog-content', fileName, file);
      
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const addImageByUrl = () => {
    if (!editor) return;

    const url = window.prompt('Enter the direct image URL (must start with http:// or https://):');
    if (!url) {
      return;
    }

    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        alert('Only http and https image URLs are supported.');
        return;
      }
      editor.chain().focus().setImage({ src: parsed.toString() }).run();
    } catch (error) {
      console.error('Invalid image URL:', error);
      alert('Please enter a valid image URL.');
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          title="Bold"
        >
          <BoldIcon className="w-5 h-5" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          title="Italic"
        >
          <ItalicIcon className="w-5 h-5" />
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-200 font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
          title="Heading"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-200 font-semibold ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
          title="Heading"
        >
          H3
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          title="Bullet List"
        >
          <ListBulletIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-300' : ''}`}
          title="Add Link"
        >
          <LinkIcon className="w-5 h-5" />
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={addImageByUrl}
          className="p-2 rounded hover:bg-gray-200"
          title="Insert Image by URL"
        >
          <GlobeAltIcon className="w-5 h-5" />
        </button>

        <label className="p-2 rounded hover:bg-gray-200 cursor-pointer" title="Upload Image">
          <PhotoIcon className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {uploading && <span className="text-sm text-gray-600 self-center">Uploading...</span>}
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
}
