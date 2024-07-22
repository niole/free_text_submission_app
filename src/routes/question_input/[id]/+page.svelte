<script lang="ts">
    import { onMount } from "svelte";

	// TODO gate with google auth
	/** @type {import('./$types').PageData} */
	export let data;
	let { question, id } = data;
	const viewingUser = 'niolenelson@gmail.com';

	onMount(() => {
		fetch('?/handlePageVisit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `id=${id}&viewingUser=${viewingUser}`,
		});
	});
</script>

<svelte:head>
	<title>Answer Question</title>
</svelte:head>

<section>

	<form action="?/submitAnswer" method="POST">
		<input type="hidden" name="id" value={id} />
		<input type="hidden" name="email" value={viewingUser} />

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