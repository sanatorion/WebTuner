import { PitchDetector } from "https://esm.sh/pitchy@4";

const savedTuningKey = sessionStorage.getItem("selectedTuning") || "standard";
let activeTuning = (savedTuningKey === "chromaticNotes") ? chromaticNotes : TUNINGS[savedTuningKey] || TUNINGS.standard;

console.log(activeTuning);

let holdDuration = 2000;
let lastValidTime = 0;
let lockUntilTime = 0;
let lastOffset = 0;

let pitchHistory = [];
const maxHistoryLength = 40;

const isPreset = savedTuningKey && savedTuningKey !== "chromatic" && savedTuningKey !== "custom";

const noteInputs = document.querySelectorAll(".note-box");
const arrowButtons = document.querySelectorAll(".arrow-btn");

if (isPreset) {
    arrowButtons.forEach(btn => btn.style.display = "none");

    noteInputs.forEach((input, index) => {
        input.readOnly = true;
        if (activeTuning && activeTuning[index]) {
            // Keep the raw note string with its subscript octave directly from TUNINGS
            input.value = activeTuning[index].note;
        }
    });
} else {
    arrowButtons.forEach(btn => btn.style.display = "inline-block");

    noteInputs.forEach((input) => {
        input.readOnly = false;
    });
}

const tunerTypeLabel = document.getElementById("tuner-type-label");
if (tunerTypeLabel) {
    tunerTypeLabel.textContent = TUNING_NAMES[savedTuningKey] || "Chromatic";
}

function updateActiveNoteHighlight(targetNote) {
    if (!noteInputs.length) return;

    if (!targetNote || targetNote === "-") {
        noteInputs.forEach(input => {
            input.style.borderColor = "";
            input.style.setProperty("color", "#919191", "important");
        });
        return;
    }

    noteInputs.forEach(input => {
        // Direct match includes the octave subscript (e.g., "D#₂" === "D#₂")
        if (input.value.trim() === targetNote.trim()) {
            input.style.borderColor = "#74F398";
            input.style.setProperty("color", "#dddddd", "important");
        } else {
            input.style.borderColor = "";
            input.style.setProperty("color", "#919191", "important");
        }
    });
}

