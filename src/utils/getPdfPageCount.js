import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc =
  '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

export async function getPdfPageCount(file) {
  return new Promise((resolve, reject) => {
    try {
      if (file.arrayBuffer) {
        file
          .arrayBuffer()
          .then((buffer) => {
            processPdfBuffer(buffer, resolve);
          })
          .catch((error) => {
            console.error('Error reading file arrayBuffer:', error);
            resolve(100);
          });
      } else if (file.buffer) {
        processPdfBuffer(file.buffer, resolve);
      } else {
        const reader = new FileReader();

        reader.onload = (event) => {
          processPdfBuffer(event.target.result, resolve);
        };

        reader.onerror = (error) => {
          console.error('Error reading file:', error);
          resolve(100);
        };

        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('Error in getPdfPageCount:', error);
      resolve(100);
    }
  });
}

async function processPdfBuffer(buffer, resolve) {
  try {
    if (typeof buffer === 'string') {
      const binaryString = window.atob(buffer);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      buffer = bytes.buffer;
    }

    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;

    const pageCount = pdf.numPages;

    console.log(`PDF loaded with ${pageCount} pages`);
    resolve(pageCount);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    resolve(100);
  }
}

export async function getPdfMetadata(file) {
  return new Promise((resolve) => {
    try {
      if (file.arrayBuffer) {
        file
          .arrayBuffer()
          .then((buffer) => {
            processPdfMetadata(buffer, resolve);
          })
          .catch((error) => {
            console.error(
              'Error reading file arrayBuffer for metadata:',
              error
            );
            resolve({});
          });
      } else if (file.buffer) {
        processPdfMetadata(file.buffer, resolve);
      } else {
        const reader = new FileReader();

        reader.onload = (event) => {
          processPdfMetadata(event.target.result, resolve);
        };

        reader.onerror = (error) => {
          console.error('Error reading file for metadata:', error);
          resolve({});
        };

        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('Error in getPdfMetadata:', error);
      resolve({});
    }
  });
}

async function processPdfMetadata(buffer, resolve) {
  try {
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;

    const metadata = await pdf.getMetadata();

    console.log('PDF metadata extracted:', metadata);
    resolve(metadata.info || {});
  } catch (error) {
    console.error('Error extracting PDF metadata:', error);
    resolve({});
  }
}
