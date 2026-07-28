import { jsPDF } from 'jspdf';
import { ICPConfig } from '../types';

/**
 * Generates and downloads a highly polished professional PDF document
 * for a specific ICP configuration of Energiza Soluções.
 */
export function generateIcpPDF(config: ICPConfig) {
  // Initialize standard A4 PDF (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 18;
  let currentY = 18;

  // Helpers to draw lines & headers
  const setPrimaryColor = () => {
    // Custom colors depending on the segment
    if (config.slug === 'cobranca') doc.setFillColor(217, 119, 6); // Amber
    else if (config.slug === 'instituicoes-financeiras') doc.setFillColor(5, 150, 105); // Emerald
    else if (config.slug === 'varejo') doc.setFillColor(79, 70, 229); // Indigo
    else if (config.slug === 'educacao') doc.setFillColor(13, 148, 136); // Teal
    else if (config.slug === 'logistica') doc.setFillColor(37, 99, 235); // Blue
    else if (config.slug === 'advogados') doc.setFillColor(109, 40, 217); // Violet-Purple
    else doc.setFillColor(30, 41, 59); // Slate default
  };

  const getPrimaryHexColor = () => {
    if (config.slug === 'cobranca') return '#D97706';
    if (config.slug === 'instituicoes-financeiras') return '#059669';
    if (config.slug === 'varejo') return '#4F46E5';
    if (config.slug === 'educacao') return '#0D9888';
    if (config.slug === 'logistica') return '#2563EB';
    if (config.slug === 'advogados') return '#6D28D9';
    return '#1E293B';
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Gray
    doc.line(marginX, pageHeight - 15, pageWidth - marginX, pageHeight - 15);
    doc.text('Energiza Soluções Inteligentes - Todos os direitos reservados.', marginX, pageHeight - 10);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - marginX - 20, pageHeight - 10);
  };

  // --- PAGE 1: COVER & BLUEPRINT DIAGRAM ---

  // Top Dark Header Banner
  doc.setFillColor(15, 23, 42); // slate-900 background
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Mini Accent Stripe in Primary Color
  setPrimaryColor();
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Company Name in Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('ENERGIZA', marginX, 18);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('SOLUÇÕES DE INTELIGÊNCIA CADASTRAL', marginX, 23);

  // Document Info Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('BLUEPRINT TÉCNICO & PROPOSTA COMERCIAL', pageWidth - marginX - 85, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(191, 219, 254);
  doc.text(`CANAL ATIVO: /${config.slug}`, pageWidth - marginX - 85, 23);
  doc.text(`DATA DE EMISSÃO: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - marginX - 85, 27);

  // Back to normal content
  currentY = 58;

  // Title of the Segment
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 41, 59);
  doc.text(`Segmento: ${config.name}`, marginX, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const headlineLines = doc.splitTextToSize(config.headline, pageWidth - (marginX * 2));
  doc.text(headlineLines, marginX, currentY);
  currentY += (headlineLines.length * 4.5) + 4;

  // Subheadline Intro
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const subHeadlineLines = doc.splitTextToSize(config.subheadline, pageWidth - (marginX * 2));
  doc.text(subHeadlineLines, marginX, currentY);
  currentY += (subHeadlineLines.length * 4.5) + 8;

  // Diagram Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('DIAGRAMA DE INTEGRAÇÃO & FLUXO DE ENRIQUECIMENTO', marginX, currentY);
  currentY += 4;

  // Underline
  setPrimaryColor();
  doc.rect(marginX, currentY, 40, 0.8, 'F');
  currentY += 8;

  // --- DRAW FLOW DIAGRAM ---
  // We draw 4 horizontal boxes (A4 Portrait, so each box is roughly 38mm wide)
  // connected by subtle lines.
  const numSteps = config.steps.length;
  const boxWidth = 38;
  const boxHeight = 28;
  const boxSpacing = 6;
  const startX = marginX;

  // Render the diagram boxes
  for (let i = 0; i < numSteps; i++) {
    const stepObj = config.steps[i];
    const bX = startX + i * (boxWidth + boxSpacing);
    const bY = currentY;

    // Outer Card Shadow / Border
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(0.4);
    doc.rect(bX, bY, boxWidth, boxHeight, 'FD');

    // Accent Header of Card in Segment Color
    setPrimaryColor();
    doc.rect(bX, bY, boxWidth, 2, 'F');

    // Circle for Step Number
    doc.setFillColor(241, 245, 249);
    doc.circle(bX + 6, bY + 8, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    setPrimaryColor();
    doc.setTextColor(doc.getFillColor().split(',')[0] === '0' ? 0 : 70); // default fallback color
    // Write step number
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(stepObj.step, bX + 4.5, bY + 10.5);

    // Box Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const boxTitleLines = doc.splitTextToSize(stepObj.title, boxWidth - 4);
    doc.text(boxTitleLines, bX + 2, bY + 15);

    // Box Subtext (small)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    const boxDescLines = doc.splitTextToSize(stepObj.description, boxWidth - 4);
    doc.text(boxDescLines, bX + 2, bY + boxHeight - 7);

    // Connector Arrow (if not last)
    if (i < numSteps - 1) {
      const arrowX = bX + boxWidth;
      const arrowY = bY + boxHeight / 2;
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.6);
      doc.line(arrowX, arrowY, arrowX + boxSpacing, arrowY);
      
      // Draw a tiny arrow head
      doc.line(arrowX + boxSpacing, arrowY, arrowX + boxSpacing - 1.5, arrowY - 1);
      doc.line(arrowX + boxSpacing, arrowY, arrowX + boxSpacing - 1.5, arrowY + 1);
    }
  }

  currentY += boxHeight + 12;

  // Problem & Solution Breakdown Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('PILARES DE ENGENHARIA DE DADOS E SOLUÇÕES', marginX, currentY);
  currentY += 4;

  // Underline
  setPrimaryColor();
  doc.rect(marginX, currentY, 40, 0.8, 'F');
  currentY += 8;

  // Render 3 Solutions in a nice list layout with styled bullet marks
  for (let s = 0; s < config.solutions.length; s++) {
    const sol = config.solutions[s];
    
    // Check Y boundary before drawing
    if (currentY > 265) {
      drawFooter(1, 2);
      doc.addPage();
      currentY = 20;
    }

    // Custom background box for solution
    doc.setFillColor(248, 250, 252);
    doc.rect(marginX, currentY, pageWidth - (marginX * 2), 16, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.rect(marginX, currentY, pageWidth - (marginX * 2), 16, 'D');

    // Bullet Stripe
    setPrimaryColor();
    doc.rect(marginX, currentY, 1.5, 16, 'F');

    // Solution Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(sol.title, marginX + 4, currentY + 5);

    // Solution Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const solDescLines = doc.splitTextToSize(sol.description, pageWidth - (marginX * 2) - 10);
    doc.text(solDescLines, marginX + 4, currentY + 10);

    currentY += 19;
  }

  // Draw Page 1 footer
  drawFooter(1, 2);

  // --- PAGE 2: PRICING, FAQ & REGULATORY COMPLIANCE ---
  doc.addPage();
  currentY = 20;

  // Header Banner Page 2
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Mini Accent Stripe in Primary Color Page 2
  setPrimaryColor();
  doc.rect(0, 24, pageWidth, 1.5, 'F');

  // Text inside header page 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('ESTRUTURA DE PREÇOS, REQUISITOS E COMPLIANCE', marginX, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Proposta Comercial Personalizada para ${config.sector}`, marginX, 17);

  currentY = 36;

  // Pricing & Licensing Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('PROPOSTA COMERCIAL & COMPOSIÇÃO DA LICENÇA', marginX, currentY);
  currentY += 4;
  setPrimaryColor();
  doc.rect(marginX, currentY, 40, 0.8, 'F');
  currentY += 8;

  // Main Pricing Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  const cardHeight = 65;
  doc.rect(marginX, currentY, pageWidth - (marginX * 2), cardHeight, 'FD');

  // Accent band in pricing card
  setPrimaryColor();
  doc.rect(marginX, currentY, pageWidth - (marginX * 2), 3, 'F');

  // Plan Title & Price Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(config.pricing.title, marginX + 6, currentY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(config.pricing.subtitle, marginX + 6, currentY + 14);

  // Price Value
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  setPrimaryColor();
  // Get text value for primary color to match doc text color
  const priceColor = getPrimaryHexColor();
  // We can write using standard RGB setting
  if (config.slug === 'cobranca') doc.setTextColor(217, 119, 6);
  else if (config.slug === 'instituicoes-financeiras') doc.setTextColor(5, 150, 105);
  else if (config.slug === 'varejo') doc.setTextColor(79, 70, 229);
  else if (config.slug === 'educacao') doc.setTextColor(13, 148, 136);
  else if (config.slug === 'logistica') doc.setTextColor(37, 99, 235);
  else if (config.slug === 'advogados') doc.setTextColor(109, 40, 217);
  else doc.setTextColor(30, 41, 59);

  doc.text(config.pricing.price, marginX + 6, currentY + 25);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(config.pricing.period, marginX + 6, currentY + 29);

  // Divider Line inside pricing card
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX + 6, currentY + 33, pageWidth - marginX - 6, currentY + 33);

  // Features inside the Card (Two Column list to save space)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  
  const numFeatures = config.pricing.features.length;
  const col1X = marginX + 8;
  const col2X = marginX + 90;
  
  for (let f = 0; f < numFeatures; f++) {
    const feat = config.pricing.features[f];
    const isCol2 = f >= Math.ceil(numFeatures / 2);
    const fx = isCol2 ? col2X : col1X;
    const rowOffset = isCol2 ? (f - Math.ceil(numFeatures / 2)) : f;
    const fy = currentY + 39 + (rowOffset * 5.5);

    // Checkmark symbol
    doc.setFont('zapfdingbats', 'normal');
    setPrimaryColor();
    // In zapfdingbats 4 is a checkmark in some encodings, but let's stick to standard helvetica bullet to avoid encoding issues across systems
    doc.setFont('helvetica', 'bold');
    doc.text('✓', fx, fy);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const featLines = doc.splitTextToSize(feat, isCol2 ? 80 : 75);
    doc.text(featLines, fx + 4, fy);
  }

  currentY += cardHeight + 10;

  // FAQ Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('DÚVIDAS FREQUENTES & OBJEÇÕES DE ENGENHARIA', marginX, currentY);
  currentY += 4;
  setPrimaryColor();
  doc.rect(marginX, currentY, 40, 0.8, 'F');
  currentY += 8;

  // Let's render the main objection statement
  doc.setFillColor(254, 243, 199); // light amber-100
  doc.setDrawColor(251, 191, 36); // amber-400 border
  doc.setLineWidth(0.3);
  
  const objectionTitleLines = doc.splitTextToSize(config.objectionTitle, pageWidth - (marginX * 2) - 8);
  const objectionTextLines = doc.splitTextToSize(config.objectionText, pageWidth - (marginX * 2) - 8);
  const objectionBoxHeight = (objectionTitleLines.length * 4) + (objectionTextLines.length * 3.5) + 8;

  doc.rect(marginX, currentY, pageWidth - (marginX * 2), objectionBoxHeight, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 4); // deep amber-900
  doc.text(objectionTitleLines, marginX + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 4);
  doc.text(objectionTextLines, marginX + 4, currentY + 5 + (objectionTitleLines.length * 4));

  currentY += objectionBoxHeight + 8;

  // Regulatory Compliance Statement
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(config.complianceTitle, marginX, currentY);
  currentY += 4;
  setPrimaryColor();
  doc.rect(marginX, currentY, 40, 0.8, 'F');
  currentY += 8;

  // Compliance Text box with elegant gray scale
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.rect(marginX, currentY, pageWidth - (marginX * 2), 22, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const complianceLines = doc.splitTextToSize(config.complianceText, pageWidth - (marginX * 2) - 8);
  doc.text(complianceLines, marginX + 4, currentY + 6);

  // Footer / Sign Off Block at the bottom
  currentY += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Para dúvidas adicionais ou customizações via API, contate nosso time técnico.', marginX, currentY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('E-mail: energizasolucoescwb@gmail.com  |  Telefone: (41) 99716-2138', marginX, currentY + 4.5);

  drawFooter(2, 2);

  // Save the PDF
  const filename = `energiza_blueprint_${config.slug}.pdf`;
  doc.save(filename);
}
