import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generateAndDownloadFile = async (
  content: string,
  fileType: string,
  fileName: string
) => {
  try {
    if (fileType === 'application/pdf') {
      await generateAndDownloadPDF(content, fileName);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      await generateAndDownloadDOCX(content, fileName);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Error generating file:', error);
    throw new Error('Failed to generate file. Please try again.');
  }
};

const generateAndDownloadPDF = async (content: string, fileName: string) => {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage();
  const { width, height } = currentPage.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const fontSize = 12;
  const lineHeight = fontSize * 1.2;
  const margin = 50;
  
  const lines = content.split('\n');
  let y = height - margin;
  
  for (const line of lines) {
    if (y < margin) {
      currentPage = pdfDoc.addPage();
      y = height - margin;
    }
    
    currentPage.drawText(line, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    y -= lineHeight;
  }
  
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `${fileName}.pdf`);
};

const generateAndDownloadDOCX = async (content: string, fileName: string) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: content.split('\n').map(line => 
        new Paragraph({
          children: [new TextRun(line)],
        })
      ),
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileName}.docx`);
}; 