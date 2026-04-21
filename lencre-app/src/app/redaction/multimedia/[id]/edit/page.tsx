'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { redactionFetch } from '@/lib/redactionAuth';
import MultimediaForm from '@/components/admin/MultimediaForm';

export default function RedactionEditMultimediaPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    redactionFetch(`/redaction/multimedia/${params.id}`)
      .then(res => res.json())
      .then(item => {
        setData(item);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="redaction-loading"><div className="redaction-loading__spinner" /><p>Chargement...</p></div>;
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}>Média introuvable.</div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Modifier mon Média</h1>
      </div>
      <MultimediaForm 
        initialData={data} 
        isEdit 
        fetchFn={(endpoint, options) => redactionFetch(`/redaction${endpoint}`, options)}
        redirectPath="/redaction/multimedia"
        showStatusField={false}
      />
    </div>
  );
}
