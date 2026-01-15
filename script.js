// ====== CONFIGURACIÓN DV360/CM360 ======
// Esta variable debe apuntar a la URL de destino final
// En DV360/CM360, esta URL se puede sobrescribir dinámicamente
// NO cambiar el nombre de la variable (debe ser exactamente "clickTag")
var clickTag = "https://www.berlitz.com/es-mx/idiomas/ingles";

// ====== VARIABLES GLOBALES ======
// Frases y palabras críticas por nivel
const phrases = {
    1: {
        text: "We need to schedule a meeting for next Monday",
        criticalWords: ["schedule", "meeting", "monday"],
        level: "Básico"
    },
    2: {
        text: "We need to leverage our synergies to maximize ROI",
        criticalWords: ["leverage", "synergies", "maximize", "roi"],
        level: "Intermedio"
    },
    3: {
        text: "Our Q4 projections indicate significant EBITDA growth despite macroeconomic headwinds",
        criticalWords: ["projections", "ebitda", "growth", "macroeconomic", "headwinds"],
        level: "Avanzado"
    }
};

// Almacenamiento de scores y datos (en memoria, no localStorage)
let phraseScores = {
    1: null,
    2: null,
    3: null
};

let userData = {
    nombre: null,
    email: null,
    telefono: null,
    empresa: null
};

let startTime = null;
let endTime = null;
let currentSlide = 1;
let currentPhrase = null;
let recognitionInstance = null;

// Inicializar timestamp de inicio
startTime = new Date().getTime();
console.log("🎯 Berlitz Lead Gen Banner Loaded");
console.log("Start time:", new Date(startTime).toISOString());

// ====== NAVEGACIÓN ENTRE SLIDES ======
function goToSlide(slideNumber) {
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    const slideId = slideNumber === 'analysis' ? 'slide-analysis' : `slide-${slideNumber}`;
    document.getElementById(slideId).classList.add('active');
    currentSlide = slideNumber;
}

// ====== RECONOCIMIENTO DE VOZ ======
function startListening(phraseNumber) {
    currentPhrase = phraseNumber;
    const phrase = phrases[phraseNumber];
    
    // Verificar compatibilidad
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.");
        simulateScore(phraseNumber);
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.lang = 'en-US';
    recognitionInstance.interimResults = false;
    recognitionInstance.maxAlternatives = 1;

    // UI feedback: botón "grabando"
    const micButton = document.getElementById(`mic-button-${phraseNumber}`);
    micButton.classList.add('recording');
    micButton.innerHTML = `
        <svg class="mic-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="8"></circle>
        </svg>
        <span>Grabando...</span>
    `;

    recognitionInstance.start();

    recognitionInstance.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        console.log(`Frase ${phraseNumber} - Usuario dijo:`, speechResult);
        
        // Resetear botón
        resetMicButton(phraseNumber);
        
        // Ir a slide de análisis
        goToSlide('analysis');
        
        // Simular delay de procesamiento (1.5s)
        setTimeout(() => {
            calculateScore(speechResult, phraseNumber);
        }, 1500);
    };

    recognitionInstance.onerror = function(event) {
        console.error(`Error de reconocimiento en frase ${phraseNumber}:`, event.error);
        resetMicButton(phraseNumber);
        
        if (event.error === 'not-allowed' || event.error === 'no-speech') {
            alert("No se detectó tu voz o el micrófono está bloqueado. Puedes usar 'Simular resultado' para continuar.");
        } else {
            // Fallback: simular score
            goToSlide('analysis');
            setTimeout(() => {
                simulateScore(phraseNumber);
            }, 1500);
        }
    };

    recognitionInstance.onspeechend = function() {
        recognitionInstance.stop();
        resetMicButton(phraseNumber);
    };
}

// ====== RESETEAR BOTÓN DE MICRÓFONO ======
function resetMicButton(phraseNumber) {
    const micButton = document.getElementById(`mic-button-${phraseNumber}`);
    micButton.classList.remove('recording');
    micButton.innerHTML = `
        <svg class="mic-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
        <span>Grabar</span>
    `;
}

