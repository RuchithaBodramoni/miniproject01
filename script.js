// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBdkoLFH5Ee0dWBa-jytAjTblRev1D31-4",
    authDomain: "gita-a4.firebaseapp.com",
    databaseURL: "https://gita-a4-default-rtdb.firebaseio.com",
    projectId: "gita-a4",
    storageBucket: "gita-a4.firebasestorage.app",
    messagingSenderId: "774652659701",
    appId: "1:774652659701:web:f2ab86253638e93d1582bc",
    measurementId: "G-3FPMK4RRH0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Global state for current Shloka number
window.currentShlokaNum = 1;

// Function to reset all content
function resetShlokaContent() {
    document.getElementById("shloka-box").innerHTML = ""; // Clear Shloka text
    document.getElementById("meaning-box").innerHTML = ""; // Clear Meaning
    document.getElementById("summary-box").innerHTML = ""; // Clear Summary
    document.getElementById("word-meaning-box").innerHTML = ""; // Clear Word-to-Word Meaning
    document.getElementById("audPlayer").src = ""; // Reset Male Audio
    document.getElementById("audPlayer1").src = ""; // Reset Female Audio
    document.getElementById("audPlayer2").src = ""; // Reset Child Audio
    document.getElementById("shloka-image").src = "default-image.jpg"; // Reset Image to default
}

// Function to fetch translations
async function fetchTranslation(languageKey) {
    const shlokaNum = window.currentShlokaNum;
    const translationRef = ref(database, `Shloka-${shlokaNum}/Translations/${languageKey}`);

    try {
        const snapshot = await get(translationRef);
        if (snapshot.exists()) {
            document.getElementById("shloka-box").innerHTML = snapshot.val();
        } else {
            console.error(`No translation found for Shloka-${shlokaNum} in language ${languageKey}.`);
        }
    } catch (error) {
        console.error("Error fetching translation:", error);
    }
}

// Function to fetch meaning
async function fetchMeaning(languageKey) {
    const shlokaNum = window.currentShlokaNum;
    const meaningRef = ref(database, `Shloka-${shlokaNum}/Meaning/${languageKey}`);

    try {
        const snapshot = await get(meaningRef);
        if (snapshot.exists()) {
            document.getElementById("meaning-box").innerHTML = snapshot.val();
        } else {
            console.error(`No meaning found for Shloka-${shlokaNum} in language ${languageKey}.`);
        }
    } catch (error) {
        console.error("Error fetching meaning:", error);
    }
}

// Function to fetch summary
async function fetchSummary(languageKey) {
    const shlokaNum = window.currentShlokaNum;
    const summaryRef = ref(database, `Shloka-${shlokaNum}/Summary/${languageKey}`);

    try {
        const snapshot = await get(summaryRef);
        if (snapshot.exists()) {
            document.getElementById("summary-box").innerHTML = snapshot.val();
        } else {
            console.error(`No summary found for Shloka-${shlokaNum} in language ${languageKey}.`);
        }
    } catch (error) {
        console.error("Error fetching summary:", error);
    }
}

// Function to fetch word-to-word meaning
async function fetchWordMeaning(languageKey) {
    const shlokaNum = window.currentShlokaNum;
    const wordMeaningRef = ref(database, `Shloka-${shlokaNum}/Word-Meaning/${languageKey}`);

    try {
        const snapshot = await get(wordMeaningRef);
        if (snapshot.exists()) {
            document.getElementById("word-meaning-box").innerHTML = snapshot.val();
        } else {
            console.error(`No word-to-word meaning found for Shloka-${shlokaNum} in language ${languageKey}.`);
        }
    } catch (error) {
        console.error("Error fetching word-to-word meaning:", error);
    }
}

// Function to fetch shloka data and audio
async function fetchShlokaData(shlokaNum) {
    resetShlokaContent(); // Reset all content before loading new data
    window.currentShlokaNum = shlokaNum;

    const shlokaRef = ref(database, `Shloka-${shlokaNum}/main`);
    const imageRef = ref(database, `Shloka-${shlokaNum}/image`);
    const audioRefs = [
        ref(database, `Shloka-${shlokaNum}/aud`),
        ref(database, `Shloka-${shlokaNum}/audf`),
        ref(database, `Shloka-${shlokaNum}/audc`)
    ];

    try {
        const [shlokaSnap, imageSnap, maleAudioSnap, femaleAudioSnap, childAudioSnap] = await Promise.all([
            get(shlokaRef),
            get(imageRef),
            ...audioRefs.map(ref => get(ref))
        ]);

        // Update Shloka text
        if (shlokaSnap.exists()) {
            document.getElementById("shloka-box").innerHTML = shlokaSnap.val();
        } else {
            console.error(`No Shloka data found for Shloka-${shlokaNum}.`);
        }

        // Update Image
        if (imageSnap.exists()) {
            document.getElementById("shloka-image").src = imageSnap.val();
        } else {
            console.error(`No image found for Shloka-${shlokaNum}.`);
            document.getElementById("shloka-image").src = "default-image.jpg"; // Fallback image
        }

        // Update Audio Sources
        if (maleAudioSnap.exists()) {
            document.getElementById("audPlayer").src = maleAudioSnap.val();
        } else {
            console.error(`No male audio found for Shloka-${shlokaNum}.`);
        }

        if (femaleAudioSnap.exists()) {
            document.getElementById("audPlayer1").src = femaleAudioSnap.val();
        } else {
            console.error(`No female audio found for Shloka-${shlokaNum}.`);
        }

        if (childAudioSnap.exists()) {
            document.getElementById("audPlayer2").src = childAudioSnap.val();
        } else {
            console.error(`No child audio found for Shloka-${shlokaNum}.`);
        }
    } catch (error) {
        console.error("Error fetching Shloka, image, or Audio data:", error);
    }
}

// Assign functions to global scope
window.changeText = fetchTranslation;
window.translateMeaning = fetchMeaning;
window.translateSummary = fetchSummary;
window.translateWordMeaning = fetchWordMeaning;
window.navClick = fetchShlokaData;
