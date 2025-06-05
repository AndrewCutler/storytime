import Together from 'together-ai';

// use environment variable, TOGETHER_API_KEY
const together = new Together({
	apiKey: '939d5863eb54f9fd11aaccc9f0e03831b15116f4b3f9402cdd4594aa18d768bc',
});

const response = await together.chat.completions.create({
	messages: [
		{
			role: 'user',
			content: 'write one page of a children\'s book about a bear cub',
		},
	],
	model: 'mistralai/Mistral-7B-Instruct-v0.1',
});

console.log(response.choices[0].message?.content);
