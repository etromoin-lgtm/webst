const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace PartnerCTA link
code = code.replace(/<Link className="btn p" to="\/apply\/sales">Express Your Interest<\/Link>/, '<Link className="btn p" to="/partner-apply">Express Your Interest</Link>');

// 2. Replace TechApplyPage and SalesApplyPage with PartnerApplyPage
const applyPagesRegex = /\/\/ --- PARTNER APPLICATION FORMS ---[\s\S]*?(?=\/\/ --- ADMIN DASHBOARD ---)/;

const newApplyPages = `// --- PARTNER APPLICATION FORMS ---

function PartnerApplyPage() {
  const [tab, setTab] = useState('apply'); // 'apply' or 'status'
  const [type, setType] = useState('tech'); // 'tech' or 'sales'
  const [status, setStatus] = useState('');
  const [code, setCode] = useState('');
  
  const [checkCode, setCheckCode] = useState('');
  const [checkStatusRes, setCheckStatusRes] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Submitting...');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.type = type;
    
    try {
      const res = await fetch('http://localhost:5000/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok) {
        setCode(resData.code);
        setStatus('Success! Your application has been submitted.');
      } else {
        setStatus('Error submitting application.');
      }
    } catch (err) {
      setStatus('Error connecting to server.');
    }
  };

  const handleCheckStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckStatusRes({ loading: true });
    try {
      const res = await fetch(\`http://localhost:5000/api/partners/status/\${checkCode}\`);
      const resData = await res.json();
      if (res.ok && resData.success) {
        setCheckStatusRes({ success: true, data: resData.data });
      } else {
        setCheckStatusRes({ success: false, error: resData.error || 'Code not found' });
      }
    } catch (err) {
      setCheckStatusRes({ success: false, error: 'Network error.' });
    }
  };

  return (
    <div style={{ paddingTop: '160px', paddingBottom: '160px', minHeight: '80vh', textAlign: 'center' }} className="wrap">
      <h1 style={{ marginTop: '24px', fontSize: 'clamp(40px, 6vw, 64px)' }}>Partner Portal</h1>
      <p style={{ marginTop: '24px', fontSize: '20px', maxWidth: '60ch', opacity: 0.8, margin: '24px auto 40px' }}>Apply to join our ecosystem or check your application status.</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
        <button onClick={() => setTab('apply')} className={tab === 'apply' ? 'btn p' : 'btn'} style={{ padding: '12px 24px', borderRadius: '32px' }}>Apply as Partner</button>
        <button onClick={() => setTab('status')} className={tab === 'status' ? 'btn p' : 'btn'} style={{ padding: '12px 24px', borderRadius: '32px' }}>Check Status</button>
      </div>

      {tab === 'apply' && !code && (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)', padding: '40px', borderRadius: '24px', textAlign: 'left' }}>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '16px' }}>
            <button type="button" onClick={() => setType('tech')} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: type === 'tech' ? 'var(--sky)' : 'transparent', color: type === 'tech' ? '#000' : 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Tech Partner</button>
            <button type="button" onClick={() => setType('sales')} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: type === 'sales' ? 'var(--sky)' : 'transparent', color: type === 'sales' ? '#000' : 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Sales Partner</button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Full Name</label>
            <input name="name" required style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'white', fontSize: '16px' }} />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email Address</label>
            <input name="email" type="email" required style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'white', fontSize: '16px' }} />
          </div>

          {type === 'tech' && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Company Name</label>
                <input name="company" required style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'white', fontSize: '16px' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Product Name</label>
                <input name="product_name" required style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'white', fontSize: '16px' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Product Website</label>
                <input name="website" type="url" required style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'white', fontSize: '16px' }} />
              </div>
            </>
          )}

          {type === 'sales' && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Agency Name (Optional)</label>
                <input name="agency_name" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'white', fontSize: '16px' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>LinkedIn Profile URL</label>
                <input name="linkedin" type="url" required style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'white', fontSize: '16px' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Sales Experience</label>
                <textarea name="experience" required style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'white', fontSize: '16px', minHeight: '100px' }}></textarea>
              </div>
            </>
          )}

          <button type="submit" className="btn p" style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '16px' }}>Submit Application</button>
          {status && <p style={{ marginTop: '24px', fontSize: '14px', color: status.includes('Success') ? 'var(--sky)' : '#FF8A3D', textAlign: 'center' }}>{status}</p>}
        </form>
      )}

      {tab === 'apply' && code && (
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(143, 193, 255, 0.1)', border: '1px solid var(--sky)', padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
          <svg style={{ margin: '0 auto 24px' }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Application Submitted</h2>
          <p style={{ opacity: 0.8, marginBottom: '24px' }}>Your application is under review. Please save your tracking code to check your status later.</p>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '24px', borderRadius: '12px', fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--sky)' }}>
            {code}
          </div>
          <button onClick={() => {setCode(''); setStatus('');}} className="btn" style={{ marginTop: '32px' }}>Submit Another</button>
        </div>
      )}

      {tab === 'status' && (
        <form onSubmit={handleCheckStatus} style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)', padding: '40px', borderRadius: '24px', textAlign: 'left' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Application Tracking Code</label>
            <input value={checkCode} onChange={e => setCheckCode(e.target.value)} required placeholder="e.g. TECH-ABCDEF" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'white', fontSize: '16px', textTransform: 'uppercase' }} />
          </div>
          <button type="submit" className="btn p" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>Check Status</button>

          {checkStatusRes && (
            <div style={{ marginTop: '32px', padding: '24px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', textAlign: 'center' }}>
              {checkStatusRes.loading && <p>Checking...</p>}
              {checkStatusRes.success && (
                <>
                  <p style={{ fontSize: '14px', opacity: 0.6, marginBottom: '8px' }}>Applicant: {checkStatusRes.data.name} ({checkStatusRes.data.type.toUpperCase()})</p>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: checkStatusRes.data.status === 'Pending' ? '#FF8A3D' : 'var(--sky)' }}>
                    Status: {checkStatusRes.data.status}
                  </div>
                </>
              )}
              {checkStatusRes.error && <p style={{ color: '#FF8A3D' }}>{checkStatusRes.error}</p>}
            </div>
          )}
        </form>
      )}
    </div>
  );
}

`;
code = code.replace(applyPagesRegex, newApplyPages);

