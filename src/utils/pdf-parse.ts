/* eslint-disable no-await-in-loop */
import pdfParse from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';
import { PdfDetails } from '@/models/interface';
import { formatName } from '@/utils';

export async function parsePDFDetailsWithBuffers(pdfBuffer: Buffer) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const totalPages = pdfDoc.getPages().length;

  const pdfDetailsArray: PdfDetails[] = [];

  for (let i = 0; i < totalPages; i++) {
    // Extraer cada página como un PDF separado
    const singlePagePdf = await PDFDocument.create();
    const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i]);
    singlePagePdf.addPage(copiedPage);

    // Guardar el PDF de la página como Uint8Array y convertir a Buffer
    const singlePageUint8Array = await singlePagePdf.save();
    const singlePageBuffer = Buffer.from(singlePageUint8Array);

    // Leer el texto de la página usando pdf-parse
    const pageText = await pdfParse(singlePageBuffer).then((data) => data.text);

    // Buscar el CUIL en el texto
    const cuilMatch = pageText.match(/CUIL:\s?(\d{2}-\d{8}-\d)/);
    const cuil = cuilMatch && cuilMatch[1] ? cuilMatch[1] : 'No encontrado';

    // Dividir el texto en líneas y obtener "name" (línea 6)
    const lines = pageText.split('\n');
    const name = lines[6] ? formatName(lines[6]) : 'No encontrado';

    // Agregar los datos al array incluyendo el buffer de la página
    pdfDetailsArray.push({ page: i + 1, name, cuil, buffer: singlePageBuffer });
  }

  return pdfDetailsArray;
}
