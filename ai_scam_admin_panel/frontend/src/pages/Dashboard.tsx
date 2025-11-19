import React from 'react'

export default function Dashboard(){
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Pending Reports<br/><strong>12</strong></div>
        <div className="p-4 bg-white rounded shadow">Today's Checks<br/><strong>1,234</strong></div>
        <div className="p-4 bg-white rounded shadow">Top Domains<br/><strong>example.com</strong></div>
      </div>
      <div className="mt-6 p-4 bg-white rounded shadow">
        <h3 className="font-medium">Quick actions</h3>
        <p className="text-sm text-gray-600">Upload CSVs or browse database using the tabs above.</p>
      </div>
    </div>
  )
}
