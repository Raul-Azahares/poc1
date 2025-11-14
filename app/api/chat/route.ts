import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Structured questions in English
const structuredQuestionsEN = [
  // 1. Introduction and Context
  "Hello! I'm your medical pre-consultation assistant. I can help you record how you're feeling and prepare a summary that a healthcare professional can review later. To start, tell me a bit about your condition. What brings you in today?",
  
  // 2. Initial Symptom Assessment
  "Thank you for sharing that. How long have you been experiencing these symptoms or discomfort?",
  "Have they worsened, improved, or stayed the same since they started?",
  "Could you describe how the discomfort or pain feels? (For example, its intensity, frequency, or if it worsens with certain activities.)",
  "Do you have any other symptoms that you think might be related? (For example: fever, cough, pain, fatigue, etc.)",
  
  // 3. Information to Complete the Medical Record
  // 3.1. Patient Personal Information
  "Perfect. Based on what you've told me, I can create a pre-consultation medical record, so the doctor has a clear summary of your situation. I will ask you a series of questions to gather relevant information for completing your medical record. Could you tell me your full name?",
  "How old are you?",
  "What is your biological sex?",
  "Which city or country are you currently in?",
  "Could you tell me your approximate weight and height? (This will help me calculate your Body Mass Index, or BMI).",
  
  // 3.2. Medical History
  "Now, tell me a bit about your medical background. Do you have any diagnosed chronic illnesses or conditions?",
  "Are you currently taking any medications or undergoing any treatments? If so, could you tell me which ones and how often?",
  "Have you had any major surgeries in the past?",
  "Do you have any known allergies to medications, foods, or other substances?",
  // Pregnancy question will be asked dynamically based on sex
  
  // 3.3. Habits and Lifestyle
  "I'd like to know a bit about your lifestyle, as it can impact your health. Do you smoke or consume alcohol frequently?",
  "Do you engage in any regular physical activity?",
  "How have your sleep and stress levels been lately?",
  "How would you describe your overall diet?",
  
  // 3.4. Vital Signs and Recent Data
  "If you have any recent data, such as your temperature, blood pressure, or heart rate, could you share them with me? If you don't have them, that's okay—I can continue with the information you've already provided.",
  "Could you tell me your current temperature or the most recent one you recorded?",
  "Do you have your most recent blood pressure reading? If so, could you share the systolic and diastolic values?",
  "Could you tell me your current heart rate or the last one you measured?",
  
  // 3.5. Medical Documents or Tests
  "Do you have any recent tests, analyses, or medical reports that you'd like to mention or share? (For example, blood tests, X-rays, lab studies, etc.) If you wish, you can briefly tell me what it's about.",
  
  // 4. Closing and Final Consent
  "Excellent. With this information, I can create your pre-consultation medical record. Do you authorize the use of this information solely for medical evaluation and service improvement purposes?",
  "Perfect. Your information has been saved. Remember, I am a support assistant and do not replace the assessment of a medical professional. Thank you for your time! A specialist will review your record soon."
];

