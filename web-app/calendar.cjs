const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newContactPage = `function ContactPage() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [data, setData] = useState({ name: '', email: '', phone: '', company: '', country: '', topics: [] as string[], message: '' });
  const [status, setStatus] = useState('');

  const timeSlots = ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "01:00 PM - 03:00 PM", "03:00 PM - 05:00 PM", "05:00 PM - 07:00 PM", "07:00 PM - 09:00 PM"];
  const topicsList = ["AI", "Smart Systems", "Web App", "Mobile App", "Managed Website", "Make website live", "Marketing"];

  const handleTopicToggle = (topic: string) => {
    setData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic) ? prev.topics.filter(t => t !== topic) : [...prev.topics, topic]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Scheduling...');
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, date, time })
      });
      if (res.ok) {
        setStatus('Success! Your session is booked.');
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('Network error. Please try again later.');
    }
  };

  const renderDays = () => {
    const days = [];
    for(let i=1; i<=30; i++) {
      const isSelected = date === i;
      days.push(
        <button type="button" key={i} onClick={() => setDate(i)} style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: isSelected ? 'var(--sky)' : 'transparent',
          color: isSelected ? '#000' : 'white',
          fontWeight: 'bold', border: 'none', cursor: 'pointer', margin: 'auto',
          opacity: [1, 7, 8, 14, 15, 21, 22, 28, 29].includes(i) ? 0.3 : 1
        }}>
          {i}
        </button>
      );
    }
    return days;
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#05080F" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
            </div>
            <p style={{ color: 'var(--sky)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 'bold' }}>CONSULTATION</p>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.1, marginBottom: '24px' }}>Strategy Session</h1>
            <p style={{ fontSize: '18px', opacity: 0.8, lineHeight: 1.6, maxWidth: '40ch', marginBottom: '40px' }}>
              A structured conversation on your operational workflow — so you leave with a clear recommendation and a practical path forward.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Assess the operation</h4>
                  <p style={{ fontSize: '15px', opacity: 0.6, lineHeight: 1.5 }}>Where time concentrates, what governs decisions, and what must stay human</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Recommend an approach</h4>
                  <p style={{ fontSize: '15px', opacity: 0.6, lineHeight: 1.5 }}>AI agents, an operational system, or a custom application</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Align on next steps</h4>
                  <p style={{ fontSize: '15px', opacity: 0.6, lineHeight: 1.5 }}>Pilot scope, timeline, and how we would engage</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rv" style={{ flex: 1.2, background: '#1C1D21', padding: '48px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}>
            
            {status ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h2 style={{ color: status.includes('Success') ? 'var(--sky)' : '#FF8A3D', fontSize: '24px', marginBottom: '16px' }}>{status}</h2>
                {status.includes('Success') && <p style={{ opacity: 0.8 }}>We've sent a calendar invitation to {data.email}</p>}
                <button onClick={() => { setStatus(''); setStep(1); setDate(null); setTime(null); }} className="btn p" style={{ marginTop: '32px' }}>Book Another</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '40px', fontSize: '14px', fontWeight: 'bold' }}>
                  <span style={{ background: step === 1 ? 'white' : 'transparent', color: step === 1 ? '#000' : 'rgba(255,255,255,0.4)', padding: '6px 16px', borderRadius: '20px' }}>1 Date</span>
                  <span style={{ opacity: 0.4 }}>→</span>
                  <span style={{ background: step === 2 ? 'white' : 'transparent', color: step === 2 ? '#000' : 'rgba(255,255,255,0.4)', padding: '6px 16px', borderRadius: '20px' }}>2 Time</span>
                  <span style={{ opacity: 0.4 }}>→</span>
                  <span style={{ background: step === 3 ? 'white' : 'transparent', color: step === 3 ? '#000' : 'rgba(255,255,255,0.4)', padding: '6px 16px', borderRadius: '20px' }}>3 Details</span>
                </div>

                {step === 1 && (
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Select a date</h2>
                    <p style={{ opacity: 0.6, marginBottom: '32px' }}>Weekdays with open slots are highlighted.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}>&lt;</button>
                      <h3 style={{ fontSize: '18px' }}>November 2026</h3>
                      <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}>&gt;</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px', textAlign: 'center', fontSize: '12px', opacity: 0.6, marginBottom: '16px' }}>
                      <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px 8px', textAlign: 'center' }}>
                      <span style={{ opacity: 0.2, margin: 'auto' }}>1</span>
                      {renderDays()}
                    </div>
                    <button onClick={() => setStep(2)} disabled={!date} className="btn p" style={{ marginTop: '40px', opacity: date ? 1 : 0.5 }}>Continue</button>
                  </div>
                )}

                {step === 2 && (
                  <div style={{ textAlign: 'center' }}>
                    <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--sky)', cursor: 'pointer', marginBottom: '24px' }}>← Back to calendar</button>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Select a time</h2>
                    <p style={{ opacity: 0.6, marginBottom: '32px' }}>Thursday, Nov {date}, 2026</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                      {timeSlots.map(t => (
                        <button key={t} onClick={() => setTime(t)} style={{ padding: '16px', borderRadius: '12px', border: time === t ? '2px solid var(--sky)' : '1px solid rgba(255,255,255,0.1)', background: time === t ? 'rgba(143, 193, 255, 0.1)' : 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: time === t ? 'bold' : 'normal', textAlign: 'center' }}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setStep(3)} disabled={!time} className="btn p" style={{ marginTop: '40px', width: '100%', justifyContent: 'center', opacity: time ? 1 : 0.5 }}>Next: Details</button>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                      <div>
                        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Your details</h2>
                        <p style={{ opacity: 0.6 }}>Nov {date}, 2026 • {time}</p>
                      </div>
                      <button type="button" onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer', opacity: 0.8 }}>Change time</button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Full name</label>
                          <input required type="text" name="name" value={data.name} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} />
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Email</label>
                          <input required type="email" name="email" value={data.email} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Phone (optional)</label>
                          <input type="tel" name="phone" value={data.phone} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} />
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Company (optional)</label>
                          <input type="text" name="company" value={data.company} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} />
                        </div>
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Country (optional)</label>
                        <input type="text" name="country" value={data.country} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', outline: 'none' }} />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Topics (optional)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {topicsList.map(t => (
                            <button type="button" key={t} onClick={() => handleTopicToggle(t)} style={{ padding: '8px 16px', borderRadius: '20px', background: data.topics.includes(t) ? 'var(--sky)' : 'rgba(255,255,255,0.05)', color: data.topics.includes(t) ? '#000' : 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Anything we should know? (optional)</label>
                        <textarea name="message" value={data.message} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '16px', minHeight: '100px', resize: 'vertical', outline: 'none' }} placeholder="Your biggest bottleneck, tools you use, or what you want from the call."></textarea>
                      </div>

                      <button type="submit" className="btn p" style={{ padding: '16px 32px', fontSize: '16px', borderRadius: '32px', alignSelf: 'flex-start', marginTop: '8px', fontWeight: 'bold' }}>Book Your Session</button>
                    </form>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
`;

code = code.replace(/function ContactPage\(\) \{[\s\S]*?\n\}\n/, newContactPage + '\n');
fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Update complete');