// ====== ALGORITMO DE SCORING (igual que Versión A) ======
function calculateScore(spokenText, phraseNumber) {
    const phrase = phrases[phraseNumber];
    const targetPhrase = phrase.text;
    const criticalWords = phrase.criticalWords;
    
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
    
    // Guardar score en memoria
    phraseScores[phraseNumber] = finalScore;
    
    console.log(`Frase ${phraseNumber} (${phrase.level}):`);
    console.log(`  - Score: ${finalScore}%`);
    console.log(`  - Base: ${basePercentage}%`);
    console.log(`  - Critical matches: ${criticalMatches}/${criticalWords.length}`);
    console.log(`  - Perfect: ${isPerfect}`);
    
    // Continuar con la siguiente frase o mostrar resultados parciales
    processNextStep(phraseNumber);
}

// ====== SIMULACIÓN DE SCORE (FALLBACK) ======
function simulateScore(phraseNumber) {
    // Generar score aleatorio diferente para cada frase (35-65%)
    // Variar el rango para que no sea siempre el mismo
    const baseMin = 35;
    const baseMax = 65;
    const variance = (phraseNumber - 1) * 5; // Pequeña variación por frase
    const randomScore = Math.floor(Math.random() * (baseMax - baseMin + 1) + baseMin - variance);
    const finalScore = Math.max(35, Math.min(100, randomScore));
    
    phraseScores[phraseNumber] = finalScore;
    
    console.log(`Frase ${phraseNumber} (${phrases[phraseNumber].level}) - SIMULADO:`);
    console.log(`  - Score simulado: ${finalScore}%`);
    
    // Continuar con la siguiente frase o mostrar resultados parciales
    processNextStep(phraseNumber);
}

// ====== PROCESAR SIGUIENTE PASO ======
function processNextStep(phraseNumber) {
    // Verificar si ya completamos las 3 frases
    const allComplete = phraseScores[1] !== null && phraseScores[2] !== null && phraseScores[3] !== null;
    
    if (allComplete) {
        // Calcular promedio y mostrar resultados parciales
        const averageScore = Math.round((phraseScores[1] + phraseScores[2] + phraseScores[3]) / 3);
        showPartialResults(averageScore);
    } else {
        // Avanzar a la siguiente frase
        const nextPhrase = phraseNumber + 1;
        if (nextPhrase <= 3) {
            setTimeout(() => {
                    goToSlide(nextPhrase + 1); // Slide 2, 3 o 4 (frases)
            }, 500);
        }
    }
}

// ====== MOSTRAR RESULTADOS PARCIALES ======
function showPartialResults(averageScore) {
    goToSlide(5);
    
    const scoreDisplay = document.getElementById('score-display-partial');
    const preliminaryScore = document.getElementById('preliminary-score');
    const scoreCircle = document.getElementById('score-circle-partial');
    
    // Animación de conteo
    let current = 0;
    const increment = averageScore / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= averageScore) {
            current = averageScore;
            clearInterval(timer);
        }
        scoreDisplay.innerText = Math.round(current);
        preliminaryScore.innerText = Math.round(current);
    }, 20);
    
    // Cambiar color según el score
    if (averageScore >= 70) {
        scoreCircle.classList.add('good');
    }
    
    console.log("📊 RESULTADOS PARCIALES:");
    console.log(`  - Score promedio: ${averageScore}%`);
    console.log(`  - Frase 1 (Básico): ${phraseScores[1]}%`);
    console.log(`  - Frase 2 (Intermedio): ${phraseScores[2]}%`);
    console.log(`  - Frase 3 (Avanzado): ${phraseScores[3]}%`);
}

// ====== SALTAR DIAGNÓSTICO ======
function skipToForm() {
    // Generar scores aleatorios para las frases faltantes
    for (let i = 1; i <= 3; i++) {
        if (phraseScores[i] === null) {
            const baseMin = 35;
            const baseMax = 65;
            const variance = (i - 1) * 5;
            const randomScore = Math.floor(Math.random() * (baseMax - baseMin + 1) + baseMin - variance);
            phraseScores[i] = Math.max(35, Math.min(100, randomScore));
        }
    }
    
    // Calcular promedio
    const averageScore = Math.round((phraseScores[1] + phraseScores[2] + phraseScores[3]) / 3);
    
    console.log("⏭️ Usuario saltó diagnóstico");
    console.log("📊 Scores generados automáticamente:", phraseScores);
    console.log(`  - Score promedio: ${averageScore}%`);
    
    // Ir directo al formulario
    showPartialResults(averageScore);
}

