<script lang="ts">
    import { onMount } from "svelte";
    import { Button, Textarea, Label, Input } from 'flowbite-svelte';

	// TODO gate with google auth
	/** @type {import('./$types').PageData} */
	export let data;
	let { question, id } = data;

	onMount(() => {
		fetch('?/handlePageVisit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `id=${id}`,
		});
	});
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
		<Textarea id="answer" name="answer" />

		<div>
			<Button color="light" type="submit" formaction="?/submitAnswer">Submit</Button>
		</div>

	</form>
</section>

<style>
</style>