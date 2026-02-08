"use client";

export default function Settings() {
  return (
    <div>
      <h2 className="text-xl font-normal mb-6">Settings</h2>

      <div className="space-y-6 max-w-lg">
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
            GitHub Repository
          </label>
          <input
            type="text"
            defaultValue="NanoHermano/production-house"
            className="w-full border border-gray-200 rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
            Wallet Address
          </label>
          <input
            type="text"
            defaultValue="0xFE8f6EB2E980F1C68E8286A5F602a737e02FA814"
            className="w-full border border-gray-200 rounded px-4 py-2 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
            Default Model
          </label>
          <select className="w-full border border-gray-200 rounded px-4 py-2">
            <option>Opus 4.5 (Executive)</option>
            <option>Sonnet 4 (Standard)</option>
            <option>Haiku 3.5 (Fast)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
            Telegram Notifications
          </label>
          <div className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm">Send alerts to Telegram</span>
          </div>
        </div>

        <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          Save Settings
        </button>
      </div>
    </div>
  );
}
