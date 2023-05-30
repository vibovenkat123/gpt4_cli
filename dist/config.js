"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_1 = require("./default");
const max_tokens = parseInt(process.env.GPT4_CLI_MAX_TOKENS || default_1.default_config.tokens.toString());
const top_p = parseInt(process.env.GPT4_CLI_TOP_P || default_1.default_config.top_p.toString());
const temperature = parseInt(process.env.GPT4_CLI_TEMP || default_1.default_config.temp.toString());
const frequency_penalty = parseInt(process.env.GPT4_CLI_FREQ_PEN || default_1.default_config.freq_pen.toString());
const presence_penalty = parseInt(process.env.GPT4_CLI_PRES_PEN || default_1.default_config.pres_pen.toString());
function gen_config(messages) {
    const req = {
        model: "gpt-4",
        messages,
        stream: true,
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
    return { req };
}
exports.default = gen_config;
//# sourceMappingURL=config.js.map