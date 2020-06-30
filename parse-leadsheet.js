Tonal = require("@tonaljs/tonal")

function tokenize(input) {
    input = input.replace("(", "") // No parentheses
    input = input.replace(")", "")
    input = input.split(/[,-\s]\s*/) // Commas, hyphens, spaces
    input = input.filter(element => {return element != ""})
    return input
}

// MIDI 60 = 0V = C4 = 261.6256 hz
function toVOct(pitch){
    pitch = Tonal.Midi.toMidi(pitch)
    pitch = (pitch - 60) * 1 / 12
    return pitch
} 

// Tonic on the 4th octave for easier further conversion
function parseAsLeadsheet(input) {
    pitchSeries = input.map(currentChord => {       
        if (currentChord.includes("/")) {
            split = currentChord.split("/")
            currentChord = Tonal.Chord.get(split[0])
            currentChord = Tonal.Chord.getChord(currentChord.aliases[0], currentChord.tonic, split[1])
        } else {
            currentChord = Tonal.Chord.get(currentChord)
        }
        currentFirstNote = Tonal.note(currentChord.tonic + "4")
        return currentChord.intervals.map(interval => Tonal.transpose(currentFirstNote, interval))

    })
    return pitchSeries
}

function leadsheetToQqqq(input) {
    results = parseAsLeadsheet(tokenize(input))
    results = results.map(chord => chord.map(pitch => toVOct(pitch)))
    return JSON.stringify(results)
}