import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Send,
  Edit2,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import PDFViewerModal from '../portal/PDFViewerModal';

interface Props {
  apiBase: string;
}

export function AdminClientManager({ apiBase }: Props) {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Sub-tab inside client profile
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'products' | 'invoices' | 'claims' | 'messages'>('overview');

  // Modal forms
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Edit / Delete Project State
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editScope, setEditScope] = useState('');
  const [editType, setEditType] = useState('CUSTOM_DEV');
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState('IN_PROGRESS');
  const [editCompletionDate, setEditCompletionDate] = useState('');
  const [editIsHistorical, setEditIsHistorical] = useState(false);
  const [deletingProject, setDeletingProject] = useState<any | null>(null);

  // Add Project Form State
  const [projectName, setProjectName] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [projectType, setProjectType] = useState('CUSTOM_DEV');
  const [projectProgress, setProjectProgress] = useState(0);
  const [projectStatus, setProjectStatus] = useState('IN_PROGRESS');
  const [isHistorical, setIsHistorical] = useState(false);
  const [completionDate, setCompletionDate] = useState('');

  // Add Product Form State
  const [productName, setProductName] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [entitlementType, setEntitlementType] = useState('LIFETIME');
  const [pricePaid, setPricePaid] = useState('$1,200');

  // Add Invoice Form State
  const [invTitle, setInvTitle] = useState('');
  const [invTotal, setInvTotal] = useState(5000);
  const [invPaid, setInvPaid] = useState(2500);
  const [invStatus, setInvStatus] = useState('PARTIAL');

  // Message Form State
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgPriority, setMsgPriority] = useState('NORMAL');

  // Fetch all clients
  const loadClients = async () => {
    try {
      const res = await fetch(`${apiBase}/api/portal/admin/clients`);
      const data = await res.json();
      if (data.success) {
        setClients(data.clients || []);
        if (data.clients.length > 0 && !selectedClientId) {
          setSelectedClientId(data.clients[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load clients', err);
    }
  };

  // Fetch full profile of selected client
  const loadClientProfile = async (orgId: number) => {
    setProfileLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/portal/admin/clients/${orgId}`);
      const data = await res.json();
      if (data.success) {
        setClientProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to load client profile', err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      loadClientProfile(selectedClientId);
    }
  }, [selectedClientId]);

  // Handle Add Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !projectName) return;

    try {
      const res = await fetch(`${apiBase}/api/portal/admin/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedClientId,
          name: projectName,
          scope_summary: projectScope,
          project_type: projectType,
          progress_percentage: Number(projectProgress),
          status: projectStatus,
          is_historical_record: isHistorical ? 1 : 0,
          target_or_completion_date: completionDate
        })
      });
      if (res.ok) {
        setShowAddProjectModal(false);
        setProjectName('');
        setProjectScope('');
        loadClientProfile(selectedClientId);
        loadClients();
      }
    } catch (e) {
      alert('Error creating project');
    }
  };

  // Handle Quick Status Change
  const handleQuickStatusChange = async (projectId: number, newStatus: string) => {
    try {
      await fetch(`${apiBase}/api/portal/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (selectedClientId) loadClientProfile(selectedClientId);
      loadClients();
    } catch (e) {
      alert('Error updating status');
    }
  };

  // Handle Quick Progress Update
  const handleUpdateProgress = async (projectId: number, newPercent: number, newStatus?: string) => {
    try {
      const payload: any = { progress_percentage: newPercent };
      if (newStatus) payload.status = newStatus;
      await fetch(`${apiBase}/api/portal/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (selectedClientId) loadClientProfile(selectedClientId);
      loadClients();
    } catch (e) {
      alert('Error updating progress');
    }
  };

  // Open Edit Project Modal
  const openEditProjectModal = (p: any) => {
    setEditingProject(p);
    setEditName(p.name || '');
    setEditScope(p.scope_summary || '');
    setEditType(p.project_type || 'CUSTOM_DEV');
    setEditProgress(p.progress_percentage || 0);
    setEditStatus(p.status || 'IN_PROGRESS');
    setEditCompletionDate(p.target_or_completion_date || '');
    setEditIsHistorical(p.is_historical_record === 1);
  };

  // Save Project Edits
  const handleSaveEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const res = await fetch(`${apiBase}/api/portal/admin/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          scope_summary: editScope,
          project_type: editType,
          progress_percentage: Number(editProgress),
          status: editStatus,
          target_or_completion_date: editCompletionDate,
          is_historical_record: editIsHistorical ? 1 : 0
        })
      });

      if (res.ok) {
        setEditingProject(null);
        if (selectedClientId) loadClientProfile(selectedClientId);
        loadClients();
      } else {
        alert('Failed to save project edits');
      }
    } catch (err) {
      alert('Error saving project edits');
    }
  };

  // Confirm and Delete Project
  const handleConfirmDeleteProject = async () => {
    if (!deletingProject) return;

    try {
      const res = await fetch(`${apiBase}/api/portal/admin/projects/${deletingProject.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setDeletingProject(null);
        if (selectedClientId) loadClientProfile(selectedClientId);
        loadClients();
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      alert('Error deleting project');
    }
  };

  // Handle Add Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !productName) return;

    try {
      const res = await fetch(`${apiBase}/api/portal/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedClientId,
          product_name: productName,
          license_key: licenseKey,
          entitlement_type: entitlementType,
          price_paid: pricePaid
        })
      });
      if (res.ok) {
        setShowAddProductModal(false);
        setProductName('');
        setLicenseKey('');
        loadClientProfile(selectedClientId);
        loadClients();
      }
    } catch (e) {
      alert('Error assigning product');
    }
  };

  // Handle Add Invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !invTitle) return;

    try {
      const res = await fetch(`${apiBase}/api/portal/admin/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedClientId,
          title: invTitle,
          total_amount: Number(invTotal),
          amount_paid: Number(invPaid),
          status: invStatus
        })
      });
      if (res.ok) {
        setShowAddInvoiceModal(false);
        setInvTitle('');
        loadClientProfile(selectedClientId);
      }
    } catch (e) {
      alert('Error creating invoice');
    }
  };

  // Handle Direct Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !msgTitle || !msgBody) return;

    try {
      const res = await fetch(`${apiBase}/api/portal/admin/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedClientId,
          sender_name: 'Etromo Engineering Team',
          title: msgTitle,
          message_body: msgBody,
          priority: msgPriority
        })
      });
      if (res.ok) {
        setShowMessageModal(false);
        setMsgTitle('');
        setMsgBody('');
        loadClientProfile(selectedClientId);
      }
    } catch (e) {
      alert('Error sending message');
    }
  };

  // Handle Review Claim
  const handleReviewClaim = async (claimId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await fetch(`${apiBase}/api/portal/admin/claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          admin_decision_notes: `Claim ${status.toLowerCase()} by admin on ${new Date().toLocaleDateString()}`
        })
      });
      if (selectedClientId) {
        loadClientProfile(selectedClientId);
        loadClients();
      }
    } catch (e) {
      alert('Error updating claim');
    }
  };

  const org = clientProfile?.organization;
  const projects = clientProfile?.projects || [];
  const products = clientProfile?.products || [];
  const invoices = clientProfile?.invoices || [];
  const claims = clientProfile?.claims || [];
  const messages = clientProfile?.messages || [];
  const tickets = clientProfile?.tickets || [];
  const audits = clientProfile?.audits || [];

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#fff' }}>B2B Client Portal & History Manager</h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            Manage client categories (Products, Historical & Active Projects), verify questionnaire claims, update progress and trigger PDFs.
          </p>
        </div>

        {org && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowPDFModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'rgba(47, 107, 255, 0.15)',
                border: '1px solid rgba(47, 107, 255, 0.4)',
                color: 'var(--sky, #8FC1FF)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <FileText size={15} /> Generate Official PDF
            </button>
            <button
              onClick={() => setShowMessageModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'var(--electric, #2F6BFF)',
                border: 'none',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Send size={15} /> Send Direct Message
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Left Directory + Right Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Left: Clients List */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
              REGISTERED CLIENTS ({clients.length})
            </span>
          </div>

          {clients.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedClientId(c.id)}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: selectedClientId === c.id ? 'rgba(47, 107, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                border: selectedClientId === c.id ? '1px solid rgba(143, 193, 255, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>{c.legal_name}</span>
                {c.pending_claims_count > 0 && (
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#F59E0B', color: '#000', fontWeight: 800 }}>
                    CLAIM PENDING
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{c.primary_email}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                <span>📁 {c.project_count} Projects</span>
                <span>📦 {c.product_count} Products</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Client Profile Workspace */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          {profileLoading || !org ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading client details...</div>
          ) : (
            <div>
              {/* Client Top Header Lockup */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#fff' }}>{org.legal_name}</h3>
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: org.verification_status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: org.verification_status === 'VERIFIED' ? '#34D399' : '#FBBF24',
                      fontWeight: 700
                    }}>
                      {org.verification_status}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                    Primary: {org.primary_email} · Phone: {org.phone || 'N/A'} · Web: {org.website || 'N/A'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowAddProjectModal(true)}
                    style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Add Project
                  </button>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Add Product
                  </button>
                  <button
                    onClick={() => setShowAddInvoiceModal(true)}
                    style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Log Invoice
                  </button>
                </div>
              </div>

              {/* Sub-nav Tabs */}
              <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '20px' }}>
                {[
                  { id: 'overview', label: `Overview & Metrics` },
                  { id: 'projects', label: `Projects (${projects.length})` },
                  { id: 'products', label: `Products (${products.length})` },
                  { id: 'invoices', label: `Invoices (${invoices.length})` },
                  { id: 'claims', label: `History Claims (${claims.length})` },
                  { id: 'messages', label: `Direct Messages (${messages.length})` }
                ].map((t: any) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: activeTab === t.id ? 'rgba(47, 107, 255, 0.15)' : 'transparent',
                      color: activeTab === t.id ? 'var(--sky, #8FC1FF)' : 'rgba(255,255,255,0.6)',
                      fontSize: '13px',
                      fontWeight: activeTab === t.id ? 700 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW & AUDIT */}
              {activeTab === 'overview' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Active Projects</span>
                      <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: 800, color: 'var(--electric, #2F6BFF)' }}>
                        {projects.filter((p: any) => p.status === 'IN_PROGRESS').length}
                      </p>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Completed / Historical</span>
                      <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: 800, color: '#34D399' }}>
                        {projects.filter((p: any) => p.status === 'COMPLETED' || p.is_historical_record === 1).length}
                      </p>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Products Owned</span>
                      <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: 800, color: 'var(--sky, #8FC1FF)' }}>
                        {products.length}
                      </p>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Open Tickets</span>
                      <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: 800, color: '#FBBF24' }}>
                        {tickets.filter((t: any) => t.status !== 'RESOLVED').length}
                      </p>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Audit Log & Historical Timeline</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {audits.map((a: any) => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--sky, #8FC1FF)', marginRight: '8px' }}>{a.action}</span>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>{a.details}</span>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{a.created_at}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS (ACTIVE & HISTORICAL) */}
              {activeTab === 'projects' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {projects.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>No projects assigned yet.</p>
                      <button
                        onClick={() => setShowAddProjectModal(true)}
                        style={{ marginTop: '12px', padding: '6px 14px', borderRadius: '8px', background: 'var(--electric, #2F6BFF)', color: '#fff', border: 'none', fontSize: '13px', cursor: 'pointer' }}
                      >
                        + Add First Project
                      </button>
                    </div>
                  ) : (
                    projects.map((p: any) => (
                      <div key={p.id} style={{ padding: '18px', borderRadius: '12px', background: 'rgba(10, 21, 48, 0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: p.is_historical_record ? 'rgba(255,255,255,0.1)' : 'rgba(47, 107, 255, 0.2)', color: p.is_historical_record ? 'rgba(255,255,255,0.6)' : 'var(--sky, #8FC1FF)', fontWeight: 700 }}>
                                {p.is_historical_record ? 'HISTORICAL RECORD' : 'ACTIVE PROJECT'}
                              </span>
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{p.project_code}</span>
                              <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                                {p.project_type || 'CUSTOM_DEV'}
                              </span>
                            </div>
                            <h4 style={{ margin: 0, fontSize: '17px', color: '#fff', fontWeight: 700 }}>{p.name}</h4>
                          </div>

                          {/* Quick Process Status Changer & Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {/* Inline Process Status Dropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Status:</span>
                              <select
                                value={p.status}
                                onChange={(e) => handleQuickStatusChange(p.id, e.target.value)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '8px',
                                  background: 'rgba(5, 8, 15, 0.9)',
                                  border: '1px solid rgba(143, 193, 255, 0.3)',
                                  color: p.status === 'COMPLETED' ? '#34D399' : p.status === 'IN_PROGRESS' ? 'var(--sky, #8FC1FF)' : p.status === 'IN_REVIEW' ? '#FBBF24' : '#fff',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  outline: 'none'
                                }}
                              >
                                <option value="PLANNING">Planning & Scope</option>
                                <option value="IN_PROGRESS">In Development</option>
                                <option value="IN_REVIEW">QA & Review</option>
                                <option value="COMPLETED">Delivered / Complete</option>
                                <option value="ON_HOLD">On Hold</option>
                              </select>
                            </div>

                            {/* Edit Button */}
                            <button
                              onClick={() => openEditProjectModal(p)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '5px 10px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: 'var(--sky, #8FC1FF)',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                              title="Edit Project Details"
                            >
                              <Edit2 size={13} /> Edit
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setDeletingProject(p)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '5px 10px',
                                borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#F87171',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                              title="Delete Project"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>

                        <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                          {p.scope_summary || 'No scope details specified.'}
                        </p>

                        {/* Interactive Progress Bar & Quick Adjust */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Progress:</span>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--sky, #8FC1FF)' }}>{p.progress_percentage}%</span>
                            {p.target_or_completion_date && (
                              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginLeft: '12px' }}>
                                Target / Delivered: <strong>{p.target_or_completion_date}</strong>
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => handleUpdateProgress(p.id, Math.max(0, p.progress_percentage - 10))}
                              style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
                            >
                              -10%
                            </button>
                            <button
                              onClick={() => handleUpdateProgress(p.id, Math.min(100, p.progress_percentage + 10), p.progress_percentage + 10 >= 100 ? 'COMPLETED' : undefined)}
                              style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
                            >
                              +10%
                            </button>
                            {p.progress_percentage < 100 && (
                              <button
                                onClick={() => handleUpdateProgress(p.id, 100, 'COMPLETED')}
                                style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                              >
                                Mark 100%
                              </button>
                            )}
                          </div>
                        </div>

                        <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${p.progress_percentage}%`,
                            background: p.status === 'COMPLETED' ? '#10B981' : 'linear-gradient(90deg, var(--electric, #2F6BFF), var(--sky, #8FC1FF))',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: PRODUCTS */}
              {activeTab === 'products' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {products.map((pr: any) => (
                    <div key={pr.id} style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--sky, #8FC1FF)', fontWeight: 700 }}>{pr.entitlement_type}</span>
                      <h4 style={{ margin: '4px 0', fontSize: '15px', color: '#fff' }}>{pr.product_name}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>Key: {pr.license_key}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#34D399' }}>Paid: {pr.price_paid || '$0'}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: INVOICES */}
              {activeTab === 'invoices' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {invoices.map((inv: any) => (
                    <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--sky, #8FC1FF)', fontWeight: 700 }}>{inv.invoice_number}</span>
                        <h4 style={{ margin: '2px 0 0', fontSize: '14px', color: '#fff' }}>{inv.title}</h4>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>${inv.total_amount}</span>
                        <p style={{ margin: 0, fontSize: '11px', color: '#34D399' }}>Paid: ${inv.amount_paid} ({inv.status})</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: CLAIMS REVIEW */}
              {activeTab === 'claims' && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                    Customer Previous Work Claims Requiring Review
                  </h4>
                  {claims.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>No previous work claims declared by this customer.</p>
                  ) : (
                    claims.map((c: any) => (
                      <div key={c.id} style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: 'var(--sky, #8FC1FF)', fontWeight: 700 }}>TYPE: {c.claim_type}</span>
                            <h4 style={{ margin: '2px 0', fontSize: '16px', color: '#fff' }}>{c.declared_name}</h4>
                            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                              Ref: {c.declared_reference_number || 'None'} · Old Email: {c.declared_old_email} · Date: {c.approximate_date}
                            </p>
                          </div>
                          <div>
                            <span style={{
                              fontSize: '11px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: c.verification_status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: c.verification_status === 'APPROVED' ? '#34D399' : '#FBBF24',
                              fontWeight: 700
                            }}>
                              {c.verification_status}
                            </span>
                          </div>
                        </div>

                        {c.notes && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', margin: '0 0 12px' }}>"{c.notes}"</p>}

                        {c.verification_status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleReviewClaim(c.id, 'APPROVED')}
                              style={{ padding: '6px 14px', borderRadius: '6px', background: '#10B981', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              ✓ Approve & Link Historical Record
                            </button>
                            <button
                              onClick={() => handleReviewClaim(c.id, 'REJECTED')}
                              style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#F87171', fontSize: '12px', cursor: 'pointer' }}
                            >
                              ✕ Reject Claim
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 6: MESSAGES */}
              {activeTab === 'messages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {messages.map((m: any) => (
                    <div key={m.id} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{m.title}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{m.created_at}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{m.message_body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD PROJECT */}
      {showAddProjectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '540px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Add Project / Historical Work</h3>
            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real Estate WhatsApp Bot"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Scope & Features</label>
                <textarea
                  rows={3}
                  placeholder="Details of the deliverable..."
                  value={projectScope}
                  onChange={e => setProjectScope(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Project Type</label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  >
                    <option value="CUSTOM_DEV">Custom Development</option>
                    <option value="AUTOMATION">Automation Workflow</option>
                    <option value="CRM_INTEGRATION">CRM Integration</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Target or Completion Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-06-30"
                    value={completionDate}
                    onChange={e => setCompletionDate(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Progress %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={projectProgress}
                    onChange={e => setProjectProgress(Number(e.target.value))}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Status</label>
                  <select
                    value={projectStatus}
                    onChange={e => setProjectStatus(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  >
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="IN_REVIEW">Under Review</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="hist_check"
                  checked={isHistorical}
                  onChange={e => setIsHistorical(e.target.checked)}
                />
                <label htmlFor="hist_check" style={{ fontSize: '13px', color: '#fff', cursor: 'pointer' }}>
                  Mark as Pre-Portal / Historical Offline Record
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--electric, #2F6BFF)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Assign Product License</h3>
            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WhatsApp Business CRM Suite"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>License Key (Optional, auto-generated if blank)</label>
                <input
                  type="text"
                  placeholder="ETRO-WA-XXXX-X"
                  value={licenseKey}
                  onChange={e => setLicenseKey(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Entitlement Type</label>
                  <select
                    value={entitlementType}
                    onChange={e => setEntitlementType(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  >
                    <option value="LIFETIME">Lifetime License</option>
                    <option value="ANNUAL">Annual Subscription</option>
                    <option value="WARRANTY">Extended Warranty</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Price Billed</label>
                  <input
                    type="text"
                    value={pricePaid}
                    onChange={e => setPricePaid(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--electric, #2F6BFF)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Assign Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD INVOICE */}
      {showAddInvoiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Log Commercial Invoice</h3>
            <form onSubmit={handleCreateInvoice}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Invoice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CRM Integration Milestone 1"
                  value={invTitle}
                  onChange={e => setInvTitle(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Total Amount ($)</label>
                  <input
                    type="number"
                    value={invTotal}
                    onChange={e => setInvTotal(Number(e.target.value))}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Amount Paid ($)</label>
                  <input
                    type="number"
                    value={invPaid}
                    onChange={e => setInvPaid(Number(e.target.value))}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Payment Status</label>
                <select
                  value={invStatus}
                  onChange={e => setInvStatus(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                >
                  <option value="PAID">Fully Paid</option>
                  <option value="PARTIAL">Partially Paid</option>
                  <option value="DUE">Payment Due</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--electric, #2F6BFF)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DIRECT MESSAGE */}
      {showMessageModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Send Direct Client Alert / Notice</h3>
            <form onSubmit={handleSendMessage}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Notification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milestone 2 Ready for UAT Review"
                  value={msgTitle}
                  onChange={e => setMsgTitle(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Priority Level</label>
                <select
                  value={msgPriority}
                  onChange={e => setMsgPriority(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                >
                  <option value="NORMAL">Normal Notice</option>
                  <option value="URGENT">Urgent Action Required</option>
                  <option value="ANNOUNCEMENT">General Announcement</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Message Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Details for the client to see on their portal dashboard..."
                  value={msgBody}
                  onChange={e => setMsgBody(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--electric, #2F6BFF)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Dispatch Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROJECT */}
      {editingProject && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0e1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--sky, #8FC1FF)', fontFamily: 'monospace' }}>{editingProject.project_code}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '2px 0 0' }}>Edit Project Details</h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Project Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Scope & Features</label>
                <textarea
                  rows={3}
                  value={editScope}
                  onChange={e => setEditScope(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Project Type</label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  >
                    <option value="CUSTOM_DEV">Custom Development</option>
                    <option value="AUTOMATION">Automation Workflow</option>
                    <option value="CRM_INTEGRATION">CRM Integration</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Target or Completion Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-06-30"
                    value={editCompletionDate}
                    onChange={e => setEditCompletionDate(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Progress Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editProgress}
                    onChange={e => setEditProgress(Number(e.target.value))}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Process Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff' }}
                  >
                    <option value="PLANNING">Planning & Scope</option>
                    <option value="IN_PROGRESS">In Development</option>
                    <option value="IN_REVIEW">QA & Review</option>
                    <option value="COMPLETED">Delivered / Complete</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="edit_hist_check"
                  checked={editIsHistorical}
                  onChange={e => setEditIsHistorical(e.target.checked)}
                />
                <label htmlFor="edit_hist_check" style={{ fontSize: '13px', color: '#fff', cursor: 'pointer' }}>
                  Mark as Historical / Completed Deliverable
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', background: 'var(--electric, #2F6BFF)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE PROJECT CONFIRMATION */}
      {deletingProject && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#120d15', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#F87171' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>Delete Project</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: '0 0 8px' }}>
              Are you sure you want to permanently delete <strong>{deletingProject.name}</strong> ({deletingProject.project_code})?
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' }}>
              This will remove all associated milestones and records from the client portal. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProject}
                style={{ padding: '8px 16px', borderRadius: '8px', background: '#DC2626', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Generation Modal */}
      {org && (
        <PDFViewerModal
          isOpen={showPDFModal}
          onClose={() => setShowPDFModal(false)}
          clientOrg={org}
          projects={projects}
          invoices={invoices}
          products={products}
        />
      )}
    </div>
  );
}

export default AdminClientManager;
