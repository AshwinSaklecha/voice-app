// src/components/TextInput.js
import React from 'react';

const TextInput = ({ value, onChange, maxLength }) => {
  const handleChange = (e) => {
    const newText = e.target.value.slice(0, maxLength);
    onChange(newText);
  };

  return (
    <div className="mt-6">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Type your text here (max 500 characters)..."
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows="4"
        maxLength={maxLength}
      />
      <div className="text-sm text-gray-500 mt-1">
        {value.length}/{maxLength} characters
      </div>
    </div>
  );
};

export default TextInput;