// 3. Update AdminDashboard to use the new unified endpoint structure
const adminDashboardRegex = /function AdminDashboard\(\) \{[\s\S]*?(?=\/\/ ---)/;

const newAdminDashboard = \`function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/applications')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error(e));
  }, []);

  return (
    <div style={{ paddingTop: '160px', paddingBottom: '160px', minHeight: '80vh' }} className="wrap">
      <h1 style={{ fontSize: '32px', marginBottom: '40px' }}>Admin Dashboard</h1>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '24px', border: '1px solid var(--line)' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>All Partner Applications</h2>
        
        {data ? (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '16px 8px', opacity: 0.6 }}>Date</th>
                <th style={{ padding: '16px 8px', opacity: 0.6 }}>Code</th>
                <th style={{ padding: '16px 8px', opacity: 0.6 }}>Type</th>
                <th style={{ padding: '16px 8px', opacity: 0.6 }}>Name</th>
                <th style={{ padding: '16px 8px', opacity: 0.6 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.applications?.map((app: any) => (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 8px' }}>{new Date(app.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>{app.code}</td>
                  <td style={{ padding: '16px 8px', textTransform: 'uppercase' }}>{app.type}</td>
                  <td style={{ padding: '16px 8px' }}>{app.name}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', background: app.status === 'Pending' ? 'rgba(255, 138, 61, 0.2)' : 'rgba(143, 193, 255, 0.2)', color: app.status === 'Pending' ? '#FF8A3D' : 'var(--sky)' }}>{app.status}</span>
                  </td>
                </tr>
              ))}
              {(!data.applications || data.applications.length === 0) && (
                <tr><td colSpan={5} style={{ padding: '24px 8px', textAlign: 'center', opacity: 0.6 }}>No applications found.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}
\`;

code = code.replace(adminDashboardRegex, newAdminDashboard);

// 4. Update router
code = code.replace(/<Route path="\/apply\/tech" element={<TechApplyPage \/>} \/>/g, '<Route path="/partner-apply" element={<PartnerApplyPage />} />');
code = code.replace(/<Route path="\/apply\/sales" element={<SalesApplyPage \/>} \/>/g, '');

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Update complete');
