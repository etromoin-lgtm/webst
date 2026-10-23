import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageSEO from '../components/layout/PageSEO';
import ProductCardItem, { type ProductData } from '../components/ui/ProductCardItem';
import { ArrowRight, Layers, Sparkles, Building2, GraduationCap, Coffee, Zap, ShoppingBag } from 'lucide-react';

export const INDUSTRY_CATEGORIES = [
  { id: 'All', label: 'All Industries', icon: Layers },
  { id: 'Real Estate', label: 'Real Estate', icon: Building2 },
  { id: 'Education', label: 'Education & Training', icon: GraduationCap },
  { id: 'Hospitality', label: 'Hospitality & Cafes', icon: Coffee },
  { id: 'Communication', label: 'Communication & AI', icon: Zap },
  { id: 'Retail', label: 'Retail & eCommerce', icon: ShoppingBag },
];

export function matchesIndustryCategory(productCategory: string | undefined, targetCategory: string): boolean {
  if (!targetCategory || targetCategory === 'All') return true;
  if (!productCategory) return false;

  const prod = productCategory.toLowerCase();
  const target = targetCategory.toLowerCase();

  if (target === 'real estate') {
    return prod.includes('real') || prod.includes('estate') || prod.includes('property');
  }
  if (target === 'education') {
    return prod.includes('education') || prod.includes('academy') || prod.includes('school') || prod.includes('training') || prod.includes('student');
  }
  if (target === 'hospitality') {
    return prod.includes('hospitality') || prod.includes('cafe') || prod.includes('café') || prod.includes('restaurant') || prod.includes('food');
  }
  if (target === 'communication') {
    return prod.includes('communication') || prod.includes('whatsapp') || prod.includes('chat') || prod.includes('ai') || prod.includes('messaging');
  }
  if (target === 'retail') {
    return prod.includes('retail') || prod.includes('ecommerce') || prod.includes('commerce') || prod.includes('inventory');
  }

  return prod.includes(target);
}

export function ProductsIndexHero({ activeCategory }: { activeCategory: string }) {
  const currentIndustry = INDUSTRY_CATEGORIES.find(c => c.id === activeCategory)?.label || 'All Industries';

  return (
    <header className="products-hero" id="top">
      <div className="products-hero-orb" aria-hidden="true" />
      <div className="products-hero-flute" aria-hidden="true" />
      <div className="wrap products-hero-wrap">
        <p className="mono products-eyebrow">
          Industry Software Suite • {activeCategory === 'All' ? 'Cross-Industry Solutions' : currentIndustry}
        </p>
        <h1 id="products-title">
          {activeCategory === 'All' ? (
            <>Our <em>Products.</em></>
          ) : (
            <>{currentIndustry} <em>Suite.</em></>
          )}
        </h1>
        <p className="products-hero-copy">
          Explore our suite of industry-specific software solutions. We build purpose-driven CRMs, conversational automation, and operational operating systems designed to eliminate industry bottlenecks.
        </p>
      </div>
    </header>
  );
}

