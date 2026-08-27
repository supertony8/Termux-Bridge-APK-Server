import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import { PYTHON_SDK_CODE, PYTHON_EXAMPLE_SCRIPT } from '../data/termuxPythonSdk';

interface TermuxGuideProps {
  serverPort: number;
  serverHost: string;
}

export const TermuxGuide: React.FC<TermuxGuideProps> = ({ serverPort, serverHost }) => {
  const [activeTab, setActiveTab] = useState<'sdk' | 'example'>('sdk');
  const [copiedSdk, setCopiedSdk] = useState<boolean>(false);
  const [copiedExample, setCopiedExample] = useState<boolean>(false);
  const [copiedCommands, setCopiedCommands] = useState<boolean>(false);

  const formattedSdk = PYTHON_SDK_CODE.replace(/8080/g, String(serverPort));
  const formattedExample = PYTHON_EXAMPLE_SCRIPT.replace(/8080/g, String(serverPort));

  const termuxSetupCommands = `# 1. Обновление пакетов и установка Python
pkg update -y && pkg install python -y

# 2. Установка библиотеки requests
pip install requests

# 3. Скачивание SDK клиента (или создайте файл вручную)
cat << 'EOF' > termux_bridge.py
${formattedSdk}
EOF

# 4. Запуск вашего скрипта автоматизации
python example_automation.py`;

  const handleCopySdk = () => {
    navigator.clipboard.writeText(formattedSdk);
    setCopiedSdk(true);
    setTimeout(() => setCopiedSdk(false), 2000);
  };

  const handleCopyExample = () => {
    navigator.clipboard.writeText(formattedExample);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(termuxSetupCommands);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Quickstart 3-Step Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Пошаговая интеграция с Termux и Python
            </h2>
            <p className="text-xs text-slate-400">
              Как за 1 минуту подключить ваши скрипты к нативному Android APK мосту
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 relative">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
              Шаг 1
            </span>
            <h4 className="font-bold text-slate-100 text-sm pt-1">Установите APK</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Скомпилируйте или установите APK на смартфон, запустите его и нажмите «Запустить сервер». Предоставьте запрошенные права (Камера, Микрофон, Файлы).
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 relative">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              Шаг 2
            </span>
            <h4 className="font-bold text-slate-100 text-sm pt-1">Настройте Termux</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Откройте Termux и установите Python и модуль <code className="text-cyan-300">requests</code> одной командой.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 relative">
            <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
              Шаг 3
            </span>
            <h4 className="font-bold text-slate-100 text-sm pt-1">Запустите Python скрипт</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Импортируйте <code className="text-amber-300">TermuxBridgeClient</code> и управляйте телефоном: делайте фото, включайте фонарик, пишите в файлы.
            </p>
          </div>
        </div>
      </div>

      {/* Terminal Setup Command Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              Команды для быстрой настройки в Termux
            </h3>
          </div>
          <button
            onClick={handleCopyCommands}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            {copiedCommands ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCommands ? 'Скопировано!' : 'Копировать всё'}</span>
          </button>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
          <pre>{termuxSetupCommands}</pre>
        </div>
      </div>

      {/* Python SDK and Example Script Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          {/* Tabs: SDK vs Example Script */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('sdk')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'sdk'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. termux_bridge.py (Библиотека-клиент SDK)
            </button>
            <button
              onClick={() => setActiveTab('example')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'example'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. example_automation.py (Скрипт автоматизации)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab === 'sdk') {
                  downloadFile('termux_bridge.py', formattedSdk);
                } else {
                  downloadFile('example_automation.py', formattedExample);
                }
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать .py</span>
            </button>

            <button
              onClick={activeTab === 'sdk' ? handleCopySdk : handleCopyExample}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
            >
              {(activeTab === 'sdk' ? copiedSdk : copiedExample) ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{(activeTab === 'sdk' ? copiedSdk : copiedExample) ? 'Скопировано!' : 'Копировать'}</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-700 leading-relaxed">
          <pre>{activeTab === 'sdk' ? formattedSdk : formattedExample}</pre>
        </div>
      </div>
    </div>
  );
};
