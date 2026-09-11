# WebTuner

WebTuner is a simple, minimalist web tool built for quick and distraction-free instrument tuning right in your browser. It uses your device's mic to give you real-time pitch feedback—no extra apps or installs needed, just open the page and tune up.

---

## Important Note on Internet Access (WiFi / Data)

**WebTuner requires an active internet connection to function.** 

The audio pitch detection engine imports the pitchy module directly via an external CDN (https://esm.sh/pitchy@4). You must be connected to Wi-Fi or mobile data when opening the application so the browser can load the pitch detection library.

---

## Features

- **Real-Time Visual Feedback**: Smooth interactive cent trail rendered using the HTML5 Canvas API and linear interpolation (Lerp).
- **Multiple Guitar Tunings**: Built-in support for Standard, Half Step Down, Full Step Down, Drop D, Drop C#, and Drop C.
- **Chromatic Mode**: Supports all 12 tones across multiple octaves (C₂–B₅).
- **Smart Note Box Highlighting**: Highlights the exact string/note box matching the octave currently being played.
- **Persistent Selection**: Seamlessly carries your chosen tuning between the selection menu and main tuner UI via sessionStorage.
- **Zero Installs**: Runs completely within any modern web browser with microphone access.

---

## Getting Started

1. **Clone or Download** the project files to your local machine.
2. **Run a local web server** (required because the app uses ES Modules):
   - **VS Code**: Install the *Live Server* extension, right-click `index.html`, and select **Open with Live Server**.
3. Open the provided local URL (e.g., `http://localhost:5500` or `http://localhost:8000`) in your browser.
4. Make sure you are **connected to the internet** so external CDN scripts load properly.
5. Allow microphone access when prompted.
6. Pluck a string and start tuning!

---

## Tech Stack

- **HTML5 & CSS3**: Custom responsive layouts and styling.
- **JavaScript (ES Modules)**: Modern ES module setup for clean, modular code.
- **Web Audio API**: Standard browser API used to capture live microphone input.
- **Canvas API**: Custom trail rendering with quadratic bezier curves for pitch history.
- **Pitchy**: Open-source pitch detection library loaded via CDN.

---

## Credits & Acknowledgments

WebTuner is powered by the open-source Pitchy library by Ian Prime (MIT License), providing accurate, real-time pitch detection via the Web Audio API.