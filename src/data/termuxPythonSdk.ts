export const PYTHON_SDK_CODE = `#!/usr/bin/env python3
"""
TermuxBridge Client SDK for Python
Удобный клиент для управления Android-устройством из скриптов в Termux или локальной сети.
"""

import requests
import json
import base64
from typing import Optional, Dict, Any, List

class TermuxBridgeClient:
    def __init__(self, host: str = "127.0.0.1", port: int = 8080, timeout: int = 15):
        self.base_url = f"http://{host}:{port}"
        self.timeout = timeout
        self.session = requests.Session()

    def _post(self, endpoint: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        resp = self.session.post(url, json=data or {}, timeout=self.timeout)
        resp.raise_for_status()
        return resp.json()

    def _get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        resp = self.session.get(url, params=params or {}, timeout=self.timeout)
        resp.raise_for_status()
        return resp.json()

    # ==================== CAMERA & VISION ====================
    def take_photo(self, camera: str = "back", flash: str = "off", quality: int = 85, save_to_file: bool = True) -> Dict[str, Any]:
        """Сделать снимок камерой (back/front)"""
        return self._post("/api/camera/capture", {
            "camera": camera,
            "flash": flash,
            "quality": quality,
            "save_to_file": save_to_file
        })

    def set_torch(self, enabled: bool = True, level: int = 100) -> Dict[str, Any]:
        """Включить/выключить фонарик камеры"""
        return self._post("/api/camera/torch", {"enabled": enabled, "level": level})

    # ==================== AUDIO & MICROPHONE ====================
    def start_audio_record(self, output_file: Optional[str] = None, format: str = "aac") -> Dict[str, Any]:
        """Начать запись звука с микрофона в файл"""
        payload = {"format": format}
        if output_file:
            payload["output_file"] = output_file
        return self._post("/api/audio/record/start", payload)

    def stop_audio_record(self) -> Dict[str, Any]:
        """Остановить текущую запись микрофона"""
        return self._post("/api/audio/record/stop")

    def play_audio(self, file_path: str, volume: float = 1.0, loop: bool = False) -> Dict[str, Any]:
        """Проиграть аудиофайл на динамике телефона"""
        return self._post("/api/audio/play", {
            "file_path": file_path,
            "volume": volume,
            "loop": loop
        })

    def tts_speak(self, text: str, lang: str = "ru_RU", rate: float = 1.0) -> Dict[str, Any]:
        """Произнести текст голосом (Text-to-Speech)"""
        return self._post("/api/audio/tts/speak", {
            "text": text,
            "lang": lang,
            "rate": rate
        })

    # ==================== NETWORK & WI-FI ====================
    def get_wifi_status(self) -> Dict[str, Any]:
        """Получить статус Wi-Fi подключения (SSID, RSSI, IP)"""
        return self._get("/api/network/wifi/status")

    def toggle_wifi(self, enable: bool) -> Dict[str, Any]:
        """Включить или выключить Wi-Fi"""
        return self._post("/api/network/wifi/toggle", {"enable": enable})

    def scan_wifi(self) -> Dict[str, Any]:
        """Сканировать окружающие Wi-Fi сети"""
        return self._get("/api/network/wifi/scan")

    def get_cellular_status(self) -> Dict[str, Any]:
        """Статус сотовой сети (5G/LTE, оператор, SIM)"""
        return self._get("/api/network/cellular/status")

    # ==================== SENSORS ====================
    def get_sensors(self) -> Dict[str, Any]:
        """Получить моментальный снимок всех аппаратных датчиков"""
        return self._get("/api/sensors/current")

    # ==================== STORAGE & FILES ====================
    def list_files(self, path: str = "/sdcard/Download") -> Dict[str, Any]:
        """Список файлов в директории"""
        return self._get("/api/files/list", {"path": path})

    def read_file(self, path: str) -> Dict[str, Any]:
        """Прочитать текстовый файл"""
        return self._get("/api/files/read", {"path": path})

    def write_file(self, path: str, content: str, append: bool = False) -> Dict[str, Any]:
        """Записать данные в файл на телефоне"""
        return self._post("/api/files/write", {
            "path": path,
            "content": content,
            "append": append
        })

    # ==================== APPS & PACKAGES ====================
    def list_apps(self, filter: str = "user") -> Dict[str, Any]:
        """Список установленных приложений (user/system/all)"""
        return self._get("/api/apps/list", {"filter": filter})

    def launch_app(self, package_name: str) -> Dict[str, Any]:
        """Запустить приложение по имени пакета"""
        return self._post("/api/apps/launch", {"package_name": package_name})

    # ==================== SYSTEM CONTROLS ====================
    def get_battery(self) -> Dict[str, Any]:
        """Информация о батарее (% заряда, температура, зарядка)"""
        return self._get("/api/system/battery")

    def vibrate(self, duration_ms: int = 500) -> Dict[str, Any]:
        """Вибрация телефона"""
        return self._post("/api/system/vibrate", {"duration_ms": duration_ms})

    def show_toast(self, message: str, duration: str = "short") -> Dict[str, Any]:
        """Показать всплывающее Toast-сообщение на экране"""
        return self._post("/api/system/toast", {"message": message, "duration": duration})

    def get_clipboard(self) -> str:
        """Получить текст из буфера обмена"""
        data = self._get("/api/system/clipboard")
        return data.get("text", "")

    def set_clipboard(self, text: str) -> Dict[str, Any]:
        """Записать текст в буфер обмена"""
        return self._post("/api/system/clipboard", {"text": text})

    def post_notification(self, title: str, body: str, priority: str = "high") -> Dict[str, Any]:
        """Отправить уведомление в шторку Android"""
        return self._post("/api/notifications/post", {
            "title": title,
            "body": body,
            "priority": priority
        })

    def get_device_info(self) -> Dict[str, Any]:
        """Характеристики устройства и версия Android"""
        return self._get("/api/system/device")

    def get_location(self) -> Dict[str, Any]:
        """GPS координаты устройства"""
        return self._get("/api/location/current")
`;

