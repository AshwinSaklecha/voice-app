const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const client = new textToSpeech.TextToSpeechClient();

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateSpeech(text, outputFileName) {
  const request = {
    input: { text: text },
    // Choose a voice (e.g., English, male or female, etc.)
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  const filePath = path.join(__dirname, 'output', outputFileName);
  fs.writeFileSync(filePath, response.audioContent, 'binary');
  return filePath;
}

module.exports = { generateSpeech };
