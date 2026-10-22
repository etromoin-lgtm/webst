import { useState, useEffect } from 'react';
import PageSEO from '../components/layout/PageSEO';
import ProductCardItem, { type ProductData } from '../components/ui/ProductCardItem';

export function ProductsIndexHero() {
  return (
    <header className="products-hero" id="top">
      <div className="products-hero-orb" aria-hidden="true" />
      <div className="products-hero-flute" aria-hidden="true" />
      <div className="wrap products-hero-wrap">
        <p className="mono products-eyebrow">Industry Software Suite</p>
        <h1 id="products-title">Our <em>Products.</em></h1>
        <p className="products-hero-copy">
          Explore our suite of industry-specific software solutions. We build powerful CRMs and automation tools designed to solve real operational bottlenecks.
        </p>
      </div>
    </header>
  );
}

export function ProductsList() {
  const defaultProducts: ProductData[] = [
    {
      name: 'Real Estate CRM Pro',
      category: 'CRM Software',
      price_label: 'Subscription Based',
      link_url: '/products/real-estate-crm',
      description: 'The complete operating system for real estate developers and channel partners. Unified lead pipeline, automated follow-ups, and site visit tracking.',
      features_json: {
        boostValue: '+65%',
        boostLabel: 'Lead Conversion',
        timeReducedValue: '-40%',
        timeReducedLabel: 'Time Reduced',
        benefits: [
          { icon: 'target', text: 'Instant Lead Capture from Meta & Google' },
          { icon: 'refresh', text: 'Automated Follow-ups & WhatsApp Broadcasts' },
          { icon: 'shield', text: 'Role-Based Access & Database Security' }
        ]
      }
    },
    {
      name: 'WhatsApp CRM',
      category: 'Communication Platform',
      price_label: 'One-Time + Subscription',
      link_url: '/products/whatsapp-crm',
      description: 'Connect directly with customers on their favorite platform. Multi-agent routing, automated message flows, broadcast campaigns, and analytics.',
      features_json: {
        boostValue: '3.5x',
        boostLabel: 'Response Speed',
        timeReducedValue: '-60%',
        timeReducedLabel: 'Resolution Time',
        benefits: [
          { icon: 'zap', text: 'Official WhatsApp Business Cloud API Integration' },
          { icon: 'refresh', text: 'Multi-Agent Routing & Shared Inbox' },
          { icon: 'trending', text: 'High-Open-Rate Automated Broadcasts' }
        ]
      }
    },
    {
      name: 'Café Management Suite',
      category: 'Operations Software',
      price_label: 'Subscription Based',
      link_url: '/products/cafe-crm',
      description: 'An integrated management platform for modern café groups and restaurant chains. Multi-branch inventory, loyalty programs, and digital menus.',
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
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="products-catalog-section">
      <div className="wrap">
        <div className="products-grid">
          {products.map((p, i) => (
            <ProductCardItem key={`${p.id || p.name}-${i}`} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductsPage() {
  return (
    <>
      <PageSEO
        title="Our Software Products"
        description="Explore our catalog of custom-built software solutions, CRMs, and ecosystem plugins designed for business scale."
        url="/products"
      />
      <ProductsIndexHero />
      <ProductsList />
    </>
  );
}

export default ProductsPage;
