'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { playChimeSound, speakText, getRandomTakenRhyme } from '@/lib/rhymes';
import {
  Cpu,
  Wifi,
  Volume2,
  Check,
  Clock,
  Sparkles,
  Zap,
  Code2,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Copy,
  CheckCheck
} from 'lucide-react';

export const HardwareSimulator: React.FC = () => {
  const {
    hardwareState,
    pressHardwareTaken,
    pressHardwareNotTaken,
    setHardwareVolume,
    triggerReminderModal,
    activePatient,
    schedules,
    checkDoseSafety
  } = useApp();

  const [activeTab, setActiveTab] = useState<'simulator' | 'schematics' | 'code'>('simulator');
  const [copiedCode, setCopiedCode] = useState(false);

  // Determine LED ring class
  const getLedClass = () => {
    switch (hardwareState.ledStatus) {
      case 'alert_pulsing':
        return 'border-amber-400 bg-amber-400/20 shadow-[0_0_25px_rgba(251,191,36,0.9)] animate-pulse';
      case 'taken_green':
        return 'border-emerald-400 bg-emerald-400/20 shadow-[0_0_25px_rgba(52,211,153,0.9)]';
      case 'snooze_blue':
        return 'border-sky-400 bg-sky-400/20 shadow-[0_0_25px_rgba(56,189,248,0.8)]';
      default:
        return 'border-teal-500/50 bg-teal-500/10 shadow-[0_0_12px_rgba(20,184,166,0.4)]';
    }
  };

  const handleTestBuzzer = () => {
    playChimeSound('hardware_buzzer');
  };

  const handleSimulateAlert = () => {
    triggerReminderModal();
  };

  const handlePhysicalTakenPress = () => {
    playChimeSound('success');
    const rhyme = getRandomTakenRhyme();
    speakText(`Hardware speaker output: ${rhyme.lines.join(' ')}`, {
      pitch: 1.25,
      rate: 0.95
    });
    pressHardwareTaken();
  };

  const handlePhysicalNotTakenPress = () => {
    playChimeSound('gentle_sad');
    pressHardwareNotTaken();
  };

  const esp32ArduinoCode = `// ========================================================
// MediNotify IoT Smart Medicine Box Firmware
// Target: ESP32-WROOM-32 + SSD1306 OLED + DFPlayer Mini MP3
// Project: Pediatric Oncology Adherence Companion
// ========================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DFRobotDFPlayerMini.h>

// PIN ASSIGNMENTS
#define PIN_BUTTON_TAKEN      18  // Large Green Push Button
#define PIN_BUTTON_NOT_TAKEN  19  // Large Amber Snooze Button
#define PIN_BUZZER            23  // Piezo Alarm Buzzer
#define PIN_NEOPIXEL          4   // WS2812B RGB Ring
#define SCREEN_WIDTH         128
#define SCREEN_HEIGHT         64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
HardwareSerial mySoftwareSerial(2); // RX=16, TX=17 for DFPlayer
DFRobotDFPlayerMini dfPlayer;

const char* ssid     = "Caregiver_WiFi";
const char* password = "SafeAndCaredFor";
const char* api_url  = "https://api.medinotify.care/v1/schedule/status";

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BUTTON_TAKEN, INPUT_PULLUP);
  pinMode(PIN_BUTTON_NOT_TAKEN, INPUT_PULLUP);
  pinMode(PIN_BUZZER, OUTPUT);

  // Initialize OLED Display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 Allocation Failed");
  }
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  display.println("MediNotify IoT v2.0");
  display.println("Connecting WiFi...");
  display.display();

  // Initialize DFPlayer Mini for Rhymes
  mySoftwareSerial.begin(9600, SERIAL_8N1, 16, 17);
  if (dfPlayer.begin(mySoftwareSerial)) {
    dfPlayer.volume(25); // 0 to 30
  }
}

void loop() {
  // Check Hardware TAKEN Push Button
  if (digitalRead(PIN_BUTTON_TAKEN) == LOW) {
    delay(50); // Debounce
    triggerDoseTaken();
    delay(500);
  }

  // Check Hardware SNOOZE Push Button
  if (digitalRead(PIN_BUTTON_NOT_TAKEN) == LOW) {
    delay(50); // Debounce
    triggerSnooze();
    delay(500);
  }

  // Poll cloud schedule every 10 seconds...
  delay(100);
}

void triggerDoseTaken() {
  display.clearDisplay();
  display.setCursor(0, 15);
  display.println("ALREADY TAKEN [OK]");
  display.println("Great job, hero!");
  display.display();

  // Play Motivational Rhyme via Speaker
  dfPlayer.play(1); // Track 1: Motivational Rhyme
  sendAdherenceUpdate("taken");
}

void triggerSnooze() {
  display.clearDisplay();
  display.setCursor(0, 15);
  display.println("SNOOZE: +10 MINS");
  display.println("Take when ready!");
  display.display();
  sendAdherenceUpdate("snoozed");
}

void sendAdherenceUpdate(String status) {
  HTTPClient http;
  http.begin(api_url);
  http.addHeader("Content-Type", "application/json");
  String payload = "{\\"status\\":\\"" + status + "\\",\\"device_id\\":\\"esp32-box-01\\"}";
  http.POST(payload);
  http.end();
}`;

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(esp32ArduinoCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* Top Banner & Tab Navigation */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400 text-teal-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Hardware Integration Concept
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Sync Online
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black mt-1">
            MediNotify IoT Smart Companion Box
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Physical bedside reminder device with speaker, OLED display, LEDs & push-buttons.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'simulator'
                ? 'bg-teal-500 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => setActiveTab('schematics')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'schematics'
                ? 'bg-teal-500 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Flow & Blueprint
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'code'
                ? 'bg-teal-500 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            ESP32 Firmware
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE HARDWARE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="p-6 bg-slate-50 flex flex-col lg:flex-row items-center gap-8">
          
          {/* Virtual 3D Hardware Casing */}
          <div className="w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] p-6 shadow-2xl border-4 border-slate-700 flex flex-col items-center relative overflow-hidden select-none">
            
            {/* Top Device Status Bar */}
            <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-mono mb-4 px-2">
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-teal-400" />
                <span>MQTT: CONNECTED</span>
              </div>
              <div className="flex items-center gap-1">
                <span>BAT: 98%</span>
                <span className="w-3 h-2 rounded-sm border border-slate-400 inline-block bg-teal-400" />
              </div>
            </div>

            {/* Glowing Multi-Color RGB LED Ring */}
            <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-500 mb-4 ${getLedClass()}`}>
              <div className="w-20 h-20 rounded-full bg-slate-900/90 flex flex-col items-center justify-center text-center p-1">
                <Cpu className="w-6 h-6 text-slate-300 mb-0.5" />
                <span className="text-[9px] font-black uppercase text-slate-300">
                  {hardwareState.ledStatus === 'alert_pulsing' && 'BUZZING!'}
                  {hardwareState.ledStatus === 'taken_green' && 'TAKEN ✓'}
                  {hardwareState.ledStatus === 'snooze_blue' && 'SNOOZED'}
                  {hardwareState.ledStatus === 'idle' && 'STANDBY'}
                </span>
              </div>
            </div>

            {/* Simulated I2C OLED Display (128x64 Blue/Yellow) */}
            <div className="w-full bg-black rounded-2xl p-4 border-2 border-slate-700 shadow-inner font-mono text-center flex flex-col justify-center min-h-[110px] relative overflow-hidden">
              <div className="absolute top-1 left-2 text-[9px] text-yellow-400/80">
                OLED SSD1306 (I2C 0x3C)
              </div>
              <p className="text-yellow-400 font-bold text-sm tracking-widest mt-1">
                {hardwareState.screenMessage}
              </p>
              <p className="text-cyan-300 text-xs mt-1 leading-snug">
                {hardwareState.screenSubtext}
              </p>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-center gap-2">
                <span>Patient: {activePatient.name}</span>
                <span>•</span>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Speaker Grille with Sound Waves */}
            <div className="w-full mt-4 flex items-center justify-between px-3 text-slate-400 text-xs">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-teal-400" />
                <span className="text-[11px] font-mono">3W Rhyme Speaker</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 rounded bg-teal-400 animate-pulse" />
                <span className="w-1 h-5 rounded bg-teal-400 animate-pulse delay-75" />
                <span className="w-1 h-2 rounded bg-teal-400 animate-pulse delay-150" />
                <span className="w-1 h-4 rounded bg-teal-400 animate-pulse" />
              </div>
            </div>

            {/* TWO PHYSICAL TACTILE PUSH BUTTONS */}
            <div className="w-full grid grid-cols-2 gap-4 mt-5">
              
              {/* TAKEN Physical Button (Big Green Arcade Cap) */}
              <button
                onClick={handlePhysicalTakenPress}
                className="py-4 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-700 active:from-emerald-700 active:to-emerald-800 text-white font-black text-sm shadow-[0_6px_0_#065f46] active:shadow-[0_2px_0_#065f46] active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1 border-2 border-emerald-400"
              >
                <Check className="w-5 h-5" />
                <span>TAKEN [✓]</span>
                <span className="text-[9px] text-emerald-200 font-normal">Push to Confirm</span>
              </button>

              {/* SNOOZE / NOT TAKEN Physical Button (Big Amber Arcade Cap) */}
              <button
                onClick={handlePhysicalNotTakenPress}
                className="py-4 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-700 active:from-amber-700 active:to-amber-800 text-white font-black text-sm shadow-[0_6px_0_#92400e] active:shadow-[0_2px_0_#92400e] active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1 border-2 border-amber-400"
              >
                <Clock className="w-5 h-5" />
                <span>SNOOZE</span>
                <span className="text-[9px] text-amber-200 font-normal">Remind Later</span>
              </button>

            </div>

            <p className="mt-4 text-[10px] text-slate-500 text-center font-mono">
              STATUS: {hardwareState.lastAction}
            </p>

          </div>

          {/* Right Controls & Testing Console */}
          <div className="flex-1 w-full space-y-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                Interactive Evaluation Controls
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Test the bidirectional interaction between this hardware companion and the MediNotify app.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <button
                  onClick={handleSimulateAlert}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Trigger Alert on Hardware</span>
                </button>

                <button
                  onClick={handleTestBuzzer}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-300"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Test Hardware Buzzer</span>
                </button>
              </div>
            </div>

            {/* Hardware Flow Summary */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
              <h5 className="font-black text-teal-950 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                How the Hardware Works
              </h5>
              <ol className="text-xs text-teal-900 space-y-2 list-decimal list-inside font-medium leading-relaxed">
                <li>
                  <strong>Medicine Schedule:</strong> Caregiver schedules child doses in MediNotify.
                </li>
                <li>
                  <strong>Reminder Trigger:</strong> At the set time, cloud MQTT sends a trigger to the ESP32 box.
                </li>
                <li>
                  <strong>Buzzer & LEDs:</strong> The hardware sounds a soft double-chime and pulses amber lights.
                </li>
                <li>
                  <strong>Child Action:</strong> The child presses the large green <strong>TAKEN</strong> button.
                </li>
                <li>
                  <strong>Motivational Rhyme:</strong> The hardware speaker immediately recites an encouraging rhyme!
                </li>
                <li>
                  <strong>Adherence Locked:</strong> Locks dose to <strong>“Already Taken ✓”</strong> and logs it on the Caregiver Dashboard.
                </li>
              </ol>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: SCHEMATICS & WORKFLOW DIAGRAM */}
      {activeTab === 'schematics' && (
        <div className="p-6 bg-slate-50 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-black text-slate-900 text-sm mb-3">
              Hardware Architecture & Signal Pipeline
            </h4>
            
            {/* Step Pipeline Visualization */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">1. Schedule</span>
                <span className="text-[11px] text-slate-500">Cloud Webhook</span>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block">2. Trigger</span>
                <span className="text-[11px] text-amber-700">MQTT Pub/Sub</span>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl border border-amber-300">
                <span className="font-bold text-amber-950 block">3. Buzzer</span>
                <span className="text-[11px] text-amber-800">Piezo & OLED</span>
              </div>
              <div className="bg-teal-50 p-3 rounded-xl border border-teal-200">
                <span className="font-bold text-teal-900 block">4. Child Takes</span>
                <span className="text-[11px] text-teal-700">Comfort Moment</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block">5. Button Push</span>
                <span className="text-[11px] text-emerald-700">Taken / Snooze</span>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200">
                <span className="font-bold text-yellow-900 block">6. Rhyme Audio</span>
                <span className="text-[11px] text-yellow-700">3W DFPlayer</span>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl border border-emerald-300">
                <span className="font-bold text-emerald-950 block">7. Dashboard</span>
                <span className="text-[11px] text-emerald-800">Status Locked ✓</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h5 className="font-black text-slate-900 text-xs uppercase tracking-wide mb-3">
                Bill of Materials (BOM)
              </h5>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex justify-between border-b pb-1">
                  <span>ESP32-WROOM-32 Dev Board</span>
                  <span className="font-mono text-slate-500">\$4.50</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>0.96" I2C OLED (SSD1306, 128x64)</span>
                  <span className="font-mono text-slate-500">\$2.80</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>DFPlayer Mini MP3 + 3W Speaker</span>
                  <span className="font-mono text-slate-500">\$3.20</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>WS2812B NeoPixel 8-LED Ring</span>
                  <span className="font-mono text-slate-500">\$1.90</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>2x Arcade Tactile Buttons (Green & Amber)</span>
                  <span className="font-mono text-slate-500">\$2.20</span>
                </li>
                <li className="flex justify-between font-bold text-teal-800 pt-1">
                  <span>Total Unit Prototype Cost:</span>
                  <span className="font-mono">~\$14.60</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h5 className="font-black text-slate-900 text-xs uppercase tracking-wide mb-3">
                Safety & Pediatric Considerations
              </h5>
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  • <strong>Double-Dose Prevention:</strong> Pressing the button after status is marked taken simply displays "Already Taken ✓" and suppresses duplicate alarms.
                </p>
                <p>
                  • <strong>Gentle Sound Levels:</strong> Piezo buzzer capped at 65 dB to prevent sensory overload for children experiencing post-chemo nausea or migraines.
                </p>
                <p>
                  • <strong>Battery Backup:</strong> LiPo battery ensures uninterrupted operation even if unhooked from bedside charger.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ESP32 ARDUINO C++ FIRMWARE CODE */}
      {activeTab === 'code' && (
        <div className="p-6 bg-slate-900 text-white flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-teal-400" />
              <span className="font-mono text-xs font-bold text-slate-300">
                firmware_esp32_medinotify.ino
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedCode ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied Code!' : 'Copy Arduino Sketch'}</span>
            </button>
          </div>

          <pre className="p-4 bg-black/60 rounded-xl border border-slate-800 font-mono text-[11px] text-teal-300 overflow-x-auto max-h-96 leading-relaxed">
            {esp32ArduinoCode}
          </pre>
        </div>
      )}

    </div>
  );
};
