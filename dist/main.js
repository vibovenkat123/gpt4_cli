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
const config_1 = __importDefault(require("./config"));
const examples_1 = __importDefault(require("./examples"));
const openai_1 = require("openai");
const messages = [];
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
            console.log(`User: 
${input.content}
`);
            try {
                let gpt_res = [];
                const { req } = (0, config_1.default)(messages);
                const res = await openai.createChatCompletion(req, {
                    responseType: "stream",
                });
                const stream = res.data;
                process.stdout.write("GPT:\n");
                stream.on("data", (chunk) => {
                    var _a;
                    const payloads = chunk.toString().split("\n\n");
                    for (const payload of payloads) {
                        if (payload.includes("[DONE]"))
                            return;
                        if (payload.startsWith("data:")) {
                            const data = JSON.parse(payload.replace("data: ", ""));
                            try {
                                const chunk = (_a = data.choices[0].delta) === null || _a === void 0 ? void 0 : _a.content;
                                if (chunk) {
                                    process.stdout.write(`${chunk}`);
                                    gpt_res.push(chunk);
                                }
                            }
                            catch (error) {
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
                stream.on("error", (err) => {
                    throw err;
                });
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
        }
        else {
            input.content += `${inp}\n`;
            main();
        }
    });
}
main();
//# sourceMappingURL=main.js.map