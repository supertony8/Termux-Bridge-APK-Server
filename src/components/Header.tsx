import React, { useState } from 'react';
import { 
  Server, 
  Smartphone, 
  Download, 
  Terminal, 
  ShieldCheck, 
  Code2, 
  Sliders, 
  Sparkles,
  Wifi,
  Copy,
  Check
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../utils/zipGenerator';

interface HeaderProps {
  activeTab: 'catalog' | 'console' | 'permissions' | 'android_code' | 'termux_guide';
  setActiveTab: (tab: 'catalog' | 'console' | 'permissions' | 'android_code' | 'termux_guide') => void;
  serverPort: number;
  setServerPort: (port: number) => void;
  serverHost: string;
  setServerHost: (host: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  serverPort,
  setServerPort,
  serverHost,
  setServerHost
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const fullBaseUrl = `http://${serverHost}:${serverPort}`;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadAndroidProjectZip(serverPort);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(fullBaseUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-white tracking-tight">Android HTTP Bridge APK</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
                  REST Server
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Мост между Android API и скриптами в Termux, Python и Web
              </p>
            </div>
          </div>

          {/* Controls: Port, IP, and Download button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs shadow-inner">
              <span className="text-slate-400 mr-2 flex items-center gap-1 font-mono">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                Host:
              </span>
              <input
                type="text"
                value={serverHost}
                onChange={(e) => setServerHost(e.target.value)}
                className="bg-transparent text-emerald-300 font-mono focus:outline-none w-24 border-b border-dashed border-slate-600 focus:border-emerald-400 text-xs"
                placeholder="127.0.0.1"
              />
              <span className="text-slate-500 mx-1.5">:</span>
              <span className="text-slate-400 mr-1 font-mono">Port:</span>
              <input
                type="number"
                value={serverPort}
                onChange={(e) => setServerPort(Math.max(1, Math.min(65535, Number(e.target.value) || 8080)))}
                className="bg-transparent text-cyan-300 font-mono focus:outline-none w-14 border-b border-dashed border-slate-600 focus:border-cyan-400 text-xs"
              />
              <button
                onClick={copyUrl}
                title="Копировать базовый URL сервера"
                className="ml-2 p-1 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded transition"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow-lg shadow-emerald-900/30 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Архивация...' : 'Скачать проект APK (ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-1 border-t border-slate-800/80 pt-1 -mb-px text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Каталог возможностей ({30}+ API)</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'console'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Тестер API и Генератор кода</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'permissions'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Матрица разрешений Android</span>
          </button>

          <button
            onClick={() => setActiveTab('android_code')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'android_code'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Исходный код APK (Kotlin + Ktor)</span>
          </button>

          <button
            onClick={() => setActiveTab('termux_guide')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'termux_guide'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Инструкция Termux & Python SDK</span>
          </button>
        </div>
      </div>
    </header>
  );
};
