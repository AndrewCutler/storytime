<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Story Time!</title>
	<meta name="description" content="Learn more about our team and mission." />
</svelte:head>

<div class="bg"></div>
<div class="bg bg2"></div>
<div class="bg bg3"></div>
<div class="h-full">
	{@render children()}
</div>

<style>
</style>
