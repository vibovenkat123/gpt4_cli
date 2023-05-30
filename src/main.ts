#!/usr/bin/env node
import * as readline from "readline";
import gen_config from "./config";
import prompts from "./examples";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { IncomingMessage } from "http";

// the storage for all the messages
export type Message = {
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
};
const messages: Message[] = [];
const conf = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(conf);

// set up readline for inputs
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input: Message = { role: "user", content: "" };
messages.push({
  "role": "system",
  "content": "You are a helpful assistant.",
});
async function main() {
  // get the input
  rl.question(`> `, async (inp) => {
    // exit the program if the user says "exit"
    inp = prompts.get(inp) || inp;
    if (inp.toLowerCase() === "exit") {
      rl.close();
      process.exit(0);
    } else if (
      // allow multiline inputs
      inp.toLowerCase() === "submit" || inp.toLowerCase() === "regenerate"
    ) {
      if (inp.toLowerCase() === "submit") {
        messages.push({ ...input });
      } else {
        // regenerate the prompt
        messages.pop();
        input = messages.at(-1)!;
      }
      console.log(`User: 
${input.content}
`);
      try {
        let gpt_res: string[] = [];
        // the request body
        const { req } = gen_config(messages);
        const res = await openai.createChatCompletion(req, {
          responseType: "stream",
        });
        const stream = res.data as unknown as IncomingMessage;
        process.stdout.write("GPT:\n");
        stream.on("data", (chunk: Buffer) => {
          const payloads = chunk.toString().split("\n\n");
          for (const payload of payloads) {
            if (payload.includes("[DONE]")) return;
            if (payload.startsWith("data:")) {
              const data = JSON.parse(payload.replace("data: ", ""));
              try {
                const chunk: undefined | string = data.choices[0].delta
                  ?.content;
                if (chunk) {
                  process.stdout.write(`${chunk}`);
                  gpt_res.push(chunk);
                }
              } catch (error) {
                console.log(`Error with JSON.parse and ${payload}.\n${error}`);
                process.exit(1);
              }
            }
          }
        });
        stream.on("end", () => {
          const finalResponse = gpt_res.join("");
          process.stdout.write("\n");
          messages.push({ role: "assistant", content: finalResponse });
          main();
        });
        stream.on("error", (err: Error) => {
          throw err;
        });
      } catch (e) {
        if (e.response.data) {
          console.table(e.response.data);
        } else {
          console.error(e);
        }
        process.exit(1);
      }
      // set the input to nothing
      input.content = "";
      // request the api
      // check if the message is not undefined
      // keep looping
    } else {
      // make the inputs multilined
      input.content += `${inp}\n`;
      main();
    }
  });
}
// run the program
main();
