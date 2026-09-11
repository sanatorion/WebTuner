// Reference dictionary of guitar tuning frequencies

const TUNING_NAMES = {
    standard: "Standard",
    halfStepDown: "Half Step Down",
    fullStepDown: "Full Step Down",
    dropD: "Drop D",
    dropCSharp: "Drop C#",
    dropC: "Drop C",
    custom: "Custom",
    chromatic: "Chromatic"
};

const chromaticNotes = [
    // Octave 2
    { note: "C₂",  freq: 65.4 },
    { note: "C#₂", freq: 69.3 },
    { note: "D₂",  freq: 73.4 },
    { note: "D#₂", freq: 77.8 },
    { note: "E₂",  freq: 82.4 },
    { note: "F₂",  freq: 87.3 },
    { note: "F#₂", freq: 92.5 },
    { note: "G₂",  freq: 98 },
    { note: "G#₂", freq: 103.8 },
    { note: "A₂",  freq: 110 },
    { note: "A#₂", freq: 116.5 },
    { note: "B₂",  freq: 123.5 },

    // Octave 3 
    { note: "C₃",  freq: 130.8 },
    { note: "C#₃", freq: 138.6 },
    { note: "D₃",  freq: 146.8 },
    { note: "D#₃", freq: 155.6 },
    { note: "E₃",  freq: 164.8 },
    { note: "F₃",  freq: 174.6 },
    { note: "F#₃", freq: 185 },
    { note: "G₃",  freq: 196 },
    { note: "G#₃", freq: 207.6 },
    { note: "A₃",  freq: 220 },
    { note: "A#₃", freq: 233.1 },
    { note: "B₃",  freq: 246.9 },

    // Octave 4
    { note: "C₄",  freq: 261.6 },
    { note: "C#₄", freq: 277.2 },
    { note: "D₄",  freq: 293.7 },
    { note: "D#₄", freq: 311.1 },
    { note: "E₄",  freq: 329.6 },
    { note: "F₄",  freq: 349.2 },
    { note: "F#₄", freq: 369.1 },
    { note: "G₄",  freq: 392 },
    { note: "G#₄", freq: 415.3 },
    { note: "A₄",  freq: 440 },
    { note: "A#₄", freq: 466.2 },
    { note: "B₄",  freq: 493.9 },

    // Octave 5
    { note: "C₅",  freq: 523.3 },
    { note: "C#₅", freq: 554.4 },
    { note: "D₅",  freq: 587.3 },
    { note: "D#₅", freq: 622.3 },
    { note: "E₅",  freq: 659.3 },
    { note: "F₅",  freq: 698.5 },
    { note: "F#₅", freq: 739.1 },
    { note: "G₅",  freq: 783.1 },
    { note: "G#₅", freq: 830.6 },
    { note: "A₅",  freq: 880 },
    { note: "A#₅", freq: 932.3 },
    { note: "B₅",  freq: 987.8 }
];

const TUNINGS = {
    standard: [
        { note: "E₂", octave: 2, freq: 82.4 },
        { note: "A₂", octave: 2, freq: 110 },
        { note: "D₃", octave: 3, freq: 146.8 },
        { note: "G₃", octave: 3, freq: 196 },
        { note: "B₃", octave: 3, freq: 246.9 },
        { note: "E₄", octave: 4, freq: 329.6 }
    ],
    halfStepDown: [
        { note: "D#₂", octave: 2, freq: 77.8 },
        { note: "G#₂", octave: 2, freq: 103.8 },
        { note: "C#₃", octave: 3, freq: 138.6 },
        { note: "F#₃", octave: 3, freq: 185 },
        { note: "A#₃", octave: 3, freq: 233.1 },
        { note: "D#₄", octave: 4, freq: 311.1 }
    ],
    fullStepDown: [
        { note: "D₂", octave: 2, freq: 73.4 },
        { note: "G₂", octave: 2, freq: 98 },
        { note: "C₃", octave: 3, freq: 130.8 },
        { note: "F₃", octave: 3, freq: 174.6 },
        { note: "A₃", octave: 3, freq: 220 },
        { note: "D₄", octave: 4, freq: 293.7 }
    ],
    dropD: [
        { note: "D₂", octave: 2, freq: 73.4 },
        { note: "A₂", octave: 2, freq: 110 },
        { note: "D₃", octave: 3, freq: 146.8 },
        { note: "G₃", octave: 3, freq: 196 },
        { note: "B₃", octave: 3, freq: 246.9 },
        { note: "E₄", octave: 4, freq: 329.6 }
    ],
    dropCSharp: [
        { note: "C#₂", octave: 2, freq: 69.3 },
        { note: "G#₂", octave: 2, freq: 103.8 },
        { note: "C#₃", octave: 3, freq: 138.6 },
        { note: "F#₃", octave: 3, freq: 185 },
        { note: "A#₃", octave: 3, freq: 233.1 },
        { note: "D#₄", octave: 4, freq: 311.1 }
    ],
    dropC: [
        { note: "C₂", octave: 2, freq: 65.4 },
        { note: "G₂", octave: 2, freq: 98 },
        { note: "C₃", octave: 3, freq: 130.8 },
        { note: "F₃", octave: 3, freq: 174.6 },
        { note: "A₃", octave: 3, freq: 220 },
        { note: "D₄", octave: 4, freq: 293.7 }
    ],
    custom: [
        { note: "E₂", octave: 2, freq: 82.4 },
        { note: "A₂", octave: 2, freq: 110 },
        { note: "D₃", octave: 3, freq: 146.8 },
        { note: "G₃", octave: 3, freq: 196 },
        { note: "B₃", octave: 3, freq: 246.9 },
        { note: "E₄", octave: 4, freq: 329.6 }
    ]
}