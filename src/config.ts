import { default_config } from "./default";
import { type Message } from "./main";
type Request = {
  model: string;
  messages: any[]; // Update with the appropriate type for messages
  stream: boolean;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
};

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
export default function gen_config(
  messages: Message[],
): { req: Request } {
  const req = {
    model: "gpt-4",
    messages,
    stream: true,
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
  return { req };
}
