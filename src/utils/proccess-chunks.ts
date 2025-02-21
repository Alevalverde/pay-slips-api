/* eslint-disable no-await-in-loop */
import { googleDriveService } from '@/services';

export async function processChunks(chunks: any, folderName: string, folderId: string) {
  const uploadResults: any = [];

  // Procesar cada chunk con un pequeño retraso entre ellos
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // Subir los archivos del chunk en paralelo
    const chunkResults = await Promise.all(
      chunk.map(async (payslip: any) => {
        const pdfName = `${folderName} - ${payslip.name}`;
        const { urlPdf, fileId } = await googleDriveService.uploadFileToGoogleDrive(payslip.buffer, pdfName, folderId);
        return { ...payslip, urlPdf, fileId, pdfName };
      })
    );

    // Agregar los resultados del chunk al array final
    uploadResults.push(...chunkResults);

    // Agregar un pequeño retraso entre chunks (excepto en el último)
    if (i < chunks.length - 1) {
      await delay(1000); // Retraso de 1 segundo
    }
  }

  return uploadResults;
}

export function chunkArray(array: any, size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
