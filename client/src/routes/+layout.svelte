<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	onMount(async () => {
		try {
			const res = await fetch('http://localhost:8000');
			const text = await res.text();
			console.log(text);
		} catch (e) {
			console.error(e);
		}
	});
</script>

{@render children()}