// Structured questions in Spanish
const structuredQuestionsES = [
  // 1. Introducción y Contexto
  "¡Hola! Soy tu asistente de pre-consulta médica. Puedo ayudarte a registrar cómo te sientes y preparar un resumen que un profesional de la salud podrá revisar después. Para comenzar, cuéntame un poco sobre tu condición. ¿Qué te trae por aquí hoy?",
  
  // 2. Evaluación Inicial de Síntomas
  "Gracias por compartir eso. ¿Cuánto tiempo llevas experimentando estos síntomas o malestares?",
  "¿Han empeorado, mejorado o se han mantenido igual desde que comenzaron?",
  "¿Podrías describir cómo se siente el malestar o dolor? (Por ejemplo, su intensidad, frecuencia, o si empeora con ciertas actividades.)",
  "¿Tienes algún otro síntoma que creas que podría estar relacionado? (Por ejemplo: fiebre, tos, dolor, fatiga, etc.)",
  
  // 3. Información para Completar el Expediente Médico
  // 3.1. Información Personal del Paciente
  "Perfecto. Basándome en lo que me has contado, puedo crear un expediente médico de pre-consulta para que el doctor tenga un resumen claro de tu situación. Te haré una serie de preguntas para recopilar información relevante para completar tu expediente médico. ¿Podrías decirme tu nombre completo?",
  "¿Cuántos años tienes?",
  "¿Cuál es tu sexo biológico?",
  "¿En qué ciudad o país te encuentras actualmente?",
  "¿Podrías decirme tu peso y altura aproximados? (Esto me ayudará a calcular tu Índice de Masa Corporal, o IMC).",
  
  // 3.2. Historial Médico
  "Ahora, cuéntame un poco sobre tu historial médico. ¿Tienes alguna enfermedad crónica o condición diagnosticada?",
  "¿Estás tomando algún medicamento actualmente o siguiendo algún tratamiento? Si es así, ¿podrías decirme cuáles y con qué frecuencia?",
  "¿Has tenido alguna cirugía importante en el pasado?",
  "¿Tienes alguna alergia conocida a medicamentos, alimentos u otras sustancias?",
  
  // 3.3. Hábitos y Estilo de Vida
  "Me gustaría conocer un poco sobre tu estilo de vida, ya que puede influir en tu salud. ¿Fumas o consumes alcohol con frecuencia?",
  "¿Realizas alguna actividad física de forma regular?",
  "¿Cómo han estado tu sueño y tus niveles de estrés últimamente?",
  "¿Cómo describirías tu alimentación en general?",
  
  // 3.4. Signos Vitales y Datos Recientes
  "Si tienes algunos datos recientes, como tu temperatura, presión arterial o frecuencia cardíaca, ¿podrías compartirlos conmigo? Si no los tienes, no hay problema, puedo continuar con la información que ya me has proporcionado.",
  "¿Podrías decirme tu temperatura actual o la más reciente que hayas registrado?",
  "¿Tienes tu lectura más reciente de presión arterial? Si es así, ¿podrías compartir los valores sistólico y diastólico?",
  "¿Podrías decirme tu frecuencia cardíaca actual o la última que hayas medido?",
  
  // 3.5. Documentos Médicos o Pruebas
  "¿Tienes algún examen, análisis o reporte médico reciente que quieras mencionar o compartir? (Por ejemplo: análisis de sangre, radiografías, estudios de laboratorio, etc.) Si deseas, puedes contarme brevemente de qué se trata.",
  
  // 4. Cierre y Consentimiento Final
  "Excelente. Con esta información, puedo crear tu expediente médico de pre-consulta. ¿Autorizas el uso de esta información únicamente para fines de evaluación médica y mejora del servicio?",
  "Perfecto. Tu información ha sido guardada. Recuerda que soy un asistente de apoyo y no reemplazo la valoración de un profesional médico. ¡Gracias por tu tiempo! Un especialista revisará tu expediente pronto."
];

// Detect language from user's message
async function detectLanguage(message: string, apiKey: string): Promise<'es' | 'en'> {
  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a language detector. Analyze the following text and respond with ONLY 'es' for Spanish or 'en' for English. Do not add any explanation."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 5,
    });
    
    const detected = completion.choices[0]?.message?.content?.trim().toLowerCase() || 'en';
    return detected.startsWith('es') ? 'es' : 'en';
  } catch (error) {
    // Fallback: improved heuristic detection with more Spanish words
    const spanishWords = [
      'hola', 'tengo', 'dolor', 'fiebre', 'síntoma', 'me', 'te', 'le', 'nos', 'les', 
      'estoy', 'estás', 'está', 'qué', 'cómo', 'dónde', 'cuándo', 'por qué', 'quién',
      'sí', 'si', 'bastante', 'mucho', 'poco', 'muy', 'más', 'menos', 'también',
      'nombre', 'años', 'edad', 'peso', 'altura', 'medicamento', 'alergia', 'cirugía',
      'enfermedad', 'condición', 'síntomas', 'malestar', 'experimentando', 'llevas',
      'podrías', 'podría', 'tienes', 'tiene', 'tengo', 'tiene', 'están', 'están',
      'empeorado', 'mejorado', 'mantenido', 'intensidad', 'frecuencia', 'actividades'
    ];
    const lowerMessage = message.toLowerCase().trim();
    
    // Check for common Spanish words and patterns
    const hasSpanish = spanishWords.some(word => lowerMessage.includes(word)) ||
                      lowerMessage.match(/\b(sí|si|bastante|mucho|poco|muy|más|menos)\b/i) ||
                      lowerMessage.match(/[áéíóúñü]/i); // Spanish accented characters
    
    return hasSpanish ? 'es' : 'en';
  }
}

