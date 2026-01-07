'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBrandMutations } from '@/lib/hooks/mutations/useBrandMutations';
import { brandServices } from '@/lib/services/brandServices';
import { fileServices } from '@/lib/services/fileServices'; // Added fileServices
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import FloatingInput from '@/components/inputs/FloatingInput';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import ImageField from '@/components/inputs/ImageField';
import { toast } from 'react-hot-toast';

export default function AddBrandPage() {
  const router = useRouter();
  const { useCreateBrand } = useBrandMutations();
  const createMutation = useCreateBrand();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    status: '1' // Default to Active (string for dropdown)
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormData(prev => ({ ...prev, name, slug }));
  };

  const handleFileChange = (file: File | File[] | null) => {
    if (file && !Array.isArray(file)) {
      // Show local preview (ImageField handles this internally if we pass File object?)
      // ImageField expects 'value' to be a string URL for preview.
      // But for new files, it handles preview internally via 'processFiles'.
      // We just need to store the file for upload.
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let logoUrl = formData.logo;

      // 1. Upload File if selected
      if (selectedFile) {
        try {
          logoUrl = await fileServices.uploadFile(selectedFile, 'brands');
          console.log('Brand Logo Uploaded:', logoUrl);
        } catch (uploadError) {
          console.error('Logo upload failed', uploadError);
          toast.error('Failed to upload logo');
          setIsUploading(false);
          return; // Stop creation
        }
      }

      // 2. Create Brand with logo URL
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('slug', formData.slug);
      submitData.append('status', formData.status);
      submitData.append('logo', logoUrl); // Send string URL

      // DEBUG: Log FormData entries
      console.log('Submitting Brand Data:', Object.fromEntries(submitData.entries()));

      createMutation.mutate(submitData, {
        onSuccess: () => {
          router.push('/admin/brand-management/list-page');
        },
        onSettled: () => {
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error('Creation failed:', error);
      toast.error('Failed to create brand');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/brand-management/list-page"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Brand</h1>
          <p className="text-gray-500 text-sm">Create a new brand to display in the store</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Basic Information
              </h3>

              <FloatingInput
                id="name"
                label="Brand Name"
                value={formData.name}
                onChange={handleNameChange}
                required
                color='blue'
              />

              <div>
                <FloatingInput
                  id="slug"
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="font-mono text-sm bg-gray-50"
                  color='blue'
                />
                <p className="text-xs text-gray-500 mt-1 pl-1">URL-friendly unique identifier</p>
              </div>

              <ModernDropdown
                label="Status"
                options={[
                  { value: '1', label: 'Active' },
                  { value: '2', label: 'Inactive' }
                ]}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
              />
            </div>

            {/* Media Section */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Media & Assets
              </h3>

              <ImageField
                label="Brand Logo"
                value={formData.logo}
                onChange={(val) => setFormData({ ...formData, logo: val as string })}
                onFileChange={handleFileChange}
                maxFiles={1}
                maxSizeMB={2}
                helperText="Upload generic brand logo (PNG, JPG, SVG)"
                enableCrop={true}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Link
              href="/admin/brand-management/list-page"
              className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending || isUploading}
              className={`flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 ${createMutation.isPending || isUploading ? 'cursor-not-allowed' : 'cursor-pointer'} transition-all shadow-sm hover:shadow`}
            >
              {createMutation.isPending || isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isUploading ? 'Uploading...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Brand
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}