'use client';

import MultimediaForm from '@/components/admin/MultimediaForm';
import { redactionFetch } from '@/lib/redactionAuth';

export default function RedactionNewMultimediaPage() {
  return (
    <div>
      <div className="cms-header">
        <h1>Ajouter un Média</h1>
      </div>
      <MultimediaForm 
        fetchFn={(endpoint, options) => redactionFetch(`/redaction${endpoint}`, options)}
        redirectPath="/redaction/multimedia"
        showStatusField={false}
      />
    </div>
  );
}
