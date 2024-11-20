import React from 'react';

const DownloadButton = ({ uploadedFile, inputText, setGeneratedFileUrl, setIsLoading, setError }) => {
  const [downloadUrl, setDownloadUrl] = React.useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          originalVoicePath: uploadedFile,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setDownloadUrl(data.downloadUrl);
      setGeneratedFileUrl(data.downloadUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={handleGenerate}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        disabled={!uploadedFile || !inputText}
      >
        {isLoading ? 'Generating...' : 'Generate Voice'}
      </button>

      {downloadUrl && (
        <a
          href={downloadUrl}
          download
          className="block w-full text-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Download Generated Voice
        </a>
      )}
    </div>
  );
};

export default DownloadButton;
