import React, { useEffect, useState } from 'react'
import axios from 'axios'

type Row = { id:number, url:string, status?:string, created_at?:string }

export default function DBCursor(){
  const [rows, setRows] = useState<Row[]>([])
  const [message, setMessage] = useState('')

  useEffect(()=>{
    async function load(){
      try{
        setMessage('Loading...')
        const token = prompt('Enter admin token for DB access:') || ''
        const res = await axios.get('/api/admin/db-preview', { headers: { 'x-admin-token': token } })
        setRows(res.data.rows || [])
        setMessage('')
      }catch(err:any){
        setMessage('Failed to load: ' + (err.response?.data?.error || err.message))
      }
    }
    load()
  },[])

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Database Preview (read-only)</h2>
      <p className="text-sm text-gray-600 mb-3">{message}</p>
      <table className="w-full text-sm">
        <thead><tr><th className="text-left">ID</th><th className="text-left">URL</th><th className="text-left">Status</th><th className="text-left">Created</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}><td>{r.id}</td><td>{r.url}</td><td>{r.status}</td><td>{r.created_at}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-500">This is read-only. Sensitive fields are hidden.</p>
    </div>
  )
}
