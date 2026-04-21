'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminFetch } from '@/lib/auth';
import MultimediaForm from '@/components/admin/MultimediaForm';

export default function AdminEditMultimediaPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`/multimedia/admin/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(item => {
        setData(item);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Chargement...</p></div>;
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}>Média introuvable.</div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Modifier le Média</h1>
      </div>
      <MultimediaForm initialData={data} isEdit />
    </div>
  );
}