export const PYTHON_EXAMPLE_SCRIPT = `#!/usr/bin/env python3
"""
Пример скрипта комплексной автоматизации в Termux с использованием TermuxBridgeClient
"""

import time
from termux_bridge import TermuxBridgeClient

def main():
    # 1. Подключаемся к локальному серверу APK (по умолчанию порт 8080)
    bridge = TermuxBridgeClient(host="127.0.0.1", port=8080)

    print("=== [1] Проверка подключения и устройства ===")
    device = bridge.get_device_info()
    battery = bridge.get_battery()
    print(f"Смартфон: {device.get('manufacturer')} {device.get('model')} (Android {device.get('android_version')})")
    print(f"Батарея: {battery.get('level_percent')}% (Зарядка: {battery.get('is_charging')})")

    print("\\n=== [2] Опрос сенсоров и Wi-Fi ===")
    sensors = bridge.get_sensors()
    print(f"Освещенность: {sensors.get('light_sensor_lux')} Lux")
    
    wifi = bridge.get_wifi_status()
    print(f"Подключен к Wi-Fi: {wifi.get('ssid')} (Уровень: {wifi.get('signal_level_percent')}%)")

    print("\\n=== [3] Голосовое приветствие и Toast ===")
    bridge.show_toast("Запуск автоматизации Termux!", duration="long")
    bridge.tts_speak("Привет! Все системы смартфона готовы к работе.", lang="ru_RU")

    print("\\n=== [4] Включение фонарика на 2 секунды ===")
    bridge.set_torch(True)
    time.sleep(2)
    bridge.set_torch(False)

    print("\\n=== [5] Фотосъемка с камеры ===")
    photo_res = bridge.take_photo(camera="back", save_to_file=True)
    print("Снимок сохранен:", photo_res.get("file_path"))

    print("\\n=== [6] Запись звука с микрофона (3 сек) ===")
    bridge.start_audio_record("/sdcard/Bridge/Audio/test_termux.m4a")
    time.sleep(3)
    rec_res = bridge.stop_audio_record()
    print("Аудио записано:", rec_res.get("file_path"), f"({rec_res.get('duration_ms')} мс)")

    print("\\n=== [7] Уведомление в шторку и виброотклик ===")
    bridge.post_notification("Termux Скрипт", "Все 7 задач успешно выполнены!")
    bridge.vibrate(400)
    print("Готово!")

if __name__ == "__main__":
    main()
`;
