# WebTuner

WebTuner is a lightweight, minimalist web utility designed for musicians who want a clean, visual, and distraction-free way to tune their instruments directly from their browser. It provides real-time, interactive pitch feedback without requiring any installation.

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

1. **Clone or Download** the repository to your local machine.
2. Open index.html or tuned.html in any modern web browser (Google Chrome, Firefox, Safari, Edge).
3. Ensure you are **connected to the internet** so external libraries load properly.
4. Allow microphone access when prompted by your browser.
5. Pluck a string and start tuning!

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