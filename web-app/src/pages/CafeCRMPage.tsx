import PageSEO from '../components/layout/PageSEO';
import PageTemplate from '../components/common/PageTemplate';

export function CafeCRMPage() {
  return (
    <>
      <PageSEO
        title="Cafe Management CRM"
        description="Streamline your restaurant operations. From table reservations and inventory tracking to customer loyalty programs."
        url="/products/cafe-crm"
      />
      <PageTemplate
        title="Cafe Management CRM"
        subtitle="Streamline your restaurant operations. From table reservations and inventory tracking to customer loyalty programs."
      />
    </>
  );
}

export default CafeCRMPage;
