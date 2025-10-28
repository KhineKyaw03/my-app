"use client";

import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("Not clocked in");
  const [lastAction, setLastAction] = useState("--");

  const handleClockIn = () => {
    const now = new Date().toLocaleTimeString();
    setStatus("Clocked In");
    setLastAction(`Clocked in at ${now}`);
  };

  const handleClockOut = () => {
    const now = new Date().toLocaleTimeString();
    setStatus("Clocked Out");
    setLastAction(`Clocked out at ${now}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 p-8">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-red-600">
          Payroll / Time Tracking
        </h1>

        <p className="text-center text-sm text-gray-500 mt-1">
          Clock in and clock out below
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={handleClockIn}
            className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-lg shadow"
          >
            Clock In
          </button>

          <button
            onClick={handleClockOut}
            className="w-full rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 text-lg shadow"
          >
            Clock Out
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-600 text-center">
          <p>Status: <span className="font-medium">{status}</span></p>
          <p>Last action: <span className="font-medium">{lastAction}</span></p>
        </div>
      </div>
    </main>
  );
}
