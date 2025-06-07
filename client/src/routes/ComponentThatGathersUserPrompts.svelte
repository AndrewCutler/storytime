<script lang="ts">
	const animals = ['bear', 'tiger', 'wolf', 'butterfly'] as const;
	const actions = ['paint', 'dance', 'sing', 'sleep'] as const;
	const chores = ['clean the house', 'do the yardwork', 'cook dinner', 'go shopping'] as const;
	type Choice = (typeof animals | typeof actions | typeof chores)[number];

	const MAX_PROMPTS: number = 3 as const;
	let choices: Choice[] = $state([]);

	let prompt = $derived.by(() => {
		switch (choices.length) {
			case 0:
				return 'First, pick an animal.';
			case 1:
				return `Now, what does the ${choices[0]} like to do?`;
			case 2:
				return `But before ${choices[1]}, the ${choices[0]} has to...`;
			default:
				return '';
		}
	});

	let options = $derived.by(() => {
		switch (choices.length) {
			case 0:
				return animals as unknown as string[];
			case 1:
				return actions as unknown as string[];
			case 2:
				return chores as unknown as string[];
			default:
				return [];
		}
	});

	async function generateStory(): Promise<void> {
		const body = `create a children's story about a ${choices[0]} that likes to ${choices[1]} but has to ${choices[2]} first`;
		const res = await fetch('http://localhost:8000', {
			method: 'POST',
			body
		});
		const text = await res.text();
		console.log(text);
	}

	function makeChoice(choice: Choice) {
		choices.push(choice);

		if (choices.length === MAX_PROMPTS) {
			generateStory();
		}
	}
</script>

<h4>Let's write a story!</h4>

<div>{prompt}</div>
<div class="flex flex-col">
	{#each options as option}<button onclick={() => makeChoice(option as Choice)}>{option}</button
		>{/each}
</div>
