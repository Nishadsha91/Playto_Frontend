import React, { useState } from "react";
import api from "../services/api";

export default function PayoutForm({ bankAccounts, refreshPayouts }) {
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || !bankAccount) {
      setError("Please fill in all fields");
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Amount must be a valid positive number");
      return;
    }

    const paise = Math.round(parseFloat(amount) * 100);

    // Minimum payout ₹1
    if (paise < 100) {
      setError("Minimum payout amount is ₹1");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/payouts/",
        {
          amount_paise: paise,
          bank_account_id: bankAccount,
        },
        {
          headers: {
            "Idempotency-Key": crypto.randomUUID(),
          },
        }
      );

      setSuccess(`✅ Payout requested successfully! Amount: ₹${amount}`);
      setTimeout(() => setSuccess(""), 5000);

      setAmount("");
      setBankAccount("");

      if (refreshPayouts) {
        setTimeout(refreshPayouts, 1000);
      }

    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Error requesting payout";

      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">

      <h2 className="text-lg font-semibold mb-4">Request Payout</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>

          <input
            type="number"
            placeholder="Enter amount in paise"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Account
          </label>

          <select
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading || bankAccounts.length === 0}
            required
          >
            <option value="">-- Select Bank Account --</option>

            {bankAccounts.map((b) => (
              <option key={b.id} value={b.id}>
                {b.account_holder_name} — {b.account_number}
              </option>
            ))}
          </select>

          {bankAccounts.length === 0 && (
            <p className="text-yellow-600 text-sm mt-2">
              ⚠️ No bank accounts available
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || bankAccounts.length === 0}
          className={`w-full py-2 px-4 rounded-lg font-bold transition ${
            loading || bankAccounts.length === 0
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Processing..." : "Request Payout"}
        </button>

      </div>
    </form>
  );
}