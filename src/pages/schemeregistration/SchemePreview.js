import React from 'react'
import { useParams } from 'react-router-dom';
import { useFormData } from './FormDataContext';
export default function SchemePreview() {
    const { schemeId } = useParams();
    const { formData } = useFormData();


  return (
    <div>
      <h2>Preview Loaded</h2>
      <p>Previewing Scheme ID: {schemeId}</p>
      <p>Your scheme has been successfully saved and preview is now available.</p>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  )
}
