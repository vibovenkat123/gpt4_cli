#!/usr/bin/env node
import * as readline from "readline";
import prompts from "./examples";
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
const max_tokens = parseInt(
  process.env.GPT4_CLI_MAX_TOKENS || default_config.tokens.toString(),
);
const top_p = parseInt(
  process.env.GPT4_CLI_TOP_P || default_config.top_p.toString(),
);
const temperature = parseInt(
  process.env.GPT4_CLI_TEMP || default_config.temp.toString(),
);
const frequency_penalty = parseInt(
  process.env.GPT4_CLI_FREQ_PEN || default_config.freq_pen.toString(),
);
const presence_penalty = parseInt(
  process.env.GPT4_CLI_PRES_PEN || default_config.pres_pen.toString(),
);

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
  // start of with the default system message
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
      console.log(`User: ${input.content}`);
      try {
        // the request body
        const req = {
          model: "gpt-4",
          messages,
          // if the env vars are nan, default to the original values
          temperature: isNaN(temperature) ? default_config.temp : temperature,
          max_tokens: isNaN(max_tokens) ? default_config.tokens : max_tokens,
          top_p: isNaN(top_p) ? default_config.top_p : top_p,
          frequency_penalty: isNaN(frequency_penalty)
            ? default_config.freq_pen
            : frequency_penalty,
          presence_penalty: isNaN(presence_penalty)
            ? default_config.pres_pen
            : presence_penalty,
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
      // set the input to nothing
      input.content = "";
      // request the api
      // check if the message is not undefined
      // keep looping
      main();
    } else {
      // make the inputs multilined
      input.content += `${inp}\n`;
      main();
    }
  });
}
// run the program
main();
