'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/supabase';
import { BlogPost } from '@/types';
import BlogEditor from '@/components/admin/BlogEditor';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    slug: '',
    metaDescription: '',
    published: false,
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();

    // Subscribe to real-time changes
    const subscription = db.subscribeToBlogPosts(() => {
      fetchPosts();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await db.getBlogPosts();
    if (error) {
      console.error('❌ Error fetching posts:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Fetched posts:', data?.length || 0);
      // Map snake_case to camelCase for compatibility
      const mappedPosts = (data || []).map(post => ({
        ...post,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        metaDescription: post.meta_description,
      }));
      setPosts(mappedPosts);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const encoder = new TextEncoder();
    const contentBytes = encoder.encode(formData.content || '').length;
    const excerptBytes = encoder.encode(formData.excerpt || '').length;
    const contentKB = Math.ceil(contentBytes / 1024);
    const excerptKB = Math.ceil(excerptBytes / 1024);
    const recommendedContentLimit = 200 * 1024; // 200 KB
    const recommendedExcerptLimit = 10 * 1024; // 10 KB

    if (contentBytes > recommendedContentLimit) {
      const proceed = window.confirm(
        `This article content is ${contentKB} KB. Posts larger than 200 KB may be slow to load or fail to open.\n\nConsider reducing embedded images or media. Do you still want to continue?`
      );
      if (!proceed) {
        return;
      }
    }

    if (excerptBytes > recommendedExcerptLimit) {
      alert(
        `The excerpt is ${excerptKB} KB which is larger than recommended (10 KB). Please shorten the excerpt to avoid issues displaying the blog list.`
      );
      return;
    }

    setUploading(true);

    try {
      let imageUrl = editingPost?.image || '';

      // Upload featured image if selected
      if (featuredImage) {
        const fileName = `${Date.now()}_${featuredImage.name}`;
        imageUrl = await storage.uploadImage('blog-images', fileName, featuredImage);
      }

      // Map camelCase to snake_case for database
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image: imageUrl,
        slug: formData.slug || generateSlug(formData.title),
        meta_description: formData.metaDescription || null,
        published: formData.published,
        updated_at: new Date().toISOString(),
      };

      let result;
      const isNewPost = !editingPost;
      
      if (editingPost) {
        // Update existing post
        result = await db.updateBlogPost(editingPost.id, postData);
        console.log('✅ Post updated successfully:', result);
      } else {
        // Create new post
        result = await db.createBlogPost({
          ...postData,
          created_at: new Date().toISOString(),
        });
        console.log('✅ Post created successfully:', result);
      }

      if (result.error) {
        throw result.error;
      }

      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        slug: '',
        metaDescription: '',
        published: false,
      });
      setFeaturedImage(null);
      setShowForm(false);
      setEditingPost(null);
      
      // Show success message
      const successMsg = isNewPost 
        ? 'Post created successfully!' 
        : 'Post updated successfully!';
      alert(successMsg);
    } catch (error) {
      console.error('❌ Error saving post:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save post: ${errorMessage}\n\nCheck the console for details.`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      slug: post.slug,
      metaDescription: post.metaDescription || '',
      published: post.published,
    });
    setShowForm(true);
  };

  const handleDelete = (postId: string) => {
    setPendingDeleteId(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      await db.deleteBlogPost(pendingDeleteId);
      setShowDeleteModal(false);
      setPendingDeleteId(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      slug: '',
      metaDescription: '',
      published: false,
    });
    setFeaturedImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Posts</h1>
          <p className="text-gray-600">Create and manage your blog content</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            New Post
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="auto-generated-from-title"
              />
              <p className="text-sm text-gray-500 mt-1">Leave empty to auto-generate from title</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                placeholder="Brief summary of the post"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended max excerpt size: 10 KB (~1200 characters). Larger excerpts may prevent posts from loading.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Content
              </label>
              <BlogEditor
                initialContent={formData.content}
                onContentChange={(content) => setFormData({ ...formData, content })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended max content size: 200 KB. Large embedded images or media may cause the blog post page to fail to open.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Meta Description (SEO)
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                placeholder="Description for search engines (optional)"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
              />
              <label htmlFor="published" className="text-sm font-semibold text-gray-900">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {uploading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No blog posts yet. Create your first post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-md">{post.excerpt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.published ? (
                          <>
                            <EyeIcon className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <PencilIcon className="w-5 h-5 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900">Delete Post?</h3>
                <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this blog post? All associated data will be permanently removed.
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
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
