import React from "react";

export default function BalanceCard({ title, value, valueRupees, color, icon }) {
  // value is in paise, valueRupees is already divided by 100
  const displayValue = valueRupees || (value / 100).toFixed(2);
  
  return (
    <div className={`p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">₹{parseFloat(displayValue).toFixed(2)}</p>
        </div>
        <div className={`text-4xl ${icon}`}>💰</div>
      </div>
    </div>
  );
}