import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { PYTHON_SDK_CODE, PYTHON_EXAMPLE_SCRIPT } from '../data/termuxPythonSdk';

export async function downloadAndroidProjectZip(serverPort: number = 8080): Promise<void> {
  const zip = new JSZip();

  // Root project files
  zip.file('settings.gradle.kts', `rootProject.name = "TermuxBridgeServer"\ninclude(":app")\n`);
  zip.file('build.gradle.kts', `plugins {\n    alias(libs.plugins.android.application) apply false\n    alias(libs.plugins.kotlin.android) apply false\n    alias(libs.plugins.kotlin.serialization) apply false\n}\n`);
  zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nkotlin.code.style=official\n`);
  zip.file('gradle/libs.versions.toml', `[versions]
agp = "8.2.2"
kotlin = "1.9.22"
coreKtx = "1.12.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
`);

  // Add all generated Android Project files
  for (const file of ANDROID_PROJECT_FILES) {
    let content = file.content;
    // Replace default port if customized
    if (serverPort !== 8080) {
      content = content.replace(/8080/g, String(serverPort));
    }
    zip.file(file.path, content);
  }

  // Add Termux Python client scripts
  zip.file('termux_client/termux_bridge.py', PYTHON_SDK_CODE.replace(/8080/g, String(serverPort)));
  zip.file('termux_client/example_automation.py', PYTHON_EXAMPLE_SCRIPT.replace(/8080/g, String(serverPort)));
  zip.file('termux_client/requirements.txt', 'requests>=2.28.0\n');
  zip.file('termux_client/README.md', `# Termux Bridge Client
Запуск в Termux:
\`\`\`bash
pkg update && pkg install python -y
pip install requests
python example_automation.py
\`\`\`
`);

  // Add Project Readme
  zip.file('README.md', `# Termux Bridge Server (Android APK + REST API)

Полнофункциональный Android HTTP REST мост для автоматизации устройства из Termux, Python и веб-страниц.

### Возможности:
- Съемка фото с фронтальной и основной камеры
- Включение фонарика с регулировкой яркости
- Запись звука с микрофона в M4A/AAC файл и воспроизведение через динамик
- Синтез речи (Google TTS)
- Получение статуса Wi-Fi, сканирование сетей, переключение Wi-Fi
- Статус сотовой связи (5G/LTE) и SIM-карты
- Опрос всех аппаратных сенсоров (Акселерометр, Гироскоп, Люксметр, Датчик приближения, Барометр)
- Доступ ко всей файловой системе (/sdcard) с MANAGE_EXTERNAL_STORAGE
- Список установленных приложений и запуск по имени пакета
- Батарея, Буфер обмена, Вибрация, Уведомления и всплывающие Toast-сообщения

### Сборка APK:
1. Откройте эту папку в **Android Studio** (Hedgehog / Iguana / Jellyfish).
2. Дождитесь синхронизации Gradle.
3. Нажмите **Build > Build Bundle(s) / APK(s) > Build APK(s)** или выполните \`./gradlew assembleDebug\`.
4. Установите полученный APK на телефон и предоставьте запрошенные разрешения в приложении.
`);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TermuxBridge-AndroidProject-port-${serverPort}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
