import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import DBCursor from './pages/DBCursor'

export default function App(){
  const [page, setPage] = useState<'dashboard'|'upload'|'db'>('dashboard')
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">AI Scam — Admin Panel</h1>
          <nav className="space-x-3">
            <button onClick={()=>setPage('dashboard')} className="px-3 py-1 rounded bg-teal-500 text-white">Dashboard</button>
            <button onClick={()=>setPage('upload')} className="px-3 py-1 rounded bg-gray-200">Upload CSV</button>
            <button onClick={()=>setPage('db')} className="px-3 py-1 rounded bg-gray-200">DB Browser</button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        {page === 'dashboard' && <Dashboard />}
        {page === 'upload' && <Upload />}
        {page === 'db' && <DBCursor />}
      </main>
    </div>
  )
}
