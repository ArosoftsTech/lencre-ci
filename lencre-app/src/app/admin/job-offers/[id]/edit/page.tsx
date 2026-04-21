'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminFetch } from '@/lib/auth';
import JobOfferForm from '@/components/admin/JobOfferForm';

export default function EditJobOfferPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminFetch(`/job-offers`);
        const json = await res.json();
        // Since we don't have a direct GET /admin/job-offers/{id} without slug, we filter from list
        // Alternatively we can use the public slug endpoint if we have the slug, 
        // but here we can just find it in the list for simplicity or extend the API.
        // Actually, the API might not have a GET /{id} for admin. We'll search the list.
        const offer = json.data?.find((o: any) => o.id === parseInt(id));
        if (offer) {
          setData(offer);
        } else {
          setError('Offre introuvable');
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
        <h1>Modifier l'offre d'emploi</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <JobOfferForm initialData={data} isEdit={true} />
      </div>
    </div>
  );
}
