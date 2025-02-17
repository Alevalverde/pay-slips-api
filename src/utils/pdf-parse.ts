import pdfParse from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';
import { formatName } from '@/utils';

/**
 * Parses a PDF buffer and extracts details from each page.
 *
 * This function processes a PDF buffer, extracts each page as a separate
 * PDF, and retrieves specific details from the text content of each page.
 * The extracted details include the page number, name, CUIL, and the
 * page content as a buffer.
 *
 * @param pdfBuffer - The buffer of the PDF file to be processed.
 * @returns A promise that resolves to an array of objects, each containing
 * the page number, extracted name, CUIL, and the buffer of the single-page PDF.
 */
export async function parsePDFDetailsWithBuffers(pdfBuffer: Buffer, isPaySlip: boolean) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const totalPages = pdfDoc.getPages().length;
  // Create an array of promises for processing each page
  const pdfDetailsArray = await Promise.all(
    Array.from({ length: totalPages }, async (_, i) => {
      // Extract each page as a separate PDF
      const singlePagePdf = await PDFDocument.create();
      const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i]);
      singlePagePdf.addPage(copiedPage);

      // Save the single-page PDF as Uint8Array and convert it to Buffer
      const singlePageUint8Array = await singlePagePdf.save();
      const singlePageBuffer = Buffer.from(singlePageUint8Array);

      // Extract the text from the page using pdf-parse
      const pageText = await pdfParse(singlePageBuffer).then((data) => data.text);

      // Find the CUIL in the text
      const cuilMatch = pageText.match(/CUIL:\s?(\d{2}-\d{8}-\d)/);
      const cuil = cuilMatch && cuilMatch[1] ? cuilMatch[1] : null;

      const lines = pageText.split('\n');
      // Split the text into lines and extract "name" from line 6 to Pay slip PDF and line 9 to Salary PDF
      const name = isPaySlip ? (lines[6] ? formatName(lines[6]) : null) : lines[9] ? formatName(lines[9]) : null;
      // Return the processed details for this page
      return { page: i + 1, name, cuil, buffer: singlePageBuffer };
    })
  );

  return pdfDetailsArray;
}
