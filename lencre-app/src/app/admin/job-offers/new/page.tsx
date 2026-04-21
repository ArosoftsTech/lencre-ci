'use client';

import JobOfferForm from '@/components/admin/JobOfferForm';

export default function NewJobOfferPage() {
  return (
    <div>
      <div className="cms-header">
        <h1>Créer une nouvelle offre d'emploi</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <JobOfferForm />
      </div>
    </div>
  );
}
