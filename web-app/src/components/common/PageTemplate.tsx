export function PageTemplate({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ paddingTop: '160px', minHeight: '80vh' }} className="wrap">
      <h1 style={{ marginTop: '24px', fontSize: 'clamp(40px, 6vw, 80px)' }}>{title}</h1>
      <p style={{ marginTop: '24px', fontSize: '20px', maxWidth: '60ch', opacity: 0.8 }}>{subtitle}</p>
      <div style={{ marginTop: '64px', padding: '64px', border: '1px solid var(--line)', borderRadius: '24px', textAlign: 'center', background: 'rgba(255,255,200,0.02)' }}>
        <p className="mono">Content in development</p>
      </div>
    </div>
  );
}

export default PageTemplate;
