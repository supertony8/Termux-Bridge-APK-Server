import { ApiEndpoint, PermissionDetail } from '../types/bridge';

export const PERMISSIONS_LIST: PermissionDetail[] = [
  {
    permission: 'android.permission.CAMERA',
    name: 'Камера (Camera)',
    dangerous: true,
    purpose: 'Съемка фотографий (фронтальная/основная), запись видео, считывание штрихкодов.',
    androidVersionNote: 'Требуется runtime-разрешение с Android 6.0 (API 23+). В Android 11+ доступ в фоне требует Foreground Service с типом camera.',
    howToGrant: 'runtime_dialog'
  },
  {
    permission: 'android.permission.RECORD_AUDIO',
    name: 'Микрофон (Record Audio)',
    dangerous: true,
    purpose: 'Запись звука в MP3/AAC/WAV файл, анализ громкости окружения.',
    androidVersionNote: 'Требуется runtime-разрешение. С Android 10 фоновая запись требует Foreground Service с типом microphone.',
    howToGrant: 'runtime_dialog'
  },
  {
    permission: 'android.permission.ACCESS_FINE_LOCATION',
    name: 'Точная геолокация (GPS Location)',
    dangerous: true,
    purpose: 'Получение точных GPS координат (широта, долгота, высота, скорость), сканирование Wi-Fi сетей и Bluetooth.',
    androidVersionNote: 'С Android 9/10 сканирование Wi-Fi и Bluetooth жестко требует ACCESS_FINE_LOCATION.',
    howToGrant: 'runtime_dialog'
  },
  {
    permission: 'android.permission.CHANGE_WIFI_STATE',
    name: 'Управление Wi-Fi (Change Wi-Fi State)',
    dangerous: false,
    purpose: 'Включение/выключение Wi-Fi модуля, переключение сетей.',
    androidVersionNote: 'В Android 10+ (API 29+) прямой вызов setWifiEnabled() заблокирован Google для сторонних приложений (требуется показ системного Wifi Panel / Settings Intent или права Shizuku/Root).',
    howToGrant: 'install_time'
  },
  {
    permission: 'android.permission.ACCESS_WIFI_STATE',
    name: 'Чтение состояния Wi-Fi',
    dangerous: false,
    purpose: 'Получение текущего SSID, BSSID, уровня сигнала (RSSI), IP-адреса, скорости линка.',
    androidVersionNote: 'Для получения имени сети (SSID) в новых версиях Android также требуется Location.',
    howToGrant: 'install_time'
  },
  {
    permission: 'android.permission.READ_PHONE_STATE',
    name: 'Состояние мобильной сети и SIM',
    dangerous: true,
    purpose: 'Тип сети (5G/LTE/3G), оператор связи, уровень сигнала сотовой связи, состояние SIM-карты.',
    androidVersionNote: 'Требует запроса в рантайме. Прямое программное выключение мобильных данных требует системных привилегий (Root/Shizuku/Device Owner), иначе открывается экран настроек сети.',
    howToGrant: 'runtime_dialog'
  },
  {
    permission: 'android.permission.MANAGE_EXTERNAL_STORAGE',
    name: 'Полный доступ ко всем файлам',
    dangerous: true,
    purpose: 'Чтение и запись любых файлов во внутренней памяти (/sdcard), управление файлами, архивация.',
    androidVersionNote: 'Android 11+ (API 30+). Выдается через специальный экран системных настроек "Доступ ко всем файлам".',
    howToGrant: 'special_access'
  },
  {
    permission: 'android.permission.QUERY_ALL_PACKAGES',
    name: 'Список всех установленных приложений',
    dangerous: true,
    purpose: 'Получение полного списка установленных пакетов, их названий, иконок, разрешений и версий.',
    androidVersionNote: 'Android 11+ (API 30+). Без этого разрешения PackageManager возвращает только системные приложения и ограниченный набор.',
    howToGrant: 'install_time'
  },
  {
    permission: 'android.permission.FOREGROUND_SERVICE',
    name: 'Работа сервера в фоне (Foreground Service)',
    dangerous: false,
    purpose: 'Позволяет HTTP-серверу работать непрерывно, когда экран выключен или открыто другое приложение.',
    androidVersionNote: 'Показывает постоянное уведомление в шторке со статусом и текущим портом/IP.',
    howToGrant: 'install_time'
  },
  {
    permission: 'android.permission.POST_NOTIFICATIONS',
    name: 'Отправка уведомлений',
    dangerous: true,
    purpose: 'Показ системных уведомлений в шторке Android (Android 13+).',
    androidVersionNote: 'Требуется runtime-запрос на Android 13+ (API 33+).',
    howToGrant: 'runtime_dialog'
  },
  {
    permission: 'android.permission.VIBRATE',
    name: 'Вибрация устройства',
    dangerous: false,
    purpose: 'Тактильный отклик, вибросигналы заданной длительности и паттерна.',
    androidVersionNote: 'Обычное системное разрешение, предоставляется автоматически при установке.',
    howToGrant: 'install_time'
  },
  {
    permission: 'android.permission.WAKE_LOCK',
    name: 'Предотвращение сна процессора',
    dangerous: false,
    purpose: 'Удержание процессора в активном состоянии при обработке фоновых команд при выключенном экране.',
    androidVersionNote: 'Используется совместно с Foreground Service и PowerManager.WakeLock.',
    howToGrant: 'install_time'
  }
];

