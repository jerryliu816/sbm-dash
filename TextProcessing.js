function extractTextFromPDF(file) {
  const blob = file.getBlob();
  const resource = {
    title: file.getName().replace(".pdf", "") + " (OCR)"
  };

  const docFile = Drive.Files.insert(resource, blob, {
    ocr: true,
    ocrLanguage: 'en'
  });

  const doc = DocumentApp.openById(docFile.id);
  const text = doc.getBody().getText();
  DriveApp.getFileById(docFile.id).setTrashed(true);
  return text;
}

function cleanExtractedText(text) {
  return text
    .replace(/^[A-Z\s]{5,}\n?/gm, '')
    .replace(/Page\s*\d+\s*of\s*\d+/gi, '')
    .replace(/_{2,}/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

