import { Editor } from '@tiptap/core';
import { Image as ImageIcon, Upload, Link as LinkIcon, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Dropdown } from './Dropdown';
import { fileServices } from '@/lib/services/fileServices';

interface ImageDropdownProps {
    editor: Editor;
}

export const ImageDropdown = ({ editor }: ImageDropdownProps) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
    const [url, setUrl] = useState('');
    const [altText, setAltText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const insertImage = async () => {
        let imageUrl = url;

        if (activeTab === 'upload') {
            if (!file) return;
            setIsUploading(true);
            try {
                const url = await fileServices.uploadFile(file, 'posts');
                imageUrl = url;
            } catch (error) {
                console.error("Upload failed", error);
                alert("Failed to upload image");
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl, alt: altText }).run();
            setIsOpen(false);
            // Reset state
            setUrl('');
            setAltText('');
            setFile(null);
            setIsUploading(false);
        }
    };

    return (
        <Dropdown
            trigger={
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    type='button'
                    className="p-1.5 cursor-pointer rounded text-gray-600 hover:bg-gray-200 transition-colors"
                    title="Insert Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
            }
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            width="w-80"
        >
            <div className="p-3">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-3">
                    <button
                        type='button'
                        className={`flex-1 cursor-pointer pb-2 text-sm font-medium transition-colors ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Upload
                    </button>
                    <button
                        type='button'
                        className={`flex-1 cursor-pointer pb-2 text-sm font-medium transition-colors ${activeTab === 'url' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('url')}
                    >
                        By URL
                    </button>
                </div>

                <div className="space-y-3">
                    {activeTab === 'upload' ? (
                        <div className="space-y-2">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {file ? (
                                    <div className="flex items-center justify-center gap-2 text-blue-600">
                                        <ImageIcon className="w-5 h-5" />
                                        <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                                    </div>
                                ) : (
                                    <div className="text-gray-500">
                                        <Upload className="w-6 h-6 mx-auto mb-1" />
                                        <span className="text-xs">Click or Drag to Upload</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Image URL</label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/image.png"
                                className="w-full text-sm p-1.5 text-gray-600 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Alt Text</label>
                        <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Description for screen readers"
                            className="w-full text-sm text-gray-600 p-1.5 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={insertImage}
                        disabled={isUploading || (activeTab === 'upload' && !file) || (activeTab === 'url' && !url)}
                        className="w-full cursor-pointer bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? 'Uploading...' : 'Insert Image'}
                    </button>
                </div>
            </div>
        </Dropdown>
    );
};
