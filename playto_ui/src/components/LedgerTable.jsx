import React from "react";

export default function LedgerTable({ ledger }) {
  if (!ledger || ledger.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">📊 Ledger History</h2>
        <p className="text-gray-500 text-center py-8">No ledger entries yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">📊 Ledger History</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount (₹)</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
            </tr>
          </thead>

          <tbody>
            {ledger.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    entry.entry_type === 'credit' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {entry.entry_type === 'credit' ? '⬆️ Credit' : '⬇️ Debit'}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${
                  entry.entry_type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {entry.entry_type === 'credit' ? '+' : '-'}₹{Math.abs(entry.amount_rupees ?? entry.amount_paise / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-700">{entry.description}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(entry.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

