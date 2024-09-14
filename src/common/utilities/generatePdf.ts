import jsPDF from 'jspdf';

export const generatePdf = (title: string, htmlText: string) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = pdf.internal.pageSize.height || 297;
  const marginTop = 40;
  const marginLeft = 10;
  const marginRight = 10;
  const lineHeight = 10;
  const contentWidth = 210 - marginLeft - marginRight;

  pdf.setFontSize(20);
  pdf.text(title, marginLeft, marginTop);

  pdf.setFontSize(12);

  const plainText = htmlText.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');

  let yOffset = marginTop + lineHeight * 2;
  const splitText = pdf.splitTextToSize(plainText, contentWidth);

  splitText.forEach((line: string) => {
    if (yOffset + lineHeight > pageHeight - marginTop) {
      pdf.addPage();
      yOffset = marginTop;
    }
    pdf.text(line, marginLeft, yOffset);
    yOffset += lineHeight;
  });

  pdf.save(`${title}.pdf`);
};
