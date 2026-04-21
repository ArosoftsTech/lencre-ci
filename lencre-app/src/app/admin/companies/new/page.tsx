'use client';

import CompanyForm from '@/components/admin/CompanyForm';

export default function NewCompanyPage() {
  return (
    <div>
      <div className="cms-header">
        <h1>Ajouter une entreprise</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <CompanyForm />
      </div>
    </div>
  );
}
