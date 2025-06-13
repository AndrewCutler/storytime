<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Story Time!</title>
	<meta name="description" content="Learn more about our team and mission." />
</svelte:head>

{@render children()}
