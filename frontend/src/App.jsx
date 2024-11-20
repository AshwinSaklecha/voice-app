import React, { useState } from 'react';
import UploadFile from './components/UploadFile';
import TextInput from './components/TextInput';
import DownloadButton from './components/DownloadButton';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [inputText, setInputText] = useState('');
  const [generatedFileUrl, setGeneratedFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Voice Conversion App</h1>
        
        <UploadFile 
          onFileUpload={setUploadedFile} 
          setError={setError} 
        />

        <TextInput 
          value={inputText}
          onChange={setInputText}
          maxLength={500}
        />

        {uploadedFile && inputText && (
          <DownloadButton 
            uploadedFile={uploadedFile}
            inputText={inputText}
            setGeneratedFileUrl={setGeneratedFileUrl}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
