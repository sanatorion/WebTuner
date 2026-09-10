import { PitchDetector } from "https://esm.sh/pitchy@4";

let pitchHistory = [];
const maxHistoryLength = 40;

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

let holdDuration = 2000;
let lastValidTime = 0;
let lockUntilTime = 0;
let lastOffset = 0;

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
  const closestNote = findClosestNote(hz, chromaticNotes);

  const coin = document.querySelector('.cent-coin');
  const centText = document.querySelector('.cent');

  let currentOffset = 0;
  let isActivePitch = false;

  if (clarity > 0.95) {  
    lastValidTime = now;
    isActivePitch = true;

    document.getElementById("frequency-label").textContent = `${hz} Hz`;
    document.getElementById("tuner-note-label").textContent = `${closestNote.targetNote}`;
    document.getElementById("target-frequency-label").textContent = `${closestNote.targetFreq} Hz`;

    const cents = closestNote.cents;
    const maxCents = 50;
    const clampedCents = Math.max(-maxCents, Math.min(maxCents, cents));
    
    const canvasWidth = document.querySelector('.cent-canvas').clientWidth;
    const maxPixelShift = (canvasWidth / 2) - 30; 
    currentOffset = (clampedCents / maxCents) * maxPixelShift;

    lastOffset = currentOffset;

    if (coin) {
      coin.style.transform = `translateX(calc(-50% + ${currentOffset}px))`;

      if (cents === 0){
        centText.style.backgroundColor = "#74F398";
        lockUntilTime = now + 800;
      } else if (cents >= -8 && cents <= 8){
        centText.style.backgroundColor = "#2D2F2C";
      } else {
        centText.style.backgroundColor = "#1d1d1d";
      }
    }

    if (centText) {
      if (cents === 0) {
        centText.textContent = "✓";
        centText.style.color = "#1d1d1d";
        centText.style.fontSize = "30px";
        document.getElementsByClassName("vertical-axis-line")[0].style.backgroundColor = "#74F398";
        document.getElementsByClassName("horizontal-axis-line")[0].style.backgroundColor = "#74F398";
      } else {
        centText.textContent = `${cents > 0 ? '+' : ''}${cents}`;
        centText.style.color = "#dddddd";
        centText.style.fontSize = "22px";
      }
    }

  } else {
    if (now - lastValidTime > holdDuration) {
      centText.style.transition = "all 0.10s linear";
      centText.style.backgroundColor = "#1d1d1d";
      centText.style.color = "#dddddd";
      centText.style.fontSize = "22px";
      
      document.getElementsByClassName("vertical-axis-line")[0].style.backgroundColor = "#919191";
      document.getElementsByClassName("horizontal-axis-line")[0].style.backgroundColor = "#919191";
      
      document.getElementById("frequency-label").textContent = `--.- Hz`;
      document.getElementById("target-frequency-label").textContent = `--.- Hz`;
      document.getElementById("tuner-note-label").textContent = `-`;

      if (coin) {
        coin.style.transform = `translateX(-50%)`;
      }
      if (centText) {
        centText.textContent = `-`;
      }

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