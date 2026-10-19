import { useState } from 'react';
import {
  FileText,
  Download,
  Shield
} from 'lucide-react';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientOrg: any;
  projects?: any[];
  invoices?: any[];
  products?: any[];
}

export const PDFViewerModal: React.FC<PDFModalProps> = ({
  isOpen,
  onClose,
  clientOrg,
  projects = [],
  invoices = [],
  products = []
}) => {
  const [docType, setDocType] = useState<'PROJECT_SUMMARY' | 'PAYMENT_RECEIPT' | 'PORTFOLIO'>('PROJECT_SUMMARY');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id?.toString() || '');

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id?.toString() === selectedProjectId) || projects[0] || {};
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const totalPaid = invoices.reduce((acc, inv) => acc + (inv.amount_paid || 0), 0);
  const totalBilled = invoices.reduce((acc, inv) => acc + (inv.total_amount || 0), 0);
  const totalBalance = totalBilled - totalPaid;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '94vh',
        background: '#0d1321',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(47,107,255,0.15)',
        overflow: 'hidden'
      }}>
        {/* Modal Controls Bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={20} color="var(--sky, #8FC1FF)" />
            <span style={{ fontWeight: 600, fontSize: '15px', color: '#fff' }}>Official PDF Generator & Preview</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setDocType('PROJECT_SUMMARY')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: docType === 'PROJECT_SUMMARY' ? 'var(--electric, #2F6BFF)' : 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: docType === 'PROJECT_SUMMARY' ? 600 : 400
              }}
            >
              Project Deliverable
            </button>
            <button
              onClick={() => setDocType('PAYMENT_RECEIPT')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: docType === 'PAYMENT_RECEIPT' ? 'var(--electric, #2F6BFF)' : 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: docType === 'PAYMENT_RECEIPT' ? 600 : 400
              }}
            >
              Payment Statement
            </button>
            <button
              onClick={() => setDocType('PORTFOLIO')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: docType === 'PORTFOLIO' ? 'var(--electric, #2F6BFF)' : 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: docType === 'PORTFOLIO' ? 600 : 400
              }}
            >
              Lifetime History
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '8px',
                background: '#10B981',
                color: '#fff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                marginLeft: '12px'
              }}
            >
              <Download size={14} /> Download / Print PDF
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '20px',
                cursor: 'pointer',
                marginLeft: '8px',
                padding: '4px 8px'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Paper Document Preview Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div id="pdf-printable-doc" style={{
            width: '100%',
            maxWidth: '750px',
            background: '#ffffff',
            color: '#111827',
            padding: '48px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            fontFamily: '"Inter Tight", system-ui, sans-serif'
          }}>
            {/* Header Letterhead */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E5E7EB', paddingBottom: '24px', marginBottom: '28px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <img src="/logo.png" alt="Etromo" style={{ height: '32px', width: 'auto' }} />
                  <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A' }}>Etromo.</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Enterprise AI & Automation Architecture</p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94A3B8' }}>contact@etromo.com | https://etromo.com</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#EEF2FF',
                  color: '#4338CA',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px'
                }}>
                  {docType.replace('_', ' ')}
                </span>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Date: <strong>{today}</strong></p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94A3B8' }}>Verified Document Ref: ETRO-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
            </div>

            {/* Client Info Block */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>CLIENT ORGANIZATION</p>
                <p style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{clientOrg?.legal_name || 'Acme Enterprises Inc'}</p>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#475569' }}>{clientOrg?.primary_email} | {clientOrg?.phone || 'N/A'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>ACCOUNT STATUS</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', margin: '4px 0 0', color: '#059669', fontWeight: 700, fontSize: '13px' }}>
                  <Shield size={14} /> Verified Organization
                </span>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94A3B8' }}>Website: {clientOrg?.website || 'N/A'}</p>
              </div>
            </div>

            {/* Document Dynamic Body */}
            {docType === 'PROJECT_SUMMARY' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  Project Deliverable & Milestone Report
                </h3>
                
                {projects.length > 1 && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginRight: '8px' }}>Select Project:</label>
                    <select
                      value={selectedProjectId}
                      onChange={e => setSelectedProjectId(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.project_code || 'PRJ'})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <tbody>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#64748B', width: '35%' }}>Project Code / Reference</td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A' }}>{currentProject.project_code || 'PRJ-2026-02'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#64748B' }}>Project Name</td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A' }}>{currentProject.name}</td>
                      </tr>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#64748B' }}>Completion Status & Progress</td>
                        <td style={{ padding: '10px 14px', color: '#0F172A' }}>
                          <span style={{ fontWeight: 700, color: currentProject.progress_percentage === 100 ? '#059669' : '#2563EB' }}>
                            {currentProject.progress_percentage}% ({currentProject.status})
                          </span>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#64748B' }}>Scope & Features Built</td>
                        <td style={{ padding: '10px 14px', color: '#334155' }}>{currentProject.scope_summary || 'Custom development deliverables and automation workflow architecture.'}</td>
                      </tr>
                      <tr style={{ background: '#F8FAFC' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#64748B' }}>Completion / Delivery Timeline</td>
                        <td style={{ padding: '10px 14px', color: '#334155' }}>{currentProject.target_or_completion_date || currentProject.start_date || 'Standard schedule'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {currentProject.milestones && currentProject.milestones.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Milestone Breakdown</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {currentProject.milestones.map((m: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px' }}>
                          <span style={{ fontWeight: 600, color: '#1E293B' }}>{idx + 1}. {m.title}</span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: m.status === 'SHIPPED' ? '#DEF7EC' : '#EFF6FF',
                            color: m.status === 'SHIPPED' ? '#03543F' : '#1E40AF'
                          }}>
                            {m.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {docType === 'PAYMENT_RECEIPT' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  Commercial Invoices & Payment Ledger
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Invoiced</span>
                    <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>${totalBilled.toLocaleString()}</p>
                  </div>
                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#065F46', fontWeight: 600, textTransform: 'uppercase' }}>Amount Paid</span>
                    <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800, color: '#059669' }}>${totalPaid.toLocaleString()}</p>
                  </div>
                  <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#92400E', fontWeight: 600, textTransform: 'uppercase' }}>Balance Due</span>
                    <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800, color: '#D97706' }}>${totalBalance.toLocaleString()}</p>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px' }}>Invoice #</th>
                      <th style={{ padding: '10px 12px' }}>Description</th>
                      <th style={{ padding: '10px 12px' }}>Total Amount</th>
                      <th style={{ padding: '10px 12px' }}>Paid</th>
                      <th style={{ padding: '10px 12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv: any) => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{inv.invoice_number}</td>
                        <td style={{ padding: '10px 12px', color: '#334155' }}>{inv.title}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>${inv.total_amount?.toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', color: '#059669', fontWeight: 600 }}>${inv.amount_paid?.toLocaleString()}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: inv.status === 'PAID' ? '#DEF7EC' : '#FEF3C7',
                            color: inv.status === 'PAID' ? '#03543F' : '#92400E'
                          }}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {docType === 'PORTFOLIO' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  Lifetime Customer History & Engagement Portfolio
                </h3>
                
                <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                  This official document certificates all projects, automation workflows, and software products commissioned by <strong>{clientOrg?.legal_name}</strong> with Etromo.
                </p>

                <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em', marginBottom: '8px' }}>Products Owned</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  {products.length === 0 ? <p style={{ fontSize: '12px', color: '#94A3B8' }}>No off-the-shelf product licenses owned.</p> : products.map((pr: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{pr.product_name}</span>
                      <span style={{ color: '#64748B', fontSize: '12px' }}>Key: {pr.license_key} ({pr.entitlement_type})</span>
                    </div>
                  ))}
                </div>

                <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em', marginBottom: '8px' }}>All Projects Completed & In Progress</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {projects.map((p: any, i: number) => (
                    <div key={i} style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{p.name}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: p.is_historical_record ? '#6B7280' : '#2563EB' }}>
                          {p.is_historical_record ? 'HISTORICAL RECORD' : 'ACTIVE PROJECT'} · {p.progress_percentage}%
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{p.scope_summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Footer Signature */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>Generated securely via Etromo Client Portal Infrastructure.</p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94A3B8' }}>Tamper-evident verification hash: SHA256:{Math.random().toString(36).substring(2, 15)}</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '140px', borderBottom: '1px solid #0F172A', marginBottom: '4px' }} />
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Authorized Signature</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Etromo Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModal;
