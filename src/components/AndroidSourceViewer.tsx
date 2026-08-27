import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderTree, 
  Layers, 
  Sparkles,
  Smartphone,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { downloadAndroidProjectZip } from '../utils/zipGenerator';

interface AndroidSourceViewerProps {
  serverPort: number;
}

export const AndroidSourceViewer: React.FC<AndroidSourceViewerProps> = ({ serverPort }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const activeFile = ANDROID_PROJECT_FILES[selectedFileIndex] || ANDROID_PROJECT_FILES[0];
  const fileContent = activeFile.content.replace(/8080/g, String(serverPort));

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      await downloadAndroidProjectZip(serverPort);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
              Ktor CIO + CameraX + AndroidX Coroutines
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Готовый исходный код Android Studio проекта (Kotlin)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Полный модульный исходный код нативного Android приложения для компиляции APK в Android Studio.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={downloading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 transition disabled:opacity-50 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Сборка архива...' : 'Скачать полный проект (ZIP)'}</span>
        </button>
      </div>

      {/* Main Code Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: File Tree (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              Файлы проекта:
            </h3>

            <div className="space-y-1.5">
              {ANDROID_PROJECT_FILES.map((file, idx) => {
                const isSelected = selectedFileIndex === idx;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-emerald-600/20 text-emerald-200 border border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono font-bold text-slate-100 flex items-center gap-1.5">
                        <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                        {file.filename}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                        {file.language}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1">
                      {file.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Architecture info box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Ключевые архитектурные решения:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li><strong className="text-slate-200">Ktor CIO:</strong> Асинхронный неблокирующий движок HTTP сервера на корутинах.</li>
              <li><strong className="text-slate-200">Foreground Service:</strong> Постоянное системное уведомление предотвращает выгрузку ОС Android из ОЗУ.</li>
              <li><strong className="text-slate-200">WakeLock + WifiLock:</strong> Процессор и Wi-Fi модуль не засыпают при выключении экрана.</li>
              <li><strong className="text-slate-200">CORS Enabled:</strong> Возможность слать запросы из веб-страниц без блокировок браузера.</li>
            </ul>
          </div>
        </div>

        {/* Right Area: Code Display (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 block">
                  {activeFile.path}
                </span>
                <span className="text-xs text-slate-400">
                  {activeFile.description}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Скопировано!' : 'Копировать файл'}</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-[620px] scrollbar-thin scrollbar-thumb-slate-700 leading-relaxed">
              <pre>{fileContent}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
