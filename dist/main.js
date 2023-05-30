#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const examples_1 = __importDefault(require("./examples"));
const default_1 = require("./default");
const openai_1 = require("openai");
const messages = [];
const max_tokens = parseInt(process.env.GPT4_CLI_MAX_TOKENS || default_1.default_config.tokens.toString());
const top_p = parseInt(process.env.GPT4_CLI_TOP_P || default_1.default_config.top_p.toString());
const temperature = parseInt(process.env.GPT4_CLI_TEMP || default_1.default_config.temp.toString());
const frequency_penalty = parseInt(process.env.GPT4_CLI_FREQ_PEN || default_1.default_config.freq_pen.toString());
const presence_penalty = parseInt(process.env.GPT4_CLI_PRES_PEN || default_1.default_config.pres_pen.toString());
const conf = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(conf);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let input = { role: "user", content: "" };
messages.push({
    "role": "system",
    "content": "You are a helpful assistant.",
});
async function main() {
    rl.question(`> `, async (inp) => {
        inp = examples_1.default.get(inp) || inp;
        if (inp.toLowerCase() === "exit") {
            rl.close();
            process.exit(0);
        }
        else if (inp.toLowerCase() === "submit" || inp.toLowerCase() === "regenerate") {
            if (inp.toLowerCase() === "submit") {
                messages.push(Object.assign({}, input));
            }
            else {
                messages.pop();
                input = messages.at(-1);
            }
            console.log(`User: ${input.content}`);
            try {
                const req = {
                    model: "gpt-4",
                    messages,
                    temperature: isNaN(temperature) ? default_1.default_config.temp : temperature,
                    max_tokens: isNaN(max_tokens) ? default_1.default_config.tokens : max_tokens,
                    top_p: isNaN(top_p) ? default_1.default_config.top_p : top_p,
                    frequency_penalty: isNaN(frequency_penalty)
                        ? default_1.default_config.freq_pen
                        : frequency_penalty,
                    presence_penalty: isNaN(presence_penalty)
                        ? default_1.default_config.pres_pen
                        : presence_penalty,
                };
                const res = await openai.createChatCompletion(req);
                const msg = res.data.choices[0].message;
                if (msg) {
                    const content = msg.content;
                    console.log(`GPT: ${content}`);
                    messages.push({ role: "assistant", content: content });
                }
            }
            catch (e) {
                if (e.response.data) {
                    console.table(e.response.data);
                }
                else {
                    console.error(e);
                }
                process.exit(1);
            }
            input.content = "";
            main();
        }
        else {
            input.content += `${inp}\n`;
            main();
        }
    });
}
main();
//# sourceMappingURL=main.js.map