// ====== MANEJAR SUBMIT DEL FORMULARIO ======
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Recopilar datos del formulario
    userData.nombre = document.getElementById('nombre').value.trim();
    userData.email = document.getElementById('email').value.trim();
    userData.telefono = document.getElementById('telefono').value.trim();
    userData.empresa = document.getElementById('empresa').value.trim() || null;
    
    console.log("📝 DATOS DEL FORMULARIO:");
    console.log("  - Nombre:", userData.nombre);
    console.log("  - Email:", userData.email);
    console.log("  - Teléfono:", userData.telefono);
    console.log("  - Empresa:", userData.empresa || "No proporcionada");
    
    // Calcular tiempo total
    endTime = new Date().getTime();
    const totalTime = Math.round((endTime - startTime) / 1000); // en segundos
    
    console.log("⏱️ TIEMPO TOTAL DE INTERACCIÓN:", totalTime, "segundos");
    console.log("  - Inicio:", new Date(startTime).toISOString());
    console.log("  - Fin:", new Date(endTime).toISOString());
    
    // Mostrar resultados finales
    showFinalResults();
}

// ====== MOSTRAR RESULTADOS FINALES ======
function showFinalResults() {
    goToSlide(7);
    
    // Calcular promedio final
    const averageScore = Math.round((phraseScores[1] + phraseScores[2] + phraseScores[3]) / 3);
    
    // Personalizar saludo
    const greeting = document.getElementById('personalized-greeting');
    if (userData.nombre) {
        greeting.innerText = `Hola ${userData.nombre}, basado en tu evaluación...`;
    }
    
    // Actualizar score final
    const scoreDisplay = document.getElementById('score-display-final');
    const scoreCircle = document.getElementById('score-circle-final');
    
    // Animación de conteo
    let current = 0;
    const increment = averageScore / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= averageScore) {
            current = averageScore;
            clearInterval(timer);
            finalizeFinalMessage(averageScore);
        }
        scoreDisplay.innerText = Math.round(current);
    }, 20);
    
    // Cambiar color según el score
    if (averageScore >= 70) {
        scoreCircle.classList.add('good');
    }
    
    // Mostrar desglose de scores
    document.getElementById('score-basic').innerText = `${phraseScores[1]}%`;
    document.getElementById('score-intermediate').innerText = `${phraseScores[2]}%`;
    document.getElementById('score-advanced').innerText = `${phraseScores[3]}%`;
    
    // Console.log final detallado
    console.log("🎯 RESULTADOS FINALES:");
    console.log("📊 Scores individuales:");
    console.log(`  - Nivel Básico: ${phraseScores[1]}%`);
    console.log(`  - Nivel Intermedio: ${phraseScores[2]}%`);
    console.log(`  - Nivel Avanzado: ${phraseScores[3]}%`);
    console.log(`📈 Score promedio final: ${averageScore}%`);
    console.log("👤 Datos del usuario:", userData);
    console.log("⏱️ Tiempo total:", Math.round((endTime - startTime) / 1000), "segundos");
}

// ====== MENSAJE FINAL SEGÚN SCORE ======
function finalizeFinalMessage(score) {
    const resultMessage = document.getElementById('result-message-final');
    const resultTitle = document.getElementById('result-title-final');
    
    resultTitle.innerText = "Tu nivel de inglés";
    
    if (score < 50) {
        resultMessage.innerText = "Tu nivel de inglés necesita refuerzo urgente. Pierdes oportunidades de negocio.";
    } else if (score < 70) {
        resultMessage.innerText = "Nivel intermedio. Con Berlitz puedes llegar a cerrar negocios con confianza.";
    } else if (score < 90) {
        resultMessage.innerText = "Buen nivel, pero la perfección marca la diferencia en negociaciones millonarias.";
    } else {
        resultMessage.innerText = "¡Excelente! Berlitz te ayuda a mantener ese nivel y certificarte.";
    }
}

// ====== CLICK TAG (DV360/CM360) ======
function handleClickTag() {
    console.log("🔗 Click en CTA - Redirigiendo a:", clickTag);
    window.open(clickTag, '_blank');
}

// ====== DEBUG TOOLS ======
console.log("✅ Sistema de scoring configurado");
console.log("📝 Frases configuradas:", Object.keys(phrases).length);
