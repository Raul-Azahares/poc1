import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const MEDICAL_SYSTEM_PROMPT = `You are a compassionate medical assistant conducting a patient intake interview. Your role is to:

1. Ask clear, specific questions about symptoms one at a time
2. Be empathetic and professional
3. Gather information about:
   - Current symptoms (detailed description)
   - Duration of symptoms
   - Severity level
   - Medical history, allergies, and current medications
4. After collecting all information, thank the patient and inform them you'll generate a report

Important:
- Ask ONE question at a time
- Keep responses concise and friendly
- Do not provide diagnoses
- Remind patients to seek professional medical care
- Ask follow-up questions if symptoms are unclear`;

const fallbackQuestions = [
  "Of course, I'm here to help. Could you please tell me what symptoms you're experiencing?",
  "How long have you been experiencing these symptoms?",
  "On a scale of 1-10, how would you rate the severity of your symptoms? (1 being mild, 10 being severe)",
  "Is there anything else you'd like to mention? (Medical history, allergies, current medications, etc.)"
];

export async function POST(request: NextRequest) {
  try {
    const { message, messageHistory } = await request.json();

    // Check if Groq API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (!apiKey || apiKey === 'PEGA_TU_KEY_AQUI') {
      // Fallback to rule-based system
      const userMessagesCount = messageHistory.filter((m: any) => m.role === 'user').length;
      
      if (userMessagesCount < fallbackQuestions.length) {
        return NextResponse.json({ 
          response: fallbackQuestions[userMessagesCount],
          mode: 'rule-based'
        });
      } else {
        return NextResponse.json({ 
          response: "Thank you for providing all the information. I've generated a comprehensive medical report based on our conversation. You can download it as a PDF for your records and to share with your healthcare provider.",
          mode: 'rule-based'
        });
      }
    }

    // Use Groq AI
    try {
      const groq = new Groq({
        apiKey: apiKey,
      });

      const messages: any[] = [
        {
          role: "system",
          content: MEDICAL_SYSTEM_PROMPT
        },
        ...messageHistory.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: "user",
          content: message
        }
      ];

      const completion = await groq.chat.completions.create({
        messages,
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 300,
      });

      const responseContent = completion.choices[0]?.message?.content || 
        "I apologize, but I'm having trouble responding. Could you please try again?";

      return NextResponse.json({ 
        response: responseContent,
        mode: 'groq-ai'
      });

    } catch (groqError) {
      console.error('Groq API Error:', groqError);
      
      // Fallback to rule-based on error
      const userMessagesCount = messageHistory.filter((m: any) => m.role === 'user').length;
      
      if (userMessagesCount < fallbackQuestions.length) {
        return NextResponse.json({ 
          response: fallbackQuestions[userMessagesCount],
          mode: 'rule-based-fallback'
        });
      } else {
        return NextResponse.json({ 
          response: "Thank you for providing all the information. I've generated a comprehensive medical report based on our conversation. You can download it as a PDF for your records and to share with your healthcare provider.",
          mode: 'rule-based-fallback'
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

