import React, { useRef, useState } from 'react';
import './UploadMusic.css';

function UploadMusic({ onUpload }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]; // get first selected file
    if (!file) return;

    const formData = new FormData();
    // MUST match upload.single('file') in backend
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/tracks/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ ${file.name} uploaded successfully!`);
        if (onUpload) onUpload();
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert(`❌ ${data.error || 'Upload failed'}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <input
        id="file-input"              // needed for label htmlFor
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav"
        onChange={handleFileSelect}
        disabled={uploading}
        className="file-input"
      />
      <label htmlFor="file-input" className="upload-label">
        {uploading ? '⏳ Uploading...' : '📁 Click to upload (MP3/WAV)'}
      </label>
      <p className="upload-hint">Max size: 10MB</p>
    </div>
  );
}

export default UploadMusic;
