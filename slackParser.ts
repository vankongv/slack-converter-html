import * as fs from "fs";
import * as path from "path";

interface Message {
  text: string;
  ts: string;
  user_profile?: {
    real_name: string;
  };
}

const readAndParseJSONFile = (filePath: string): Message[] => {
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
};

const convertTimestamp = (timestamp: string): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString("en-AU", { timeZone: "Australia/Sydney" });
};

const writeToFile = (filename: string, content: string): void => {
  fs.writeFileSync(filename, content, "utf8");
};

let combinedHtmlContent =
  "<html><head><title>Combined Slack Messages</title></head><body>";

const convertToHtml = (filePath: string) => {
  const outputFileName = path.basename(filePath, ".json") + ".html";
  const outputDirPath = path.resolve(__dirname, "./converted/filenames");
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }
  const outputFilePath = path.join(outputDirPath, outputFileName);

  let individualHtmlContent =
    "<html><head><title>Slack Messages</title></head><body>";

  const messages = readAndParseJSONFile(filePath);

  messages.forEach((message) => {
    const text = message.text;
    const realName = message.user_profile?.real_name;
    const timestamp = convertTimestamp(message.ts);

    if (text && realName && timestamp) {
      const messageHtml =
        `<p><strong>Timestamp:</strong> ${timestamp}</p>` +
        `<p><strong>Message:</strong> ${text}</p>` +
        `<p><strong>Real Name:</strong> ${realName}</p><hr>`;

      individualHtmlContent += messageHtml;
      combinedHtmlContent += messageHtml;
    }
  });

  individualHtmlContent += "</body></html>";
  writeToFile(outputFilePath, individualHtmlContent);
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

  combinedHtmlContent += "</body></html>";
  const combinedOutputFilePath = path.join(
    path.resolve(__dirname, "./converted/filenames"),
    "combined.html"
  );
  writeToFile(combinedOutputFilePath, combinedHtmlContent);
};

main();
