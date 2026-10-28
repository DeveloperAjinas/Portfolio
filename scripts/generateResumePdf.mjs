import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'a4',
});

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Helper functions
function drawHeader(doc) {
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 20);
  doc.text('Ajinas P', PAGE_WIDTH / 2, 60, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(50, 50, 50);
  doc.text('parachikottilajinas@gmail.com | +919074018646 | Kerala, India', PAGE_WIDTH / 2, 78, { align: 'center' });
}

function drawSectionHeading(doc, title, y) {
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text(title.toUpperCase(), MARGIN, y);
  return y + 16;
}

// ================= PAGE 1 =================
drawHeader(doc);

let y = 115;

// PROFILE
y = drawSectionHeading(doc, 'Profile', y);
doc.setFont('times', 'normal');
doc.setFontSize(9.75);
doc.setTextColor(40, 40, 40);
const profileText = 
  'Software Engineer with 3+ years of professional experience developing and maintaining web applications using C#, ASP.NET Core, ASP.NET Web API, Angular, and SQL Server. Experienced in RESTful API development, database-backed business functionality, third-party API integration, and full-stack application delivery. Contributes across the software development lifecycle, including requirements collaboration, implementation, debugging, testing, deployment, and production support.';
const profileLines = doc.splitTextToSize(profileText, CONTENT_WIDTH);
doc.text(profileLines, MARGIN, y, { lineHeightFactor: 1.45 });
y += profileLines.length * 14.5 + 18;

// EDUCATION
y = drawSectionHeading(doc, 'Education', y);
doc.setFont('times', 'bold');
doc.setFontSize(10);
doc.setTextColor(30, 30, 30);
doc.text('Bachelor of Technology (B.Tech), Computer Science and Engineering,', MARGIN, y);
doc.setFont('times', 'normal');
doc.setFontSize(9.5);
doc.text('Feb 2019 - Mar 2023', PAGE_WIDTH - MARGIN, y, { align: 'right' });
y += 14;

doc.text('MEA Engineering College, Perinthalmanna', MARGIN, y);
y += 13;
doc.text('Cumulative GPA: 7/10', MARGIN, y);
y += 13;
doc.text('APJ Abdul Kalam Technological University', MARGIN, y);
y += 24;

// WORK EXPERIENCE
y = drawSectionHeading(doc, 'Work Experience', y);

doc.setFont('times', 'bold');
doc.setFontSize(10.5);
doc.text('Benzy Infotech Pvt. Ltd.', MARGIN, y);
doc.setFont('times', 'normal');
doc.setFontSize(9.5);
doc.text('Ajman - United Arab Emirates', PAGE_WIDTH - MARGIN, y, { align: 'right' });
y += 14;

doc.setFont('times', 'italic');
doc.text('Software Engineer', MARGIN, y);
doc.setFont('times', 'normal');
doc.text('May 2023 - Present', PAGE_WIDTH - MARGIN, y, { align: 'right' });
y += 16;

const experienceBullets = [
  'Developed and maintained full-stack web applications using C#, ASP.NET Core, Angular, and SQL Server.',
  'Designed and implemented RESTful Web APIs to support application features and communication between frontend and backend components.',
  'Implemented backend business logic and data-access functionality using relational databases and Entity Framework Core.',
  'Built frontend features using Angular, TypeScript, HTML5, CSS3, and Bootstrap.',
  'Integrated external APIs and handled application data processing and error scenarios.',
  'Collaborated with cross-functional team members to clarify requirements, deliver features, debug issues, and support releases.',
  'Participated in testing, deployment, and production support, with attention to maintainability and application performance.'
];

doc.setFont('times', 'normal');
doc.setFontSize(9.5);
experienceBullets.forEach(bullet => {
  doc.circle(MARGIN + 5, y - 3, 1.5, 'F');
  const lines = doc.splitTextToSize(bullet, CONTENT_WIDTH - 16);
  doc.text(lines, MARGIN + 14, y, { lineHeightFactor: 1.35 });
  y += lines.length * 13 + 3;
});
y += 10;

