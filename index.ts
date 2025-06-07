import Together from 'together-ai';
import * as http from 'http';

const PORT = 8000;
const ALLOWED_ORIGIN = 'http://localhost:5173' as const;

async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
	const {
		headers: { origin, referer },
	} = req;

	// todo: create custom handlers for each route
	if ([origin, referer].some((x) => x?.startsWith(ALLOWED_ORIGIN))) {
		// const story = await getStory();
		let body: string = '';
		req.on('data', function (chunk) {
			body += chunk;
		});
		req.on('end', async function () {
			const story = await getStory(body);
			res.writeHead(200, {
				'content-type': 'text/plain',
				'access-control-allow-origin': origin || referer,
			});
			res.write(story);
			res.end();
		});
	} else {
		res.writeHead(204, { 'content-type': 'text/plain' });
		res.write('fuck off');
		res.end();
	}
}

const server = http.createServer(handler);

server.listen(PORT);

async function getStory(prompt: string): Promise<string | undefined> {
	// use environment variable, TOGETHER_API_KEY
	const together = new Together({
		apiKey: '939d5863eb54f9fd11aaccc9f0e03831b15116f4b3f9402cdd4594aa18d768bc',
	});

	const response = await together.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
		model: 'mistralai/Mistral-7B-Instruct-v0.1',
	});

	return response.choices[0].message?.content ?? undefined;
}