// Get questions based on language
function getStructuredQuestions(language: 'es' | 'en') {
  return language === 'es' ? structuredQuestionsES : structuredQuestionsEN;
}

// Helper function for heuristic language detection
function detectLanguageHeuristic(text: string): 'es' | 'en' {
  const spanishWords = [
    'hola', 'tengo', 'dolor', 'fiebre', 'síntoma', 'me', 'te', 'le', 'nos', 'les', 
    'estoy', 'estás', 'está', 'qué', 'cómo', 'dónde', 'cuándo', 'por qué', 'quién',
    'sí', 'si', 'bastante', 'mucho', 'poco', 'muy', 'más', 'menos', 'también',
    'nombre', 'años', 'edad', 'peso', 'altura', 'medicamento', 'alergia', 'cirugía',
    'enfermedad', 'condición', 'síntomas', 'malestar', 'experimentando', 'llevas',
    'podrías', 'podría', 'tienes', 'tiene', 'tengo', 'tiene', 'están', 'están',
    'empeorado', 'empeora', 'empeorar', 'mejorado', 'mejora', 'mejorar', 'mantenido', 
    'intensidad', 'frecuencia', 'actividades', 'mal', 'bien', 'peor', 'mejor',
    'días', 'horas', 'semanas', 'meses', 'años', 'minutos', 'segundos',
    'intenso', 'intensa', 'leve', 'moderado', 'moderada', 'grave', 'severa', 'severo'
  ];
  const lowerMessage = text.toLowerCase().trim();
  
  // Check for Spanish words
  const hasSpanishWord = spanishWords.some(word => {
    // Check if word appears as a whole word (not just as part of another word)
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerMessage);
  });
  
  // Check for Spanish patterns
  const hasSpanishPattern = lowerMessage.match(/\b(sí|si|bastante|mucho|poco|muy|más|menos|mal|bien|peor|mejor)\b/i);
  
  // Check for Spanish accented characters
  const hasAccents = /[áéíóúñü]/i.test(lowerMessage);
  
  // Check for Spanish verb endings (ar, er, ir conjugations)
  const hasSpanishVerbEnding = /\b\w+(ar|er|ir|ando|iendo|ado|ido|amos|emos|imos|an|en|in)\b/i.test(lowerMessage);
  
  // Check for common Spanish question words at start
  const startsWithSpanishQuestion = /^(qué|cuál|cuáles|cómo|dónde|cuándo|por qué|quién|quiénes|cuánto|cuánta|cuántos|cuántas)/i.test(lowerMessage);
  
  const hasSpanish = hasSpanishWord || hasSpanishPattern || hasAccents || hasSpanishVerbEnding || startsWithSpanishQuestion;
  
  return hasSpanish ? 'es' : 'en';
}

