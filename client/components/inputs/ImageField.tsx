import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Plus, Eye, Trash2, Check, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/utils/cropImage';

interface ImageFieldProps {
    label?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSizeMB?: number;
    value?: string | string[];
    onChange?: (value: string | string[] | null) => void;
    onFileChange?: (file: File | File[] | null) => void;
    accept?: string;
    disabled?: boolean;
    required?: boolean;
    helperText?: string;
    error?: string;
    className?: string;
    enableCrop?: boolean;
    cropAspectRatio?: number;
    variant?: 'default' | 'mini';
}

export default function ImageField({
    label = 'Upload Image',
    multiple = false,
    maxFiles = 5,
    maxSizeMB = 5,
    value,
    onChange,
    onFileChange,
    accept = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
    disabled = false,
    required = false,
    helperText,
    error,
    className = '',
    enableCrop = false,
    cropAspectRatio = 1,
    variant = 'default'
}: ImageFieldProps) {
    const [previews, setPreviews] = useState<string[]>(
        value ? (Array.isArray(value) ? value : [value]) : []
    );
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [previewModal, setPreviewModal] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cropping State
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Sync previews with value prop changes (e.g., after successful upload)
    useEffect(() => {
        if (value) {
            const newPreviews = Array.isArray(value) ? value : [value];
            setPreviews(newPreviews);
            // Clear selected files since these are now saved URLs
            setSelectedFiles([]);
        } else {
            setPreviews([]);
            setSelectedFiles([]);
        }
    }, [value]);

    const processFiles = (files: File[]) => {
        const newPreviews: string[] = [];
        const newFiles: File[] = [];

        // Check file count limit for multiple
        if (multiple && previews.length + files.length > maxFiles) {
            alert(`You can only upload up to ${maxFiles} images`);
            return;
        }

        files.forEach((file) => {
            // Check file size
            if (file.size > maxSizeMB * 1024 * 1024) {
                alert(`${file.name} is too large. Max size is ${maxSizeMB}MB`);
                return;
            }

            // Check file type
            const acceptedTypes = accept.split(',').map(t => t.trim());
            const isAccepted = acceptedTypes.some(type => {
                // Handle wildcards like image/*
                if (type.includes('*')) {
                    const pattern = new RegExp('^' + type.replace('*', '.*') + '$');
                    return pattern.test(file.type);
                }
                // Direct match
                return file.type === type;
            });

            if (!isAccepted) {
                alert(`${file.name} is not a supported image format`);
                return;
            }

            newFiles.push(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                newPreviews.push(result);

                // Update state when all files are processed
                if (newPreviews.length === newFiles.length) {
                    const updatedPreviews = multiple
                        ? [...previews, ...newPreviews]
                        : newPreviews;

                    const updatedFiles = multiple
                        ? [...selectedFiles, ...newFiles]
                        : newFiles;

                    setPreviews(updatedPreviews);
                    setSelectedFiles(updatedFiles);

                    if (onChange) {
                        onChange(multiple ? updatedPreviews : updatedPreviews[0] || null);
                    }
                    if (onFileChange) {
                        onFileChange(multiple ? updatedFiles : updatedFiles[0] || null);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    }

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const fileArray = Array.from(files);

        // If cropping is enabled and it's a single file (or take first of multiple), intercept
        if (enableCrop && fileArray.length > 0) {
            // For now, only crop the first file if multiple are selected, or iterate?
            // Usually cropping is best for single avatar/cover uploads. 
            // Let's assume enabling crop implies single file flow or one-by-one.
            // If multiple=true and enableCrop=true, we might just crop the first, or disable multiple crop for simplicity now.
            // Let's take the first file for cropping.
            const fileToCrop = fileArray[0];

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setCroppingImage(reader.result as string);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setRotation(0);
            });
            reader.readAsDataURL(fileToCrop);

            // Clear input so same file can be selected again if cancelled
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        processFiles(fileArray);
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        if (!croppingImage || !croppedAreaPixels) return;

        try {
            const croppedBlob = await getCroppedImg(
                croppingImage,
                croppedAreaPixels,
                rotation
            );

            if (croppedBlob) {
                const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
                processFiles([file]);
                setCroppingImage(null);
            }
        } catch (e) {
            console.error(e);
            alert('Something went wrong cropping the image');
        }
    };

    const handleRemove = (index: number) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);

        setPreviews(updatedPreviews);
        setSelectedFiles(updatedFiles);

        if (onChange) {
            if (multiple) {
                onChange(updatedPreviews.length > 0 ? updatedPreviews : null);
            } else {
                onChange(null);
            }
        }

        if (onFileChange) {
            if (multiple) {
                onFileChange(updatedFiles.length > 0 ? updatedFiles : null);
            } else {
                onFileChange(null);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const openFileDialog = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Label */}
            {label && variant !== 'mini' && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Upload Area */}
            {(!multiple && previews.length === 0) || (multiple && previews.length < maxFiles) ? (
                <div
                    onClick={openFileDialog}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            relative border-2 border-dashed rounded-xl transition-all cursor-pointer
            ${variant === 'mini' ? 'p-1' : 'p-6'}
            ${isDragging
                            ? 'border-purple-500 bg-purple-50'
                            : error
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 hover:border-purple-400 bg-gray-50'
                        }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={(e) => handleFileSelect(e.target.files)}
                        disabled={disabled}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center text-center space-y-3 h-full w-full">
                        <div className={`
              rounded-full flex items-center justify-center
              ${variant === 'mini' ? 'w-full h-full p-6' : 'w-16 h-16'}
              ${isDragging ? 'bg-purple-100' : 'bg-gray-100'}
            `}>
                            <Upload className={`
                ${variant === 'mini' ? 'w-1/2 h-1/2' : 'w-8 h-8'}
                ${isDragging ? 'text-purple-600' : 'text-gray-400'}
              `} />
                        </div>

                        {variant !== 'mini' && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {isDragging ? 'Drop your images here' : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {multiple
                                        ? `PNG, JPG, GIF, WEBP (max ${maxFiles} files, ${maxSizeMB}MB each)`
                                        : `PNG, JPG, GIF, WEBP (max ${maxSizeMB}MB)`
                                    }
                                </p>
                            </div>
                        )}

                        {multiple && previews.length > 0 && variant !== 'mini' && (
                            <p className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                                {previews.length} / {maxFiles} uploaded
                            </p>
                        )}
                    </div>
                </div>
            ) : null
            }

            {/* Preview Grid */}
            {
                previews.length > 0 && (
                    <div className={`
          grid gap-4 mt-4
          ${multiple
                            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                            : 'grid-cols-1'
                        }
        `}>
                        {previews.map((preview, index) => (
                            <div
                                key={index}
                                className="relative group rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
                            >
                                {/* Image */}
                                <div className={`
                relative overflow-hidden bg-gray-100
                ${multiple ? 'aspect-square' : 'aspect-video'}
              `}>
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay on hover - Hidden for mini variant */}
                                    {variant !== 'mini' && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setPreviewModal(preview)}
                                                className="cursor-pointer p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                                title="Preview"
                                            >
                                                <Eye size={18} className="text-gray-700" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(index)}
                                                disabled={disabled}
                                                className="cursor-pointer p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={18} className="text-red-600" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Image info */}
                                {multiple && (
                                    <div className="p-2 bg-white">
                                        <p className="text-xs text-gray-500 truncate">
                                            Image {index + 1}
                                        </p>
                                    </div>
                                )}

                                {/* Remove button (always visible on mobile) - customized for mini */}
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    disabled={disabled}
                                    className={`
                                    cursor-pointer absolute bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors
                                    ${variant === 'mini'
                                            ? 'top-0 right-0 p-0.5 w-4 h-4 flex items-center justify-center shadow-sm translate-x-1/4 -translate-y-1/4'
                                            : 'top-2 right-2 p-1.5 sm:opacity-0 sm:group-hover:opacity-100'
                                        }
                                `}
                                    title="Remove"
                                >
                                    <X size={variant === 'mini' ? 10 : 14} />
                                </button>
                            </div>
                        ))}

                        {/* Add more button for multiple */}
                        {multiple && previews.length < maxFiles && (
                            <button
                                type="button"
                                onClick={openFileDialog}
                                disabled={disabled}
                                className={`
                aspect-square rounded-xl border-2 border-dashed border-gray-300
                hover:border-purple-400 hover:bg-purple-50 transition-all
                flex flex-col items-center justify-center gap-2
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
                            >
                                <Plus size={24} className="text-gray-400" />
                                <span className="text-xs text-gray-500">Add more</span>
                            </button>
                        )}
                    </div>
                )
            }

            {/* Helper Text */}
            {
                helperText && !error && (
                    <p className="mt-2 text-xs text-gray-500">{helperText}</p>
                )
            }

            {/* Error Message */}
            {
                error && (
                    <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">!</span>
                        {error}
                    </p>
                )
            }

            {/* Preview Modal */}
            {
                previewModal && (
                    <div
                        className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setPreviewModal(null)}
                    >
                        <div className="relative max-w-4xl max-h-[70vh] w-full">
                            <button
                                type="button"
                                onClick={() => setPreviewModal(null)}
                                className="absolute top-2 right-2 text-gray-600 bg-white/70 hover:bg-white/80 cursor-pointer p-2  rounded-full  transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <img
                                src={previewModal}
                                alt="Preview"
                                className="w-full h-full object-contain rounded-xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )
            }

            {/* Cropping Modal */}
            {
                croppingImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-gray-900">Crop Image</h3>
                                <button type="button" onClick={() => setCroppingImage(null)} className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Cropper Area */}
                            <div className="relative h-80 w-full bg-gray-100">
                                <Cropper
                                    image={croppingImage}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={cropAspectRatio}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                />
                            </div>

                            {/* Controls */}
                            <div className="p-6 space-y-6">
                                {/* Zoom Slider */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        <span>Zoom</span>
                                        <span>{Math.round((zoom - 1) * 100)}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ZoomOut size={16} className="text-gray-400" />
                                        <input
                                            type="range"
                                            value={zoom}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            aria-labelledby="Zoom"
                                            onChange={(e) => setZoom(Number(e.target.value))}
                                            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <ZoomIn size={16} className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Rotation Slider */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        <span>Rotation</span>
                                        <span>{rotation}°</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RotateCw size={16} className="text-gray-400" />
                                        <input
                                            type="range"
                                            value={rotation}
                                            min={0}
                                            max={360}
                                            step={1}
                                            aria-labelledby="Rotation"
                                            onChange={(e) => setRotation(Number(e.target.value))}
                                            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setCroppingImage(null)}
                                        className="flex-1 cursor-pointer py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCropSave}
                                        className="flex-1 cursor-pointer py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} />
                                        Save Crop
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
