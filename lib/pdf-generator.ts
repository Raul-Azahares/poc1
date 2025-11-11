import jsPDF from 'jspdf'
import type { MedicalReport } from './medical-ai'
import type { Message } from './consultations'

// Extract structured information from conversation messages
function extractPatientData(messages: Message[]) {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
  
  return {
    // Question 0: What brings you in today?
    mainComplaint: userMessages[0] || 'Not provided',
    
    // Question 1: How long experiencing symptoms?
    symptomDuration: userMessages[1] || 'Not provided',
    
    // Question 2: Worsened, improved, or stayed the same?
    progression: userMessages[2] || 'Not provided',
    
    // Question 3: Describe discomfort
    discomfortDescription: userMessages[3] || 'Not provided',
    
    // Question 4: Other related symptoms?
    relatedSymptoms: userMessages[4] || 'None reported',
    
    // Question 5: Full name
    fullName: userMessages[5] || 'Not provided',
    
    // Question 6: Age
    age: userMessages[6] || 'Not provided',
    
    // Question 7: Biological sex
    sex: userMessages[7] || 'Not provided',
    
    // Question 8: City/Country
    location: userMessages[8] || 'Not provided',
    
    // Question 9: Weight and height
    weightHeight: userMessages[9] || 'Not provided',
    
    // Question 10: Chronic illnesses
    chronicIllnesses: userMessages[10] || 'None reported',
    
    // Question 11: Current medications
    medications: userMessages[11] || 'None reported',
    
    // Question 12: Previous surgeries
    surgeries: userMessages[12] || 'None reported',
    
    // Question 13: Allergies
    allergies: userMessages[13] || 'None reported',
    
    // Question 14: Smoking/alcohol
    tobaccoAlcohol: userMessages[14] || 'Not provided',
    
    // Question 15: Physical activity
    physicalActivity: userMessages[15] || 'Not provided',
    
    // Question 16: Sleep and stress
    sleepStress: userMessages[16] || 'Not provided',
    
    // Question 17: Diet
    diet: userMessages[17] || 'Not provided',
    
    // Question 18: Vital signs intro (skip)
    
    // Question 19: Temperature
    temperature: userMessages[18] || 'Not provided',
    
    // Question 20: Blood pressure
    bloodPressure: userMessages[19] || 'Not provided',
    
    // Question 21: Heart rate
    heartRate: userMessages[20] || 'Not provided',
    
    // Question 22: Medical documents
    documents: userMessages[21] || 'None reported',
    
    // Question 23: Authorization
    authorization: userMessages[22] || 'Not provided',
  };
}

