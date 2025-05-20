function doGet(e) {
  const view = e.parameter.view;

  switch (view) {
    case "iep":
      return HtmlService.createHtmlOutputFromFile("IepDashboard");
    case "gmail":
      return HtmlService.createHtmlOutputFromFile("GmailDashboard");
    case "lcap":
      return HtmlService.createHtmlOutputFromFile("LcapDashboard");
    default:
      return HtmlService.createHtmlOutputFromFile("Home");
  }
}


function loadPrompt(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent().trim();
}


function analyzeUploadedPDFAndSave(fileId) {
  const file = DriveApp.getFileById(fileId);
  const rawText = extractTextFromPDF(file);
  const cleanedText = cleanExtractedText(rawText);
  const prompt = "Analyze this IEP for a special education student and describe specific weaknesses and legal risk areas. Look for inconsistencies among components of the document and highlight areas where the district may face legal exposure. Please format your response clearly, using section headings and bullet points where appropriate.";
  const fullPrompt = prompt + "\n\n" + cleanedText;

  const result = callGemini(fullPrompt);
  const html = formatLLMOutputAsHTML(result);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const folder = getIepFolder();

  //folder.createFile(`LLM_input_${file.getName()}.txt`, fullPrompt, MimeType.PLAIN_TEXT);
  //folder.createFile(`LLM_output_${file.getName()}_${timestamp}.txt`, result, MimeType.PLAIN_TEXT);
  folder.createFile(`LLM_output_${file.getName()}_${timestamp}.html`, html, MimeType.HTML);

  return result;
}

function analyzeSelectedLcap(fileId) {
  const file = DriveApp.getFileById(fileId);
  const rawText = extractTextFromPDF(file);
  const cleanedText = cleanExtractedText(rawText);
  const prompt = loadPrompt("LcapPrompt");  // 🔁 loads from file
  const fullPrompt = prompt + "\n\n" + cleanedText;

  const result = callGemini(fullPrompt);
  const html = formatLLMOutputAsHTML(result);

  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    css: styleMatch ? styleMatch[1] : "",
    html: bodyMatch ? bodyMatch[1] : "<p>No content parsed.</p>"
  };
}


function analyzeSelectedFile(fileId) {
  const file = DriveApp.getFileById(fileId);
  const rawText = extractTextFromPDF(file);
  const cleanedText = cleanExtractedText(rawText);
  const prompt = "Analyze this IEP for a special education student and describe specific weaknesses and legal risk areas. Look for inconsistencies among components of the document and highlight areas where the district may face legal exposure. Please format your response clearly, using section headings and bullet points where appropriate.";
  const fullPrompt = prompt + "\n\n" + cleanedText;
  const result = callGemini(fullPrompt);
  const html = formatLLMOutputAsHTML(result);

  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    css: styleMatch ? styleMatch[1] : "",
    html: bodyMatch ? bodyMatch[1] : "<p>No content parsed.</p>"
  };
}
