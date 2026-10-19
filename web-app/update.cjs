const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const partnerApplyCode = `function PartnerApplyPage() {
  const [type, setType] = useState('tech');
  const [data, setData] = useState({ name: '', email: '', company: '', product_name: '', website: '', agency_name: '', experience: '', linkedin: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');
    const endpoint = type === 'tech' ? 'http://localhost:5000/api/partners/apply/tech' : 'http://localhost:5000/api/partners/apply/sales';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setStatus('Application received! We will be in touch shortly.');
        setData({ name: '', email: '', company: '', product_name: '', website: '', agency_name: '', experience: '', linkedin: '' });
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('Network error. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ minHeight: '80vh', paddingTop: '160px', paddingBottom: '160px', position: 'relative' }}>
      <div className="orb" style={{ background: 'radial-gradient(circle, var(--sky), transparent 60%)', left: '50%', top: '20%', transform: 'translate(-50%, -50%)', opacity: 0.15 }}></div>
      <div className="wrap">
        <div className="grid" style={{ gap: '64px', alignItems: 'flex-start' }}>
          <div className="rv" style={{ flex: 1 }}>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.1, marginBottom: '24px' }}>Join the <em style={{ color: 'var(--sky)' }}>Ecosystem.</em></h1>
            <p style={{ fontSize: '18px', opacity: 0.8, lineHeight: 1.6, maxWidth: '40ch', marginBottom: '40px' }}>
              Select your partnership type and submit your application. Our team will review your details and reach out with next steps.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <button onClick={() => setType('tech')} className={\`btn \${type === 'tech' ? 'p' : ''}\`} style={{ padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>Tech Partner</button>
              <button onClick={() => setType('sales')} className={\`btn \${type === 'sales' ? 'p' : ''}\`} style={{ padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>Sales Partner</button>
            </div>
          </div>
          
          <div className="rv" style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '48px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.9 }}>Full Name</label>
                <input required type="text" name="name" value={data.name} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} placeholder="John Doe" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.9 }}>Work Email</label>
                <input required type="email" name="email" value={data.email} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} placeholder="john@company.com" />
              </div>
              
              {type === 'tech' ? (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.9 }}>Company Name</label>
                    <input required type="text" name="company" value={data.company} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} placeholder="Company Inc." />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.9 }}>Product Name</label>
                    <input required type="text" name="product_name" value={data.product_name} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} placeholder="Your SaaS Product" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.9 }}>Website URL</label>
                    <input required type="url" name="website" value={data.website} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} placeholder="https://example.com" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.9 }}>Agency Name (Optional)</label>
                    <input type="text" name="agency_name" value={data.agency_name} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} placeholder="Agency LLC" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.9 }}>LinkedIn URL</label>
                    <input required type="url" name="linkedin" value={data.linkedin} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.9 }}>Experience Summary</label>
                    <textarea required name="experience" value={data.experience} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', minHeight: '120px', resize: 'vertical', outline: 'none' }} placeholder="Briefly describe your sales experience..."></textarea>
                  </div>
                </>
              )}
              <button type="submit" className="btn p" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px', borderRadius: '12px', marginTop: '8px' }}>Submit Application</button>
              {status && <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '15px', color: status.includes('received') ? 'var(--sky)' : '#FF8A3D' }}>{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}`;

code = code.replace(/function TechApplyPage\(\) \{[\s\S]*?function SalesApplyPage\(\) \{[\s\S]*?\n\}\n/, partnerApplyCode + '\n');
code = code.replace('<Route path="/apply/tech" element={<TechApplyPage />} />\n          <Route path="/apply/sales" element={<SalesApplyPage />} />', '<Route path="/partner-apply" element={<PartnerApplyPage />} />');

const contactTarget = `              <div>
                <h4 style={{ color: 'var(--sky)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Headquarters</h4>
                <p style={{ fontSize: '16px', opacity: 0.8 }}>100 Innovation Drive<br />Tech Park, Sector 4<br />New Delhi</p>
              </div>
            </div>
          </div>`;

const contactReplacement = `              <div>
                <h4 style={{ color: 'var(--sky)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Headquarters</h4>
                <p style={{ fontSize: '16px', opacity: 0.8 }}>100 Innovation Drive<br />Tech Park, Sector 4<br />New Delhi</p>
              </div>
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ color: 'var(--sky)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Partnerships</h4>
                <Link to="/partner-apply" className="btn" style={{ padding: '12px 24px', borderRadius: '8px' }}>Become a Partner</Link>
              </div>
            </div>
          </div>`;

code = code.replace(contactTarget, contactReplacement);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Update complete');
