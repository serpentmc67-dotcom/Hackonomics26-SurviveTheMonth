"use client";

import React, { useState, useEffect } from "react";

interface Player {
  id: number;
  username: string;
  school: string;
  registered: string;
  score: number;
  play_seconds: number;
  last_played: string | null;
  status: string;
  ip_address: string;
}

interface Stats {
  totalPlayers: number;
  onlinePlayers: number;
  bannedPlayers: number;
}

export default function AdminDashboard() {
  const [secretCode, setSecretCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPlayers: 0, onlinePlayers: 0, bannedPlayers: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const BACKEND_URL = "http://127.0.0.1:5000";

  const fetchAdminData = async (code: string) => {
    try {
      setError("");
      // Fetch stats
      const statsRes = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretCode: code }),
      });
      const statsData = await statsRes.json();

      // Fetch players list
      const playersRes = await fetch(`${BACKEND_URL}/api/admin/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretCode: code }),
      });
      const playersData = await playersRes.json();

      if (statsData.ok && playersData.ok) {
        setStats(statsData.stats);
        setPlayers(playersData.players);
        setIsAuthenticated(true);
      } else {
        setError(statsData.message || playersData.message || "Access Denied.");
      }
    } catch (err) {
      setError("Could not connect to the Python backend server.");
    }
  };

  const handleAction = async (playerId: number, action: "delete" | "ban" | "ip_ban" | "unban") => {
    if (!confirm(`Are you sure you want to execute '${action}' on this player?`)) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretCode, playerId, action }),
      });
      const data = await res.json();
      if (data.ok) {
        // Refresh data instantly
        fetchAdminData(secretCode);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error executing admin action.");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdminData(secretCode);
  };

  // Filter players based on search bar
  const filteredPlayers = players.filter((player) =>
    player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.ip_address.includes(searchQuery)
  );

  // Authentication Gate UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 p-6">
        <form onSubmit={handleLoginSubmit} className="bg-gray-900 border border-gray-800 p-8 rounded-xl max-w-md w-full shadow-2xl">
          <h1 className="text-2xl font-black text-red-500 mb-2 tracking-wide text-center uppercase">Survive The Month</h1>
          <p className="text-sm text-gray-400 mb-6 text-center font-medium">Secure Administrative Terminal</p>
          {error && <div className="bg-red-950 border border-red-800 text-red-400 p-3 rounded-lg text-sm mb-4 font-semibold">{error}</div>}
          <div className="mb-4">
            <label className="block text-xs uppercase font-bold text-gray-400 tracking-widest mb-2">Secret Admin Key</label>
            <input
              type="password"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Enter Access Key..."
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-gray-200"
            />
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 font-bold py-3 px-4 rounded-lg text-sm transition uppercase tracking-wider">
            Authorize Terminal
          </button>
        </form>
      </div>
    );
  }

  // Master Dashboard Dashboard Layout
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">Admin Command Center</h1>
            <p className="text-sm text-gray-400 mt-1">Real-time status tracking and account compliance tools</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="self-start md:self-auto text-xs font-bold uppercase tracking-widest border border-gray-800 bg-gray-950 hover:bg-gray-900 px-4 py-2 rounded-lg transition text-gray-400 hover:text-white">
            Disconnect Terminal
          </button>
        </div>

        {/* Top Stats Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Players</p>
              <h3 className="text-3xl font-black text-white mt-1">{stats.totalPlayers}</h3>
            </div>
            <div className="p-3 bg-blue-950 rounded-lg text-blue-400 font-bold text-xl">👥</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Players Online Now</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">{stats.onlinePlayers}</h3>
            </div>
            <div className="p-3 bg-emerald-950 rounded-lg text-emerald-400 font-bold text-xl relative">
              <span className="absolute top-2 right-2 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
              ⚡
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Sanctioned Accounts</p>
              <h3 className="text-3xl font-black text-red-500 mt-1">{stats.bannedPlayers}</h3>
            </div>
            <div className="p-3 bg-red-950 rounded-lg text-red-400 font-bold text-xl">🚫</div>
          </div>
        </div>

        {/* Interactive Search Tool Block */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 bg-gray-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Player Directory</h2>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search username, school, or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-4 pr-4 py-2 text-sm focus:outline-none focus:border-red-500 text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Accounts Database Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-950 border-b border-gray-800 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <th className="p-4">Account Profile</th>
                  <th className="p-4">School</th>
                  <th className="p-4 text-center">In-Game Score</th>
                  <th className="p-4">Time Played</th>
                  <th className="p-4">IP Footprint</th>
                  <th className="p-4">Security Level</th>
                  <th className="p-4 text-right">Actions Terminal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-gray-500 font-medium">
                      No matches found in database tracking systems.
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-800/30 transition text-sm">
                      <td className="p-4">
                        <div className="font-bold text-white">{player.username}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Joined: {player.registered}</div>
                      </td>
                      <td className="p-4 text-gray-300 font-medium">{player.school}</td>
                      <td className="p-4 text-center font-mono font-bold text-yellow-500">{player.score}</td>
                      <td className="p-4 text-gray-400 font-mono text-xs">
                        {Math.floor(player.play_seconds / 60)}m {player.play_seconds % 60}s
                      </td>
                      <td className="p-4 text-gray-500 font-mono text-xs">{player.ip_address || "N/A"}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${
                          player.status === "active" ? "bg-emerald-950 border-emerald-800 text-emerald-400" :
                          player.status === "banned" ? "bg-amber-950 border-amber-800 text-amber-400" :
                          "bg-red-950 border-red-900 text-red-400"
                        }`}>
                          {player.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {player.status !== "active" ? (
                          <button onClick={() => handleAction(player.id, "unban")} className="bg-gray-800 hover:bg-gray-700 text-emerald-400 text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded transition border border-gray-700">
                            Lift Ban
                          </button>
                        ) : (
                          <>
                            <button onClick={() => handleAction(player.id, "ban")} className="bg-amber-950/40 hover:bg-amber-950 border border-amber-900 text-amber-400 text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded transition">
                              Ban
                            </button>
                            <button onClick={() => handleAction(player.id, "ip_ban")} className="bg-red-950/40 hover:bg-red-950 border border-red-900 text-red-500 text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded transition">
                              IP Ban
                            </button>
                          </>
                        )}
                        <button onClick={() => handleAction(player.id, "delete")} className="bg-transparent hover:bg-red-950 text-gray-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider py-1.5 px-2 rounded transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}