import { Link } from 'react-router-dom';
import {
  Target,
  Clock,
  Zap,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import '../../pages/Products.css';

export interface ProductBenefit {
  icon: string;
  text: string;
}

export interface ProductData {
  id?: number;
  name: string;
  category?: string;
  price_label?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  features_json?: string | {
    boostValue?: string;
    boostLabel?: string;
    timeReducedValue?: string;
    timeReducedLabel?: string;
    benefits?: ProductBenefit[];
  };
}

export function renderBenefitIcon(iconName: string) {
  switch (iconName) {
    case 'target': return <Target size={14} />;
    case 'clock': return <Clock size={14} />;
    case 'zap': return <Zap size={14} />;
    case 'shield': return <ShieldCheck size={14} />;
    case 'refresh': return <RefreshCw size={14} />;
    case 'trending': return <TrendingUp size={14} />;
    case 'sparkles': return <Sparkles size={14} />;
    case 'check':
    default:
      return <CheckCircle2 size={14} />;
  }
}

export function ProductCardItem({ product, isPreview = false }: { product: ProductData; isPreview?: boolean }) {
  let features: any = {};
  if (typeof product.features_json === 'string') {
    try {
      features = JSON.parse(product.features_json || '{}');
    } catch {
      features = {};
    }
  } else if (product.features_json) {
    features = product.features_json;
  }

  const boostVal = features.boostValue || '+45%';
  const boostLbl = features.boostLabel || 'Efficiency Boost';
  const timeVal = features.timeReducedValue || '-40%';
  const timeLbl = features.timeReducedLabel || 'Time Reduced';
  const benefits: ProductBenefit[] = features.benefits && features.benefits.length > 0
    ? features.benefits
    : [
        { icon: 'target', text: 'Centralized lead capture and tracking' },
        { icon: 'refresh', text: 'Automated follow-ups & message workflows' },
        { icon: 'shield', text: 'Role-based access & protected customer database' },
      ];

  const destinationLink = (product.link_url || '').trim();
  const isExternal = destinationLink.startsWith('http://') || destinationLink.startsWith('https://');

  return (
    <div className="product-card">
      {product.image_url && (
        <div className="product-card-media">
          <img
            src={product.image_url}
            alt={product.name}
            className="product-card-img"
          />
        </div>
      )}

      {/* Top Header Badge & Category */}
      <div className="product-card-header">
        <span className="product-pill-badge">
          {product.price_label || 'Subscription Based'}
        </span>
        <span className="product-category-label">
          {product.category || 'Enterprise Software'}
        </span>
      </div>

      {/* Title & Description */}
      <h3>{product.name || 'Product Title'}</h3>
      <p className="product-card-desc">
        {product.description || 'Description highlight of what makes this product essential for your team.'}
      </p>

      {/* Results / Impact Metrics Box */}
      <div className="product-metrics-pod">
        <div>
          <div className="product-metric-num">
            {boostVal} <TrendingUp size={16} color="var(--sky)" />
          </div>
          <div className="product-metric-lbl">{boostLbl}</div>
        </div>
        <div className="product-metrics-divider" />
        <div>
          <div className="product-metric-num">
            {timeVal} <Clock size={16} color="var(--sky)" />
          </div>
          <div className="product-metric-lbl">{timeLbl}</div>
        </div>
      </div>

      {/* Key Benefits with Minimal Icons */}
      <div className="product-benefits-list">
        {benefits.map((b, idx) => (
          <div key={idx} className="product-benefit-item">
            <span className="product-benefit-icon">
              {renderBenefitIcon(b.icon)}
            </span>
            <span>{b.text}</span>
          </div>
        ))}
      </div>

      {/* Action CTA: Explore Product */}
      {isPreview ? (
        <div className="product-explore-btn">
          Explore Product <ArrowUpRight size={16} />
        </div>
      ) : isExternal ? (
        <a href={destinationLink} target="_blank" rel="noopener noreferrer" className="product-explore-btn">
          Explore Product <ArrowUpRight size={16} />
        </a>
      ) : destinationLink ? (
        <Link to={destinationLink} className="product-explore-btn">
          Explore Product <ArrowUpRight size={16} />
        </Link>
      ) : (
        <Link to="/contact" className="product-explore-btn">
          Explore Product <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}

export default ProductCardItem;