function drawLiveTrail(currentOffset, isActive) {
    const canvas = document.getElementById('cent-trail');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const centerX = canvas.width / 2;
    const startY = 48;
    const endY = canvas.height;
    const targetX = isActive ? (centerX + currentOffset) : centerX;

    pitchHistory.unshift(targetX);

    if (pitchHistory.length > maxHistoryLength) {
        pitchHistory.pop();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pitchHistory.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = "#74F398";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const stepY = (endY - startY) / (maxHistoryLength - 1);

    ctx.moveTo(pitchHistory[0], startY);

    for (let i = 1; i < pitchHistory.length; i++) {
        const prevY = startY + ((i - 1) * stepY);
        const prevX = pitchHistory[i - 1];
        
        const y = startY + (i * stepY);
        const x = pitchHistory[i];

        const midX = (prevX + x) / 2;
        const midY = (prevY + y) / 2;

        ctx.quadraticCurveTo(prevX, prevY, midX, midY);
    }
    ctx.stroke();
}

function findClosestNote(micFreq, tuningArray) {
    let closest = tuningArray[0];
    let smallestDiff = Math.abs(micFreq - closest.freq);

    for (let i = 1; i < tuningArray.length; i++) {
        const diff = Math.abs(micFreq - tuningArray[i].freq);
        if (diff < smallestDiff) {
            smallestDiff = diff;
            closest = tuningArray[i];
        }
    }

    const cents = 148 * Math.log2(micFreq / closest.freq);

    return {
        targetNote: closest.note,
        targetFreq: closest.freq,
        cents: Math.round(cents)
    };
}

function updatePitch(analyserNode, detector, input, sampleRate) {
  const now = Date.now();

  if (now < lockUntilTime) {
    drawLiveTrail(0, true); 
    window.setTimeout(
      () => updatePitch(analyserNode, detector, input, sampleRate),
      100,
    );
    return;
  }

  analyserNode.getFloatTimeDomainData(input);
  const [pitch, clarity] = detector.findPitch(input, sampleRate);
  const hz = Math.round(pitch * 10) / 10;
  const closestNote = findClosestNote(hz, activeTuning);

  const coin = document.querySelector('.cent-coin');
  const centText = document.querySelector('.cent');

  const freqLabel = document.getElementById("frequency-label");
  const tunerNoteLabel = document.getElementById("tuner-note-label");
  const targetFreqLabel = document.getElementById("target-frequency-label");
  const vertAxis = document.getElementsByClassName("vertical-axis-line")[0];
  const horizAxis = document.getElementsByClassName("horizontal-axis-line")[0];

  let currentOffset = 0;
  let isActivePitch = false;

  if (clarity > 0.95) {  
    lastValidTime = now;
    isActivePitch = true;

    if (freqLabel) freqLabel.textContent = `${hz} Hz`;
    if (tunerNoteLabel) tunerNoteLabel.textContent = `${closestNote.targetNote}`;
    if (targetFreqLabel) targetFreqLabel.textContent = `${closestNote.targetFreq} Hz`;

    // Highlight the note box corresponding to closestNote
    updateActiveNoteHighlight(closestNote.targetNote);

    const cents = closestNote.cents;
    const maxCents = 50;
    const clampedCents = Math.max(-maxCents, Math.min(maxCents, cents));
    
    const centCanvas = document.querySelector('.cent-canvas');
    if (centCanvas) {
        const canvasWidth = centCanvas.clientWidth;
        const maxPixelShift = (canvasWidth / 2) - 30; 
        currentOffset = (clampedCents / maxCents) * maxPixelShift;
    }

    lastOffset = currentOffset;

    if (coin) {
      coin.style.transform = `translateX(calc(-50% + ${currentOffset}px))`;

      if (centText) {
        if (cents === 0){
          centText.style.backgroundColor = "#74F398";
          lockUntilTime = now + 800;
        } else if (cents >= -8 && cents <= 8){
          centText.style.backgroundColor = "#2D2F2C";
        } else {
          centText.style.backgroundColor = "#1d1d1d";
        }
      }
    }

    if (centText) {
      if (cents === 0) {
        centText.textContent = "✓";
        centText.style.color = "#1d1d1d";
        centText.style.fontSize = "30px";
        if (vertAxis) vertAxis.style.backgroundColor = "#74F398";
        if (horizAxis) horizAxis.style.backgroundColor = "#74F398";
      } else {
        centText.textContent = `${cents > 0 ? '+' : ''}${cents}`;
        centText.style.color = "#dddddd";
        centText.style.fontSize = "22px";
      }
    }

  } else {
    if (now - lastValidTime > holdDuration) {
      if (centText) {
        centText.style.transition = "all 0.10s linear";
        centText.style.backgroundColor = "#1d1d1d";
        centText.style.color = "#dddddd";
        centText.style.fontSize = "22px";
        centText.textContent = `-`;
      }
      
      if (vertAxis) vertAxis.style.backgroundColor = "#919191";
      if (horizAxis) horizAxis.style.backgroundColor = "#919191";
      
      if (freqLabel) freqLabel.textContent = `--.- Hz`;
      if (targetFreqLabel) targetFreqLabel.textContent = `--.- Hz`;
      if (tunerNoteLabel) tunerNoteLabel.textContent = `-`;

      if (coin) {
        coin.style.transform = `translateX(-50%)`;
      }

      updateActiveNoteHighlight("-");

      currentOffset = 0;
      lastOffset = 0;
      isActivePitch = false;

    } else {
      currentOffset = lastOffset;
      isActivePitch = true;
    }
  }

  drawLiveTrail(currentOffset, isActivePitch);

  window.setTimeout(
    () => updatePitch(analyserNode, detector, input, sampleRate),
    100,
  );
}

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();

    audioContext.createMediaStreamSource(stream).connect(analyserNode);
    const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
    detector.minVolumeDecibels = -10;
    const input = new Float32Array(detector.inputLength);
    updatePitch(analyserNode, detector, input, audioContext.sampleRate);
})
.catch((err) => {
    console.error("Microphone error:", err);
    alert("Microphone access was denied or is unavailable. Please check your browser permissions and refresh the page.");
});