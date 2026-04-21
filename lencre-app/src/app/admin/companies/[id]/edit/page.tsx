'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminFetch } from '@/lib/auth';
import CompanyForm from '@/components/admin/CompanyForm';

export default function EditCompanyPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminFetch(`/company-profiles`);
        const json = await res.json();
        const company = json.find((c: any) => c.id === parseInt(id));
        if (company) {
          setData(company);
        } else {
          setError('Entreprise introuvable');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Modifier l'entreprise</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <CompanyForm initialData={data} isEdit={true} />
      </div>
    </div>
  );
}
