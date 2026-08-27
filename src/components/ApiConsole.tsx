import React, { useState } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  Code, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  Info,
  Clock,
  CheckCircle2,
  FileCode,
  Volume2,
  Camera,
  Layers
} from 'lucide-react';
import { API_ENDPOINTS } from '../data/capabilities';
import { ApiEndpoint } from '../types/bridge';

interface ApiConsoleProps {
  selectedEndpointId?: string;
  serverHost: string;
  serverPort: number;
}

export const ApiConsole: React.FC<ApiConsoleProps> = ({
  selectedEndpointId,
  serverHost,
  serverPort
}) => {
  const [currentId, setCurrentId] = useState<string>(selectedEndpointId || API_ENDPOINTS[0].id);
  const [codeTab, setCodeTab] = useState<'python' | 'curl' | 'js'>('python');
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const endpoint = API_ENDPOINTS.find(e => e.id === currentId) || API_ENDPOINTS[0];
  const baseUrl = `http://${serverHost}:${serverPort}`;

  const handleParamChange = (paramName: string, value: any) => {
    setParamValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const getActiveParamValue = (paramName: string, defaultValue: any) => {
    if (paramValues[paramName] !== undefined) {
      return paramValues[paramName];
    }
    return defaultValue;
  };

  const executeMockRequest = () => {
    setLoading(true);
    setExecutionTime(null);
    const start = performance.now();

    setTimeout(() => {
      // Build simulated response incorporating custom param values
      let mockRes: any = JSON.parse(JSON.stringify(endpoint.sampleResponse));
      if (typeof mockRes === 'object' && mockRes !== null) {
        mockRes.server_timestamp = Date.now();
        mockRes.port_active = serverPort;

        // Custom parameter injections for realistic interactive feedback
        if (endpoint.id === 'system_toast') {
          mockRes.message = getActiveParamValue('message', 'Привет из Termux!');
        } else if (endpoint.id === 'audio_tts_speak') {
          mockRes.text = getActiveParamValue('text', 'Внимание! Задача в Termux успешно выполнена.');
        } else if (endpoint.id === 'camera_torch') {
          mockRes.torch_enabled = getActiveParamValue('enabled', true);
        } else if (endpoint.id === 'camera_capture') {
          mockRes.camera_used = getActiveParamValue('camera', 'back');
        } else if (endpoint.id === 'system_vibrate') {
          mockRes.duration_ms = getActiveParamValue('duration_ms', 500);
        } else if (endpoint.id === 'network_wifi_toggle') {
          mockRes.wifi_enabled = getActiveParamValue('enable', true);
        }
      }

      setResponseOutput(mockRes);
      setExecutionTime(Math.round(performance.now() - start + 4));
      setLoading(false);
    }, 280);
  };

  // Generate dynamic code snippets with user custom params
  const generateDynamicPython = () => {
    if (endpoint.method === 'GET') {
      const queryParams: Record<string, any> = {};
      endpoint.params.forEach(p => {
        queryParams[p.name] = getActiveParamValue(p.name, p.defaultValue);
      });
      const hasParams = Object.keys(queryParams).length > 0;
      return `import requests

# Запрос к Android Bridge на порту ${serverPort}
url = "${baseUrl}${endpoint.path}"
${hasParams ? `params = ${JSON.stringify(queryParams, null, 4)}\nres = requests.get(url, params=params)` : `res = requests.get(url)`}
data = res.json()
print("Ответ устройства:", data)`;
    } else {
      const bodyParams: Record<string, any> = {};
      endpoint.params.forEach(p => {
        bodyParams[p.name] = getActiveParamValue(p.name, p.defaultValue);
      });
      return `import requests

# Отправка команды на Android устройство
url = "${baseUrl}${endpoint.path}"
payload = ${JSON.stringify(bodyParams, null, 4)}

response = requests.post(url, json=payload)
print("Статус:", response.status_code)
print("Результат:", response.json())`;
    }
  };

  const generateDynamicCurl = () => {
    if (endpoint.method === 'GET') {
      const paramsList: string[] = [];
      endpoint.params.forEach(p => {
        const val = getActiveParamValue(p.name, p.defaultValue);
        if (val !== undefined) paramsList.push(`${p.name}=${encodeURIComponent(String(val))}`);
      });
      const query = paramsList.length > 0 ? `?${paramsList.join('&')}` : '';
      return `curl -X GET "${baseUrl}${endpoint.path}${query}"`;
    } else {
      const bodyParams: Record<string, any> = {};
      endpoint.params.forEach(p => {
        bodyParams[p.name] = getActiveParamValue(p.name, p.defaultValue);
      });
      return `curl -X POST "${baseUrl}${endpoint.path}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(bodyParams)}'`;
    }
  };

  const generateDynamicJs = () => {
    if (endpoint.method === 'GET') {
      return `// Вызов с вашей веб-страницы или браузера
async function fetchBridgeData() {
  const response = await fetch("${baseUrl}${endpoint.path}");
  const data = await response.json();
  console.log("Данные устройства:", data);
  return data;
}

fetchBridgeData();`;
    } else {
      const bodyParams: Record<string, any> = {};
      endpoint.params.forEach(p => {
        bodyParams[p.name] = getActiveParamValue(p.name, p.defaultValue);
      });
      return `// Вызов действия с вашей веб-страницы
async function sendBridgeCommand() {
  const response = await fetch("${baseUrl}${endpoint.path}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(${JSON.stringify(bodyParams, null, 2)})
  });
  const result = await response.json();
  console.log("Результат выполнения:", result);
  return result;
}

sendBridgeCommand();`;
    }
  };

  const currentCode = 
    codeTab === 'python' ? generateDynamicPython() :
    codeTab === 'curl' ? generateDynamicCurl() :
    generateDynamicJs();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJson = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="w-full">
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Выберите API эндпоинт для тестирования:
            </label>
            <select
              value={currentId}
              onChange={(e) => {
                setCurrentId(e.target.value);
                setResponseOutput(null);
                setParamValues({});
              }}
              className="w-full md:w-96 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500 transition"
            >
              {API_ENDPOINTS.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  [{ep.method}] {ep.path} — {ep.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={executeMockRequest}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 transition disabled:opacity-50 w-full md:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Отправка...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Выполнить запрос</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters & Response on Left, Code Snippet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Endpoint details, Params, Live Response */}
        <div className="lg:col-span-7 space-y-6">
          {/* Endpoint Info Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={`px-2.5 py-0.5 rounded font-bold ${
                  endpoint.method === 'POST'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {endpoint.method}
                </span>
                <span className="font-bold text-slate-100 text-sm">{baseUrl}{endpoint.path}</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                {endpoint.androidApiLevel}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 text-base">{endpoint.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{endpoint.description}</p>
            </div>

            {endpoint.requiredPermissions.length > 0 && (
              <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 text-xs text-amber-200/90 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">Требуемые разрешения: </span>
                  {endpoint.requiredPermissions.join(', ')}
                </div>
              </div>
            )}

            {/* Configurable Parameters Form */}
            {endpoint.params.length > 0 ? (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Параметры запроса:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {endpoint.params.map((param) => {
                    const activeVal = getActiveParamValue(param.name, param.defaultValue);
                    return (
                      <div key={param.name} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-emerald-400">{param.name}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{param.type}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{param.description}</p>

                        {/* Input controls based on type */}
                        {param.type === 'boolean' ? (
                          <div className="flex items-center gap-3 pt-1">
                            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                              <input
                                type="radio"
                                name={param.name}
                                checked={activeVal === true}
                                onChange={() => handleParamChange(param.name, true)}
                                className="text-emerald-500 focus:ring-0"
                              />
                              <span>true</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                              <input
                                type="radio"
                                name={param.name}
                                checked={activeVal === false}
                                onChange={() => handleParamChange(param.name, false)}
                                className="text-emerald-500 focus:ring-0"
                              />
                              <span>false</span>
                            </label>
                          </div>
                        ) : param.type === 'enum' && param.options ? (
                          <select
                            value={String(activeVal)}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                          >
                            {param.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : param.type === 'number' ? (
                          <input
                            type="number"
                            value={activeVal ?? ''}
                            onChange={(e) => handleParamChange(param.name, Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        ) : (
                          <input
                            type="text"
                            value={activeVal ?? ''}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Эндпоинт не требует дополнительных параметров (GET-запрос без тела).</span>
              </div>
            )}
          </div>

          {/* Response Console Output */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Ответ сервера устройства (JSON)
                </h4>
              </div>
              <div className="flex items-center gap-2">
                {executionTime !== null && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {executionTime} мс (200 OK)
                  </span>
                )}
                {responseOutput && (
                  <button
                    onClick={handleCopyJson}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition text-xs flex items-center gap-1"
                    title="Копировать JSON ответа"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs overflow-x-auto max-h-80 scrollbar-thin scrollbar-thumb-slate-700">
              {loading ? (
                <div className="flex items-center justify-center py-10 text-slate-400 space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Выполнение команды на Android устройстве...</span>
                </div>
              ) : responseOutput ? (
                <pre className="text-emerald-300">
                  {JSON.stringify(responseOutput, null, 2)}
                </pre>
              ) : (
                <div className="text-slate-500 py-8 text-center">
                  Нажмите кнопку <strong className="text-slate-300">«Выполнить запрос»</strong> выше, чтобы симулировать вызов эндпоинта и увидеть реальный ответ устройства.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Dynamic Code Snippet in Python, cURL, JS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCodeTab('python')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    codeTab === 'python'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Python (Termux)
                </button>
                <button
                  onClick={() => setCodeTab('curl')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    codeTab === 'curl'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  cURL (Bash)
                </button>
                <button
                  onClick={() => setCodeTab('js')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    codeTab === 'js'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  JavaScript
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Скопировано!' : 'Копировать'}</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto flex-1 leading-relaxed">
              <pre>{currentCode}</pre>
            </div>

            <div className="mt-3 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              💡 <strong>Подсказка для Termux:</strong> Сохраните этот код в файл <code className="text-emerald-300">script.py</code> и запустите в терминале: <code className="text-emerald-300 font-bold">python script.py</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
