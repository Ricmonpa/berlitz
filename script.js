// ====== CONFIGURACIÓN DV360 ======
var clickTag = "https://www.berlitz.com/es-mx/idiomas/ingles";

// ====== VARIABLES GLOBALES ======
const targetPhrase = "We need to leverage our synergies to maximize ROI";
const criticalWords = ["leverage", "synergies", "maximize", "roi"]; // Palabras clave del mundo corporativo

let currentSlide = 1;

// ====== NAVEGACIÓN ENTRE SLIDES ======
function goToSlide(slideNumber) {
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    document.getElementById(`slide-${slideNumber}`).classList.add('active');
    currentSlide = slideNumber;
}

// ====== RECONOCIMIENTO DE VOZ ======
function startListening() {
    // Verificar compatibilidad
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.");
        simulateScore(); // Fallback automático
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // UI feedback: botón "grabando"
    const micButton = document.getElementById('mic-button');
    micButton.classList.add('recording');
    micButton.innerHTML = `
        <svg class="mic-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="8"></circle>
        </svg>
        <span>Grabando...</span>
    `;

    recognition.start();

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        console.log("Usuario dijo:", speechResult);
        
        // Ir a slide de análisis
        goToSlide(3);
        
        // Simular delay de procesamiento (1.5s)
        setTimeout(() => {
            calculateScore(speechResult);
        }, 1500);
    };

    recognition.onerror = function(event) {
        console.error("Error de reconocimiento:", event.error);
        
        if (event.error === 'not-allowed' || event.error === 'no-speech') {
            alert("No se detectó tu voz o el micrófono está bloqueado. Intenta de nuevo.");
            location.reload();
        } else {
            // Fallback: simular score bajo
            goToSlide(3);
            setTimeout(() => {
                simulateScore();
            }, 1500);
        }
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };
}

// ====== ALGORITMO DE SCORING MEJORADO ======
function calculateScore(spokenText) {
    const spokenLower = spokenText.toLowerCase().trim();
    const targetLower = targetPhrase.toLowerCase().trim();
    const targetWords = targetLower.split(' ');
    const spokenWords = spokenLower.split(' ');
    
    let matches = 0;
    let criticalMatches = 0;
    
    // Verificar si la frase es EXACTAMENTE perfecta
    const isPerfect = spokenLower === targetLower;
    
    // Contar coincidencias de palabras generales
    targetWords.forEach(word => {
        if (spokenWords.includes(word)) {
            matches++;
        }
    });
    
    // Contar coincidencias de palabras críticas (más peso)
    criticalWords.forEach(word => {
        if (spokenLower.includes(word)) {
            criticalMatches++;
        }
    });
    
    // Cálculo base
    let basePercentage = Math.round((matches / targetWords.length) * 100);
    
    // Bonus por palabras críticas (máximo +15%)
    let criticalBonus = (criticalMatches / criticalWords.length) * 15;
    
    let finalScore = basePercentage + criticalBonus;
    
    // Ajuste "dramático" para el anuncio
    // SOLO dar 100% si la frase fue EXACTAMENTE perfecta
    if (!isPerfect) {
        finalScore = Math.max(finalScore - 15, 0); // Penalización de 15% si no es perfecto
    }
    
    finalScore = Math.round(Math.min(finalScore, 100)); // Cap a 100%
    
    console.log(`Score final: ${finalScore}% (Base: ${basePercentage}%, Critical: ${criticalMatches}/${criticalWords.length}, Perfect: ${isPerfect})`);
    
    showResults(finalScore);
}

// ====== SIMULACIÓN DE SCORE (FALLBACK) ======
function simulateScore() {
    // Score aleatorio bajo (35-55%) para simular mala pronunciación
    const randomScore = Math.floor(Math.random() * (55 - 35 + 1)) + 35;
    
    goToSlide(3);
    setTimeout(() => {
        showResults(randomScore);
    }, 1500);
}

// ====== MOSTRAR RESULTADOS ======
function showResults(score) {
    goToSlide(4);
    
    const scoreDisplay = document.getElementById('score-display');
    const scoreCircle = document.getElementById('score-circle');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    
    // Animación de conteo
    let current = 0;
    const increment = score / 50; // Velocidad de animación
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
            current = score;
            clearInterval(timer);
            finalizeMessage(score);
        }
        scoreDisplay.innerText = Math.round(current);
    }, 20);
    
    // Cambiar color según el score
    if (score >= 70) {
        scoreCircle.classList.add('good');
    }
}

// ====== MENSAJE FINAL SEGÚN SCORE ======
function finalizeMessage(score) {
    const resultMessage = document.getElementById('result-message');
    
    if (score < 50) {
        resultMessage.innerText = "Con esa pronunciación, pierdes credibilidad frente a clientes internacionales. El 73% de los negocios se pierden por barreras del idioma.";
    } else if (score < 70) {
        resultMessage.innerText = "Tu pronunciación necesita trabajo. Los ejecutivos bilingües ganan 30% más que quienes no dominan el inglés.";
    } else {
        resultMessage.innerText = "¡Buen nivel! Pero la perfección marca la diferencia. Berlitz te lleva al siguiente nivel.";
    }
}

// ====== CLICK TAG (DV360/CM360) ======
function handleClickTag() {
    window.open(clickTag, '_blank');
}

// ====== DEBUG TOOLS ======
console.log("🎯 Berlitz Banner Loaded");
console.log("Target phrase:", targetPhrase);
console.log("Critical words:", criticalWords);