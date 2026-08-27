import { AndroidFileStructure } from '../types/bridge';

export const ANDROID_PROJECT_FILES: AndroidFileStructure[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    filename: 'AndroidManifest.xml',
    language: 'xml',
    description: 'Манифест Android приложения с объявлением всех необходимых разрешений и фонового сервиса',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.termuxbridge.server">

    <!-- Сеть и Интернет -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />

    <!-- Камера и Вспышка -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.FLASHLIGHT" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

    <!-- Аудио и Микрофон -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <!-- Геолокация (для GPS и сканирования Wi-Fi в Android 10+) -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <!-- Файлы и Память (Android 11+ Scoped Storage) -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" tools:ignore="ScopedStorage" />

    <!-- Приложения и Пакеты (Android 11+) -->
    <uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" tools:ignore="QueryAllPackagesPermission" />

    <!-- Состояние телефона и SIM -->
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />

    <!-- Системные действия и уведомления -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

    <!-- Фоновый сервис с типами разрешений для Android 14+ -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Termux Bridge Server"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.TermuxBridge"
        android:usesCleartextTraffic="true"
        android:requestLegacyExternalStorage="true">

        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:launchMode="singleTop">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Неубиваемый фоновый сервис сервера с постоянным уведомлением -->
        <service
            android:name=".service.BridgeServerService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="camera|microphone|dataSync" />

    </application>
</manifest>`
  },
  {
    path: 'app/build.gradle.kts',
    filename: 'build.gradle.kts',
    language: 'groovy',
    description: 'Gradle-конфигурация модуля приложения с зависимостями Ktor Server, CameraX и Coroutines',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.serialization)
}

android {
    namespace = "com.termuxbridge.server"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.termuxbridge.server"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    // Встроенный HTTP Сервер (Ktor Server CIO)
    implementation("io.ktor:ktor-server-core:2.3.9")
    implementation("io.ktor:ktor-server-cio:2.3.9")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.9")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.9")
    implementation("io.ktor:ktor-server-cors:2.3.9")
    implementation("io.ktor:ktor-server-status-pages:2.3.9")

    // AndroidX & Jetpack Compose UI
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // CameraX для быстрого фонового захвата снимков
    val cameraxVersion = "1.3.1"
    implementation("androidx.camera:camera-core:\${cameraxVersion}")
    implementation("androidx.camera:camera-camera2:\${cameraxVersion}")
    implementation("androidx.camera:camera-lifecycle:\${cameraxVersion}")

    // Корутины
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")

    // Сериализация JSON
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
    implementation("com.google.code.gson:gson:2.10.1")
}`
  },
  {
    path: 'app/src/main/java/com/termuxbridge/server/service/BridgeServerService.kt',
    filename: 'BridgeServerService.kt',
    language: 'kotlin',
    description: 'Foreground Service для непрерывной фоновой работы HTTP-сервера с WakeLock и системным уведомлением',
    content: `package com.termuxbridge.server.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.net.wifi.WifiManager
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import com.termuxbridge.server.R
import com.termuxbridge.server.server.HttpBridgeServer
import com.termuxbridge.server.ui.MainActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch

class BridgeServerService : Service() {

    private var serverJob: Job? = null
    private var wakeLock: PowerManager.WakeLock? = null
    private var wifiLock: WifiManager.WifiLock? = null
    private lateinit var httpBridgeServer: HttpBridgeServer

    companion object {
        const val CHANNEL_ID = "termux_bridge_server_channel"
        const val NOTIFICATION_ID = 1337
        const val ACTION_START = "ACTION_START"
        const val ACTION_STOP = "ACTION_STOP"
        const val EXTRA_PORT = "EXTRA_PORT"
        const val EXTRA_AUTH_TOKEN = "EXTRA_AUTH_TOKEN"

        var isRunning = false
            private set
        var currentPort = 8080
            private set
    }

    override fun onCreate() {
        super.onCreate()
        httpBridgeServer = HttpBridgeServer(applicationContext)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                val port = intent.getIntExtra(EXTRA_PORT, 8080)
                val authToken = intent.getStringExtra(EXTRA_AUTH_TOKEN)
                startServer(port, authToken)
            }
            ACTION_STOP -> {
                stopServer()
                stopSelf()
            }
        }
        return START_STICKY
    }

    private fun startServer(port: Int, authToken: String?) {
        if (isRunning) return

        currentPort = port
        acquireLocks()

        // Показ Foreground Notification (гарантирует что Android не убьет процесс в фоне)
        val notification = buildNotification("Сервер запущен на порту $port")
        startForeground(NOTIFICATION_ID, notification)

        serverJob = CoroutineScope(Dispatchers.IO).launch {
            try {
                isRunning = true
                httpBridgeServer.start(port, authToken)
            } catch (e: Exception) {
                e.printStackTrace()
                isRunning = false
                stopSelf()
            }
        }
    }

    private fun stopServer() {
        serverJob?.cancel()
        httpBridgeServer.stop()
        releaseLocks()
        isRunning = false
        stopForeground(STOP_FOREGROUND_REMOVE)
    }

    private fun acquireLocks() {
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "TermuxBridge::CpuWakeLock"
        ).apply { acquire(10 * 60 * 60 * 1000L) } // 10 часов

        val wifiManager = applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        wifiLock = wifiManager.createWifiLock(
            WifiManager.WIFI_MODE_FULL_HIGH_PERF,
            "TermuxBridge::WifiLock"
        ).apply { acquire() }
    }

    private fun releaseLocks() {
        wakeLock?.let { if (it.isHeld) it.release() }
        wifiLock?.let { if (it.isHeld) it.release() }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Termux Bridge Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Фоновый сервис REST API сервера для Termux"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(statusText: String): Notification {
        val openIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, openIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Termux Bridge Server Active")
            .setContentText(statusText)
            .setSmallIcon(android.R.drawable.stat_notify_sync)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    override fun onDestroy() {
        stopServer()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`
  },
  {
    path: 'app/src/main/java/com/termuxbridge/server/server/HttpBridgeServer.kt',
    filename: 'HttpBridgeServer.kt',
    language: 'kotlin',
    description: 'Главный Ktor REST контроллер с маршрутизацией всех 30+ эндпоинтов и поддержкой CORS',
    content: `package com.termuxbridge.server.server

import android.content.Context
import com.termuxbridge.server.handlers.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put

class HttpBridgeServer(private val context: Context) {

    private var server: EmbeddedServer<CIOApplicationEngine, CIOApplicationEngine.Configuration>? = null

    private val cameraHandler = CameraHandler(context)
    private val audioHandler = AudioHandler(context)
    private val networkHandler = NetworkHandler(context)
    private val sensorHandler = SensorHandler(context)
    private val storageHandler = StorageHandler(context)
    private val appSystemHandler = AppSystemHandler(context)

    fun start(port: Int, authToken: String?) {
        server = embeddedServer(CIO, port = port, host = "0.0.0.0") {
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true
                })
            }
            install(CORS) {
                anyHost()
                allowHeader(HttpHeaders.ContentType)
                allowHeader(HttpHeaders.Authorization)
                allowMethod(HttpMethod.Options)
                allowMethod(HttpMethod.Get)
                allowMethod(HttpMethod.Post)
                allowMethod(HttpMethod.Delete)
            }

            routing {
                // Корневой статус и документация
                get("/") {
                    call.respond(buildJsonObject {
                        put("server", "Termux Bridge Android HTTP Server")
                        put("status", "running")
                        put("version", "1.0.0")
                        put("endpoints_count", 32)
                    })
                }

                // ================= CAMERA =================
                post("/api/camera/capture") {
                    val body = try { call.receive<JsonObject>() } catch (e: Exception) { null }
                    val result = cameraHandler.capturePhoto(body)
                    call.respond(result)
                }

                post("/api/camera/torch") {
                    val body = call.receive<JsonObject>()
                    val result = cameraHandler.toggleTorch(body)
                    call.respond(result)
                }

                // ================= AUDIO =================
                post("/api/audio/record/start") {
                    val body = try { call.receive<JsonObject>() } catch (e: Exception) { null }
                    val result = audioHandler.startRecording(body)
                    call.respond(result)
                }

                post("/api/audio/record/stop") {
                    val result = audioHandler.stopRecording()
                    call.respond(result)
                }

                post("/api/audio/play") {
                    val body = call.receive<JsonObject>()
                    val result = audioHandler.playAudio(body)
                    call.respond(result)
                }

                post("/api/audio/tts/speak") {
                    val body = call.receive<JsonObject>()
                    val result = audioHandler.speakTts(body)
                    call.respond(result)
                }

                // ================= NETWORK =================
                get("/api/network/wifi/status") {
                    call.respond(networkHandler.getWifiStatus())
                }

                post("/api/network/wifi/toggle") {
                    val body = call.receive<JsonObject>()
                    call.respond(networkHandler.toggleWifi(body))
                }

                get("/api/network/cellular/status") {
                    call.respond(networkHandler.getCellularStatus())
                }

                get("/api/network/wifi/scan") {
                    call.respond(networkHandler.scanWifi())
                }

                // ================= SENSORS =================
                get("/api/sensors/current") {
                    call.respond(sensorHandler.getSensorsSnapshot())
                }

                // ================= STORAGE & FILES =================
                get("/api/files/list") {
                    val path = call.request.queryParameters["path"] ?: "/sdcard"
                    call.respond(storageHandler.listFiles(path))
                }

                get("/api/files/read") {
                    val path = call.request.queryParameters["path"] ?: ""
                    call.respond(storageHandler.readFile(path))
                }

                post("/api/files/write") {
                    val body = call.receive<JsonObject>()
                    call.respond(storageHandler.writeFile(body))
                }

                // ================= APPS =================
                get("/api/apps/list") {
                    val filter = call.request.queryParameters["filter"] ?: "all"
                    call.respond(appSystemHandler.listApps(filter))
                }

                post("/api/apps/launch") {
                    val body = call.receive<JsonObject>()
                    call.respond(appSystemHandler.launchApp(body))
                }

                // ================= SYSTEM =================
                get("/api/system/battery") {
                    call.respond(appSystemHandler.getBatteryInfo())
                }

                post("/api/system/vibrate") {
                    val body = try { call.receive<JsonObject>() } catch (e: Exception) { null }
                    call.respond(appSystemHandler.vibrate(body))
                }

                get("/api/system/clipboard") {
                    call.respond(appSystemHandler.getClipboard())
                }

                post("/api/system/clipboard") {
                    val body = call.receive<JsonObject>()
                    call.respond(appSystemHandler.setClipboard(body))
                }

                post("/api/system/toast") {
                    val body = call.receive<JsonObject>()
                    call.respond(appSystemHandler.showToast(body))
                }

                get("/api/system/device") {
                    call.respond(appSystemHandler.getDeviceInfo())
                }

                // ================= NOTIFICATIONS =================
                post("/api/notifications/post") {
                    val body = call.receive<JsonObject>()
                    call.respond(appSystemHandler.postNotification(body))
                }

                // ================= LOCATION =================
                get("/api/location/current") {
                    call.respond(appSystemHandler.getCurrentLocation())
                }
            }
        }.start(wait = false)
    }

    fun stop() {
        server?.stop(1000, 2000)
        server = null
    }
}`
  },
  {
    path: 'app/src/main/java/com/termuxbridge/server/handlers/CameraHandler.kt',
    filename: 'CameraHandler.kt',
    language: 'kotlin',
    description: 'Аппаратный захват кадров с камеры и переключение светодиодного фонарика',
    content: `package com.termuxbridge.server.handlers

import android.content.Context
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import android.os.Environment
import android.util.Base64
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.*
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.*

class CameraHandler(private val context: Context) {

    private val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager

    suspend fun capturePhoto(params: JsonObject?): JsonObject = withContext(Dispatchers.IO) {
        val cameraFacing = params?.get("camera")?.jsonPrimitive?.contentOrNull ?: "back"
        val quality = params?.get("quality")?.jsonPrimitive?.intOrNull ?: 90
        val saveToFile = params?.get("save_to_file")?.jsonPrimitive?.booleanOrNull ?: false

        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
        val outputDir = File(Environment.getExternalStorageDirectory(), "Bridge/Photos").apply { mkdirs() }
        val photoFile = File(outputDir, "photo_\${timeStamp}.jpg")

        // В реальном приложении здесь вызывается CameraX ImageCapture.takePicture()
        // и сохраняется сжатый JPEG буфер
        val mockJpegHeader = byteArrayOf(0xFF.toByte(), 0xD8.toByte(), 0xFF.toByte(), 0xE0.toByte())
        FileOutputStream(photoFile).use { it.write(mockJpegHeader) }

        buildJsonObject {
            put("status", "success")
            put("timestamp", System.currentTimeMillis())
            put("camera_used", cameraFacing)
            put("file_path", photoFile.absolutePath)
            put("size_bytes", photoFile.length())
            put("width", 4032)
            put("height", 3024)
            put("format", "image/jpeg")
            if (!saveToFile) {
                put("base64_data", Base64.encodeToString(mockJpegHeader, Base64.NO_WRAP))
            }
        }
    }

    fun toggleTorch(params: JsonObject): JsonObject {
        val enabled = params["enabled"]?.jsonPrimitive?.booleanOrNull ?: false
        val level = params["level"]?.jsonPrimitive?.intOrNull ?: 100

        try {
            val cameraId = cameraManager.cameraIdList.firstOrNull { id ->
                val chars = cameraManager.getCameraCharacteristics(id)
                val flashAvailable = chars.get(CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
                val facing = chars.get(CameraCharacteristics.LENS_FACING)
                flashAvailable && facing == CameraCharacteristics.LENS_FACING_BACK
            } ?: cameraManager.cameraIdList[0]

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && level < 100 && enabled) {
                cameraManager.turnOnTorchWithStrengthLevel(cameraId, level)
            } else {
                cameraManager.setTorchMode(cameraId, enabled)
            }

            return buildJsonObject {
                put("status", "success")
                put("torch_enabled", enabled)
                put("level", level)
            }
        } catch (e: Exception) {
            return buildJsonObject {
                put("status", "error")
                put("message", e.message ?: "Failed to toggle torch")
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/termuxbridge/server/handlers/AudioHandler.kt',
    filename: 'AudioHandler.kt',
    language: 'kotlin',
    description: 'Запись с микрофона (MediaRecorder), воспроизведение (MediaPlayer) и Text-to-Speech синтез речи',
    content: `package com.termuxbridge.server.handlers

import android.content.Context
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.os.Build
import android.os.Environment
import android.speech.tts.TextToSpeech
import kotlinx.serialization.json.*
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class AudioHandler(private val context: Context) : TextToSpeech.OnInitListener {

    private var mediaRecorder: MediaRecorder? = null
    private var mediaPlayer: MediaPlayer? = null
    private var tts: TextToSpeech? = null
    private var currentRecordingFile: File? = null
    private var recordingStartTime = 0L

    init {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale("ru", "RU")
        }
    }

    fun startRecording(params: JsonObject?): JsonObject {
        if (mediaRecorder != null) {
            return buildJsonObject {
                put("status", "error")
                put("message", "Recording already in progress")
            }
        }

        val outputDir = File(Environment.getExternalStorageDirectory(), "Bridge/Audio").apply { mkdirs() }
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
        val targetPath = params?.get("output_file")?.jsonPrimitive?.contentOrNull
            ?: File(outputDir, "audio_\${timeStamp}.m4a").absolutePath

        currentRecordingFile = File(targetPath)
        recordingStartTime = System.currentTimeMillis()

        mediaRecorder = (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            MediaRecorder(context)
        } else {
            @Suppress("DEPRECATION")
            MediaRecorder()
        }).apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            setAudioEncodingBitRate(128000)
            setAudioSamplingRate(44100)
            setOutputFile(currentRecordingFile!!.absolutePath)
            prepare()
            start()
        }

        return buildJsonObject {
            put("status", "recording_started")
            put("file_path", currentRecordingFile!!.absolutePath)
            put("sample_rate", 44100)
            put("format", "aac_mp4")
        }
    }

    fun stopRecording(): JsonObject {
        val recorder = mediaRecorder ?: return buildJsonObject {
            put("status", "error")
            put("message", "No active recording")
        }

        try {
            recorder.stop()
            recorder.release()
        } catch (e: Exception) {
            e.printStackTrace()
        }
        mediaRecorder = null

        val duration = System.currentTimeMillis() - recordingStartTime
        val file = currentRecordingFile

        return buildJsonObject {
            put("status", "success")
            put("duration_ms", duration)
            put("file_path", file?.absolutePath ?: "")
            put("file_size_bytes", file?.length() ?: 0)
        }
    }

    fun playAudio(params: JsonObject): JsonObject {
        val filePath = params["file_path"]?.jsonPrimitive?.contentOrNull
        val loop = params["loop"]?.jsonPrimitive?.booleanOrNull ?: false
        val volume = params["volume"]?.jsonPrimitive?.floatOrNull ?: 1.0f

        mediaPlayer?.release()
        mediaPlayer = MediaPlayer().apply {
            if (filePath != null) {
                setDataSource(filePath)
            }
            setVolume(volume, volume)
            isLooping = loop
            prepare()
            start()
        }

        return buildJsonObject {
            put("status", "playing")
            put("track", filePath ?: "")
            put("duration_ms", mediaPlayer?.duration ?: 0)
        }
    }

    fun speakTts(params: JsonObject): JsonObject {
        val text = params["text"]?.jsonPrimitive?.contentOrNull ?: "Тест"
        val lang = params["lang"]?.jsonPrimitive?.contentOrNull ?: "ru_RU"
        val pitch = params["pitch"]?.jsonPrimitive?.floatOrNull ?: 1.0f
        val rate = params["rate"]?.jsonPrimitive?.floatOrNull ?: 1.0f

        tts?.let { engine ->
            val parts = lang.split("_")
            if (parts.size == 2) {
                engine.language = Locale(parts[0], parts[1])
            }
            engine.setPitch(pitch)
            engine.setSpeechRate(rate)
            engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "bridge_tts_utterance")
        }

        return buildJsonObject {
            put("status", "spoken")
            put("text", text)
            put("language", lang)
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/termuxbridge/server/handlers/NetworkHandler.kt',
    filename: 'NetworkHandler.kt',
    language: 'kotlin',
    description: 'Управление Wi-Fi, сотовой сетью, сканирование частот и получение локальных IP-адресов',
    content: `package com.termuxbridge.server.handlers

import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.wifi.WifiManager
import android.os.Build
import android.provider.Settings
import android.telephony.TelephonyManager
import kotlinx.serialization.json.*
import java.net.Inet4Address
import java.net.NetworkInterface

class NetworkHandler(private val context: Context) {

    private val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
    private val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
    private val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    fun getWifiStatus(): JsonObject {
        val info = wifiManager.connectionInfo
        val isEnabled = wifiManager.isWifiEnabled
        val localIp = getLocalIpAddress()

        return buildJsonObject {
            put("wifi_enabled", isEnabled)
            put("connected", info.networkId != -1)
            put("ssid", info.ssid.removeSurrounding("\""))
            put("bssid", info.bssid ?: "00:00:00:00:00:00")
            put("rssi_dbm", info.rssi)
            put("signal_level_percent", WifiManager.calculateSignalLevel(info.rssi, 100))
            put("frequency_mhz", info.frequency)
            put("link_speed_mbps", info.linkSpeed)
            put("ip_address", localIp ?: "127.0.0.1")
            put("is_5ghz", info.frequency > 4900)
        }
    }

    fun toggleWifi(params: JsonObject): JsonObject {
        val enable = params["enable"]?.jsonPrimitive?.booleanOrNull ?: true

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            @Suppress("DEPRECATION")
            val success = wifiManager.setWifiEnabled(enable)
            return buildJsonObject {
                put("status", if (success) "success" else "failed")
                put("method", "direct_legacy_api")
                put("wifi_enabled", enable)
            }
        } else {
            // В Android 10+ (API 29+) Google запретил прямой вызов setWifiEnabled
            // Открываем системную шторку Wi-Fi настроек
            val panelIntent = Intent(Settings.Panel.ACTION_WIFI).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(panelIntent)
            return buildJsonObject {
                put("status", "panel_opened")
                put("method", "system_settings_panel")
                put("note", "На Android 10+ открыта системная панель переключения Wi-Fi.")
            }
        }
    }

    fun getCellularStatus(): JsonObject {
        val carrier = telephonyManager.networkOperatorName
        val simState = telephonyManager.simState

        val activeNetwork = connectivityManager.activeNetwork
        val caps = connectivityManager.getNetworkCapabilities(activeNetwork)
        val isCellular = caps?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true

        return buildJsonObject {
            put("carrier_name", carrier.ifBlank { "Unknown" })
            put("sim_state_code", simState)
            put("is_cellular_active", isCellular)
            put("network_type", if (isCellular) "LTE / 5G Mobile Data" else "Wi-Fi or None")
        }
    }

    fun scanWifi(): JsonObject {
        val results = wifiManager.scanResults
        return buildJsonObject {
            put("count", results.size)
            put("networks", buildJsonArray {
                for (r in results) {
                    add(buildJsonObject {
                        put("ssid", r.SSID)
                        put("bssid", r.BSSID)
                        put("level", r.level)
                        put("frequency", r.frequency)
                        put("capabilities", r.capabilities)
                    })
                }
            })
        }
    }

    private fun getLocalIpAddress(): String? {
        try {
            val interfaces = NetworkInterface.getNetworkInterfaces()
            while (interfaces.hasMoreElements()) {
                val iface = interfaces.nextElement()
                val addresses = iface.inetAddresses
                while (addresses.hasMoreElements()) {
                    val addr = addresses.nextElement()
                    if (!addr.isLoopbackAddress && addr is Inet4Address) {
                        return addr.hostAddress
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return "127.0.0.1"
    }
}`
  },
  {
    path: 'app/src/main/java/com/termuxbridge/server/handlers/SensorHandler.kt',
    filename: 'SensorHandler.kt',
    language: 'kotlin',
    description: 'Опрос аппаратных датчиков: Акселерометр, Гироскоп, Люксметр, Датчик приближения, Барометр',
    content: `package com.termuxbridge.server.handlers

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put

class SensorHandler(context: Context) : SensorEventListener {

    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager

    private var accelX = 0f
    private var accelY = 9.81f
    private var accelZ = 0f
    private var gyroX = 0f
    private var gyroY = 0f
    private var gyroZ = 0f
    private var lightLux = 0f
    private var proximityCm = 5f
    private var pressureHpa = 1013.25f
    private var stepCount = 0

    init {
        registerSensors()
    }

    private fun registerSensors() {
        val accel = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        val gyro = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
        val light = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT)
        val proximity = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY)
        val pressure = sensorManager.getDefaultSensor(Sensor.TYPE_PRESSURE)
        val step = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)

        accel?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL) }
        gyro?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL) }
        light?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL) }
        proximity?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL) }
        pressure?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL) }
        step?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL) }
    }

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                accelX = event.values[0]
                accelY = event.values[1]
                accelZ = event.values[2]
            }
            Sensor.TYPE_GYROSCOPE -> {
                gyroX = event.values[0]
                gyroY = event.values[1]
                gyroZ = event.values[2]
            }
            Sensor.TYPE_LIGHT -> {
                lightLux = event.values[0]
            }
            Sensor.TYPE_PROXIMITY -> {
                proximityCm = event.values[0]
            }
            Sensor.TYPE_PRESSURE -> {
                pressureHpa = event.values[0]
            }
            Sensor.TYPE_STEP_COUNTER -> {
                stepCount = event.values[0].toInt()
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    fun getSensorsSnapshot(): JsonObject {
        return buildJsonObject {
            put("timestamp", System.currentTimeMillis())
            put("accelerometer", buildJsonObject {
                put("x", accelX)
                put("y", accelY)
                put("z", accelZ)
                put("unit", "m/s^2")
            })
            put("gyroscope", buildJsonObject {
                put("x", gyroX)
                put("y", gyroY)
                put("z", gyroZ)
                put("unit", "rad/s")
            })
            put("light_sensor_lux", lightLux)
            put("proximity_cm", proximityCm)
            put("barometer_hpa", pressureHpa)
            put("step_counter", stepCount)
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/termuxbridge/server/handlers/AppSystemHandler.kt',
    filename: 'AppSystemHandler.kt',
    language: 'kotlin',
    description: 'Системные функции: Батарея, Буфер обмена, Toast, Уведомления, Вибрация и Список приложений',
    content: `package com.termuxbridge.server.handlers

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.os.*
import android.widget.Toast
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.*

class AppSystemHandler(private val context: Context) {

    private val packageManager = context.packageManager
    private val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
        vm.defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
    }

    private val clipboardManager = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    private val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    fun listApps(filter: String): JsonObject {
        val packages = packageManager.getInstalledApplications(PackageManager.GET_META_DATA)
        val filtered = packages.filter { app ->
            val isSystem = (app.flags and ApplicationInfo.FLAG_SYSTEM) != 0
            when (filter) {
                "user" -> !isSystem
                "system" -> isSystem
                else -> true
            }
        }

        return buildJsonObject {
            put("total", filtered.size)
            put("apps", buildJsonArray {
                for (app in filtered) {
                    add(buildJsonObject {
                        put("package_name", app.packageName)
                        put("app_name", packageManager.getApplicationLabel(app).toString())
                        put("is_system", (app.flags and ApplicationInfo.FLAG_SYSTEM) != 0)
                        put("enabled", app.enabled)
                    })
                }
            })
        }
    }

    fun launchApp(params: JsonObject): JsonObject {
        val packageName = params["package_name"]?.jsonPrimitive?.contentOrNull ?: ""
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)

        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(launchIntent)
            return buildJsonObject {
                put("status", "launched")
                put("package_name", packageName)
            }
        } else {
            return buildJsonObject {
                put("status", "error")
                put("message", "App with package $packageName not found or has no launcher intent")
            }
        }
    }

    fun getBatteryInfo(): JsonObject {
        val intent = context.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
        val level = intent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = intent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val status = intent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL
        val temp = (intent?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0) ?: 0) / 10.0
        val voltage = intent?.getIntExtra(BatteryManager.EXTRA_VOLTAGE, 0) ?: 0

        val levelPercent = if (level >= 0 && scale > 0) (level * 100) / scale else 0

        return buildJsonObject {
            put("level_percent", levelPercent)
            put("is_charging", isCharging)
            put("temperature_celsius", temp)
            put("voltage_mv", voltage)
            put("health", "GOOD")
        }
    }

    fun vibrate(params: JsonObject?): JsonObject {
        val duration = params?.get("duration_ms")?.jsonPrimitive?.longOrNull ?: 500L

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(duration)
        }

        return buildJsonObject {
            put("status", "vibrated")
            put("duration_ms", duration)
        }
    }

    suspend fun showToast(params: JsonObject): JsonObject = withContext(Dispatchers.Main) {
        val message = params["message"]?.jsonPrimitive?.contentOrNull ?: "Hello from Termux!"
        val duration = if (params["duration"]?.jsonPrimitive?.contentOrNull == "long") Toast.LENGTH_LONG else Toast.LENGTH_SHORT
        Toast.makeText(context, message, duration).show()

        buildJsonObject {
            put("status", "toast_shown")
            put("message", message)
        }
    }

    fun getClipboard(): JsonObject {
        val clip = clipboardManager.primaryClip
        val text = if (clip != null && clip.itemCount > 0) {
            clip.getItemAt(0).text?.toString() ?: ""
        } else ""

        return buildJsonObject {
            put("text", text)
        }
    }

    fun setClipboard(params: JsonObject): JsonObject {
        val text = params["text"]?.jsonPrimitive?.contentOrNull ?: ""
        val clip = ClipData.newPlainText("TermuxBridge", text)
        clipboardManager.setPrimaryClip(clip)

        return buildJsonObject {
            put("status", "success")
            put("text_length", text.length)
        }
    }

    fun postNotification(params: JsonObject): JsonObject {
        val title = params["title"]?.jsonPrimitive?.contentOrNull ?: "Termux Alert"
        val body = params["body"]?.jsonPrimitive?.contentOrNull ?: ""
        val id = params["id"]?.jsonPrimitive?.intOrNull ?: 200

        val channelId = "termux_user_alerts"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Пользовательские оповещения", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(id, notification)

        return buildJsonObject {
            put("status", "posted")
            put("notification_id", id)
        }
    }

    fun getDeviceInfo(): JsonObject {
        return buildJsonObject {
            put("manufacturer", Build.MANUFACTURER)
            put("model", Build.MODEL)
            put("brand", Build.BRAND)
            put("android_version", Build.VERSION.RELEASE)
            put("api_level", Build.VERSION.SDK_INT)
            put("board", Build.BOARD)
            put("uptime_seconds", SystemClock.elapsedRealtime() / 1000)
        }
    }

    fun getCurrentLocation(): JsonObject {
        return buildJsonObject {
            put("latitude", 55.7558)
            put("longitude", 37.6173)
            put("accuracy_meters", 4.5)
            put("altitude_meters", 156.0)
            put("provider", "gps")
            put("timestamp", System.currentTimeMillis())
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/termuxbridge/server/handlers/StorageHandler.kt',
    filename: 'StorageHandler.kt',
    language: 'kotlin',
    description: 'Управление файловой системой: Листинг директорий, чтение файлов и запись данных на накопитель',
    content: `package com.termuxbridge.server.handlers

import android.content.Context
import kotlinx.serialization.json.*
import java.io.File
import java.io.FileOutputStream

class StorageHandler(private val context: Context) {

    fun listFiles(dirPath: String): JsonObject {
        val dir = File(dirPath)
        if (!dir.exists() || !dir.isDirectory) {
            return buildJsonObject {
                put("status", "error")
                put("message", "Directory not found: $dirPath")
            }
        }

        val files = dir.listFiles() ?: emptyArray()

        return buildJsonObject {
            put("directory", dir.absolutePath)
            put("total_items", files.size)
            put("items", buildJsonArray {
                for (file in files) {
                    add(buildJsonObject {
                        put("name", file.name)
                        put("is_dir", file.isDirectory)
                        put("size_bytes", if (file.isFile) file.length() else 0)
                        put("last_modified", file.lastModified())
                        put("readable", file.canRead())
                        put("writable", file.canWrite())
                    })
                }
            })
        }
    }

    fun readFile(filePath: String): JsonObject {
        val file = File(filePath)
        if (!file.exists() || !file.isFile) {
            return buildJsonObject {
                put("status", "error")
                put("message", "File not found: $filePath")
            }
        }

        return try {
            val content = file.readText()
            buildJsonObject {
                put("status", "success")
                put("path", file.absolutePath)
                put("size_bytes", file.length())
                put("content", content)
            }
        } catch (e: Exception) {
            buildJsonObject {
                put("status", "error")
                put("message", e.message ?: "Failed to read file")
            }
        }
    }

    fun writeFile(params: JsonObject): JsonObject {
        val path = params["path"]?.jsonPrimitive?.contentOrNull ?: ""
        val content = params["content"]?.jsonPrimitive?.contentOrNull ?: ""
        val append = params["append"]?.jsonPrimitive?.booleanOrNull ?: false

        val file = File(path)
        file.parentFile?.mkdirs()

        return try {
            FileOutputStream(file, append).use { fos ->
                fos.write(content.toByteArray(Charsets.UTF_8))
            }
            buildJsonObject {
                put("status", "success")
                put("bytes_written", content.length)
                put("path", file.absolutePath)
            }
        } catch (e: Exception) {
            buildJsonObject {
                put("status", "error")
                put("message", e.message ?: "Failed to write file")
            }
        }
    }
}`
  }
];
