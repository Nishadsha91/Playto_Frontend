import { useEffect, useState } from "react";
import api from "../services/api";

import BalanceCard from "../components/BalanceCard";
import PayoutForm from "../components/PayoutForm";
import LedgerTable from "../components/LedgerTable";
import PayoutTable from "../components/PayoutTable";

export default function Dashboard() {
  const [merchant, setMerchant] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setError("");
      const [merchantRes, ledgerRes, payoutsRes, bankAccountsRes] = await Promise.all([
        api.get("/merchants/me/"),
        api.get("/ledger/"),
        api.get("/payouts/"),
        api.get("/bank-accounts/"),
      ]);

      setMerchant(merchantRes.data);
      setLedger(ledgerRes.data);
      setPayouts(payoutsRes.data);
      setBankAccounts(bankAccountsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to load dashboard: ${err.message}`);
      setLoading(false);
    }
  };

  // Initial load on mount
  useEffect(() => {
    fetchAllData();
  }, []);



useEffect(() => {
  const hasActive = payouts.some(
    (p) => p.status === "pending" || p.status === "processing"
  );

  if (!hasActive) return;

  const interval = setInterval(async () => {
    try {
      const payoutsRes = await api.get("/payouts/");
      setPayouts(payoutsRes.data);

      const merchantRes = await api.get("/merchants/me/");
      setMerchant(merchantRes.data);
    } catch (err) {
      console.warn("Error polling payouts:", err);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [payouts]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">🎯 Playto Merchant Dashboard</h1>
          {merchant && <p className="text-gray-600 mt-2">Welcome, <span className="font-semibold">{merchant.name}</span></p>}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {/* Balance Cards */}
        {merchant && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BalanceCard
              title="Available Balance"
              value={merchant.available_balance}
              valueRupees={merchant.available_balance_rupees}
              color="border-green-500 bg-gradient-to-br from-green-50 to-green-100"
              icon="💚"
            />
            <BalanceCard
              title="Held Balance"
              value={merchant.held_balance}
              valueRupees={merchant.held_balance_rupees}
              color="border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100"
              icon="🔒"
            />
            <BalanceCard
              title="Total Balance"
              value={merchant.total_balance}
              valueRupees={merchant.total_balance_rupees}
              color="border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100"
              icon="💰"
            />
          </div>
        )}

        {/* Payout Form */}
        <PayoutForm 
          bankAccounts={bankAccounts}
          refreshPayouts={fetchAllData}
        />

        {/* Payout History */}
        <PayoutTable payouts={payouts} />

        {/* Ledger History */}
        <LedgerTable ledger={ledger} />

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={fetchAllData}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
          >
            🔄 Refresh All Data
          </button>
        </div>
      </div>
    </div>
  );
}