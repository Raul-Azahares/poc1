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

// Detect language from user's first message
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
    // Fallback: simple heuristic detection
    const spanishWords = ['hola', 'tengo', 'dolor', 'fiebre', 'síntoma', 'me', 'te', 'le', 'nos', 'les', 'estoy', 'estás', 'está'];
    const lowerMessage = message.toLowerCase();
    const hasSpanish = spanishWords.some(word => lowerMessage.includes(word));
    return hasSpanish ? 'es' : 'en';
  }
}

// Get questions based on language
function getStructuredQuestions(language: 'es' | 'en') {
  return language === 'es' ? structuredQuestionsES : structuredQuestionsEN;
}

export async function POST(request: NextRequest) {
  try {
    const { message, messageHistory } = await request.json();

    // Count how many user messages have been sent to determine which question to ask next
    const userMessagesCount = messageHistory.filter((m: any) => m.role === 'user').length;
    
    // Check if Groq API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    // Detect language from user messages
    let detectedLanguage: 'es' | 'en' = 'en';
    
    // Get the first user message (current message or from history)
    const firstUserMessage = message || messageHistory.find((m: any) => m.role === 'user')?.content || '';
    
    if (firstUserMessage) {
      // Detect language from first user message
      if (apiKey && apiKey !== 'PEGA_TU_KEY_AQUI') {
        try {
          detectedLanguage = await detectLanguage(firstUserMessage, apiKey);
        } catch (error) {
          // Fallback to heuristic if API fails
          const spanishWords = ['hola', 'tengo', 'dolor', 'fiebre', 'síntoma', 'me', 'te', 'le', 'nos', 'les', 'estoy', 'estás', 'está', 'qué', 'cómo', 'dónde', 'tengo', 'siento', 'dolor'];
          const lowerMessage = firstUserMessage.toLowerCase();
          detectedLanguage = spanishWords.some(word => lowerMessage.includes(word)) ? 'es' : 'en';
        }
      } else {
        // Fallback heuristic detection
        const spanishWords = ['hola', 'tengo', 'dolor', 'fiebre', 'síntoma', 'me', 'te', 'le', 'nos', 'les', 'estoy', 'estás', 'está', 'qué', 'cómo', 'dónde', 'tengo', 'siento', 'dolor'];
        const lowerMessage = firstUserMessage.toLowerCase();
        detectedLanguage = spanishWords.some(word => lowerMessage.includes(word)) ? 'es' : 'en';
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
      const strictPrompt = `You are a professional medical pre-consultation assistant. Your role is to follow a STRICT structured interview script.

CRITICAL INSTRUCTION: You MUST ask the following question EXACTLY as written, word for word. Do NOT deviate from this question. Do NOT add extra commentary. Do NOT improvise.

QUESTION TO ASK (COPY THIS EXACTLY):
"${nextQuestion}"

The patient has just responded: "${message}"

Your response should be ONLY the question above, exactly as written. You may add a very brief (1-2 words) empathetic acknowledgment before the question if appropriate, but then ask the exact question.`;

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

      const responseContent = completion.choices[0]?.message?.content || nextQuestion;

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

