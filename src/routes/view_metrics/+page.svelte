<script lang="ts">
    // show metrics for all questions
	import { writable } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data;

	const displayed_link = writable();

	//$: displayed_answer.set(answer)
</script>

<svelte:head>
	<title>Metrics</title>
</svelte:head>
