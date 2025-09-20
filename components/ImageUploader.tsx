
import React, { useRef, useState, DragEvent } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageChange: (file: File, previewUrl: string) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageChange(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.');
      }
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-slate-700' : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500'}`}
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files)}
        className="hidden"
        accept="image/*"
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
      ) : (
        <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-500 dark:text-slate-400">
          <UploadIcon />
          <p className="font-semibold">
            <span className="text-primary-500">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs">PNG, JPG, or WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
