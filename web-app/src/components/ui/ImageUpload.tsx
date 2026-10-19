import React, { useState } from 'react';

export function ImageUpload({
  value,
  onChange,
  label = 'Upload Image'
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        onChange(data.url);
        setPreview(data.url);
      }
    } catch (err) {
      alert('Upload failed. Check backend.');
    }
    setUploading(false);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}>
          {uploading ? '⟳ Uploading...' : '↑ Choose File'}
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </label>
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setPreview(e.target.value); }}
          placeholder="Or paste image URL..."
          className="modern-input"
          style={{ flexGrow: 1, marginBottom: 0 }}
        />
      </div>
      {preview && (
        <img
          src={preview}
          alt="preview"
          onError={() => setPreview('')}
          style={{ marginTop: '12px', width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
        />
      )}
    </div>
  );
}

export default ImageUpload;
