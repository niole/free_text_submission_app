<script lang="ts">
    import { onMount } from "svelte";
    import { Button, Textarea } from 'flowbite-svelte';
	import { doFetch } from "$lib/utils";

	/** @type {import('./$types').PageData} */
	export let data;
	let { question, id } = data;

	onMount(() => {
		doFetch('?/handlePageVisit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `id=${id}`,
		});
	});

	function handleSubmit() {
		const answerForm = document.getElementById('answer-form') as HTMLFormElement;
		const es = answerForm.elements;
		const answer = (es[1] as HTMLInputElement).value;

		doFetch('?/submitAnswer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `id=${id}&answer=${answer}`,
		}, true).then(r => {
			const { correct, successTeacherResponse } = r.data;
			if (correct) {
				alert(successTeacherResponse ?? 'Correct');
			} else {
				alert('Incorrect, try again');
			}
		}).catch(e => {
			alert("Something went wrong and we couldn't process your answer");
			console.error(e);
		});
	}
</script>

<svelte:head>
	<title>Answer Question</title>
</svelte:head>

<section>

	<form id="answer-form">
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
			<Button color="light" on:click={handleSubmit}>Submit</Button>
		</div>

	</form>
</section>

<style>
</style>
