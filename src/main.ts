#!/usr/bin/env node
import * as readline from "readline";
import { default_config } from "./default";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

// the storage for all the messages
type Message = {
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
};
const messages: Message[] = [];

// set up openai
// the config
const max_tokens = parseInt(process.env.GPT4_CLI_MAX_TOKENS || default_config.tokens.toString());
const top_p = parseInt(process.env.GPT4_CLI_TOP_P || default_config.top_p.toString());
const temperature = parseInt(process.env.GPT4_CLI_TEMP || default_config.temp.toString());
const frequency_penalty = parseInt(process.env.GPT4_CLI_FREQ_PEN || default_config.freq_pen.toString());
const presence_penalty = parseInt(process.env.GPT4_CLI_PRES_PEN || default_config.pres_pen.toString());

const conf = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(conf);

// set up readline for inputs
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  let input: Message = { role: "user", content: "" };
  // start of with the default system message
  messages.push({
    "role": "system",
    "content": "You are a helpful assistant.",
  });

  // get the input
  rl.question(`> `, async (inp) => {
    input = { role: "user", content: inp };
    messages.push(input);

    // exit the program if the user says "exit"
    if (inp.toLowerCase() === "exit") {
      rl.close();
      process.exit(0);
    } else {
      console.log(`User: ${inp}`);
      try {
        // the request body
        const req = {
          model: "gpt-4",
          messages,
          // if the env vars are nan, default to the original values
          temperature: isNaN(temperature) ? default_config.temp : temperature,
          max_tokens: isNaN(max_tokens) ? default_config.tokens : max_tokens,
          top_p: isNaN(top_p) ? default_config.top_p : top_p,
          frequency_penalty: isNaN(frequency_penalty) ? default_config.freq_pen : frequency_penalty,
          presence_penalty: isNaN(presence_penalty) ? default_config.pres_pen : presence_penalty,
        };
        const res = await openai.createChatCompletion(req);
        const msg = res.data.choices[0].message;
        if (msg) {
          // update the message storage
          const content = msg.content;
          console.log(`GPT: ${content}`);
          messages.push({ role: "assistant", content: content });
        }
      } catch (e) {
        if (e.response.data) {
          console.table(e.response.data);
        } else {
          console.error(e);
        }
        process.exit(1);
      }
      // request the api
      // check if the message is not undefined
      // keep looping
      main();
    }
  });
}
// run the program
main();
