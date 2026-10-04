let recognition;
let isListening = false;

const output = document.getElementById("output");
const statusText = document.getElementById("status");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    statusText.innerHTML =
        "❌ Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.";

} else {

    recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {

        isListening = true;

        statusText.innerHTML =
            "🎙️ Listening... Speak now.";

        document.getElementById("micButton").innerHTML =
            "🔴 Listening...";
    };

    recognition.onresult = function(event) {

        let finalText = "";
        let interimText = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const transcript =
                event.results[i][0].transcript;

            if (event.results[i].isFinal) {

                finalText += transcript + " ";

            } else {

                interimText += transcript;
            }
        }

        if (finalText !== "") {

            output.value += finalText;
        }

        updateStatistics();

        if (interimText !== "") {

            statusText.innerHTML =
                "🎙️ Hearing: " + interimText;
        }
    };

    recognition.onerror = function(event) {

        statusText.innerHTML =
            "❌ Error: " + event.error;

        isListening = false;
    };

    recognition.onend = function() {

        isListening = false;

        document.getElementById("micButton").innerHTML =
            "🎙️ Start Speaking";

        if (statusText.innerHTML.includes("Listening")) {

            statusText.innerHTML =
                "Click the microphone and start speaking";
        }
    };
}


// Start Speech Recognition

function startRecognition() {

    if (!recognition) {

        alert(
            "Speech Recognition is not supported. Please use Chrome or Edge."
        );

        return;
    }

    if (isListening) {
        return;
    }

    const language =
        document.getElementById("language").value;

    recognition.lang = language;

    recognition.start();
}


// Stop Speech Recognition

function stopRecognition() {

    if (recognition && isListening) {

        recognition.stop();

        statusText.innerHTML =
            "⏹️ Speech recognition stopped.";
    }
}


// Update Statistics

function updateStatistics() {

    const text = output.value.trim();

    if (text === "") {

        document.getElementById("wordCount").textContent = "0";
        document.getElementById("characterCount").textContent = "0";
        document.getElementById("sentenceCount").textContent = "0";

        return;
    }

    const words =
        text.split(/\s+/).filter(word => word.length > 0);

    const sentences =
        text.split(/[.!?]+/)
            .filter(sentence => sentence.trim().length > 0);

    document.getElementById("wordCount").textContent =
        words.length;

    document.getElementById("characterCount").textContent =
        text.length;

    document.getElementById("sentenceCount").textContent =
        sentences.length;
}


// Copy Text

function copyText() {

    const text = output.value;

    if (text.trim() === "") {

        alert("There is no text to copy.");
        return;
    }

    navigator.clipboard.writeText(text);

    alert("Text copied successfully!");
}


// Clear Text

function clearText() {

    output.value = "";

    updateStatistics();

    statusText.innerHTML =
        "Click the microphone and start speaking";
}


// Download Text

function downloadText() {

    const text = output.value;

    if (text.trim() === "") {

        alert("There is no text to download.");
        return;
    }

    const blob =
        new Blob([text], { type: "text/plain" });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = "speech-recognition.txt";

    link.click();

    URL.revokeObjectURL(url);
}


// Update statistics when typing manually

output.addEventListener(
    "input",
    updateStatistics
);