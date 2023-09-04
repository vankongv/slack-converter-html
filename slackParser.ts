import * as fs from "fs";
import * as path from "path";

// Define the interface for a message
interface Message {
  text: string;
  ts: string;
  user_profile?: {
    real_name: string;
  };
}

// Function to read and parse the JSON file
const readAndParseJSONFile = (filePath: string): Message[] => {
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
};

// Function to convert Unix timestamp to AEST date-time
const convertTimestamp = (timestamp: string): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString("en-AU", { timeZone: "Australia/Sydney" });
};

// Function to write to a file
const writeToFile = (filename: string, content: string): void => {
  fs.writeFileSync(filename, content, "utf8");
};

let globalHtmlContent =
  "<html><head><title>Combined Slack Messages</title></head><body>";
const combineOutput = true; // Set this to true or false as needed

const convertToHtml = (filePath: string) => {
  let outputContent = "";
  const messages = readAndParseJSONFile(filePath);

  messages.forEach((message) => {
    const text = message.text;
    const realName = message.user_profile?.real_name;
    const timestamp = convertTimestamp(message.ts);

    if (text && realName && timestamp) {
      outputContent += `<p><strong>Timestamp:</strong> ${timestamp}</p>`;
      outputContent += `<p><strong>Message:</strong> ${text}</p>`;
      outputContent += `<p><strong>Real Name:</strong> ${realName}</p>`;
      outputContent += "<hr>";
    }
  });

  if (!combineOutput) {
    const outputFileName = path.basename(filePath, ".json") + ".html";
    const outputDirPath = path.resolve(__dirname, "./converted/filenames");
    // Make sure the directory exists
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }
    const outputFilePath = path.join(outputDirPath, outputFileName);
    outputContent =
      "<html><head><title>Slack Messages</title></head><body>" +
      outputContent +
      "</body></html>";
    writeToFile(outputFilePath, outputContent);
  } else {
    globalHtmlContent += outputContent;
  }
};

const main = () => {
  const dirPath = path.resolve(__dirname, "./data/general/");
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      const filePath = path.join(dirPath, file);
      convertToHtml(filePath);
    }
  });

  if (combineOutput) {
    globalHtmlContent += "</body></html>";
    const outputDirPath = path.resolve(__dirname, "./converted/filenames");
    const outputFilePath = path.join(outputDirPath, "combined.html");
    writeToFile(outputFilePath, globalHtmlContent);
  }
};

main();
