import Together from 'together-ai';

const together = new Together({
	apiKey: '939d5863eb54f9fd11aaccc9f0e03831b15116f4b3f9402cdd4594aa18d768bc',
});

const response = await together.chat.completions.create({
	messages: [
		{
			role: 'user',
			content: 'What are some fun things to do in New York?',
		},
	],
	model: 'mistralai/Mistral-7B-Instruct-v0.1',
});

console.log(response.choices[0].message?.content);
