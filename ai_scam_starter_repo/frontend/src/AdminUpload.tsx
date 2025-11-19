/**
 * Example React component (static) showing how an admin CSV upload page could look.
 * Use this as a starting point to implement the real UI.
 */
import React from 'react';

export default function AdminUpload(){
  return (
    <div style={{maxWidth:800, margin:'2rem auto', padding: '1rem', borderRadius:12, boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
      <h2>Admin — Upload Training CSV</h2>
      <p>Use the backend endpoint <code>/api/admin/upload-training-data</code> with header <code>x-admin-token</code>.</p>
      <form method="post" encType="multipart/form-data" action="/api/admin/upload-training-data">
        <input type="file" name="file" accept=".csv" />
        <button type="submit">Upload (example)</button>
      </form>
    </div>
  );
}
