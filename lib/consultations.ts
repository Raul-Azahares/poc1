// Consultation management
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Consultation {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
  completed: boolean;
  userEmail: string;
}

export function getConsultations(userEmail: string): Consultation[] {
  if (typeof window !== 'undefined') {
    const consultationsStr = localStorage.getItem('consultations');
    const allConsultations: Consultation[] = consultationsStr ? JSON.parse(consultationsStr) : [];
    return allConsultations
      .filter(c => c.userEmail === userEmail)
      .map(c => ({
        ...c,
        createdAt: new Date(c.createdAt),
        messages: c.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
      }));
  }
  return [];
}

export function saveConsultation(consultation: Consultation) {
  if (typeof window !== 'undefined') {
    const consultationsStr = localStorage.getItem('consultations');
    const consultations: Consultation[] = consultationsStr ? JSON.parse(consultationsStr) : [];
    
    const index = consultations.findIndex(c => c.id === consultation.id);
    if (index >= 0) {
      consultations[index] = consultation;
    } else {
      consultations.push(consultation);
    }
    
    localStorage.setItem('consultations', JSON.stringify(consultations));
  }
}

export function createConsultation(userEmail: string): Consultation {
  const consultation: Consultation = {
    id: Date.now().toString(),
    title: 'Consultation',
    createdAt: new Date(),
    messages: [],
    completed: false,
    userEmail
  };
  
  saveConsultation(consultation);
  return consultation;
}

