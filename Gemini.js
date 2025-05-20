function getGeminiApiKey() {
  return PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
}

function getGeminiApiUrl() {
  const base = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent";
  return `${base}?key=${getGeminiApiKey()}`;
}

function callGemini(prompt) {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(getGeminiApiUrl(), options);
  const body = response.getContentText();

  Logger.log("Gemini response: " + body);
  if (!body) return "Empty response from Gemini.";

  try {
    const json = JSON.parse(body);
    return json.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
  } catch (err) {
    Logger.log("Gemini parse error: " + err);
    return "Invalid JSON response.";
  }
}

