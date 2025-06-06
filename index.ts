import Together from 'together-ai';
import * as http from 'http';

const PORT = 8000;
const ALLOWED_ORIGIN = 'http://localhost:5173' as const;

async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
	const {
		headers: { origin, referer },
	} = req;

	if ([origin, referer].some((x) => x?.startsWith(ALLOWED_ORIGIN))) {
		// const story = await getStory();
		const story = 'testing';
		res.writeHead(200, {
			'content-type': 'text/plain',
			'access-control-allow-origin': origin || referer,
		});
		res.write(story);
	} else {
		res.writeHead(204, { 'content-type': 'text/plain' });
		res.write('fuck off');
	}

	res.end();
	console.log('done');
}

const server = http.createServer(handler);

server.listen(PORT);

async function getStory(): Promise<string | undefined> {
	// use environment variable, TOGETHER_API_KEY
	const together = new Together({
		apiKey: '939d5863eb54f9fd11aaccc9f0e03831b15116f4b3f9402cdd4594aa18d768bc',
	});

	const response = await together.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: "write one page of a children's book about a bear cub",
			},
		],
		model: 'mistralai/Mistral-7B-Instruct-v0.1',
	});

	console.log(response);

	return response.choices[0].message?.content ?? undefined;
}

// await getStory();
