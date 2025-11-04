import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const MEDICAL_SYSTEM_PROMPT = `You are Dr. MediConsult AI, a professional medical intake assistant. Your ONLY role is to conduct thorough patient interviews.

STRICT GUIDELINES:
1. You MUST ONLY discuss medical topics (symptoms, health history, medications, allergies)
2. If the user asks about non-medical topics, politely redirect: "I'm here to help with your medical consultation. Could you tell me more about your symptoms?"
3. Ask ONE clear, specific medical question at a time
4. Be empathetic, professional, and thorough

INFORMATION TO GATHER:
- Primary symptoms (detailed description: location, type, intensity)
- Duration and frequency of symptoms
- Severity level (1-10 scale)
- Aggravating or relieving factors
- Associated symptoms
- Medical history (previous conditions, surgeries)
- Current medications and dosages
- Known allergies
- Family medical history (if relevant)
- Lifestyle factors (if relevant to symptoms)

IMPORTANT RULES:
- NEVER provide medical diagnoses
- NEVER recommend specific treatments or medications
- ALWAYS ask follow-up questions to clarify vague symptoms
- Keep responses concise (2-3 sentences max)
- Use medical terminology but explain it simply
- Remain strictly professional
- If user provides enough information, acknowledge it and let them know they can generate a report when ready

CONVERSATION STYLE:
- Professional but warm
- Ask probing follow-up questions
- Show empathy for patient's condition
- Stay focused on medical information gathering`;

const fallbackQuestions = [
  "Good day. I'm Dr. MediConsult AI. I'll be conducting your medical intake today. Could you please describe the primary symptoms you're experiencing? Include details like location, type of pain or discomfort, and when you first noticed them.",
  "Thank you for that information. How long have you been experiencing these symptoms? Also, have you noticed if they're constant or do they come and go?",
  "I see. On a scale of 1-10, with 10 being the most severe, how would you rate the intensity of your symptoms? Also, is there anything that makes them better or worse?",
  "Are you currently taking any medications? Do you have any known allergies? Please also mention any relevant medical history, such as previous conditions or surgeries.",
  "Is there any family history of similar conditions that you're aware of? Also, have you noticed any other symptoms accompanying your main complaint?",
  "Thank you for providing this information. Is there anything else about your condition that you think I should know? Any recent changes in your lifestyle, diet, or stress levels?"
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
          response: "I appreciate all the information you've shared. Based on our discussion, I have a comprehensive picture of your condition. You can continue providing additional details if you'd like, or you can generate your medical report using the button at the top of the page. This report will be valuable to share with your healthcare provider.",
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
          response: "I appreciate all the information you've shared. Based on our discussion, I have a comprehensive picture of your condition. You can continue providing additional details if you'd like, or you can generate your medical report using the button at the top of the page. This report will be valuable to share with your healthcare provider.",
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

