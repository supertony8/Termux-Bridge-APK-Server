import React, { useState } from 'react';
import { 
  Camera, 
  Mic, 
  Wifi, 
  Activity, 
  FolderTree, 
  AppWindow, 
  Cpu, 
  Bell, 
  MapPin, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { API_ENDPOINTS, COMPARISON_DATA } from '../data/capabilities';
import { EndpointCategory, ApiEndpoint } from '../types/bridge';

interface CapabilitiesDirectoryProps {
  onSelectEndpoint: (endpointId: string) => void;
}

export const CapabilitiesDirectory: React.FC<CapabilitiesDirectoryProps> = ({ onSelectEndpoint }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: string; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'Все возможности', icon: <Layers className="w-4 h-4" />, count: API_ENDPOINTS.length },
    { id: 'camera', label: 'Камера & Фонарик', icon: <Camera className="w-4 h-4" />, count: API_ENDPOINTS.filter(e => e.category === 'camera').length },
    { id: 'audio', label: 'Аудио, Микрофон & TTS', icon: <Mic className="w-4 h-4" />, count: API_ENDPOINTS.filter(e => e.category === 'audio').length },
    { id: 'network', label: 'Сеть, Wi-Fi & Сотовая', icon: <Wifi className="w-4 h-4" />, count: API_ENDPOINTS.filter(e => e.category === 'network').length },
    { id: 'sensors', label: 'Аппаратные Сенсоры', icon: <Activity className="w-4 h-4" />, count: API_ENDPOINTS.filter(e => e.category === 'sensors').length },
    { id: 'storage', label: 'Файлы & Накопитель', icon: <FolderTree className="w-4 h-4" />, count: API_ENDPOINTS.filter(e => e.category === 'storage').length },
    { id: 'apps', label: 'Пакеты & Приложения', icon: <AppWindow className="w-4 h-4" />, count: API_ENDPOINTS.filter(e => e.category === 'apps').length },
    { id: 'system', label: 'Система, Батарея & Toast', icon: <Cpu className="w-4 h-4" />, count: API_ENDPOINTS.filter(e => e.category === 'system').length },
    { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-4 h-4" />, count: API_ENDPOINTS.filter(e => e.category === 'notifications').length },
    { id: 'location', label: 'GPS Геолокация', icon: <MapPin className="w-4 h-4" />, count: API_ENDPOINTS.filter(e => e.category === 'location').length }
  ];

  const filteredEndpoints = API_ENDPOINTS.filter(endpoint => {
    const matchesCat = selectedCategory === 'all' || endpoint.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      endpoint.title.toLowerCase().includes(q) ||
      endpoint.path.toLowerCase().includes(q) ||
      endpoint.description.toLowerCase().includes(q) ||
      endpoint.whyNotDirectTermux.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/70 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5" />
            Полная спецификация Android HTTP Bridge
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Полный список возможностей Android для Termux и Web
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Termux изолирован в среде Android и не имеет прямого доступа к закрытым подсистемам ОС без специального приложения с Foreground Service и системными разрешениями. Данный APK запускает легковесный Ktor/CIO HTTP REST-сервер на телефоне, предоставляя скриптам в Termux и веб-страницам полный контроль над аппаратурой устройства.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
              <div className="text-2xl font-black text-emerald-400">30+</div>
              <div className="text-xs text-slate-400 mt-0.5">Готовых REST API</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
              <div className="text-2xl font-black text-cyan-400">0 мс</div>
              <div className="text-xs text-slate-400 mt-0.5">Локальная задержка</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
              <div className="text-2xl font-black text-amber-400">Android 7–15</div>
              <div className="text-xs text-slate-400 mt-0.5">Поддержка версий</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
              <div className="text-2xl font-black text-purple-400">JSON / Raw</div>
              <div className="text-xs text-slate-400 mt-0.5">Форматы ответов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section: Termux Alone vs APK Bridge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Сравнение: Termux без APK vs Termux + Наш APK Bridge
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Почему скриптам в Termux нужен этот HTTP-сервер для полноценной работы
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold">Функционал устройства</th>
                <th className="py-3 px-4 font-semibold text-rose-400">Обычный Termux (Без APK)</th>
                <th className="py-3 px-4 font-semibold text-emerald-400">С нашим APK Bridge Сервером</th>
                <th className="py-3 px-4 font-semibold text-cyan-300">Преимущество</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {COMPARISON_DATA.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-200">{item.feature}</td>
                  <td className="py-3.5 px-4 text-rose-300/90 bg-rose-950/10">
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{item.termuxAlone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300/90 bg-emerald-950/10">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item.apkBridge}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.advantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-slate-100">
            Реестр эндпоинтов ({filteredEndpoints.length})
          </h3>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по API, камере, wifi, звуку..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Endpoints Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEndpoints.map((endpoint) => {
          const isPost = endpoint.method === 'POST';
          return (
            <div
              key={endpoint.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-md flex flex-col justify-between transition hover:shadow-lg hover:shadow-emerald-950/20 group"
            >
              <div className="space-y-3">
                {/* Header: Method + Path + Android API badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[11px] ${
                      isPost ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="font-semibold text-slate-100">{endpoint.path}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                    {endpoint.androidApiLevel}
                  </span>
                </div>

                {/* Title and Description */}
                <div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition">
                    {endpoint.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {endpoint.description}
                  </p>
                </div>

                {/* Why not direct Termux */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400/90 block mb-0.5">
                    ⚙️ Зачем нужен APK мост:
                  </span>
                  {endpoint.whyNotDirectTermux}
                </div>

                {/* Permissions required */}
                {endpoint.requiredPermissions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <Shield className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                    <span className="text-[11px] text-slate-400">Права:</span>
                    {endpoint.requiredPermissions.map((perm) => (
                      <span
                        key={perm}
                        className="text-[10px] font-mono bg-slate-800 text-amber-300/90 px-1.5 py-0.5 rounded border border-slate-700/60"
                      >
                        {perm.replace('android.permission.', '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Action: Test in Console */}
              <div className="pt-4 mt-3 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Ответ: {endpoint.responseType}
                </span>
                <button
                  onClick={() => onSelectEndpoint(endpoint.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 px-3 py-1.5 rounded-lg transition"
                >
                  <span>Тестировать в консоли</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
