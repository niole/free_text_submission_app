<script lang="ts">
	import { writable } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data;
	let { question, id } = data;
</script>

<svelte:head>
	<title>Answer Question</title>
</svelte:head>

<section>

	<form action="?/submitAnswer" method="POST">
		<input type="hidden" name="id" value={id} />

		<h1>
		Question
		</h1>
		<div>{question}</div>

		<h1>
		Answer
		</h1>
		<textarea id="answer" name="answer" />

		<div>
			<button formaction="?/submitAnswer">Submit</button>
		</div>

	</form>
</section>

<style>
</style>