export function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  const defaultProducts: ProductData[] = [
    {
      name: 'Real Estate CRM Pro',
      category: 'Real Estate',
      price_label: 'Subscription Based',
      link_url: '/products/real-estate-crm',
      description: 'The complete operating system for real estate developers and channel partners. Unified lead pipeline, automated follow-ups, site visit dispatch, and document tracking.',
      features_json: {
        boostValue: '+65%',
        boostLabel: 'Lead Conversion',
        timeReducedValue: '-40%',
        timeReducedLabel: 'Time Reduced',
        benefits: [
          { icon: 'target', text: 'Instant Lead Capture from Meta, Portals & Google' },
          { icon: 'refresh', text: 'Automated Follow-ups & WhatsApp Broadcasts' },
          { icon: 'shield', text: 'Role-Based Access & Database Security' }
        ]
      }
    },
    {
      name: 'EduSphere Academy CRM',
      category: 'Education',
      price_label: 'Subscription Based',
      link_url: '/contact?topic=education-crm',
      description: 'All-in-one education lifecycle operating system for academies, institutes, and coaching schools. Streamlined inquiry intake, admission stages, batch allocations, and automated fee reminders.',
      features_json: {
        boostValue: '+78%',
        boostLabel: 'Admission Ratio',
        timeReducedValue: '-55%',
        timeReducedLabel: 'Admin Workload',
        benefits: [
          { icon: 'target', text: 'Omnichannel Inquiry Intake & Fast Follow-up' },
          { icon: 'refresh', text: 'Automated Fee Reminders & Payment Receipts' },
          { icon: 'shield', text: 'Student Lifecycle, Batches & Attendance Logs' }
        ]
      }
    },
    {
      name: 'WhatsApp CRM',
      category: 'Communication & AI',
      price_label: 'One-Time + Subscription',
      link_url: '/products/whatsapp-crm',
      description: 'Connect directly with customers on their favorite platform. Official WhatsApp Business Cloud API, multi-agent routing, automated message flows, and broadcast campaigns.',
      features_json: {
        boostValue: '3.5x',
        boostLabel: 'Response Speed',
        timeReducedValue: '-60%',
        timeReducedLabel: 'Resolution Time',
        benefits: [
          { icon: 'zap', text: 'Official WhatsApp Business Cloud API Integration' },
          { icon: 'refresh', text: 'Multi-Agent Routing & Shared Team Inbox' },
          { icon: 'trending', text: 'High-Open-Rate Automated Broadcasts' }
        ]
      }
    },
    {
      name: 'Café Management Suite',
      category: 'Hospitality',
      price_label: 'Subscription Based',
      link_url: '/products/cafe-crm',
      description: 'An integrated management platform for modern café groups and restaurant chains. Multi-branch inventory, loyalty programs, digital QR menus, and kitchen display routing.',
      features_json: {
        boostValue: '+32%',
        boostLabel: 'Repeat Customers',
        timeReducedValue: '-50%',
        timeReducedLabel: 'Inventory Waste',
        benefits: [
          { icon: 'target', text: 'Centralized Multi-Outlet Inventory Control' },
          { icon: 'trending', text: 'Integrated Loyalty Programs & Digital Menus' },
          { icon: 'shield', text: 'Real-time Cross-Branch Sales Analytics' }
        ]
      }
    }
  ];

  const [products, setProducts] = useState<ProductData[]>(defaultProducts);

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then(data => {
        if (data && data.products && data.products.length > 0) {
          // Normalize categories from DB if needed
          const normalized = data.products.map((p: any) => {
            let cat = p.category;
            if (!cat || cat === 'CRM Software') {
              if (p.name?.toLowerCase().includes('real estate') || p.name?.toLowerCase().includes('valut') || p.name?.toLowerCase().includes('vault')) {
                cat = 'Real Estate';
              } else if (p.name?.toLowerCase().includes('whatsapp')) {
                cat = 'Communication & AI';
              } else if (p.name?.toLowerCase().includes('cafe') || p.name?.toLowerCase().includes('café')) {
                cat = 'Hospitality';
              } else if (p.name?.toLowerCase().includes('education') || p.name?.toLowerCase().includes('academy')) {
                cat = 'Education';
              }
            }
            return { ...p, category: cat };
          });
          setProducts(normalized);
        }
      })
      .catch(err => console.error('Failed to load products from API:', err));
  }, []);

  const handleSelectCategory = (catId: string) => {
    if (catId === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set('category', catId);
      setSearchParams(searchParams, { replace: true });
    }
  };

  // Filter products based on selected industry category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(p => matchesIndustryCategory(p.category, selectedCategory));
  }, [products, selectedCategory]);

  const selectedCategoryLabel = INDUSTRY_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory;

  return (
    <section className="products-catalog-section">
      <div className="wrap">
        {/* Industry Filter Tabs */}
        <div className="product-category-filters-container">
          <div className="product-category-filters-header">
            <span className="product-category-filters-eyebrow">Filter By Industry Vertical</span>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => handleSelectCategory('All')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--sky)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Reset to All Industries
              </button>
            )}
          </div>
          <div className="product-category-filters" role="tablist">
            {INDUSTRY_CATEGORIES.map(cat => {
              const isActive = (cat.id === 'All' && (selectedCategory === 'All' || !selectedCategory)) ||
                               selectedCategory.toLowerCase() === cat.id.toLowerCase();
              const count = cat.id === 'All'
                ? products.length
                : products.filter(p => matchesIndustryCategory(p.category, cat.id)).length;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`category-filter-pill${isActive ? ' active' : ''}`}
                  onClick={() => handleSelectCategory(cat.id)}
                >
                  <Icon size={14} style={{ opacity: isActive ? 1 : 0.7 }} />
                  <span>{cat.label}</span>
                  <span className="category-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((p, i) => (
            <ProductCardItem key={`${p.id || p.name}-${i}`} product={p} />
          ))}

          {/* If the current industry has no ready product, offer custom solution */}
          {filteredProducts.length === 0 && (
            <div className="custom-industry-card">
              <span className="custom-industry-badge">Bespoke Enterprise Development</span>
              <h3>Custom {selectedCategoryLabel} Software Architecture</h3>
              <p>
                Looking for a specialized solution for your {selectedCategoryLabel} operations? We build high-converting, tailored software engines, CRM workflows, and automation suites engineered specifically for your team.
              </p>
              <div className="custom-industry-actions">
                <Link to={`/contact?topic=${encodeURIComponent(selectedCategoryLabel + ' Custom Build')}`} className="btn g" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>Request Custom {selectedCategoryLabel} Solution</span>
                  <ArrowRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleSelectCategory('All')}
                  className="btn"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  View All Available Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';

  return (
    <>
      <PageSEO
        title={currentCategory === 'All' ? 'Our Software Products & Industry Suites' : `${currentCategory} Software Solutions & CRM`}
        description="Explore our catalog of custom-built software solutions, CRMs, and ecosystem plugins designed for business scale."
        url="/products"
      />
      <ProductsIndexHero activeCategory={currentCategory} />
      <ProductsList />
    </>
  );
}

export default ProductsPage;
