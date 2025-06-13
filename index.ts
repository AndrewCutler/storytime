import Together from 'together-ai';
import * as http from 'http';

const PORT = 8000;
const ALLOWED_ORIGIN = 'http://localhost:5173' as const;
// use environment variable, TOGETHER_API_KEY
const together = new Together({
	apiKey: '939d5863eb54f9fd11aaccc9f0e03831b15116f4b3f9402cdd4594aa18d768bc',
});

async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
	const {
		headers: { origin, referer },
	} = req;

	console.log(origin, referer);

	// todo: create custom handlers for each route
	if ([origin, referer].some((x) => x?.startsWith(ALLOWED_ORIGIN))) {
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
		res.end();
	}
}

const server = http.createServer(handler);

server.listen(PORT);

// todo: these should be moved elsewhere
async function getStory(prompt: string): Promise<string | undefined> {
	// TODO: chain multiple requests, one for each choice made by user,
	// so that a more detailed and elaborate story can be generated.
	const response = await together.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
		model: 'mistralai/Mistral-7B-Instruct-v0.1',
	});
	together.apiKey;
	return response.choices[0].message?.content ?? undefined;
}

// async function generateImage() {
// 	const response = await together.images.create({
// 		model: 'black-forest-labs/FLUX.1-depth',
// 		width: 1024,
// 		height: 1024,
// 		steps: 28,
// 		prompt: 'make his fur black',
// 		// @ts-ignore
// 		image_url: 'https://easydrawingguides.com/wp-content/uploads/2022/11/how-to-draw-an-easy-bear-face-featured-image-1200.png',
// 	});

// 	// @ts-ignore
// 	console.log(response.data[0].url);
// }

// generateImage();
