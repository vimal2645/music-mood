// src/components/UploadMusic.js
import React, { useRef, useState } from 'react';
import './UploadMusic.css';

const API_BASE =
  process.env.REACT_APP_API_BASE || 'https://music-mood-86s0.onrender.com';
const API = `${API_BASE}/api`;

function UploadMusic({ onUpload }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file); // MUST be 'file'

    setUploading(true);
    try {
      const res = await fetch(`${API}/tracks/upload`, {
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
      alert('Upload failed (network/API error)');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <input
        id="file-input"
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
