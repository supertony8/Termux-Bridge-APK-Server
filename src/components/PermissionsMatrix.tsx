import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Terminal, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { PERMISSIONS_LIST } from '../data/capabilities';

export const PermissionsMatrix: React.FC = () => {
  const [copiedAdb, setCopiedAdb] = useState<boolean>(false);

  const adbGrantScript = `#!/bin/bash
# Скрипт для быстрой выдачи всех прав через ADB без всплывающих диалогов:
PKG="com.termuxbridge.server"

echo "Предоставление runtime-разрешений для $PKG..."
adb shell pm grant $PKG android.permission.CAMERA
adb shell pm grant $PKG android.permission.RECORD_AUDIO
adb shell pm grant $PKG android.permission.ACCESS_FINE_LOCATION
adb shell pm grant $PKG android.permission.ACCESS_COARSE_LOCATION
adb shell pm grant $PKG android.permission.READ_PHONE_STATE
adb shell pm grant $PKG android.permission.POST_NOTIFICATIONS

# Выдача доступа ко всем файлам (MANAGE_EXTERNAL_STORAGE на Android 11+)
adb shell appops set --uid $PKG MANAGE_EXTERNAL_STORAGE allow

# Игнорирование оптимизации батареи (Doze Mode) для бесперебойной работы сервера
adb shell dumpsys deviceidle whitelist +$PKG

echo "Все права успешно предоставлены!"`;

  const handleCopyAdb = () => {
    navigator.clipboard.writeText(adbGrantScript);
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Архитектура разрешений Android и особенности ОС
            </h2>
            <p className="text-xs text-slate-400">
              Как Android разграничивает доступ к аппаратуре и как APK безопасно получает права
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
          В современных версиях Android (6.0 - 15) для защиты приватности доступ к камере, микрофону, файлам и сенсорам строго контролируется. Наш APK запрашивает права поэтапно через стандартные системные диалоги и фоновый сервис с постоянным уведомлением в шторке.
        </p>

        {/* Categories of permissions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Опасные права (Runtime)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Камера, Микрофон, Точная геолокация, Телефон. Запрашиваются при первом запуске приложения через стандартный диалог Android.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Key className="w-4 h-4" />
              <span>Специальный доступ (Special Access)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              MANAGE_EXTERNAL_STORAGE (Android 11+). Предоставляется пользователем в системном меню «Настройки » Специальный доступ » Доступ ко всем файлам».
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle className="w-4 h-4" />
              <span>Обычные права (Install-Time)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Wi-Fi, Вибрация, WakeLock, Доступ в сеть. Предоставляются автоматически системой Android при установке APK файла.
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          Полная матрица разрешений APK Bridge
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold">Разрешение в Manifest</th>
                <th className="py-3 px-4 font-semibold">Название и цель</th>
                <th className="py-3 px-4 font-semibold">Тип доступа</th>
                <th className="py-3 px-4 font-semibold">Особенности версий Android</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {PERMISSIONS_LIST.map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {perm.permission}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-100 mb-0.5">{perm.name}</div>
                    <div className="text-slate-400 text-[11px]">{perm.purpose}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {perm.howToGrant === 'runtime_dialog' && (
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-semibold text-[10px]">
                        Runtime Dialog
                      </span>
                    )}
                    {perm.howToGrant === 'special_access' && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-semibold text-[10px]">
                        Special Settings
                      </span>
                    )}
                    {perm.howToGrant === 'install_time' && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold text-[10px]">
                        Install-Time
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] leading-relaxed">
                    {perm.androidVersionNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADB One-Click Script */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>Автоматическая выдача всех прав через ADB (Для разработчиков)</span>
          </div>
          <button
            onClick={handleCopyAdb}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            {copiedAdb ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAdb ? 'Скопировано!' : 'Копировать bash скрипт'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Если вы подключаете телефон к компьютеру по ADB или запускаете Shizuku в Termux, вы можете выдать все разрешения без ручных кликов:
        </p>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
          <pre>{adbGrantScript}</pre>
        </div>
      </div>
    </div>
  );
};
