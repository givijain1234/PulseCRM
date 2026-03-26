import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { Receipt } from '../types';

export const generateReceiptPDF = (receipt: Receipt) => {
  const doc = new jsPDF();
  const dateStr = receipt.createdAt ? format(receipt.createdAt.toDate(), 'MMMM dd, yyyy') : 'Pending';
  const invoiceId = receipt.id.slice(0, 8).toUpperCase();

  // Colors
  const primaryColor = [6, 182, 212]; // Cyan-500
  const secondaryColor = [15, 23, 42]; // Slate-950
  const textColor = [51, 65, 85]; // Slate-700

  // Header Background
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(0, 0, 210, 60, 'F');

  // PulseCRM Logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Pulse', 20, 30);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('CRM', 42, 30);

  // Invoice Label
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(30);
  doc.text('INVOICE', 190, 30, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text(`#${invoiceId}`, 190, 40, { align: 'right' });

  // From / To
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text('INVOICE FROM', 20, 80);
  doc.text('INVOICE TO', 190, 80, { align: 'right' });

  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PulseCRM Solutions', 20, 88);
  doc.text(receipt.clientName, 190, 88, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('123 Innovation Drive\nTech Valley, CA 94043\nUnited States', 20, 95);
  doc.text(`${receipt.clientName.split(' ')[0]} Corp.\nBusiness District\nGlobal City`, 190, 95, { align: 'right' });

  // Info Bar
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.rect(20, 120, 170, 20, 'F');
  doc.setDrawColor(241, 245, 249); // Slate-100
  doc.rect(20, 120, 170, 20, 'S');

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('DATE ISSUED', 30, 128);
  doc.text('PAYMENT METHOD', 85, 128);
  doc.text('STATUS', 180, 128, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(dateStr, 30, 135);
  doc.text('Credit Card (**** 4242)', 85, 135);
  doc.setTextColor(16, 185, 129); // Emerald-600
  doc.text('PAID IN FULL', 180, 135, { align: 'right' });

  // Table Header
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.line(20, 160, 190, 160);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('DESCRIPTION', 20, 155);
  doc.text('QTY', 140, 155, { align: 'right' });
  doc.text('UNIT PRICE', 165, 155, { align: 'right' });
  doc.text('TOTAL', 190, 155, { align: 'right' });

  // Table Row
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(receipt.description, 20, 170);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('Professional CRM Services & Support', 20, 176);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('1', 140, 170, { align: 'right' });
  doc.text(`$${receipt.amount.toLocaleString()}`, 165, 170, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`$${receipt.amount.toLocaleString()}`, 190, 170, { align: 'right' });

  // Totals
  const totalY = 200;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('Subtotal', 150, totalY);
  doc.text('Tax (0%)', 150, totalY + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(`$${receipt.amount.toLocaleString()}`, 190, totalY, { align: 'right' });
  doc.text('$0.00', 190, totalY + 8, { align: 'right' });

  doc.line(150, totalY + 12, 190, totalY + 12);
  doc.setFontSize(12);
  doc.text('Total Amount', 150, totalY + 20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(16);
  doc.text(`$${receipt.amount.toLocaleString()}`, 190, totalY + 20, { align: 'right' });

  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Thank you for your business!', 105, 260, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('If you have any questions about this invoice, please contact support@pulsecrm.com', 105, 266, { align: 'center' });

  // Save
  doc.save(`Receipt-${invoiceId}.pdf`);
};
