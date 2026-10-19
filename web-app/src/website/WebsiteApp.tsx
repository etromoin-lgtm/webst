import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Public Website Pages
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import RealEstateCRMPage from '../pages/RealEstateCRMPage';
import WhatsappCRMPage from '../pages/WhatsappCRMPage';
import CafeCRMPage from '../pages/CafeCRMPage';
import ServicesPage from '../pages/ServicesPage';
import PartnersPage from '../pages/PartnersPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import CaseStudiesPage from '../pages/CaseStudiesPage';
import CaseStudyDetailPage from '../pages/CaseStudyDetailPage';
import ResourcesPage from '../pages/ResourcesPage';
import BlogHome from '../blog/BlogHome';
import BlogPost from '../blog/BlogPost';

export function WebsiteApp() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/real-estate-crm" element={<RealEstateCRMPage />} />
        <Route path="/products/whatsapp-crm" element={<WhatsappCRMPage />} />
        <Route path="/products/cafe-crm" element={<CafeCRMPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/blog" element={<BlogHome />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Layout>
  );
}

export default WebsiteApp;