export async function POST(request: NextRequest) {
  try {
    const { message, messageHistory } = await request.json();

    // Count how many user messages have been sent to determine which question to ask next
    const userMessagesCount = messageHistory.filter((m: any) => m.role === 'user').length;
    
    // Check if Groq API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    // Detect language from user messages - prioritize current message, adapt to language changes
    let detectedLanguage: 'es' | 'en' = 'en';
    
    // Get all user messages (current message + history)
    const allUserMessages = [
      ...messageHistory.filter((m: any) => m.role === 'user').map((m: any) => m.content),
      message
    ].filter(Boolean);
    
    // Priority 1: Check for clear time patterns first (most reliable indicator)
    const currentMsg = message || '';
    const englishTimePatterns = /\b\d+\s*(days?|hours?|weeks?|months?|years?|minutes?)\b/i;
    const spanishTimePatterns = /\b\d+\s*(días?|horas?|semanas?|meses?|años?|minutos?)\b/i;
    
    if (englishTimePatterns.test(currentMsg) && !spanishTimePatterns.test(currentMsg)) {
      detectedLanguage = 'en';
    } else if (spanishTimePatterns.test(currentMsg) && !englishTimePatterns.test(currentMsg)) {
      detectedLanguage = 'es';
    } else if (currentMsg.trim().length > 0) {
      // Check if message is ambiguous (just a name, number, or single word without language indicators)
      // First check if it has clear language indicators
      const hasLanguageIndicators = detectLanguageHeuristic(currentMsg) !== null;
      const isOnlyName = /^[a-záéíóúñü\s]+$/i.test(currentMsg.trim()) && 
                        currentMsg.trim().length <= 30 && 
                        !hasLanguageIndicators &&
                        !/\b(sí|si|hola|tengo|dolor|yes|no|hello|hi|have|pain|bad|good|fever|intenso|intense|mucho|much|poco|little|muy|very|más|more|menos|less|qué|what|cómo|how|dónde|where|cuándo|when|por qué|why|quién|who|estoy|am|estás|are|está|is|tienes|have|tiene|has|podrías|could|podría|would|mal|bien|well|días|days|horas|hours|semanas|weeks|meses|months|empeora|empeorar|mejora|mejorar)\b/i.test(currentMsg);
      
      // Get context language from previous messages (most recent assistant message)
      let contextLanguage: 'es' | 'en' | null = null;
      const assistantMessages = messageHistory.filter((m: any) => m.role === 'assistant');
      
      if (assistantMessages.length > 0) {
        // Use the MOST RECENT assistant message (not the first one)
        const lastAssistantMsg = assistantMessages[assistantMessages.length - 1].content.toLowerCase();
        // More robust Spanish detection - check for multiple Spanish keywords
        const spanishKeywords = [
          'hola', 'asistente', 'pre-consulta', 'qué te trae', 'cuánto tiempo',
          'cuántos años', 'entiendo', 'gracias por compartir', 'han empeorado',
          'podrías describir', 'experimentando estos síntomas', 'malestares',
          'mejorado o se han mantenido', 'describir cómo se siente', 'malestar o dolor',
          'intensidad, frecuencia', 'ciertas actividades', 'algún otro síntoma',
          'podría estar relacionado', 'fiebre, tos', 'dolor, fatiga', 'expediente médico',
          'pre-consulta', 'resumen claro', 'serie de preguntas', 'recopilar información',
          'completar tu expediente', 'nombre completo', 'sexo biológico', 'ciudad o país',
          'peso y altura', 'índice de masa corporal', 'imc', 'enfermedades crónicas',
          'tomando algún medicamento', 'cirugía importante', 'alergia conocida',
          'fumas o consumes', 'actividad física', 'sueño y tus niveles', 'alimentación en general',
          'datos recientes', 'temperatura', 'presión arterial', 'frecuencia cardíaca',
          'examen, análisis', 'autorizas el uso', 'únicamente para fines'
        ];
        const hasSpanishInAssistant = spanishKeywords.some(keyword => lastAssistantMsg.includes(keyword));
        // More robust English detection - check for multiple English keywords
        const englishKeywords = [
          'hello', 'assistant', 'what brings', 'how long', 'i see', 'thank you',
          'have they worsened', 'could you describe', 'based on what', 'i can create',
          'could you tell me', 'how old are you', 'what is your', 'medical record',
          'perfect', 'i will ask', 'series of questions', 'gather relevant',
          'completing your medical', 'full name', 'biological sex', 'city or country',
          'approximate weight', 'body mass index', 'chronic illnesses', 'currently taking',
          'major surgeries', 'known allergies', 'smoke or consume', 'regular physical',
          'sleep and stress', 'overall diet', 'recent data', 'temperature', 'blood pressure',
          'heart rate', 'recent tests', 'authorize the use', 'solely for medical'
        ];
        const hasEnglishInAssistant = englishKeywords.some(keyword => lastAssistantMsg.includes(keyword));
        
        if (hasSpanishInAssistant && !hasEnglishInAssistant) {
          contextLanguage = 'es';
        } else if (hasEnglishInAssistant && !hasSpanishInAssistant) {
          contextLanguage = 'en';
        }
      }
      
      // Priority 2: If message is a name, ALWAYS use context (don't even try to detect)
      if (isOnlyName && contextLanguage) {
        // Message is ambiguous (like a name), ALWAYS use context language
        detectedLanguage = contextLanguage;
      } else {
        // Priority 3: Detect language from CURRENT message (only if not a name)
        let detectedFromMessage: 'es' | 'en' | null = null;
        
        if (apiKey && apiKey !== 'PEGA_TU_KEY_AQUI') {
          try {
            detectedFromMessage = await detectLanguage(currentMsg, apiKey);
          } catch (error) {
            detectedFromMessage = detectLanguageHeuristic(currentMsg);
          }
        } else {
          detectedFromMessage = detectLanguageHeuristic(currentMsg);
        }
        
        // Use detected language if message has clear indicators
        if (detectedFromMessage) {
          detectedLanguage = detectedFromMessage;
        } else if (contextLanguage) {
          // Fallback to context if detection failed
          detectedLanguage = contextLanguage;
        } else {
          // Final fallback
          detectedLanguage = 'en';
        }
      }
      
      // Priority 3: Final fallback - check previous user messages if still ambiguous
      if (!contextLanguage && allUserMessages.length > 1) {
        const previousMessages = allUserMessages.slice(0, -1); // All except current
        const previousText = previousMessages.join(' ').toLowerCase();
        
        // Count language indicators in previous messages
        const spanishIndicators = previousText.match(/\b(sí|si|hola|tengo|dolor|bastante|mucho|poco|muy|más|menos|qué|cómo|dónde|cuándo|por qué|quién|estoy|estás|está|tienes|tiene|podrías|podría|mal|bien|días|horas|semanas|meses|intenso|fiebre)\b/i);
        const englishIndicators = previousText.match(/\b(yes|no|hello|hi|have|pain|hurt|much|little|very|more|less|what|how|where|when|why|who|am|are|is|you|can|could|days|hours|weeks|months|bad|good|fine|fever|intense)\b/i);
        
        // If previous messages are clearly in one language, use that for ambiguous responses
        if (spanishIndicators && spanishIndicators.length > (englishIndicators?.length || 0)) {
          detectedLanguage = 'es';
        } else if (englishIndicators && englishIndicators.length > (spanishIndicators?.length || 0)) {
          detectedLanguage = 'en';
        }
      }
    }
    
    // Get questions in detected language
    const structuredQuestions = getStructuredQuestions(detectedLanguage);
    
    // Final messages in both languages
    const finalMessages = {
      en: "I appreciate all the information you've shared. Based on our discussion, I have a comprehensive picture of your condition. You can continue providing additional details if you'd like, or you can generate your medical report using the button at the top of the page. This report will be valuable to share with your healthcare provider.",
      es: "Agradezco toda la información que has compartido. Con base en nuestra conversación, tengo un panorama completo de tu condición. Puedes continuar proporcionando detalles adicionales si lo deseas, o puedes generar tu reporte médico usando el botón en la parte superior de la página. Este reporte será valioso para compartir con tu profesional de la salud."
    };
    
    if (!apiKey || apiKey === 'PEGA_TU_KEY_AQUI') {
      // Fallback to rule-based system if no API key
      if (userMessagesCount < structuredQuestions.length) {
        let response = structuredQuestions[userMessagesCount];
        
        // Special handling for authorization question (index 23) - insert patient's name
        if (userMessagesCount === 23) {
          const userMessages = messageHistory.filter((m: any) => m.role === 'user');
          if (userMessages.length > 5) {
            const fullName = userMessages[5]?.content || "";
            const firstName = fullName.split(' ')[0] || fullName;
            if (firstName) {
              if (detectedLanguage === 'es') {
                response = response.replace("Excelente.", `Excelente, ${firstName}.`);
              } else {
                response = response.replace("Excellent.", `Excellent, ${firstName}.`);
              }
            }
          }
        }
        
        return NextResponse.json({ 
          response: response,
          mode: 'rule-based',
          language: detectedLanguage
        });
      } else {
        return NextResponse.json({ 
          response: finalMessages[detectedLanguage],
          mode: 'rule-based',
          language: detectedLanguage
        });
      }
    }

    // Use Groq AI with strict instructions to follow the script
    try {
      const groq = new Groq({
        apiKey: apiKey,
      });

      // Determine which question to ask
      let nextQuestion = "";
      if (userMessagesCount < structuredQuestions.length) {
        nextQuestion = structuredQuestions[userMessagesCount];
        
        // Special handling for authorization question (index 23) - insert patient's name
        if (userMessagesCount === 23) {
          // Extract the name from user message #5 (where we asked for full name)
          const userMessages = messageHistory.filter((m: any) => m.role === 'user');
          if (userMessages.length > 5) {
            const fullName = userMessages[5]?.content || "";
            // Extract first name (or use full name if it's short)
            const firstName = fullName.split(' ')[0] || fullName;
            if (firstName) {
              if (detectedLanguage === 'es') {
                nextQuestion = nextQuestion.replace("Excelente.", `Excelente, ${firstName}.`);
              } else {
                nextQuestion = nextQuestion.replace("Excellent.", `Excellent, ${firstName}.`);
              }
            }
          }
        }
      } else {
        nextQuestion = finalMessages[detectedLanguage];
      }

      // Create a strict system prompt that tells the AI to ask the exact question
      const languageInstruction = detectedLanguage === 'es' 
        ? 'IMPORTANTE: El paciente está escribiendo en ESPAÑOL. Debes responder SIEMPRE en ESPAÑOL. Todas tus respuestas deben estar en español.'
        : 'IMPORTANT: The patient is writing in ENGLISH. You must respond ALWAYS in ENGLISH. All your responses must be in English.';
      
      // Define appropriate acknowledgments based on language
      const acknowledgments = detectedLanguage === 'es' 
        ? ['Entiendo.', 'Gracias.', 'Perfecto.']
        : ['I see.', 'Thank you.', 'Perfect.'];
      
      const acknowledgmentExample = detectedLanguage === 'es' ? 'Entiendo.' : 'I see.';
      
      const strictPrompt = `You are a professional medical pre-consultation assistant. Your role is to follow a STRICT structured interview script.

${languageInstruction}

CRITICAL INSTRUCTIONS:
1. You MUST ask the following question EXACTLY as written, word for word.
2. Do NOT deviate from this question. Do NOT add extra commentary. Do NOT improvise.
3. RESPOND COMPLETELY IN ${detectedLanguage === 'es' ? 'SPANISH' : 'ENGLISH'} - EVERY SINGLE WORD MUST BE IN ${detectedLanguage === 'es' ? 'SPANISH' : 'ENGLISH'}.
4. NEVER mix languages. NEVER use Spanish words if responding in English, and NEVER use English words if responding in Spanish.
5. NEVER say "I'm not sure I understand" or "I don't understand" or similar phrases.
6. NEVER express confusion or uncertainty about the patient's response.
7. ALWAYS proceed to the next question, regardless of how brief or ambiguous the patient's response may be.
8. If the patient's response is short (like "si", "yes", "bastante", "mucho"), you may add a VERY brief acknowledgment (1-2 words) in ${detectedLanguage === 'es' ? 'SPANISH' : 'ENGLISH'} ONLY, then IMMEDIATELY ask the exact question.
9. Your ONLY job is to ask the next question in the script. Do not evaluate or comment on the patient's responses.

QUESTION TO ASK (COPY THIS EXACTLY):
"${nextQuestion}"

The patient has just responded: "${message}"

Your response format:
- Option 1: Ask the question directly: "${nextQuestion}"
- Option 2: Add a brief ${detectedLanguage === 'es' ? 'SPANISH' : 'ENGLISH'} acknowledgment (like "${acknowledgmentExample}") followed by the question: "${acknowledgmentExample} ${nextQuestion}"

REMEMBER: EVERY WORD must be in ${detectedLanguage === 'es' ? 'SPANISH' : 'ENGLISH'}. NO MIXING LANGUAGES.`;

      const messages: any[] = [
        {
          role: "system",
          content: strictPrompt
        },
        {
          role: "user",
          content: message
        }
      ];

      const completion = await groq.chat.completions.create({
        messages,
        model: "llama-3.1-8b-instant",
        temperature: 0.3, // Lower temperature for more consistent responses
        max_tokens: 200,
      });

      let responseContent = completion.choices[0]?.message?.content || nextQuestion;
      
      // Filter out "I'm not sure" or similar confusion messages
      const confusionPatterns = [
        /I'm not sure I understand/i,
        /I don't understand/i,
        /I'm not sure/i,
        /I'm confused/i,
        /No estoy seguro/i,
        /No entiendo/i,
        /No estoy segura/i,
        /I'm unclear/i,
        /No tengo claro/i
      ];
      
      // If response contains confusion, replace with the exact question
      if (confusionPatterns.some(pattern => pattern.test(responseContent))) {
        console.log('⚠️ Groq generated confusion message, replacing with exact question');
        responseContent = nextQuestion;
      }
      
      // Detect and fix language mixing
      const spanishAckPatterns = /\b(entiendo|gracias|perfecto|comprendo)\b/i;
      const englishAckPatterns = /\b(i see|thank you|perfect|i understand)\b/i;
      
      const hasSpanishAck = spanishAckPatterns.test(responseContent);
      const hasEnglishAck = englishAckPatterns.test(responseContent);
      
      // Check if question is in English or Spanish (check the question itself, not the response)
      const questionIsEnglish = /\b(How|What|When|Where|Why|Who|Are|Is|Do|Can|Could|Have|Has|Tell|Could you|Would you)\b/i.test(nextQuestion);
      const questionIsSpanish = /\b(¿|Cómo|Qué|Cuándo|Dónde|Por qué|Quién|Eres|Es|Tienes|Tiene|Podrías|Podría|Cuéntame|Dime)\b/i.test(nextQuestion) || 
                                /cuánto|cuánta|cuántos|cuántas/i.test(nextQuestion);
      
      // Detect language mixing: Spanish acknowledgment + English question OR English acknowledgment + Spanish question
      const isMixed = (hasSpanishAck && questionIsEnglish) || (hasEnglishAck && questionIsSpanish);
      
      if (isMixed) {
        console.log('⚠️ Language mixing detected, fixing...');
        if (detectedLanguage === 'es') {
          // Remove English acknowledgments, ensure Spanish
          responseContent = responseContent
            .replace(/\b(I see|Thank you|Perfect|I understand)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
          // If response doesn't start with Spanish acknowledgment and question is Spanish, add one
          if (!spanishAckPatterns.test(responseContent) && questionIsSpanish) {
            responseContent = `Entiendo. ${nextQuestion}`;
          } else if (!responseContent.includes(nextQuestion)) {
            responseContent = nextQuestion;
          }
        } else {
          // Remove Spanish acknowledgments, ensure English
          responseContent = responseContent
            .replace(/\b(Entiendo|Gracias|Perfecto|Comprendo)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
          // If response doesn't start with English acknowledgment and question is English, add one
          if (!englishAckPatterns.test(responseContent) && questionIsEnglish) {
            responseContent = `I see. ${nextQuestion}`;
          } else if (!responseContent.includes(nextQuestion)) {
            responseContent = nextQuestion;
          }
        }
        // Final safety: if question is not present, use it directly
        if (!responseContent.includes(nextQuestion)) {
          responseContent = nextQuestion;
        }
      }
      
      // Ensure response contains the question (safety check)
      // Extract just the question part if response is too long or doesn't contain it
      if (!responseContent.includes(nextQuestion.substring(0, 20))) {
        // If response doesn't contain the question, use the question directly
        responseContent = nextQuestion;
      }

      return NextResponse.json({ 
        response: responseContent,
        mode: 'groq-ai-structured',
        language: detectedLanguage
      });

    } catch (groqError) {
      console.error('Groq API Error:', groqError);
      
      // Fallback to rule-based on error
      if (userMessagesCount < structuredQuestions.length) {
        let response = structuredQuestions[userMessagesCount];
        
        // Special handling for authorization question (index 23) - insert patient's name
        if (userMessagesCount === 23) {
          const userMessages = messageHistory.filter((m: any) => m.role === 'user');
          if (userMessages.length > 5) {
            const fullName = userMessages[5]?.content || "";
            const firstName = fullName.split(' ')[0] || fullName;
            if (firstName) {
              if (detectedLanguage === 'es') {
                response = response.replace("Excelente.", `Excelente, ${firstName}.`);
              } else {
                response = response.replace("Excellent.", `Excellent, ${firstName}.`);
              }
            }
          }
        }
        
        return NextResponse.json({ 
          response: response,
          mode: 'rule-based-fallback',
          language: detectedLanguage
        });
      } else {
        return NextResponse.json({ 
          response: finalMessages[detectedLanguage],
          mode: 'rule-based-fallback',
          language: detectedLanguage
        });
      }
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