// Calculate BMI from weight and height string
function calculateBMI(weightHeightStr: string): string {
  try {
    // Try to extract numbers from the string
    const numbers = weightHeightStr.match(/\d+\.?\d*/g);
    if (numbers && numbers.length >= 2) {
      const weight = parseFloat(numbers[0]);
      const height = parseFloat(numbers[1]);
      
      // Assume if height > 3, it's in cm, convert to meters
      const heightInMeters = height > 3 ? height / 100 : height;
      
      const bmi = weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
  } catch (e) {
    // If parsing fails, return not calculated
  }
  return 'Not calculated';
}

// New function that generates PDF from consultation messages following the template
export function generatePDFFromMessages(messages: Message[], consultationDate: Date) {
  const data = extractPatientData(messages);
  const bmi = calculateBMI(data.weightHeight);
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = 20;

  // Helper function to check if new page is needed
  const checkNewPage = (spaceNeeded: number = 20) => {
    if (yPosition + spaceNeeded > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Helper function to add a section title
  const addSectionTitle = (title: string) => {
    checkNewPage(15);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin, yPosition);
    yPosition += 8;
  };

  // Helper function to add a field
  const addField = (label: string, value: string) => {
    checkNewPage(12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const labelText = label + ': ';
    doc.text(labelText, margin, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(value, maxWidth - 55);
    doc.text(lines, margin + 55, yPosition);
    yPosition += Math.max(7, lines.length * 5.5);
  };

  // ===== TITLE =====
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  const title = doc.splitTextToSize('Medical History Template - Medical Pre-Consultation POC (AI)', maxWidth);
  doc.text(title, margin, yPosition);
  yPosition += title.length * 8 + 5;

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  const subtitle = doc.splitTextToSize('This template represents the record format that is automatically generated from the responses collected by the medical pre-consultation chatbot. Its purpose is to present the information in a structured manner so that it can be reviewed by a healthcare professional.', maxWidth);
  doc.text(subtitle, margin, yPosition);
  yPosition += subtitle.length * 4 + 10;

  // ===== 1. GENERAL PATIENT INFORMATION =====
  addSectionTitle('1. General Patient Information');
  addField('Full Name', data.fullName);
  addField('Age', `${data.age} years`);
  addField('Biological Sex', data.sex);
  addField('City / Country', data.location);
  addField('Weight & Height', data.weightHeight);
  addField('BMI', bmi);
  yPosition += 5;

  // ===== 2. REASON FOR CONSULTATION =====
  addSectionTitle('2. Reason for Consultation');
  addField('Main Complaint', data.mainComplaint);
  addField('Symptom Onset', data.symptomDuration);
  addField('Progression', data.progression);
  addField('Discomfort Description', data.discomfortDescription);
  addField('Related Symptoms', data.relatedSymptoms);
  yPosition += 5;

  // ===== 3. MEDICAL HISTORY =====
  addSectionTitle('3. Medical History');
  addField('Chronic Illnesses or Conditions', data.chronicIllnesses);
  addField('Current Medications', data.medications);
  addField('Previous Surgeries', data.surgeries);
  addField('Known Allergies', data.allergies);
  if (data.sex.toLowerCase().includes('female') || data.sex.toLowerCase().includes('woman') || data.sex.toLowerCase().includes('mujer')) {
    // If pregnancy info was collected, it would be in a specific message
    addField('Pregnancy', 'Not applicable or not specified');
  }
  yPosition += 5;

  // ===== 4. HABITS AND LIFESTYLE =====
  addSectionTitle('4. Habits and Lifestyle');
  addField('Tobacco or Alcohol Use', data.tobaccoAlcohol);
  addField('Physical Activity', data.physicalActivity);
  addField('Sleep and Stress', data.sleepStress);
  addField('Diet', data.diet);
  yPosition += 5;

  // ===== 5. VITAL SIGNS ===== (Force new page)
  doc.addPage();
  yPosition = 20;
  addSectionTitle('5. Vital Signs (if available)');
  addField('Body Temperature', data.temperature);
  addField('Blood Pressure', data.bloodPressure);
  addField('Heart Rate', data.heartRate);
  addField('Oxygen Saturation (SpO2)', 'Not provided');
  addField('Other Data', 'None');
  yPosition += 5;

  // ===== 6. ATTACHED DOCUMENTS AND TESTS =====
  addSectionTitle('6. Attached Documents and Tests');
  addField('Documents / Tests', data.documents);
  yPosition += 5;

  // ===== 7. CHATBOT (AI) AUTOMATED ANALYSIS =====
  checkNewPage(40);
  addSectionTitle('7. Chatbot (AI) Automated Analysis');
  addField('Key Symptoms Identified', data.mainComplaint);
  addField('Suggested Specialty Areas', 'General Medicine (to be evaluated by professional)');
  addField('Estimated Urgency Level', 'To be determined by healthcare professional');
  addField('Preliminary Recommendations', 'Complete medical evaluation recommended');
  yPosition += 5;

  // ===== 8. CONSENT =====
  checkNewPage(45);
  doc.setFillColor(240, 248, 255);
  const consentHeight = 40;
  doc.rect(margin - 5, yPosition - 3, maxWidth + 10, consentHeight, 'F');
  
  addSectionTitle('8. Consent');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  const consentText = doc.splitTextToSize('The patient confirms that the information provided is accurate and authorizes its use for medical pre-evaluation, research, and system improvement purposes. It is clarified that this record does not replace the assessment of a medical professional.', maxWidth - 10);
  doc.text(consentText, margin, yPosition);
  yPosition += consentText.length * 4 + 8;

  // Patient Signature line
  checkNewPage(15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Patient Signature or Digital Acceptance: ', margin, yPosition);
  
  // Draw signature line
  doc.setLineWidth(0.5);
  doc.setDrawColor(150, 150, 150);
  doc.line(margin + 100, yPosition + 1, margin + maxWidth - 20, yPosition + 1);
  yPosition += 10;

  addField('Patient Authorization', data.authorization);
  addField('Date', new Date(consultationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));

  // ===== FOOTER =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i} of ${pageCount} - Generated by Medical Pre-Consultation AI`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `medical-record-${data.fullName.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`;
  doc.save(fileName);
}

// Legacy function for backward compatibility
export function generatePDF(report: MedicalReport, patientName: string, consultationDate: Date) {
  // This function is kept for backward compatibility but redirects to the old simple format
  const doc = new jsPDF()
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - (margin * 2)
  let yPosition = 20

  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Medical Consultation Report', margin, yPosition)
  yPosition += 15

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('MediConsult AI - Intelligent Medical Consultation', margin, yPosition)
  yPosition += 15

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Patient Information', margin, yPosition)
  yPosition += 8

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Name: ${patientName}`, margin, yPosition)
  yPosition += 6
  doc.text(`Date: ${new Date(consultationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, yPosition)
  yPosition += 12

  const disclaimerText = 'This report is generated by an AI assistant and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.';
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(120, 53, 15)
  const disclaimerLines = doc.splitTextToSize(disclaimerText, maxWidth)
  doc.text(disclaimerLines, margin, yPosition)

  const fileName = `medical-report-${new Date().getTime()}.pdf`
  doc.save(fileName)
}

