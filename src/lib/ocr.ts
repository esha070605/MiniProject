export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  let text = "";

  if (fileType === "pdf") {
    // Dynamically import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      let pageText = textContent.items.map((item: any) => item.str).join(" ").trim();
      
      // If the PDF page has very little text (like a scanned image), run OCR
      if (pageText.length < 10) {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const Tesseract = (await import('tesseract.js')).default;
          const result = await Tesseract.recognize(canvas, 'eng');
          pageText = result.data.text.trim();
        }
      }
      
      text += pageText + "\n";
    }
  } else if (["jpg", "jpeg", "png"].includes(fileType || "")) {
    const Tesseract = (await import('tesseract.js')).default;
    const result = await Tesseract.recognize(file, 'eng', {
      logger: m => console.log(m)
    });
    text = result.data.text;
  } else if (fileType === "txt") {
    text = await file.text();
  } else {
    throw new Error("Unsupported file type.");
  }

  return text;
};
