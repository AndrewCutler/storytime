<script lang="ts">
	type ImageChoice = { name: string; alt: string; src: string };
	const animals: ImageChoice[] = [
		{ name: 'bear', src: 'bear.png', alt: 'Wolf' },
		{ name: 'tiger', src: 'tiger.png', alt: 'Tiger' },
		{ name: 'wolf', src: 'wolf.png', alt: 'Bear' },
		{ name: 'butterfly', src: 'butterfly.png', alt: 'Butterfly' }
	] as const;
	// todo: should have an image for each of these too
	const actions: ImageChoice[] = [
		{ name: 'paint', alt: '', src: '' },
		{ name: 'dance', alt: '', src: '' },
		{ name: 'sing', alt: '', src: '' },
		{ name: 'sleep', alt: '', src: '' }
	] as const;
	// todo: should have an image for each of these too
	const chores: ImageChoice[] = [
		{ name: 'clean the house', alt: '', src: '' },
		{ name: 'do the yardwork', alt: '', src: '' },
		{ name: 'cook dinner', alt: '', src: '' },
		{ name: 'go shopping', alt: '', src: '' }
	] as const;

	const MAX_PROMPTS: number = 3 as const;
	let choices: ImageChoice[] = $state([]);
	let story: string = $state('');
	let loading = $state(false);
	let clickedOption: ImageChoice | null = $state(null);

	let prompt = $derived.by(() => {
		switch (choices.length) {
			case 0:
				return 'First, pick an animal.';
			case 1:
				return `Now, what does the ${choices[0].name} like to do?`;
			case 2:
				return `But before ${choices[1].name}, the ${choices[0].name} has to...`;
			default:
				return '';
		}
	});

	let options = $derived.by(() => {
		switch (choices.length) {
			case 0:
				return animals;
			case 1:
				return actions;
			case 2:
				return chores;
			default:
				return [];
		}
	});

	let friend = $derived(
		choices.filter((_, i) => i !== 0)[Math.floor(Math.random() * choices.length - 1)]
	);

	$inspect(friend);
	$inspect(choices);

	async function generateStory(): Promise<void> {
		loading = true;
		const body = `create a children's story about a ${choices[0].name} that likes to ${choices[1].name} but has to ${choices[2].name} first with his friend ${friend.name} and do it at a 1st grade reading level`;
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

	function makeChoice(choice: ImageChoice) {
		clickedOption = choice;
		setTimeout(() => {
			choices.push(choice);
			clickedOption = null;
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
		{#each options as option}
			<button
				onclick={() => makeChoice(option)}
				class={[
					'align-center min-w-1/4 flex max-w-md cursor-pointer flex-col gap-2 transition-transform hover:scale-110',
					{
						shrunk: clickedOption?.name === option.name
					}
				]}
			>
				{#if option.src}
					<div class="flex justify-center">
						<img src={option.src} alt={option.alt} title={option.alt} width="100" height="100" />
					</div>{/if}
				<div>{option.name}</div>
			</button>
		{/each}
	</div>
	{#if loading}<div class="p-10">Loading...</div>{/if}
	<div class="whitespace-pre-wrap text-wrap p-10 text-center text-[1.25rem]">
		{story}
	</div>
</div>
