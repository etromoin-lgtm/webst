import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Eye, Image as ImageIcon, Settings, CheckCircle2 } from 'lucide-react';
import './Blog.css'; // Reuse blog CSS for preview

export default function BlogAdmin() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Technology');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const categories = ['Technology', 'Design', 'Business', 'AI', 'Programming', 'Tutorials', 'Lifestyle'];

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'video'],
      ['clean'],
      ['code-block']
    ],
  };

  const handleSave = async (publish = false) => {
    // In a real app, this would post to the backend
    const payload = {
      title, slug, category, image_url: imageUrl, content, status: publish ? 'published' : 'draft'
    };
    console.log("Saving blog:", payload);
    alert(`Blog ${publish ? 'published' : 'saved as draft'} successfully!`);
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  if (isPreview) {
    return (
      <div className="blog-light-theme" style={{ padding: '40px' }}>
        <button onClick={() => setIsPreview(false)} style={{ marginBottom: '40px', padding: '12px 24px', background: 'var(--blog-surface)', border: '1px solid var(--blog-border)', borderRadius: '8px', cursor: 'pointer' }}>
          Back to Editor
        </button>
        <div className="blog-article-container">
          <header className="blog-article-header">
            <span className="blog-badge">{category}</span>
            <h1>{title || 'Untitled Post'}</h1>
          </header>
          {imageUrl && <img src={imageUrl} alt="" className="blog-article-hero-img" />}
          <div className="blog-rich-content" dangerouslySetInnerHTML={{ __html: content || '<p>Start writing...</p>' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-sans)', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300 }}>New Blog Post</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => setIsPreview(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
            <Eye size={18} /> Preview
          </button>
          <button onClick={() => handleSave(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
            <Save size={18} /> Save Draft
          </button>
          <button onClick={() => handleSave(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--sky)', border: 'none', borderRadius: '8px', color: 'var(--ink)', fontWeight: 600, cursor: 'pointer' }}>
            <CheckCircle2 size={18} /> Publish
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
        
        {/* Editor Area */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <input 
            type="text" 
            placeholder="Post Title" 
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (!slug) setSlug(generateSlug(e.target.value));
            }}
            style={{ width: '100%', fontSize: '40px', fontWeight: 600, background: 'transparent', border: 'none', color: 'white', outline: 'none', marginBottom: '40px' }}
          />
          
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            {/* We make the ReactQuill area white so the text is visible (since it defaults to dark mode text color if not styled) */}
            <style>{`
              .ql-container { font-size: 18px; font-family: 'Inter', sans-serif; min-height: 500px; color: #1a1a1a; }
              .ql-toolbar { background: #f3f4f6; border-color: #e5e7eb !important; }
              .ql-container.ql-snow { border-color: #e5e7eb !important; }
            `}</style>
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              placeholder="Write your amazing story..."
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={16} /> Post Settings</h3>
            
            <label style={{ display: 'block', fontSize: '13px', opacity: 0.7, marginBottom: '8px' }}>URL Slug</label>
            <input 
              type="text" 
              value={slug}
              onChange={e => setSlug(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', marginBottom: '24px' }}
            />

            <label style={{ display: 'block', fontSize: '13px', opacity: 0.7, marginBottom: '8px' }}>Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><ImageIcon size={16} /> Cover Image</h3>
            
            {imageUrl ? (
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <img src={imageUrl} alt="Cover" style={{ width: '100%', borderRadius: '8px', aspectRatio: '16/9', objectFit: 'cover' }} />
                <button onClick={() => setImageUrl('')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
              </div>
            ) : (
              <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                <span style={{ opacity: 0.5, fontSize: '13px' }}>No image selected</span>
              </div>
            )}

            <label style={{ display: 'block', fontSize: '13px', opacity: 0.7, marginBottom: '8px' }}>Image URL</label>
            <input 
              type="text" 
              placeholder="https://..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
