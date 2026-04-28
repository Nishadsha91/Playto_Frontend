import React from "react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const STATUS_ICONS = {
  pending: "⏳",
  processing: "⚙️",
  completed: "✅",
  failed: "❌",
};

export default function PayoutTable({ payouts }) {
  if (!payouts || payouts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">💸 Payout History</h2>
        <p className="text-gray-500 text-center py-8">No payouts yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">💸 Payout History</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount (₹)</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Attempts</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Bank Account</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Failure Reason</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
            </tr>
          </thead>

          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-right font-semibold">
                  ₹{(p.amount_rupees || p.amount_paise / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold inline-block ${STATUS_COLORS[p.status]}`}>
                    {STATUS_ICONS[p.status]} {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{p.attempts || 0}</td>
                <td className="px-4 py-3 text-gray-700">
                  {p.bank_account ? (
                    <>
                      <div className="font-semibold">{p.bank_account.account_holder_name}</div>
                      <div className="text-sm text-gray-600">{p.bank_account.account_number}</div>
                    </>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {p.failure_reason ? (
                    <span className="text-red-600">{p.failure_reason}</span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(p.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