// Project - Tickut
doc.setFont('times', 'bold');
doc.setFontSize(10);
doc.text('Project - Tickut', MARGIN, y);
y += 13;
doc.setFont('times', 'italic');
doc.text('Travel Platform', MARGIN, y);
y += 15;

const projectBullets = [
  'Contributed to create a travel platform focused on trip planning and booking-management functionality.',
  'Worked on application features as part of the development team.'
];

doc.setFont('times', 'normal');
doc.setFontSize(9.5);
projectBullets.forEach(bullet => {
  doc.circle(MARGIN + 5, y - 3, 1.5, 'F');
  const lines = doc.splitTextToSize(bullet, CONTENT_WIDTH - 16);
  doc.text(lines, MARGIN + 14, y, { lineHeightFactor: 1.35 });
  y += lines.length * 13 + 3;
});

// ================= PAGE 2 =================
doc.addPage('a4', 'portrait');
y = 60;

// TECHNICAL SKILLS
y = drawSectionHeading(doc, 'Technical skills', y);
doc.setDrawColor(80, 80, 80);
doc.setLineWidth(0.6);
doc.line(MARGIN, y - 4, PAGE_WIDTH - MARGIN, y - 4);
y += 12;

const skillsBullets = [
  { label: 'Programming', val: 'C#, Python, JavaScript, TypeScript, SQL' },
  { label: 'Frontend', val: 'Angular, HTML5, CSS3, Bootstrap' },
  { label: 'Backend & APIs', val: 'ASP.NET Core, ASP.NET Web API, .NET 8, .NET Framework, RESTful APIs, Entity Framework Core' },
  { label: 'Databases', val: 'Microsoft SQL Server, MySQL' },
];

doc.setFontSize(9.5);
skillsBullets.forEach(item => {
  doc.circle(MARGIN + 5, y - 3, 1.5, 'F');
  const fullText = `${item.label} : ${item.val}`;
  const lines = doc.splitTextToSize(fullText, CONTENT_WIDTH - 16);
  doc.text(lines, MARGIN + 14, y, { lineHeightFactor: 1.35 });
  y += lines.length * 13 + 4;
});
y += 14;

// CERTIFICATIONS
y = drawSectionHeading(doc, 'Certifications', y);
doc.line(MARGIN, y - 4, PAGE_WIDTH - MARGIN, y - 4);
y += 12;

const certBullets = [
  'Certified Engineer in Computer Science and Engineering with First Class.',
  'Certificate of Completion in ASP.NET Core and C# Fundamentals.',
  'Certificate of Completion in Microsoft Azure Fundamentals (AZ-900).',
  'Certificate of Completion in Angular Basics.'
];

certBullets.forEach(cert => {
  doc.circle(MARGIN + 5, y - 3, 1.5, 'F');
  const lines = doc.splitTextToSize(cert, CONTENT_WIDTH - 16);
  doc.text(lines, MARGIN + 14, y, { lineHeightFactor: 1.35 });
  y += lines.length * 13 + 4;
});
y += 16;

// LANGUAGES
y = drawSectionHeading(doc, 'Languages', y);
doc.line(MARGIN, y - 4, PAGE_WIDTH - MARGIN, y - 4);
y += 12;

const langBullets = [
  'English — Professional Working Proficiency',
  'Malayalam — Native Proficiency',
  'Hindi — Basic Proficiency'
];

langBullets.forEach(lang => {
  doc.circle(MARGIN + 5, y - 3, 1.5, 'F');
  const lines = doc.splitTextToSize(lang, CONTENT_WIDTH - 16);
  doc.text(lines, MARGIN + 14, y, { lineHeightFactor: 1.35 });
  y += lines.length * 13 + 4;
});

// Save to public directory
const outputPath = path.resolve('public', 'Ajinas_P_Resume.pdf');
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outputPath, pdfBuffer);
console.log('Resume PDF generated at:', outputPath, 'Bytes:', pdfBuffer.length);
