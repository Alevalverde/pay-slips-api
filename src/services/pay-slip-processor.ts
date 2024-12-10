import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

class PaySlipProcessor {
  async splitAndSavePDF(pdfPath: string, userNames: string[]) {
    // Read the PDF file
    const pdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Proceess the PDF
    userNames.forEach(async (userName, index) => {
      const singlePageDoc = await PDFDocument.create();
      const [page] = await singlePageDoc.copyPages(pdfDoc, [index]);
      singlePageDoc.addPage(page);

      const pdfBuffers = await singlePageDoc.save();

      // Create a new page of PDF for each user
      const filePath = path.join(__dirname, 'output', `${userName}.pdf`);
      await fs.writeFile(filePath, pdfBuffers);
    });
  }
}

export default PaySlipProcessor;
