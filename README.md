# slack-converter-html
A small ts-node script to convert a slack channel JSON export into HTML.

## Usage
`yarn install` to install dependencies

`ts-node slackParser.ts` to run script

Don't forget to set the directory of the JSON files exported from slack.

Example:
```
  const dirPath = path.resolve(__dirname, "./data/general/");
```

## Example HTML Output
<img width="1440" alt="Screenshot 2023-09-04 at 1 40 45 pm" src="https://github.com/vankongv/slack-converter-html/assets/90138834/08c708cb-c0d8-41a5-ae22-2075f248e820">