export const API_ENDPOINTS: ApiEndpoint[] = [
  // ===================== CAMERA =====================
  {
    id: 'camera_capture',
    category: 'camera',
    method: 'POST',
    path: '/api/camera/capture',
    title: 'Снимок с камеры (Photo Capture)',
    description: 'Делает моментальный снимок с фронтальной или основной камеры в высоком разрешении без запуска системного интерфейса видоискателя и возвращает файл или base64.',
    whyNotDirectTermux: 'В обычном Termux без termux-api нет доступа к Camera2 / CameraX HAL подсистемам Android. Данный APK напрямую использует CameraX API с аппаратным захватом кадра в фоновом сервисе.',
    requiredPermissions: ['android.permission.CAMERA'],
    androidApiLevel: 'API 21+ (Lollipop - Android 15)',
    params: [
      { name: 'camera', type: 'enum', required: false, defaultValue: 'back', options: ['back', 'front'], description: 'Выбор камеры: back (основная) или front (селфи)' },
      { name: 'flash', type: 'enum', required: false, defaultValue: 'off', options: ['off', 'on', 'auto', 'torch'], description: 'Режим вспышки' },
      { name: 'quality', type: 'number', required: false, defaultValue: 90, description: 'Качество JPEG компрессии (1-100)' },
      { name: 'save_to_file', type: 'boolean', required: false, defaultValue: false, description: 'Если true, сохраняет на диск в /sdcard/Bridge/Photos/ и возвращает путь' }
    ],
    sampleRequestBody: { camera: 'back', flash: 'off', quality: 90, save_to_file: false },
    sampleResponse: {
      status: 'success',
      timestamp: 1714567890000,
      width: 4032,
      height: 3024,
      format: 'image/jpeg',
      size_bytes: 2458120,
      file_path: '/sdcard/Bridge/Photos/photo_20260827_154012.jpg',
      base64_data: 'iVBORw0KGgoAAAANSUhEUgAA...'
    },
    responseType: 'json',
    pythonExample: `import requests

# Захват фото с основной камеры и сохранение в файл в Termux
res = requests.post("http://127.0.0.1:8080/api/camera/capture", json={
    "camera": "back",
    "flash": "off",
    "quality": 85,
    "save_to_file": True
})
data = res.json()
print("Фото сделано:", data["file_path"], "Размер:", data["size_bytes"], "байт")`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/camera/capture \\
  -H "Content-Type: application/json" \\
  -d '{"camera":"back","flash":"off","quality":85,"save_to_file":true}'`
  },
  {
    id: 'camera_torch',
    category: 'camera',
    method: 'POST',
    path: '/api/camera/torch',
    title: 'Фонарик / Вспышка (Torch Toggle)',
    description: 'Включает или выключает светодиодный фонарик камеры с регулировкой яркости (на поддерживаемых устройствах).',
    whyNotDirectTermux: 'Прямой доступ к CameraManager.setTorchMode() доступен только приложениям Android.',
    requiredPermissions: ['android.permission.CAMERA'],
    androidApiLevel: 'API 23+ (Marshmallow+)',
    params: [
      { name: 'enabled', type: 'boolean', required: true, defaultValue: true, description: 'true - включить фонарик, false - выключить' },
      { name: 'level', type: 'number', required: false, defaultValue: 1, description: 'Уровень яркости фонарика (1-100, если поддерживается)' }
    ],
    sampleRequestBody: { enabled: true, level: 100 },
    sampleResponse: { status: 'success', torch_enabled: true, brightness_level: 100 },
    responseType: 'json',
    pythonExample: `import requests

# Включить фонарик
requests.post("http://127.0.0.1:8080/api/camera/torch", json={"enabled": True})

# Выключить фонарик
# requests.post("http://127.0.0.1:8080/api/camera/torch", json={"enabled": False})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/camera/torch -H "Content-Type: application/json" -d '{"enabled": true}'`
  },

  // ===================== AUDIO =====================
  {
    id: 'audio_record_start',
    category: 'audio',
    method: 'POST',
    path: '/api/audio/record/start',
    title: 'Начать запись звука с микрофона',
    description: 'Запускает высококачественную фоновую запись звука с микрофона в файл (M4A/AAC или WAV/MP3) с настраиваемым битрейтом и частотой дискретизации.',
    whyNotDirectTermux: 'Termux процесс не имеет прямого доступа к аппаратным AudioRecord / MediaRecorder дескрипторам без специального Android Service.',
    requiredPermissions: ['android.permission.RECORD_AUDIO', 'android.permission.FOREGROUND_SERVICE'],
    androidApiLevel: 'API 21+',
    params: [
      { name: 'output_file', type: 'string', required: false, defaultValue: '/sdcard/Bridge/Audio/record.m4a', description: 'Целевой путь для сохранения аудиофайла' },
      { name: 'format', type: 'enum', required: false, defaultValue: 'aac', options: ['aac', 'wav', 'mp3', '3gp'], description: 'Аудио кодек / контейнер' },
      { name: 'sample_rate', type: 'number', required: false, defaultValue: 44100, description: 'Частота дискретизации (Гц): 16000, 44100, 48000' },
      { name: 'max_duration_sec', type: 'number', required: false, defaultValue: 0, description: 'Максимальная длительность записи в секундах (0 = бесконечно до команды stop)' }
    ],
    sampleRequestBody: { output_file: '/sdcard/Bridge/Audio/voice_01.m4a', format: 'aac', sample_rate: 44100 },
    sampleResponse: { status: 'recording_started', recording_id: 'rec_9281', file_path: '/sdcard/Bridge/Audio/voice_01.m4a', sample_rate: 44100 },
    responseType: 'json',
    pythonExample: `import requests, time

# Запуск записи на 5 секунд
requests.post("http://127.0.0.1:8080/api/audio/record/start", json={
    "output_file": "/sdcard/Bridge/Audio/mic_test.m4a",
    "format": "aac"
})
print("Запись микрофона пошла...")
time.sleep(5)

# Остановка записи
res = requests.post("http://127.0.0.1:8080/api/audio/record/stop")
print("Запись завершена:", res.json())`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/audio/record/start -H "Content-Type: application/json" -d '{"format":"aac"}'`
  },
  {
    id: 'audio_record_stop',
    category: 'audio',
    method: 'POST',
    path: '/api/audio/record/stop',
    title: 'Остановить запись с микрофона',
    description: 'Завершает текущую активную запись звука, сбрасывает буферы на диск и возвращает статистику (размер файла, точную продолжительность).',
    whyNotDirectTermux: 'Управляет жизненным циклом активного MediaRecorder сервиса в APK.',
    requiredPermissions: ['android.permission.RECORD_AUDIO'],
    androidApiLevel: 'API 21+',
    params: [],
    sampleResponse: {
      status: 'success',
      duration_ms: 5120,
      file_path: '/sdcard/Bridge/Audio/mic_test.m4a',
      file_size_bytes: 84320,
      format: 'audio/mp4'
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.post("http://127.0.0.1:8080/api/audio/record/stop")
print(res.json())`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/audio/record/stop`
  },
  {
    id: 'audio_play',
    category: 'audio',
    method: 'POST',
    path: '/api/audio/play',
    title: 'Проигрывание звука (Audio Playback)',
    description: 'Воспроизводит локальный аудиофайл или онлайн-аудиопоток через системный динамик устройства с контролем громкости и зацикливания.',
    whyNotDirectTermux: 'MediaPlayer Android обеспечивает нативный аппаратный рендеринг звука даже в спящем режиме.',
    requiredPermissions: [],
    androidApiLevel: 'API 21+',
    params: [
      { name: 'file_path', type: 'string', required: false, description: 'Абсолютный путь к файлу на устройстве (например, /sdcard/Music/sound.mp3)' },
      { name: 'url', type: 'string', required: false, description: 'Или URL аудиопотока' },
      { name: 'volume', type: 'number', required: false, defaultValue: 1.0, description: 'Громкость от 0.0 до 1.0' },
      { name: 'loop', type: 'boolean', required: false, defaultValue: false, description: 'Зациклить воспроизведение' }
    ],
    sampleRequestBody: { file_path: '/sdcard/Bridge/Audio/voice_01.m4a', volume: 1.0, loop: false },
    sampleResponse: { status: 'playing', duration_ms: 12400, track: '/sdcard/Bridge/Audio/voice_01.m4a' },
    responseType: 'json',
    pythonExample: `import requests

# Проиграть записанный файл
requests.post("http://127.0.0.1:8080/api/audio/play", json={
    "file_path": "/sdcard/Bridge/Audio/voice_01.m4a",
    "volume": 1.0
})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/audio/play -H "Content-Type: application/json" -d '{"file_path":"/sdcard/Bridge/Audio/voice_01.m4a"}'`
  },
  {
    id: 'audio_tts_speak',
    category: 'audio',
    method: 'POST',
    path: '/api/audio/tts/speak',
    title: 'Синтез речи (Text-to-Speech)',
    description: 'Озвучивает переданный текст голосом встроенного синтезатора Google TTS или системного движка на русском, английском и других языках.',
    whyNotDirectTermux: 'Использует системный Android TextToSpeech движок (Google Speech Engine) с естественными нейросетевыми голосами.',
    requiredPermissions: [],
    androidApiLevel: 'API 21+',
    params: [
      { name: 'text', type: 'string', required: true, defaultValue: 'Привет! Сервер успешно запущен в Termux.', description: 'Текст для произнесения' },
      { name: 'lang', type: 'string', required: false, defaultValue: 'ru_RU', options: ['ru_RU', 'en_US', 'de_DE', 'fr_FR'], description: 'Язык и локаль' },
      { name: 'pitch', type: 'number', required: false, defaultValue: 1.0, description: 'Высота тона (0.5 - 2.0)' },
      { name: 'rate', type: 'number', required: false, defaultValue: 1.0, description: 'Скорость речи (0.5 - 2.0)' }
    ],
    sampleRequestBody: { text: 'Внимание! Задача в Termux успешно выполнена.', lang: 'ru_RU', rate: 1.0 },
    sampleResponse: { status: 'spoken', text_length: 44, lang: 'ru_RU' },
    responseType: 'json',
    pythonExample: `import requests

# Озвучить голосовое оповещение из скрипта Termux
requests.post("http://127.0.0.1:8080/api/audio/tts/speak", json={
    "text": "Температура процессора в норме, резервная копия создана.",
    "lang": "ru_RU",
    "rate": 1.1
})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/audio/tts/speak -H "Content-Type: application/json" -d '{"text":"Привет из Termux!","lang":"ru_RU"}'`
  },

  // ===================== NETWORK =====================
  {
    id: 'network_wifi_status',
    category: 'network',
    method: 'GET',
    path: '/api/network/wifi/status',
    title: 'Статус Wi-Fi и подключение',
    description: 'Возвращает подробные параметры текущего Wi-Fi соединения: включен ли модуль, SSID сети, BSSID точки, RSSI уровень сигнала, частоту (2.4/5/6 GHz), скорость линка и локальный IP.',
    whyNotDirectTermux: 'Termux не имеет прямого доступа к WifiManager и системным параметрам сетевого стека без рут-прав.',
    requiredPermissions: ['android.permission.ACCESS_WIFI_STATE', 'android.permission.ACCESS_FINE_LOCATION'],
    androidApiLevel: 'API 21+',
    params: [],
    sampleResponse: {
      wifi_enabled: true,
      connected: true,
      ssid: 'Home_HighSpeed_5G',
      bssid: 'a4:2b:b0:1c:3d:e8',
      rssi_dbm: -54,
      signal_level_percent: 88,
      frequency_mhz: 5240,
      link_speed_mbps: 866,
      ip_address: '192.168.1.145',
      mac_address: '02:00:00:00:00:00',
      is_5ghz: true
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/network/wifi/status")
info = res.json()
print(f"Подключен к Wi-Fi: {info['ssid']} ({info['frequency_mhz']} MHz), Сигнал: {info['signal_level_percent']}%")`,
    curlExample: `curl http://127.0.0.1:8080/api/network/wifi/status`
  },
  {
    id: 'network_wifi_toggle',
    category: 'network',
    method: 'POST',
    path: '/api/network/wifi/toggle',
    title: 'Включение / Выключение Wi-Fi',
    description: 'Переключает состояние модуля Wi-Fi. На Android 9 и ниже через WifiManager.setWifiEnabled. На Android 10+ (API 29+) открывает системный UI диалог / Intent или использует root/Shizuku API.',
    whyNotDirectTermux: 'Начиная с Android 10 Google запретил выключение Wi-Fi приложениями напрямую через API. APK предоставляет правильные fallback механизмы (Activity Intent Panel / Shizuku / Root).',
    requiredPermissions: ['android.permission.CHANGE_WIFI_STATE'],
    androidApiLevel: 'API 21+ (С ограничениями в Android 10+)',
    params: [
      { name: 'enable', type: 'boolean', required: true, description: 'true - включить Wi-Fi, false - выключить' },
      { name: 'mode', type: 'enum', required: false, defaultValue: 'auto', options: ['auto', 'direct_legacy', 'settings_panel', 'shizuku_root'], description: 'Метод переключения' }
    ],
    sampleRequestBody: { enable: true, mode: 'auto' },
    sampleResponse: { status: 'success', requested_state: true, executed_via: 'direct_legacy_or_panel' },
    responseType: 'json',
    pythonExample: `import requests

# Переключить Wi-Fi
requests.post("http://127.0.0.1:8080/api/network/wifi/toggle", json={"enable": True})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/network/wifi/toggle -H "Content-Type: application/json" -d '{"enable":true}'`
  },
  {
    id: 'network_cellular_status',
    category: 'network',
    method: 'GET',
    path: '/api/network/cellular/status',
    title: 'Мобильная сеть и сотовые данные',
    description: 'Возвращает статус сотовой связи: тип сети (5G NR, LTE, HSPA+, GSM), оператора, статус SIM-карты, роуминг, уровень сигнала мобильной сети и включена ли мобильная передача данных.',
    whyNotDirectTermux: 'TelephonyManager требует Android контекста и привилегий READ_PHONE_STATE.',
    requiredPermissions: ['android.permission.READ_PHONE_STATE', 'android.permission.ACCESS_NETWORK_STATE'],
    androidApiLevel: 'API 21+',
    params: [],
    sampleResponse: {
      data_enabled: true,
      network_type: 'LTE (4G)',
      carrier_name: 'MTS / MegaFon',
      sim_state: 'READY',
      is_roaming: false,
      signal_strength_asu: 24,
      signal_level_bars: 4,
      mobile_ip: '10.145.89.22'
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/network/cellular/status")
print("Сеть:", res.json()["network_type"], "Оператор:", res.json()["carrier_name"])`,
    curlExample: `curl http://127.0.0.1:8080/api/network/cellular/status`
  },
  {
    id: 'network_wifi_scan',
    category: 'network',
    method: 'GET',
    path: '/api/network/wifi/scan',
    title: 'Сканирование окружающих Wi-Fi сетей',
    description: 'Запускает сканирование эфира и возвращает список всех обнаруженных Wi-Fi сетей с их SSID, BSSID, уровнем сигнала, типом шифрования (WPA3, WPA2) и частотными каналами.',
    whyNotDirectTermux: 'WifiManager.getScanResults() строго ограничен в Android и требует ACCESS_FINE_LOCATION.',
    requiredPermissions: ['android.permission.ACCESS_FINE_LOCATION', 'android.permission.ACCESS_WIFI_STATE'],
    androidApiLevel: 'API 23+',
    params: [],
    sampleResponse: {
      count: 3,
      networks: [
        { ssid: 'Home_5G', bssid: 'a4:2b:b0:1c:3d:e8', level: -52, frequency: 5240, capabilities: '[WPA2-PSK-CCMP][RSN-PSK-CCMP]' },
        { ssid: 'Neighbor_Wi-Fi', bssid: '70:4f:57:82:11:04', level: -78, frequency: 2412, capabilities: '[WPA2-PSK-CCMP]' },
        { ssid: 'TP-Link_Guest', bssid: '20:e8:82:3a:ff:10', level: -84, frequency: 2437, capabilities: '[WPA-PSK-TKIP]' }
      ]
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/network/wifi/scan")
for net in res.json().get("networks", []):
    print(f"SSID: {net['ssid']}, RSSI: {net['level']} dBm, Freq: {net['frequency']} MHz")`,
    curlExample: `curl http://127.0.0.1:8080/api/network/wifi/scan`
  },

  // ===================== SENSORS =====================
  {
    id: 'sensors_all',
    category: 'sensors',
    method: 'GET',
    path: '/api/sensors/current',
    title: 'Текущие показания аппаратных сенсоров',
    description: 'Возвращает моментальный снимок всех физических датчиков смартфона: Акселерометр (X,Y,Z), Гироскоп, Датчик освещенности (люксы), Датчик приближения (см), Барометр (давление hPa), Компас / Магнитометр, Шагомер.',
    whyNotDirectTermux: 'SensorManager в Android передает аппаратные события ядра через SensorEventListener, доступный сервисам приложений.',
    requiredPermissions: [],
    androidApiLevel: 'API 21+',
    params: [],
    sampleResponse: {
      timestamp: 1714567895120,
      accelerometer: { x: 0.12, y: 9.81, z: 0.45, unit: 'm/s^2' },
      gyroscope: { x: 0.001, y: -0.002, z: 0.004, unit: 'rad/s' },
      light_sensor_lux: 340.5,
      proximity_cm: 5.0,
      barometer_hpa: 1013.25,
      magnetic_field: { x: 12.4, y: -24.1, z: 45.0, unit: 'uT' },
      step_counter: 6420,
      device_orientation: 'PORTRAIT_UP'
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/sensors/current")
sensors = res.json()
print("Освещенность:", sensors.get("light_sensor_lux"), "Lux")
print("Акселерометр:", sensors.get("accelerometer"))
print("Шаги:", sensors.get("step_counter"))`,
    curlExample: `curl http://127.0.0.1:8080/api/sensors/current`
  },

  // ===================== STORAGE & FILES =====================
  {
    id: 'storage_list_files',
    category: 'storage',
    method: 'GET',
    path: '/api/files/list',
    title: 'Файловый менеджер (Список файлов и папок)',
    description: 'Возвращает подробный список файлов и директорий по любому пути (/sdcard, Downloads, DCIM, Documents) с правами, датой модификации, MIME-типом и размером в байтах.',
    whyNotDirectTermux: 'На Android 11+ без MANAGE_EXTERNAL_STORAGE Termux изолирован в Scoped Storage и не видит файлы других приложений или системные папки медиа.',
    requiredPermissions: ['android.permission.MANAGE_EXTERNAL_STORAGE'],
    androidApiLevel: 'API 30+ (Android 11+)',
    params: [
      { name: 'path', type: 'string', required: false, defaultValue: '/sdcard/Download', description: 'Директория для сканирования' },
      { name: 'include_hidden', type: 'boolean', required: false, defaultValue: false, description: 'Включать скрытые файлы (.файлы)' }
    ],
    sampleResponse: {
      directory: '/sdcard/Download',
      total_items: 3,
      items: [
        { name: 'archive.zip', is_dir: false, size_bytes: 14502800, last_modified: 1714560000000, mime: 'application/zip' },
        { name: 'Report.pdf', is_dir: false, size_bytes: 845100, last_modified: 1714565000000, mime: 'application/pdf' },
        { name: 'Photos_Backup', is_dir: true, size_bytes: 0, last_modified: 1714567000000, mime: 'inode/directory' }
      ]
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/files/list", params={"path": "/sdcard/Download"})
for item in res.json().get("items", []):
    type_str = "[DIR]" if item["is_dir"] else f"[{item['size_bytes']//1024} KB]"
    print(f"{type_str} {item['name']}")`,
    curlExample: `curl "http://127.0.0.1:8080/api/files/list?path=/sdcard/Download"`
  },
  {
    id: 'storage_read_file',
    category: 'storage',
    method: 'GET',
    path: '/api/files/read',
    title: 'Чтение / Скачивание файла',
    description: 'Читает содержимое файла с накопителя устройства и возвращает его в виде потока байт (для бинарных файлов) или JSON с текстом/base64.',
    whyNotDirectTermux: 'Позволяет скрипту в Termux или веб-странице мгновенно скачивать любые файлы с устройства через HTTP.',
    requiredPermissions: ['android.permission.MANAGE_EXTERNAL_STORAGE'],
    androidApiLevel: 'API 21+',
    params: [
      { name: 'path', type: 'string', required: true, description: 'Полный путь к файлу' },
      { name: 'as_binary', type: 'boolean', required: false, defaultValue: false, description: 'Если true, отдает сырой бинарный поток' }
    ],
    sampleResponse: {
      path: '/sdcard/Documents/notes.txt',
      size_bytes: 128,
      content: 'Пример текстового содержимого файла на смартфоне...'
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/files/read", params={"path": "/sdcard/Documents/notes.txt"})
print("Содержимое:", res.json().get("content"))`,
    curlExample: `curl "http://127.0.0.1:8080/api/files/read?path=/sdcard/Documents/notes.txt"`
  },
  {
    id: 'storage_write_file',
    category: 'storage',
    method: 'POST',
    path: '/api/files/write',
    title: 'Запись файла на диск устройства',
    description: 'Создает или перезаписывает файл по указанному пути с переданным текстовым или base64 содержимым.',
    whyNotDirectTermux: 'Обходит ограничения Scoped Storage на запись в общие папки.',
    requiredPermissions: ['android.permission.MANAGE_EXTERNAL_STORAGE'],
    androidApiLevel: 'API 30+',
    params: [
      { name: 'path', type: 'string', required: true, description: 'Куда записать файл' },
      { name: 'content', type: 'string', required: true, description: 'Текст или base64 строка' },
      { name: 'append', type: 'boolean', required: false, defaultValue: false, description: 'Дописывать в конец файла (append) или перезаписывать' }
    ],
    sampleRequestBody: { path: '/sdcard/Documents/termux_log.txt', content: 'Лог работы: 2026-08-27 OK\\n', append: true },
    sampleResponse: { status: 'success', bytes_written: 23, path: '/sdcard/Documents/termux_log.txt' },
    responseType: 'json',
    pythonExample: `import requests
requests.post("http://127.0.0.1:8080/api/files/write", json={
    "path": "/sdcard/Documents/status.txt",
    "content": "Выполнено успешно!",
    "append": False
})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/files/write -H "Content-Type: application/json" -d '{"path":"/sdcard/Documents/log.txt","content":"OK\\n","append":true}'`
  },

  // ===================== APPS & PACKAGES =====================
  {
    id: 'apps_list_installed',
    category: 'apps',
    method: 'GET',
    path: '/api/apps/list',
    title: 'Список установленных приложений',
    description: 'Возвращает полный реестр всех приложений на смартфоне: имя пакета (com.example.app), пользовательское название, версию, дату установки/обновления, системное ли приложение, и список запрошенных разрешений.',
    whyNotDirectTermux: 'На Android 11+ требуется специальное разрешение QUERY_ALL_PACKAGES в манифесте APK для просмотра полного списка сторонних приложений.',
    requiredPermissions: ['android.permission.QUERY_ALL_PACKAGES'],
    androidApiLevel: 'API 21+ (Android 11+ QUERY_ALL_PACKAGES)',
    params: [
      { name: 'filter', type: 'enum', required: false, defaultValue: 'all', options: ['all', 'user', 'system'], description: 'Фильтр: все, только пользовательские или системные' },
      { name: 'search', type: 'string', required: false, description: 'Поиск по названию или пакету' }
    ],
    sampleResponse: {
      total: 142,
      apps: [
        { package_name: 'com.termux', app_name: 'Termux', version_name: '0.118.0', version_code: 118, is_system: false, first_install_time: 1714500000000 },
        { package_name: 'org.telegram.messenger', app_name: 'Telegram', version_name: '10.9.1', version_code: 4620, is_system: false, first_install_time: 1714510000000 },
        { package_name: 'com.android.settings', app_name: 'Настройки', version_name: '14', version_code: 34, is_system: true, first_install_time: 1714400000000 }
      ]
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/apps/list", params={"filter": "user"})
apps = res.json().get("apps", [])
print(f"Найдено {len(apps)} пользовательских приложений:")
for app in apps[:10]:
    print(f"- {app['app_name']} ({app['package_name']}) v{app['version_name']}")`,
    curlExample: `curl "http://127.0.0.1:8080/api/apps/list?filter=user"`
  },
  {
    id: 'apps_launch',
    category: 'apps',
    method: 'POST',
    path: '/api/apps/launch',
    title: 'Запуск приложения (Launch App)',
    description: 'Запускает любое установленное приложение по имени его пакета с опциональной передачей Intent параметров, ссылок или действий.',
    whyNotDirectTermux: 'Прямой запуск Intent из сервиса APK с флагом FLAG_ACTIVITY_NEW_TASK.',
    requiredPermissions: [],
    androidApiLevel: 'API 21+',
    params: [
      { name: 'package_name', type: 'string', required: true, defaultValue: 'com.telegram.messenger', description: 'Имя пакета приложения' },
      { name: 'action', type: 'string', required: false, description: 'Intent action (например, android.intent.action.VIEW)' },
      { name: 'uri_data', type: 'string', required: false, description: 'URI данные (например, https://example.com)' }
    ],
    sampleRequestBody: { package_name: 'org.telegram.messenger' },
    sampleResponse: { status: 'launched', package_name: 'org.telegram.messenger' },
    responseType: 'json',
    pythonExample: `import requests
# Запустить Telegram
requests.post("http://127.0.0.1:8080/api/apps/launch", json={"package_name": "org.telegram.messenger"})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/apps/launch -H "Content-Type: application/json" -d '{"package_name":"org.telegram.messenger"}'`
  },

  // ===================== SYSTEM & DEVICE =====================
  {
    id: 'system_battery',
    category: 'system',
    method: 'GET',
    path: '/api/system/battery',
    title: 'Состояние аккумулятора (Battery Info)',
    description: 'Возвращает подробные физические данные батареи: точный процент заряда, статус зарядки (AC сеть, USB, Беспроводная), здоровье аккумулятора, температуру в °C и напряжение в милливольтах.',
    whyNotDirectTermux: 'Регистрирует Intent.ACTION_BATTERY_CHANGED через BatteryManager.',
    requiredPermissions: [],
    androidApiLevel: 'API 21+',
    params: [],
    sampleResponse: {
      level_percent: 78,
      is_charging: true,
      plugged_type: 'AC_CHARGER',
      health: 'GOOD',
      temperature_celsius: 31.5,
      voltage_mv: 4120,
      technology: 'Li-poly'
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/system/battery")
bat = res.json()
print(f"Заряд: {bat['level_percent']}%, Температура: {bat['temperature_celsius']}°C, Зарядка: {bat['is_charging']}")`,
    curlExample: `curl http://127.0.0.1:8080/api/system/battery`
  },
  {
    id: 'system_vibrate',
    category: 'system',
    method: 'POST',
    path: '/api/system/vibrate',
    title: 'Вибрация устройства (Haptics)',
    description: 'Запускает вибромотор смартфона на указанное количество миллисекунд или выполняет сложный вибро-паттерн (например, SOS).',
    whyNotDirectTermux: 'Использует системный Vibrator / CombinedVibrator API.',
    requiredPermissions: ['android.permission.VIBRATE'],
    androidApiLevel: 'API 21+ (VibrationEffect на API 26+)',
    params: [
      { name: 'duration_ms', type: 'number', required: false, defaultValue: 500, description: 'Длительность вибрации в миллисекундах' },
      { name: 'pattern', type: 'string', required: false, description: 'Паттерн через запятую (задержка, вибро, задержка): "0,200,100,200,100,500"' }
    ],
    sampleRequestBody: { duration_ms: 600 },
    sampleResponse: { status: 'vibrated', duration_ms: 600 },
    responseType: 'json',
    pythonExample: `import requests
# Вибрировать 500 мс
requests.post("http://127.0.0.1:8080/api/system/vibrate", json={"duration_ms": 500})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/system/vibrate -H "Content-Type: application/json" -d '{"duration_ms":500}'`
  },
  {
    id: 'system_clipboard_get',
    category: 'system',
    method: 'GET',
    path: '/api/system/clipboard',
    title: 'Чтение буфера обмена (Clipboard Get)',
    description: 'Считывает текущий текстовый буфер обмена Android.',
    whyNotDirectTermux: 'ClipboardManager в современных версиях Android изолирован и требует фонового сервиса или фокуса окна.',
    requiredPermissions: [],
    androidApiLevel: 'API 21+',
    params: [],
    sampleResponse: { text: 'Скопированный текст из приложения...' },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/system/clipboard")
print("Буфер обмена:", res.json().get("text"))`,
    curlExample: `curl http://127.0.0.1:8080/api/system/clipboard`
  },
  {
    id: 'system_clipboard_set',
    category: 'system',
    method: 'POST',
    path: '/api/system/clipboard',
    title: 'Запись в буфер обмена (Clipboard Set)',
    description: 'Копирует переданный текст в системный буфер обмена Android.',
    whyNotDirectTermux: 'Использует ClipboardManager.setPrimaryClip.',
    requiredPermissions: [],
    androidApiLevel: 'API 21+',
    params: [
      { name: 'text', type: 'string', required: true, description: 'Текст для сохранения в буфер' }
    ],
    sampleRequestBody: { text: 'Сгенерированный пароль: X9#kLm99q' },
    sampleResponse: { status: 'success', text_length: 32 },
    responseType: 'json',
    pythonExample: `import requests
requests.post("http://127.0.0.1:8080/api/system/clipboard", json={"text": "Новый текст в буфере"})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/system/clipboard -H "Content-Type: application/json" -d '{"text":"Hello from Termux"}'`
  },
  {
    id: 'system_toast',
    category: 'system',
    method: 'POST',
    path: '/api/system/toast',
    title: 'Показ всплывающего Toast-сообщения',
    description: 'Отображает на экране смартфона системное всплывающее уведомление (Toast) с кастомным текстом и длительностью.',
    whyNotDirectTermux: 'Toast.makeText() требует Android UI потока (Looper.getMainLooper()).',
    requiredPermissions: [],
    androidApiLevel: 'API 21+',
    params: [
      { name: 'message', type: 'string', required: true, defaultValue: 'Скрипт Termux успешно завершил работу!', description: 'Текст сообщения' },
      { name: 'duration', type: 'enum', required: false, defaultValue: 'short', options: ['short', 'long'], description: 'Длительность показа' }
    ],
    sampleRequestBody: { message: 'Бэкап базы данных завершен!', duration: 'long' },
    sampleResponse: { status: 'toast_shown' },
    responseType: 'json',
    pythonExample: `import requests
requests.post("http://127.0.0.1:8080/api/system/toast", json={
    "message": "Скрипт Python завершен!",
    "duration": "long"
})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/system/toast -H "Content-Type: application/json" -d '{"message":"Привет на экране!"}'`
  },
  {
    id: 'system_device_info',
    category: 'system',
    method: 'GET',
    path: '/api/system/device',
    title: 'Информация об устройстве и ОС',
    description: 'Возвращает подробные системные спецификации: модель устройства, производителя, марку, версию Android, уровень API, архитектуру процессора (ARM64/x86), аптайм и отпечаток сборки.',
    whyNotDirectTermux: 'Предоставляет структурированный JSON с данными Build, Build.VERSION и SystemClock.',
    requiredPermissions: [],
    androidApiLevel: 'API 21+',
    params: [],
    sampleResponse: {
      manufacturer: 'Xiaomi',
      model: 'Redmi Note 12 Pro',
      brand: 'Redmi',
      board: 'ruby',
      android_version: '14',
      api_level: 34,
      cpu_abi: ['arm64-v8a', 'armeabi-v7a'],
      uptime_seconds: 145290,
      total_ram_mb: 8192,
      available_ram_mb: 3450
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/system/device")
dev = res.json()
print(f"Устройство: {dev['manufacturer']} {dev['model']}, Android {dev['android_version']} (API {dev['api_level']})")`,
    curlExample: `curl http://127.0.0.1:8080/api/system/device`
  },

  // ===================== NOTIFICATIONS =====================
  {
    id: 'notification_post',
    category: 'notifications',
    method: 'POST',
    path: '/api/notifications/post',
    title: 'Отправка уведомления в шторку Android',
    description: 'Создает богатое системное уведомление в шторке устройства с кастомным заголовком, текстом, иконкой важности и возможностью клика.',
    whyNotDirectTermux: 'Использует NotificationManagerCompat и NotificationChannel с нативной кастомизацией.',
    requiredPermissions: ['android.permission.POST_NOTIFICATIONS'],
    androidApiLevel: 'API 26+ (NotificationChannel), API 33+ (POST_NOTIFICATIONS)',
    params: [
      { name: 'title', type: 'string', required: true, defaultValue: 'Оповещение Termux', description: 'Заголовок уведомления' },
      { name: 'body', type: 'string', required: true, defaultValue: 'Фоновый процесс завершен.', description: 'Текст уведомления' },
      { name: 'priority', type: 'enum', required: false, defaultValue: 'high', options: ['high', 'default', 'low'], description: 'Приоритет уведомления' },
      { name: 'id', type: 'number', required: false, defaultValue: 101, description: 'Числовой ID уведомления' }
    ],
    sampleRequestBody: { title: 'Сборка завершена', body: 'Модель обучена за 12 минут. Точность: 98.4%', priority: 'high', id: 201 },
    sampleResponse: { status: 'posted', notification_id: 201 },
    responseType: 'json',
    pythonExample: `import requests
requests.post("http://127.0.0.1:8080/api/notifications/post", json={
    "title": "Уведомление от Python",
    "body": "Сервер успешно обработал все 100 запросов.",
    "priority": "high"
})`,
    curlExample: `curl -X POST http://127.0.0.1:8080/api/notifications/post -H "Content-Type: application/json" -d '{"title":"Привет","body":"Текст уведомления"}'`
  },

  // ===================== LOCATION =====================
  {
    id: 'location_current',
    category: 'location',
    method: 'GET',
    path: '/api/location/current',
    title: 'Точные GPS координаты (Location)',
    description: 'Возвращает координаты текущего местоположения устройства с высокой точностью (GPS / FusedLocationProvider): широта, долгота, высота, скорость (км/ч), азимут и точность в метрах.',
    whyNotDirectTermux: 'LocationManager / Google FusedLocationProviderClient требует прямого доступа к аппаратным GPS чипам Android.',
    requiredPermissions: ['android.permission.ACCESS_FINE_LOCATION', 'android.permission.ACCESS_COARSE_LOCATION'],
    androidApiLevel: 'API 21+',
    params: [
      { name: 'high_accuracy', type: 'boolean', required: false, defaultValue: true, description: 'Использовать GPS (high accuracy) или вышки/Wi-Fi' }
    ],
    sampleResponse: {
      latitude: 55.755826,
      longitude: 37.617300,
      altitude_meters: 156.4,
      accuracy_meters: 3.2,
      speed_kmh: 0.0,
      bearing_degrees: 180.0,
      provider: 'gps',
      timestamp: 1714567899000
    },
    responseType: 'json',
    pythonExample: `import requests
res = requests.get("http://127.0.0.1:8080/api/location/current")
loc = res.json()
print(f"Координаты: {loc['latitude']}, {loc['longitude']} (Точность: {loc['accuracy_meters']}м)")`,
    curlExample: `curl http://127.0.0.1:8080/api/location/current`
  }
];

export const COMPARISON_DATA = [
  {
    feature: 'Снимок с камеры (Photo Capture)',
    termuxAlone: 'Недоступно напрямую (нет прямого доступа к Camera2/CameraX без сторонних бинарников)',
    apkBridge: 'Доступно мгновенно по HTTP POST /api/camera/capture с выбором камеры, вспышки и качества',
    advantage: 'Автономная фоновая съемка без UI видоискателя'
  },
  {
    feature: 'Фонарик / Вспышка (Torch Mode)',
    termuxAlone: 'Требует рута или внешних утилит',
    apkBridge: 'Прямой вызов CameraManager.setTorchMode() через POST /api/camera/torch',
    advantage: 'Нативное аппаратное управление светодиодом'
  },
  {
    feature: 'Запись с микрофона в файл',
    termuxAlone: 'Ограничено, нет доступа к MediaRecorder подсистемам Android',
    apkBridge: 'Фоновая запись в AAC/M4A/WAV с настройкой частоты дискретизации и битрейта',
    advantage: 'Чистый аппаратный захват звука в фоне'
  },
  {
    feature: 'Проигрывание звука и Синтез речи (TTS)',
    termuxAlone: 'Ограничено CLI утилитами',
    apkBridge: 'Нативный MediaPlayer + Google Speech Engine TTS на русском/английском с pitch/speed',
    advantage: 'Качественный нативный синтез речи прямо в динамики'
  },
  {
    feature: 'Статус Wi-Fi и сканирование эфира',
    termuxAlone: 'Команды iw/wpa_cli заблокированы на не-рутованных Android',
    apkBridge: 'Полный отчет WifiManager: SSID, BSSID, RSSI, 5GHz/2.4GHz, IP, сканирование каналов',
    advantage: 'Точные данные о качестве соединения и окружающих сетях'
  },
  {
    feature: 'Переключение Wi-Fi / Сети',
    termuxAlone: 'Полностью заблокировано в Termux без root',
    apkBridge: 'Умный переключатель: прямое переключение (legacy) или системная панель/Shizuku/Root',
    advantage: 'Скриптовая автоматизация сетевых режимов'
  },
  {
    feature: 'Сенсоры (Акселерометр, Гироскоп, Люксметр, Барометр)',
    termuxAlone: 'Нет доступа к /dev/input сенсоров без root',
    apkBridge: 'Мгновенный опрос всех доступных физических датчиков в JSON формате',
    advantage: 'Данные телеметрии для скриптов в Termux'
  },
  {
    feature: 'Доступ ко всем файлам (/sdcard, DCIM, Downloads)',
    termuxAlone: 'В Android 11+ Termux ограничен в Scoped Storage',
    apkBridge: 'Чтение, запись, скачивание и листинг любых файлов с MANAGE_EXTERNAL_STORAGE',
    advantage: 'Полный доступ к файловой системе накопителя'
  },
  {
    feature: 'Список приложений и запуск пакетов',
    termuxAlone: 'Ограничено из-за правил видимости пакетов Android 11+',
    apkBridge: 'QUERY_ALL_PACKAGES возвращает все установленные приложения, их версии, и запуск Intent',
    advantage: 'Автоматизация запуска и аудита приложений'
  },
  {
    feature: 'Батарея, Вибрация, Буфер обмена, Toast, Уведомления',
    termuxAlone: 'Требует отдельных костылей',
    apkBridge: 'Единый REST API с готовыми методами и ответами в формате JSON',
    advantage: 'Управление телефоном одной строчкой в Python или curl'
  }
];
