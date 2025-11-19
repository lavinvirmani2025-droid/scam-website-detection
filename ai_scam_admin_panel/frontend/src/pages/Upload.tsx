import React, { useState } from 'react'
import axios from 'axios'

export default function Upload(){
  const [file, setFile] = useState<File|null>(null)
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    if(!file){ setMessage('Choose a CSV file'); return }
    const form = new FormData()
    form.append('file', file, file.name)
    try{
      setMessage('Uploading...')
      const token = prompt('Enter admin token (use seeded token or env ADMIN_TOKEN):') || ''
      const res = await axios.post('/api/admin/upload-training-data', form, {
        headers: { 'x-admin-token': token, 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Uploaded: ' + JSON.stringify(res.data))
    }catch(err:any){
      setMessage('Upload failed: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Upload Training CSV</h2>
      <form onSubmit={onSubmit}>
        <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <div className="mt-3">
          <button className="px-4 py-2 bg-teal-500 text-white rounded">Upload</button>
        </div>
      </form>
      <p className="mt-3 text-sm text-gray-600">{message}</p>
      <div className="mt-4 text-sm text-gray-500">
        <strong>CSV format:</strong> url,label,confidence(optional)<br/>
        Example: <code>http://bad.example,scam,0.95</code>
      </div>
    </div>
  )
}
