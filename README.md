# GPT4_CLI
A way to use chatgpt (but for gpt4) in the terminal

## Installation
```bash
npm install -g gpt4_cli
```

## USAGE
1. Set your `OPENAI_API_KEY` environment variable
```console
user@host:~$ export OPENAI_API_KEY=sk-*****
```

2. (Optional) set `GPT4_CLI_MAX_TOKENS`, `GPT4_CLI_TOP_P`, `GPT4_CLI_TEMP`, `GPT4_CLI_FREQ_PEN`, `GPT4_CLI_PRES_PEN` to their corresponding values
See [The API Reference](https://platform.openai.com/docs/api-reference/chat) for more details

3. Run the program with `gpt4_cli` and enter your prompt
```console
user@host:~$ gpt4_cli
>
```

4. At the end, type `submit` to send it to GPT
```console
user@host:~ gpt4_cli
> Hello there
> Generate a simple haiku
> submit
User: Hello there
Generate a simple haiku

GPT: 
# Answer here
```

## More usage:

* type `regenerate` to regenerate
* type `exit` to exit
* you can access examples by typing them into the prompt:

1. `example0000`: `"Explain quantum computing in simple terms"`
2. `example0001`: `"Got any creative ideas for a 10 year old’s birthday?"`
3. `example0002`: `"How do I make an HTTP request in Javascript?"`
