'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/supabase';
import { Cog6ToothIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown> | null;
  description?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string>('');
  const [useFaviconUrl, setUseFaviconUrl] = useState<boolean>(false);
  const [siteTitle, setSiteTitle] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await db.getSettings();
      if (error) throw error;
      
      setSettings(data || []);
      
      // Set favicon URL if it exists
      const faviconSetting = data?.find(s => s.key === 'favicon');
      if (faviconSetting?.value?.url) {
        if (faviconSetting.value.url.startsWith('http')) {
          setFaviconUrl(faviconSetting.value.url);
          setUseFaviconUrl(true);
        } else {
          setFaviconUrl(faviconSetting.value.url);
          setUseFaviconUrl(false);
        }
      }

      // Set site title if it exists
      const titleSetting = data?.find(s => s.key === 'site_title');
      if (titleSetting?.value?.title) {
        setSiteTitle(titleSetting.value.title);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const getSettingValue = (key: string): Record<string, unknown> | null => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || null;
  };

  const updatePricing = async (planKey: string, price: string, currency: string) => {
    setSaving(true);
    try {
      const { error } = await db.updateSetting(
        `pricing_${planKey}`,
        { price, currency },
        `Pricing for ${planKey} plan`
      );
      if (error) throw error;
      
      // Update local state
      setSettings(prev => {
        const existing = prev.find(s => s.key === `pricing_${planKey}`);
        if (existing) {
          return prev.map(s => 
            s.key === `pricing_${planKey}` 
              ? { ...s, value: { price, currency } }
              : s
          );
        }
        return [...prev, { 
          id: '', 
          key: `pricing_${planKey}`, 
          value: { price, currency } 
        }];
      });
      
      alert('Pricing updated successfully!');
    } catch (error) {
      console.error('Error updating pricing:', error);
      alert('Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  const updateFavicon = async () => {
    setSaving(true);
    try {
      let faviconUrlValue = faviconUrl.trim();

      if (!useFaviconUrl && faviconFile) {
        // Upload favicon file
        const fileName = `favicon_${Date.now()}.${faviconFile.name.split('.').pop()}`;
        faviconUrlValue = await storage.uploadImage('blog-images', fileName, faviconFile);
      } else if (!faviconUrlValue) {
        alert('Please provide a favicon URL or upload a file');
        setSaving(false);
        return;
      }

      const { error } = await db.updateSetting(
        'favicon',
        { url: faviconUrlValue },
        'Website favicon'
      );

      if (error) throw error;
      
      // Update local state
      setSettings(prev => {
        const existing = prev.find(s => s.key === 'favicon');
        if (existing) {
          return prev.map(s => 
            s.key === 'favicon' 
              ? { ...s, value: { url: faviconUrlValue } }
              : s
          );
        }
        return [...prev, { 
          id: '', 
          key: 'favicon', 
          value: { url: faviconUrlValue } 
        }];
      });

      alert('Favicon updated successfully! Please refresh the page to see changes.');
      setFaviconFile(null);
    } catch (error) {
      console.error('Error updating favicon:', error);
      alert('Failed to update favicon');
    } finally {
      setSaving(false);
    }
  };

  const updateSiteTitle = async () => {
    if (!siteTitle.trim()) {
      alert('Please enter a site title');
      return;
    }

    setSaving(true);
    try {
      const { error } = await db.updateSetting(
        'site_title',
        { title: siteTitle.trim() },
        'Website title'
      );

      if (error) throw error;
      
      // Update local state
      setSettings(prev => {
        const existing = prev.find(s => s.key === 'site_title');
        if (existing) {
          return prev.map(s => 
            s.key === 'site_title' 
              ? { ...s, value: { title: siteTitle.trim() } }
              : s
          );
        }
        return [...prev, { 
          id: '', 
          key: 'site_title', 
          value: { title: siteTitle.trim() } 
        }];
      });

      alert('Site title updated successfully! The title will update on the next page load.');
    } catch (error) {
      console.error('Error updating site title:', error);
      alert('Failed to update site title');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pricingPlans = [
    { key: 'trial', label: 'Trial Lesson', current: getSettingValue('pricing_trial') },
    { key: 'individual', label: 'Individual Lesson', current: getSettingValue('pricing_individual') },
    { key: 'async', label: 'Asynchronous Learning', current: getSettingValue('pricing_async') },
    { key: 'group', label: 'Group Lesson', current: getSettingValue('pricing_group') },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage site settings, favicon, and pricing information</p>
      </div>

      {/* Site Title Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <DocumentTextIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Site Title</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Website Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="TinyTalks - Learn English with Confidence | Beginner to B1"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This title appears in the browser tab and search engine results.
            </p>
          </div>

          {(() => {
            const titleValue = getSettingValue('site_title');
            const title = titleValue?.title;
            return title && typeof title === 'string' ? (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Current title:</p>
                <p className="text-sm font-medium text-gray-900">
                  {title}
                </p>
              </div>
            ) : null;
          })()}

          <button
            onClick={updateSiteTitle}
            disabled={saving || !siteTitle.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Title'}
          </button>
        </div>
      </div>

      {/* Favicon Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Cog6ToothIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Favicon</h2>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => {
                setUseFaviconUrl(false);
                setFaviconUrl('');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !useFaviconUrl
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Upload Favicon
            </button>
            <button
              type="button"
              onClick={() => {
                setUseFaviconUrl(true);
                setFaviconFile(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                useFaviconUrl
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Use Favicon URL
            </button>
          </div>

          {useFaviconUrl ? (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Favicon URL
              </label>
              <input
                type="url"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="https://example.com/favicon.ico or /favicon.ico"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a direct link to a favicon file (.ico, .png, .svg)
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload Favicon
              </label>
              <input
                type="file"
                accept=".ico,.png,.svg,image/x-icon,image/png,image/svg+xml"
                onChange={(e) => setFaviconFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a favicon file (.ico, .png, or .svg). Recommended size: 32x32 or 16x16 pixels.
              </p>
              {faviconFile && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <img
                    src={URL.createObjectURL(faviconFile)}
                    alt="Favicon preview"
                    className="w-16 h-16 border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>
          )}

          {getSettingValue('favicon')?.url && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Current favicon:</p>
              <img
                src={getSettingValue('favicon').url}
                alt="Current favicon"
                className="w-16 h-16 border border-gray-300 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <button
            onClick={updateFavicon}
            disabled={saving || (!faviconFile && !faviconUrl.trim())}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Favicon'}
          </button>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <PhotoIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Pricing Plans</h2>
        </div>

        <div className="space-y-6">
          {pricingPlans.map((plan) => (
            <div key={plan.key} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{plan.label}</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price
                  </label>
                  <input
                    id={`${plan.key}_price`}
                    type="text"
                    defaultValue={plan.current?.price || ''}
                    onBlur={(e) => {
                      const currencyInput = document.getElementById(`${plan.key}_currency`) as HTMLInputElement;
                      const currency = currencyInput?.value || plan.current?.currency || '₽';
                      if (e.target.value !== plan.current?.price) {
                        updatePricing(plan.key, e.target.value, currency);
                      }
                    }}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Currency
                  </label>
                  <input
                    id={`${plan.key}_currency`}
                    type="text"
                    defaultValue={plan.current?.currency || '₽'}
                    onBlur={(e) => {
                      const priceInput = document.getElementById(`${plan.key}_price`) as HTMLInputElement;
                      const price = priceInput?.value || plan.current?.price || '0';
                      if (e.target.value !== plan.current?.currency) {
                        updatePricing(plan.key, price, e.target.value);
                      }
                    }}
                    placeholder="₽"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    Current: <span className="font-semibold">
                      {plan.current?.price || '0'} {plan.current?.currency || '₽'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Prices are saved automatically when you blur (click away from) the input fields.
            Changes will be reflected on the landing page immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

