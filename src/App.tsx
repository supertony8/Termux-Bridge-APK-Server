import React, { useState } from 'react';
import { Header } from './components/Header';
import { CapabilitiesDirectory } from './components/CapabilitiesDirectory';
import { ApiConsole } from './components/ApiConsole';
import { PermissionsMatrix } from './components/PermissionsMatrix';
import { AndroidSourceViewer } from './components/AndroidSourceViewer';
import { TermuxGuide } from './components/TermuxGuide';
import { Server, Terminal, Shield, Code, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'console' | 'permissions' | 'android_code' | 'termux_guide'>('catalog');
  const [serverPort, setServerPort] = useState<number>(8080);
  const [serverHost, setServerHost] = useState<string>('127.0.0.1');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('camera_capture');

  const handleSelectEndpointFromCatalog = (endpointId: string) => {
    setSelectedEndpointId(endpointId);
    setActiveTab('console');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverPort={serverPort}
        setServerPort={setServerPort}
        serverHost={serverHost}
        setServerHost={setServerHost}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalog' && (
          <CapabilitiesDirectory onSelectEndpoint={handleSelectEndpointFromCatalog} />
        )}

        {activeTab === 'console' && (
          <ApiConsole
            selectedEndpointId={selectedEndpointId}
            serverHost={serverHost}
            serverPort={serverPort}
          />
        )}

        {activeTab === 'permissions' && (
          <PermissionsMatrix />
        )}

        {activeTab === 'android_code' && (
          <AndroidSourceViewer serverPort={serverPort} />
        )}

        {activeTab === 'termux_guide' && (
          <TermuxGuide serverPort={serverPort} serverHost={serverHost} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Android REST Bridge & Termux Automation Hub</span>
          </div>
          <p className="text-slate-400">
            Разработано для выполнения аппаратных команд Android из Python в Termux и веб-приложений.
          </p>
        </div>
      </footer>
    </div>
  );
}
