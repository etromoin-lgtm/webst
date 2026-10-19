export function FormInput({
  label,
  name,
  type = "text",
  required = true
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        {label} {required && '*'}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        style={{
          padding: '12px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: '#fff'
        }}
      />
    </div>
  );
}

export default FormInput;
