import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  FileText,
  CreditCard,
  LifeBuoy,
  PlusCircle,
  Building,
  Bell,
  LogOut,
  Download,
  Send,
  CheckCircle,
  FileCheck,
  Copy,
  Check,
  Key
} from 'lucide-react';
import PDFViewerModal from '../components/portal/PDFViewerModal';
import './ClientPortal.css';

export function ClientDashboardPage() {
  const navigate = useNavigate();
  const [token] = useState<string | null>(localStorage.getItem('client_token'));
  const [session] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem('client_session') || '{}');
    } catch {
      return {};
    }
  });

  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'products' | 'invoices' | 'documents' | 'support' | 'profile'
  >('overview');

  const [portalData, setPortalData] = useState<any>(null);
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  // New ticket state
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState('MEDIUM');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [ticketSubmitLoading, setTicketSubmitLoading] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState('');

  // New request state
  const [requestType, setRequestType] = useState('NEW_PROJECT');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  // Email / Message reply modal
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  const fetchDashboardData = async () => {
    if (!session?.organization_id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/dashboard/${session.organization_id}`);
      const json = await res.json();
      if (json.success) {
        setPortalData(json.data);
      }
    } catch (err) {
      console.error('Failed to load portal data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success && json.products) {
        setCatalogProducts(json.products);
      }
    } catch (err) {
      console.error('Failed to load catalog products', err);
    }
  };

  useEffect(() => {
    if (!token || !session?.organization_id) {
      navigate('/portal/login');
      return;
    }
    fetchDashboardData();
    fetchCatalogProducts();
  }, [token, session?.organization_id]);

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_session');
    navigate('/portal/login');
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMessage) return;

    setTicketSubmitLoading(true);
    setTicketSuccess('');
    try {
      const res = await fetch('/api/portal/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: session.organization_id,
          user_id: session.id,
          subject: newTicketSubject,
          priority: newTicketPriority,
          initial_message: newTicketMessage
        })
      });

      const data = await res.json();
      if (data.success) {
        setTicketSuccess(`Support Ticket #${data.ticket_code} created successfully! Our team is reviewing it.`);
        setNewTicketSubject('');
        setNewTicketMessage('');
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to submit ticket');
    } finally {
      setTicketSubmitLoading(false);
    }
  };

  const handleSendTicketReply = async (ticketId: number) => {
    if (!ticketReplyText.trim()) return;
    try {
      await fetch(`/api/portal/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: session.full_name || 'Client',
          sender_role: 'CLIENT',
          message_body: ticketReplyText
        })
      });
      setTicketReplyText('');
      // Reload ticket details
      const refRes = await fetch(`/api/portal/tickets/${ticketId}`);
      const refJson = await refRes.json();
      if (refJson.success) {
        setSelectedTicket(refJson);
      }
      fetchDashboardData();
    } catch (e) {
      alert('Error sending reply');
    }
  };

  const openTicketConversation = async (t: any) => {
    try {
      const res = await fetch(`/api/portal/tickets/${t.id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedTicket(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderProjectProcessStepper = (status: string, progress: number) => {
    const normalizedStatus = (status || 'IN_PROGRESS').toUpperCase();

    let currentStage = 2;
    if (normalizedStatus === 'PLANNING') currentStage = 1;
    else if (normalizedStatus === 'IN_PROGRESS') currentStage = 2;
    else if (normalizedStatus === 'IN_REVIEW') currentStage = 3;
    else if (normalizedStatus === 'COMPLETED' || progress >= 100) currentStage = 4;

    const steps = [
      { num: '01', title: 'Scope & Architecture', desc: 'Blueprints, tech specs & APIs' },
      { num: '02', title: 'Development & Build', desc: 'Core engineering & integrations' },
      { num: '03', title: 'QA & Security Review', desc: 'Testing, verification & UAT' },
      { num: '04', title: 'Delivered & Handover', desc: 'Production deployment & keys' },
    ];

    return (
      <div style={{ marginTop: '16px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(244, 246, 249, 0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            Project Lifecycle Tracker
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 10px',
            borderRadius: '12px',
            fontWeight: 700,
            background: normalizedStatus === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(47, 107, 255, 0.15)',
            color: normalizedStatus === 'COMPLETED' ? '#34D399' : 'var(--sky, #8FC1FF)',
            border: `1px solid ${normalizedStatus === 'COMPLETED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(47, 107, 255, 0.3)'}`
          }}>
            Stage: {steps[currentStage - 1].title}
          </span>
        </div>

        <div className="portal-stepper">
          {steps.map((step, idx) => {
            const stepIndex = idx + 1;
            const isDone = stepIndex < currentStage || (currentStage === 4 && normalizedStatus === 'COMPLETED');
            const isCurrent = stepIndex === currentStage && normalizedStatus !== 'COMPLETED';

            return (
              <div
                key={step.num}
                className={`portal-step-item ${isDone ? 'completed' : isCurrent ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className="portal-step-num" style={{ color: isDone ? '#34D399' : isCurrent ? 'var(--sky, #8FC1FF)' : 'rgba(244, 246, 249, 0.35)' }}>
                    Phase {step.num}
                  </span>
                  {isDone ? (
                    <CheckCircle size={13} color="#34D399" />
                  ) : isCurrent ? (
                    <span style={{ height: '6px', width: '6px', borderRadius: '50%', background: 'var(--electric, #2F6BFF)', boxShadow: '0 0 6px #2F6BFF' }} />
                  ) : null}
                </div>
                <span className="portal-step-name">{step.title}</span>
                <span style={{ fontSize: '11px', color: 'rgba(244, 246, 249, 0.4)', marginTop: '2px' }}>{step.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading && !portalData) {
    return (
      <div className="portal-dash-root" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ opacity: 0.6 }}>Loading your verified client dashboard...</p>
      </div>
    );
  }

  const org = portalData?.organization || session;
  const products = portalData?.products || [];
  const projects = portalData?.projects || [];
  const invoices = portalData?.invoices || [];
  const documents = portalData?.documents || [];
  const tickets = portalData?.tickets || [];
  const messages = portalData?.messages || [];
  const claims = portalData?.claims || [];
  const financials = portalData?.financials || { totalBilled: 0, totalPaid: 0, totalBalance: 0 };

  const unreadMessagesCount = messages.filter((m: any) => m.is_read === 0).length;
  const activeProjects = projects.filter((p: any) => p.status === 'IN_PROGRESS' || p.status === 'PLANNING' || p.status === 'IN_REVIEW');
  const completedProjects = projects.filter((p: any) => p.status === 'COMPLETED' || p.is_historical_record === 1);

  const filteredProjects = projects.filter((p: any) => {
    if (projectFilter === 'ACTIVE') return p.status !== 'COMPLETED' && !p.is_historical_record;
    if (projectFilter === 'COMPLETED') return p.status === 'COMPLETED' || p.is_historical_record === 1;
    return true;
  });

  return (
    <div className="portal-dash-root">
      {/* Top Header Bar */}
      <header className="portal-dash-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, textDecoration: 'none' }}>
            <img src="/logo.png" alt="Etromo" style={{ height: '28px', width: 'auto' }} />
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: 'var(--brand-font)' }}>
              Etromo<span style={{ color: 'var(--electric, #2F6BFF)' }}>.</span>
            </span>
          </Link>
          <span style={{ height: '18px', width: '1px', background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span style={{
              fontWeight: 600,
              fontSize: '14px',
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '240px'
            }}>
              {org.legal_name}
            </span>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '20px',
              background: org.verification_status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: org.verification_status === 'VERIFIED' ? '#34D399' : '#FBBF24',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              {org.verification_status === 'VERIFIED' ? 'Verified' : 'Pending'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={() => setPdfModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Download size={14} color="var(--sky, #8FC1FF)" /> PDF Handover
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#F87171',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="portal-dash-container">
        {/* Unread Alert Notification Banner if any */}
        {unreadMessagesCount > 0 && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(47, 107, 255, 0.2) 0%, rgba(143, 193, 255, 0.1) 100%)',
            border: '1px solid rgba(143, 193, 255, 0.3)',
            borderRadius: '12px',
            padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={18} color="var(--sky, #8FC1FF)" />
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#fff' }}>
                  {messages[0]?.title || 'New Announcement from Etromo Engineering'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                  {messages[0]?.message_body}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('support')}
              style={{ padding: '6px 14px', borderRadius: '6px', background: 'var(--electric, #2F6BFF)', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              View In Center
            </button>
          </div>
        )}

        {/* Precise One-Word Website Navigation Tabs */}
        <div className="portal-navbar-tabs">
          <button className={`portal-tab-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={15} /> Overview
          </button>
          <button className={`portal-tab-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
            <Layers size={15} /> Projects {projects.length > 0 && <span style={{ opacity: 0.6, fontSize: '11px', marginLeft: '2px' }}>({projects.length})</span>}
          </button>
          <button className={`portal-tab-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Cpu size={15} /> Products
          </button>
          <button className={`portal-tab-item ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>
            <CreditCard size={15} /> Invoices
          </button>
          <button className={`portal-tab-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
            <FileText size={15} /> Documents {documents.length > 0 && <span style={{ opacity: 0.6, fontSize: '11px', marginLeft: '2px' }}>({documents.length})</span>}
          </button>
          <button className={`portal-tab-item ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
            <LifeBuoy size={15} /> Support {tickets.length > 0 && <span style={{ opacity: 0.6, fontSize: '11px', marginLeft: '2px' }}>({tickets.length})</span>}
          </button>
          <button className={`portal-tab-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <Building size={15} /> Profile
          </button>
        </div>

        {/* --- TAB 1: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div className="portal-stat-card">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Products Owned</span>
                <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 800, color: 'var(--sky, #8FC1FF)' }}>{products.length}</p>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Enterprise licenses active</span>
              </div>

              <div className="portal-stat-card">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Active Projects</span>
                <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 800, color: '#34D399' }}>{activeProjects.length}</p>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Currently in development</span>
              </div>

              <div className="portal-stat-card">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Completed / Historical</span>
                <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 800, color: '#F4F6F9' }}>{completedProjects.length}</p>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Verified lifetime works</span>
              </div>

              <div className="portal-stat-card">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Total Paid & Cleared</span>
                <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 800, color: '#FBBF24' }}>${financials.totalPaid?.toLocaleString()}</p>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  {financials.totalBalance > 0 ? `Pending: $${financials.totalBalance.toLocaleString()}` : 'No outstanding dues'}
                </span>
              </div>
            </div>

            {/* Active Engagement Highlight */}
            {activeProjects.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--sky, #8FC1FF)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE ENGAGEMENT TRACKER</span>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '4px 0 0', color: '#fff' }}>{activeProjects[0].name}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{activeProjects[0].scope_summary}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--electric, #2F6BFF)' }}>{activeProjects[0].progress_percentage}%</span>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Status: <strong>{activeProjects[0].status}</strong></p>
                  </div>
                </div>

                <div className="portal-progress-bar-bg" style={{ marginBottom: '12px' }}>
                  <div className="portal-progress-bar-fill" style={{ width: `${activeProjects[0].progress_percentage}%` }} />
                </div>

                {/* 4-Phase Process Stepper */}
                {renderProjectProcessStepper(activeProjects[0].status, activeProjects[0].progress_percentage)}

                {activeProjects[0].milestones && activeProjects[0].milestones.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '20px' }}>
                    {activeProjects[0].milestones.map((m: any, i: number) => (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{m.title}</span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '8px',
                            background: m.status === 'SHIPPED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(47, 107, 255, 0.2)',
                            color: m.status === 'SHIPPED' ? '#34D399' : 'var(--sky, #8FC1FF)'
                          }}>
                            {m.status}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{m.notes || 'In progress by development pod'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Action Bar */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setPdfModalOpen(true)} className="portal-primary-btn">
                <FileCheck size={16} /> Generate Work & Payment PDF
              </button>
              <button onClick={() => setActiveTab('support')} className="portal-secondary-btn">
                <LifeBuoy size={16} /> Raise Complaint / Ticket
              </button>
              <button onClick={() => setShowNewRequestModal(true)} className="portal-secondary-btn">
                <PlusCircle size={16} /> Commission New Feature / Project
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 2: PRODUCTS --- */}
        {activeTab === 'products' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>Products & Enterprise Solutions</h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                Explore active software suites developed by Etromo and manage your organization's active licenses.
              </p>
            </div>

            {/* Section A: Active Company Products Catalog (from website) */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Active Software Catalog
                  </h3>
                </div>
                <Link to="/products" style={{ fontSize: '12px', color: 'var(--sky, #8FC1FF)', textDecoration: 'none', fontWeight: 600 }}>
                  View Full Website Catalog &rarr;
                </Link>
              </div>

              {catalogProducts.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {catalogProducts.map((cp: any) => (
                    <div key={cp.id} className="portal-stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(47, 107, 255, 0.15)', color: 'var(--sky, #8FC1FF)', textTransform: 'uppercase' }}>
                            {cp.category || 'Enterprise Software'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 700 }}>
                            ● Active
                          </span>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{cp.name}</h4>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.4', margin: '0 0 14px' }}>
                          {cp.short_description || cp.description || 'Production-ready software system built and maintained by Etromo.'}
                        </p>

                        {cp.features && Array.isArray(cp.features) && cp.features.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                            {cp.features.slice(0, 3).map((f: any, idx: number) => (
                              <span key={idx} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)' }}>
                                {typeof f === 'string' ? f : f.name || f.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                        <button
                          onClick={() => {
                            setRequestType('NEW_PROJECT');
                            setRequestTitle(`License Request: ${cp.name}`);
                            setRequestDesc(`Requesting an enterprise license & deployment setup for ${cp.name}.`);
                            setShowNewRequestModal(true);
                          }}
                          className="portal-primary-btn"
                          style={{ flex: 1, padding: '7px 10px', fontSize: '12px', justifyContent: 'center' }}
                        >
                          Request License
                        </button>
                        <Link
                          to={`/products`}
                          style={{
                            padding: '7px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '12px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          Docs
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                    Loading active solutions... You can also browse the live <Link to="/products" style={{ color: 'var(--sky, #8FC1FF)' }}>Software Products Catalog</Link>.
                  </p>
                </div>
              )}
            </div>

            {/* Section B: Client Owned Licenses */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Key size={15} color="var(--sky, #8FC1FF)" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Your Active Product Licenses ({products.length})
                </h3>
              </div>

              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Cpu size={32} color="rgba(255,255,255,0.2)" style={{ marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>No Product Licenses Assigned Yet</h4>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', margin: '8px auto 16px' }}>
                    When you purchase or subscribe to any Etromo software suite, your cryptographic license key and entitlement records appear here.
                  </p>
                  <button
                    onClick={() => {
                      setRequestType('NEW_PROJECT');
                      setRequestTitle('Inquiry: Software License Acquisition');
                      setShowNewRequestModal(true);
                    }}
                    className="portal-secondary-btn"
                    style={{ fontSize: '12px' }}
                  >
                    Request License Quote
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                  {products.map((p: any) => (
                    <div key={p.id} className="portal-stat-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--sky, #8FC1FF)', fontWeight: 700, textTransform: 'uppercase' }}>{p.entitlement_type} LICENSE</span>
                          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '4px 0 0', color: '#fff' }}>{p.product_name}</h3>
                        </div>
                        <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 700 }}>
                          {p.status}
                        </span>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>Key: {p.license_key}</span>
                        <button
                          onClick={() => handleCopyKey(p.license_key)}
                          style={{
                            background: copiedKey === p.license_key ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)',
                            border: 'none',
                            borderRadius: '6px',
                            color: copiedKey === p.license_key ? '#34D399' : 'var(--sky, #8FC1FF)',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            flexShrink: 0
                          }}
                        >
                          {copiedKey === p.license_key ? (
                            <><Check size={12} /> Copied</>
                          ) : (
                            <><Copy size={12} /> Copy Key</>
                          )}
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setNewTicketSubject(`Inquiry regarding ${p.product_name}`);
                            setActiveTab('support');
                          }}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', cursor: 'pointer' }}
                        >
                          Raise Issue
                        </button>
                        <button
                          onClick={() => setPdfModalOpen(true)}
                          style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(47, 107, 255, 0.15)', border: '1px solid rgba(47, 107, 255, 0.3)', color: 'var(--sky, #8FC1FF)', fontSize: '12px', cursor: 'pointer' }}
                        >
                          License PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: MY PROJECTS --- */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>Active, Completed & Historical Projects</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  All custom software engineering, automation workflows and prior verified contracts.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Project Filter Pills */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    onClick={() => setProjectFilter('ALL')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '7px',
                      border: 'none',
                      background: projectFilter === 'ALL' ? 'var(--electric, #2F6BFF)' : 'transparent',
                      color: projectFilter === 'ALL' ? '#fff' : 'rgba(255,255,255,0.6)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    All ({projects.length})
                  </button>
                  <button
                    onClick={() => setProjectFilter('ACTIVE')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '7px',
                      border: 'none',
                      background: projectFilter === 'ACTIVE' ? 'var(--electric, #2F6BFF)' : 'transparent',
                      color: projectFilter === 'ACTIVE' ? '#fff' : 'rgba(255,255,255,0.6)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Active ({activeProjects.length})
                  </button>
                  <button
                    onClick={() => setProjectFilter('COMPLETED')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '7px',
                      border: 'none',
                      background: projectFilter === 'COMPLETED' ? 'var(--electric, #2F6BFF)' : 'transparent',
                      color: projectFilter === 'COMPLETED' ? '#fff' : 'rgba(255,255,255,0.6)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Completed ({completedProjects.length})
                  </button>
                </div>

                <button onClick={() => setShowNewRequestModal(true)} className="portal-primary-btn" style={{ fontSize: '13px' }}>
                  <PlusCircle size={14} /> Start New Project
                </button>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Layers size={36} color="rgba(255,255,255,0.2)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>No Projects Matching This Filter</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', margin: '8px auto 20px' }}>
                  Select another view or commission a new project pod with Etromo.
                </p>
                <button onClick={() => setShowNewRequestModal(true)} className="portal-primary-btn">
                  Start Your First Project
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredProjects.map((p: any) => (
                  <div key={p.id} className="portal-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: p.is_historical_record ? 'rgba(255,255,255,0.08)' : 'rgba(47, 107, 255, 0.2)',
                            color: p.is_historical_record ? 'rgba(255,255,255,0.6)' : 'var(--sky, #8FC1FF)'
                          }}>
                            {p.is_historical_record ? 'HISTORICAL RECORD' : 'ACTIVE PROJECT'}
                          </span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{p.project_code}</span>
                          <span style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            background: p.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(47, 107, 255, 0.15)',
                            color: p.status === 'COMPLETED' ? '#34D399' : 'var(--sky, #8FC1FF)'
                          }}>
                            Status: {p.status}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#fff' }}>{p.name}</h3>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: p.progress_percentage === 100 ? '#34D399' : 'var(--electric, #2F6BFF)' }}>
                          {p.progress_percentage}%
                        </span>
                        {p.target_or_completion_date && (
                          <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                            Target / Delivered: {p.target_or_completion_date}
                          </p>
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: '0 0 14px' }}>{p.scope_summary}</p>

                    <div className="portal-progress-bar-bg" style={{ marginBottom: '14px' }}>
                      <div className="portal-progress-bar-fill" style={{ width: `${p.progress_percentage}%` }} />
                    </div>

                    {/* 4-Phase Process Stepper */}
                    {renderProjectProcessStepper(p.status, p.progress_percentage)}

                    {p.milestones && p.milestones.length > 0 && (
                      <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: '8px' }}>
                          Key Deliverable Milestones
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                          {p.milestones.map((m: any, idx: number) => (
                            <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#fff' }}>{m.title}</span>
                              <span style={{ color: m.status === 'SHIPPED' ? '#34D399' : 'var(--sky, #8FC1FF)', fontWeight: 600 }}>{m.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 4: DOCUMENTS --- */}
        {activeTab === 'documents' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>Deliverables, Handover & Documents Archive</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  Download verified architecture documents, handover manuals and official PDF work certificates.
                </p>
              </div>
              <button onClick={() => setPdfModalOpen(true)} className="portal-primary-btn" style={{ fontSize: '13px' }}>
                <Download size={14} /> Open PDF Studio
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {documents.map((doc: any) => (
                <div key={doc.id} className="portal-stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--sky, #8FC1FF)', fontWeight: 700 }}>{doc.document_type}</span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{doc.version}</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 6px' }}>{doc.title}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Size: {doc.file_size || '1.5 MB'}</p>
                  </div>

                  <button
                    onClick={() => setPdfModalOpen(true)}
                    style={{
                      marginTop: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} /> View & Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 5: INVOICES --- */}
        {activeTab === 'invoices' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>Invoicing, Payments & Commercial Ledger</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  Transparent breakdown of all billed work cycles, payments received, and outstanding balances.
                </p>
              </div>
              <button onClick={() => setPdfModalOpen(true)} className="portal-primary-btn" style={{ fontSize: '13px' }}>
                <Download size={14} /> Download Statement PDF
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div className="portal-stat-card">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Total Invoiced</span>
                <p style={{ margin: '6px 0 0', fontSize: '26px', fontWeight: 800, color: '#fff' }}>${financials.totalBilled?.toLocaleString()}</p>
              </div>
              <div className="portal-stat-card">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Total Paid</span>
                <p style={{ margin: '6px 0 0', fontSize: '26px', fontWeight: 800, color: '#34D399' }}>${financials.totalPaid?.toLocaleString()}</p>
              </div>
              <div className="portal-stat-card">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Outstanding Balance</span>
                <p style={{ margin: '6px 0 0', fontSize: '26px', fontWeight: 800, color: financials.totalBalance > 0 ? '#FBBF24' : 'rgba(255,255,255,0.5)' }}>
                  ${financials.totalBalance?.toLocaleString()}
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                    <th style={{ padding: '14px 18px' }}>Invoice Number</th>
                    <th style={{ padding: '14px 18px' }}>Description</th>
                    <th style={{ padding: '14px 18px' }}>Due Date</th>
                    <th style={{ padding: '14px 18px' }}>Total Amount</th>
                    <th style={{ padding: '14px 18px' }}>Amount Paid</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{inv.invoice_number}</td>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.8)' }}>{inv.title}</td>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.5)' }}>{inv.due_date || 'Standard'}</td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#fff' }}>${inv.total_amount?.toLocaleString()}</td>
                      <td style={{ padding: '14px 18px', color: '#34D399', fontWeight: 600 }}>${inv.amount_paid?.toLocaleString()}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '10px',
                          background: inv.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: inv.status === 'PAID' ? '#34D399' : '#FBBF24'
                        }}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 6: SUPPORT & COMPLAINTS --- */}
        {activeTab === 'support' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1fr 1fr' : '1.3fr 1fr', gap: '24px' }}>
              {/* Existing Tickets List */}
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Support & Complaint Tickets</h2>
                {tickets.length === 0 ? (
                  <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>No support tickets raised yet. Everything running smoothly!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tickets.map((t: any) => (
                      <div
                        key={t.id}
                        onClick={() => openTicketConversation(t)}
                        style={{
                          background: selectedTicket?.ticket?.id === t.id ? 'rgba(47, 107, 255, 0.15)' : 'rgba(255,255,255,0.025)',
                          border: selectedTicket?.ticket?.id === t.id ? '1px solid var(--electric, #2F6BFF)' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--sky, #8FC1FF)', fontWeight: 700 }}>{t.ticket_code}</span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '8px',
                            background: t.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: t.status === 'RESOLVED' ? '#34D399' : '#FBBF24'
                          }}>
                            {t.status}
                          </span>
                        </div>
                        <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#fff' }}>{t.subject}</h4>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Priority: {t.priority} · Click to view messages</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ticket Details / Conversation or Raise New Ticket */}
              <div>
                {selectedTicket ? (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--sky, #8FC1FF)' }}>{selectedTicket.ticket.ticket_code}</span>
                        <h3 style={{ margin: '2px 0 0', fontSize: '16px', color: '#fff' }}>{selectedTicket.ticket.subject}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedTicket(null)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px' }}
                      >
                        ✕ Close
                      </button>
                    </div>

                    {/* Messages Scroll Area */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {selectedTicket.messages.map((msg: any) => (
                        <div
                          key={msg.id}
                          style={{
                            alignSelf: msg.sender_role === 'CLIENT' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            background: msg.sender_role === 'CLIENT' ? 'rgba(47, 107, 255, 0.2)' : 'rgba(255,255,255,0.06)',
                            border: msg.sender_role === 'CLIENT' ? '1px solid rgba(47, 107, 255, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '10px 14px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            <span style={{ fontWeight: 700, color: msg.sender_role === 'CLIENT' ? 'var(--sky, #8FC1FF)' : '#34D399' }}>
                              {msg.sender_name} ({msg.sender_role})
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '13px', color: '#fff', lineHeight: 1.4 }}>{msg.message_body}</p>
                        </div>
                      ))}
                    </div>

                    {/* Reply input */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Type a message or response..."
                        value={ticketReplyText}
                        onChange={e => setTicketReplyText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendTicketReply(selectedTicket.ticket.id)}
                        style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', padding: '10px 14px', fontSize: '13px' }}
                      />
                      <button
                        onClick={() => handleSendTicketReply(selectedTicket.ticket.id)}
                        className="portal-primary-btn"
                        style={{ padding: '10px 16px' }}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Raise Complaint or Support Query</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
                      Directly alert the assigned engineering pod. Real-time updates reflect in this thread.
                    </p>

                    {ticketSuccess && (
                      <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                        {ticketSuccess}
                      </div>
                    )}

                    <form onSubmit={handleCreateTicket}>
                      <div style={{ marginBottom: '16px' }}>
                        <label className="portal-field-label">Subject / Issue Summary *</label>
                        <div className="portal-input-container">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Webhook delivery issue or New Feature Bug"
                            value={newTicketSubject}
                            onChange={e => setNewTicketSubject(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label className="portal-field-label">Severity Level</label>
                        <select
                          value={newTicketPriority}
                          onChange={e => setNewTicketPriority(e.target.value)}
                          className="portal-input-container"
                          style={{ width: '100%', background: 'rgba(0,0,0,0.4)', color: '#fff' }}
                        >
                          <option value="LOW">Low - General Question</option>
                          <option value="MEDIUM">Medium - Normal Bug / Tweak</option>
                          <option value="HIGH">High - Urgent Production Issue</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label className="portal-field-label">Detailed Explanation *</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Describe the problem, steps to reproduce, or requested changes..."
                          value={newTicketMessage}
                          onChange={e => setNewTicketMessage(e.target.value)}
                          style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#fff', padding: '10px 14px', fontSize: '13px' }}
                        />
                      </div>

                      <button type="submit" disabled={ticketSubmitLoading} className="portal-primary-btn" style={{ width: '100%' }}>
                        {ticketSubmitLoading ? 'Submitting...' : 'Submit Support Ticket'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}



        {/* --- TAB 8: COMPANY PROFILE --- */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Organization Profile & Authorized Contacts</h2>
            <div className="portal-stat-card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Legal Organization Name</span>
                  <p style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: 700, color: '#fff' }}>{org.legal_name}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Registered Primary Email</span>
                  <p style={{ margin: '4px 0 0', fontSize: '15px', color: 'var(--sky, #8FC1FF)' }}>{org.primary_email}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Phone / WhatsApp</span>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#fff' }}>{org.phone || 'Not provided'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Website</span>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#fff' }}>{org.website || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Historical Claims Status if any */}
            {claims.length > 0 && (
              <div className="portal-stat-card">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>Previous Work Claims Status</h3>
                {claims.map((c: any) => (
                  <div key={c.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{c.declared_name}</span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: c.verification_status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: c.verification_status === 'APPROVED' ? '#34D399' : '#FBBF24'
                      }}>
                        {c.verification_status}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Ref: {c.declared_reference_number || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
 
       {/* Commission New Project / License Modal */}
       {showNewRequestModal && (
         <div className="portal-modal-overlay" onClick={() => setShowNewRequestModal(false)}>
           <div className="portal-modal-card" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <div>
                 <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Commission Project or Add License</h3>
                 <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                   Submit specifications directly to Etromo's engineering architects.
                 </p>
               </div>
               <button
                 onClick={() => {
                   setShowNewRequestModal(false);
                   setRequestSent(false);
                 }}
                 style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '18px' }}
               >
                 ✕
               </button>
             </div>

             {requestSent ? (
               <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '32px', textAlign: 'center' }}>
                 <CheckCircle size={40} color="#34D399" style={{ marginBottom: '14px' }} />
                 <h4 style={{ fontSize: '18px', color: '#fff', margin: '0 0 6px' }}>Request Submitted Successfully!</h4>
                 <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: '0 0 20px', lineHeight: '1.5' }}>
                   Our engineering team has received your project scope. A formal statement of work and architecture timeline will be linked to your portal.
                 </p>
                 <button
                   onClick={() => {
                     setShowNewRequestModal(false);
                     setRequestSent(false);
                     setRequestTitle('');
                     setRequestDesc('');
                   }}
                   className="portal-primary-btn"
                   style={{ margin: '0 auto' }}
                 >
                   Done
                 </button>
               </div>
             ) : (
               <form onSubmit={e => { e.preventDefault(); setRequestSent(true); }}>
                 <div style={{ marginBottom: '16px' }}>
                   <label className="portal-field-label">Request Type</label>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                     {[
                       { id: 'NEW_PROJECT', label: 'New Project' },
                       { id: 'ENHANCEMENT', label: 'Add-on Feature' },
                       { id: 'MAINTENANCE', label: 'License / SLA' }
                     ].map(r => (
                       <button
                         key={r.id}
                         type="button"
                         onClick={() => setRequestType(r.id)}
                         style={{
                           padding: '10px 8px',
                           borderRadius: '8px',
                           border: requestType === r.id ? '2px solid var(--electric, #2F6BFF)' : '1px solid rgba(255,255,255,0.1)',
                           background: requestType === r.id ? 'rgba(47, 107, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                           color: '#fff',
                           fontSize: '12px',
                           fontWeight: 600,
                           cursor: 'pointer'
                         }}
                       >
                         {r.label}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div style={{ marginBottom: '16px' }}>
                   <label className="portal-field-label">Title / Subject *</label>
                   <div className="portal-input-container">
                     <input
                       type="text"
                       required
                       placeholder="e.g. AI Customer Service Voice Agent or WhatsApp CRM License"
                       value={requestTitle}
                       onChange={e => setRequestTitle(e.target.value)}
                     />
                   </div>
                 </div>

                 <div style={{ marginBottom: '20px' }}>
                   <label className="portal-field-label">Scope & Business Goals *</label>
                   <textarea
                     rows={4}
                     required
                     placeholder="Describe the expected functionality, integrations, or specific timeline..."
                     value={requestDesc}
                     onChange={e => setRequestDesc(e.target.value)}
                     style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#fff', padding: '10px 14px', fontSize: '13px' }}
                   />
                 </div>

                 <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                   <button
                     type="button"
                     onClick={() => setShowNewRequestModal(false)}
                     style={{
                       padding: '10px 18px',
                       borderRadius: '8px',
                       background: 'rgba(255,255,255,0.05)',
                       border: '1px solid rgba(255,255,255,0.1)',
                       color: '#fff',
                       fontSize: '13px',
                       cursor: 'pointer'
                     }}
                   >
                     Cancel
                   </button>
                   <button type="submit" className="portal-primary-btn">
                     Submit to Engineering Team
                   </button>
                 </div>
               </form>
             )}
           </div>
         </div>
       )}

       {/* PDF Modal Engine Component */}
       <PDFViewerModal
         isOpen={pdfModalOpen}
         onClose={() => setPdfModalOpen(false)}
         clientOrg={org}
         projects={projects}
         invoices={invoices}
         products={products}
       />
    </div>
  );
}

export default ClientDashboardPage;
