// src/components/UploadFile.js
import React, { useState } from 'react';

const UploadFile = ({ onFileUpload, setError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    // Check file type
    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file');
      return;
    }

    const formData = new FormData();
    formData.append('voiceFile', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onFileUpload(data.filePath);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files[0]);
      }}
    >
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => handleFileUpload(e.target.files[0])}
        className="hidden"
        id="fileInput"
      />
      <label 
        htmlFor="fileInput"
        className="cursor-pointer text-blue-600 hover:text-blue-800"
      >
        Click to upload
      </label>
      <p className="mt-2 text-sm text-gray-600">or drag and drop</p>
      <p className="mt-1 text-xs text-gray-500">Audio files only, up to 5MB</p>
    </div>
  );
};

export default UploadFile;
