<script lang="ts">
	type Animal = { name: string; alt: string; src: string };
	const animals: Animal[] = [
		{ name: 'bear', src: 'bear.png', alt: 'Wolf' },
		{ name: 'tiger', src: 'tiger.png', alt: 'Tiger' },
		{ name: 'wolf', src: 'wolf.png', alt: 'Bear' },
		{ name: 'butterfly', src: 'butterfly.png', alt: 'Butterfly' }
	] as const;
	// todo: should have an image for each of these too
	const actions = ['paint', 'dance', 'sing', 'sleep'] as const;
	// todo: should have an image for each of these too
	const chores = ['clean the house', 'do the yardwork', 'cook dinner', 'go shopping'] as const;
	type Choice = (typeof animals | typeof actions | typeof chores)[number];

	const MAX_PROMPTS: number = 3 as const;
	// todo: should be an object, not an array of mixed types
	let choices: Choice[] = $state([]);
	let story: string = $state('');
	let prompt = $derived.by(() => {
		switch (choices.length) {
			case 0:
				return 'First, pick an animal.';
			case 1:
				return `Now, what does the ${(choices[0] as Animal).name} like to do?`;
			case 2:
				return `But before ${choices[1]}, the ${(choices[0] as Animal).name} has to...`;
			default:
				return '';
		}
	});
	let options = $derived.by(() => {
		switch (choices.length) {
			case 0:
				return animals;
			case 1:
				return actions as unknown as string[];
			case 2:
				return chores as unknown as string[];
			default:
				return [];
		}
	});
	let loading = $state(false);
	let animal = $state<Animal | undefined>();
	let friend = $derived(
		(choices.filter((_, i) => i !== 0) as Animal[])[Math.floor(Math.random() * choices.length - 1)]
	);

	$inspect(friend);
	$inspect(choices);
	$inspect(animal);

	async function generateStory(): Promise<void> {
		loading = true;
		const body = `create a children's story about a ${(choices[0] as Animal).name} that likes to ${choices[1]} but has to ${choices[2]} first with his friend ${friend} and do it at a 1st grade reading level`;
		// todo: try/catch
		const res = await fetch('http://localhost:8000', {
			method: 'POST',
			body
		});
		// todo: try/catch
		const text = await res.text();
		story = text;
		console.log(story);
		loading = false;
	}

	function makeChoice(choice: Choice) {
		if (choices.length === 0) {
			animal = choice as Animal;
		}

		setTimeout(function () {
			choices.push(choice);

			if (choices.length === MAX_PROMPTS) {
				generateStory();
			}
		}, 1000);
	}
</script>

<!-- TODO: animations. Transitions between each choice, with feedback like "Good choice", "Oh, dancing is fun!", etc. -->

<div class="align-center flex flex-col gap-8 text-lg">
	<div class="flex justify-center">
		<h2>Let's write a story!</h2>
	</div>

	<div class="flex justify-center">{prompt}</div>

	<div class="flex flex-col items-center gap-5">
		{#each options as option}<button
				onclick={() => makeChoice(option as Choice)}
				class={[
					'align-center min-w-1/4 flex max-w-md cursor-pointer flex-col gap-2 transition-transform hover:scale-110',
					{ shrunk: choices.length === 0 && animal?.name === (option as Animal).name }
				]}
			>
				{#if typeof option === 'object'}
					<div class="flex justify-center">
						<img src={option.src} alt={option.alt} title={option.alt} width="100" height="100" />
					</div>
					<div>{option.name}</div>
				{:else}
					<div>{option}</div>
				{/if}
			</button>{/each}
	</div>
	{#if loading}<div class="p-10">Loading...</div>{/if}
	<div class="whitespace-pre-wrap text-wrap p-10 text-center text-[1rem]">
		{story}
	</div>
</div>
