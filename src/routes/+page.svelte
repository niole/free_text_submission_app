<script lang="ts">
	// TODO gate with google auth, only allow teacher
	// add teacher registration page or build with configuration for mom only dnelson@mvrhs.org
	import CreateEditQuestion from './CreateEditQuestion.svelte';
	import { writable } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data;
	let question: any | undefined;
	let answer: any | undefined;

	let pairId: any | null = null;

	const pair_id = writable();
	const displayed_question = writable();
	const displayed_answer = writable();
	const displayed_link = writable();

	$: pair_id.set(pairId);
	$: displayed_question.set(question)
	$: displayed_answer.set(answer)

	function setQuestionAnswerPair(pair) {
		if (pairId !== pair.id) {
			pairId = pair.id;
			question = pair.question;
			answer = pair.answer;
			$: displayed_link.set(pair.link)
		} else {
			pairId = null
			question = null;
			answer = null;
			$: displayed_link.set(null)
		}
	}

</script>

<svelte:head>
	<title>Create</title>
	<meta name="description" content="Create question answer pairs" />
</svelte:head>

<section>
	<h1>
	Questions
	</h1>

	<h2>
	Add or edit a question
	</h2>
	<CreateEditQuestion
		pairId={$pair_id}
		question={$displayed_question}
		answer={$displayed_answer}
		link={$displayed_link}
	/>

	{#each data.qs as q}
		<div>
			{q.question}
			{q.answer}
			<button on:click={() => setQuestionAnswerPair(q)}>{$pair_id === q.id ? 'close' : 'open' }</button>
		</div>
	{/each}

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
