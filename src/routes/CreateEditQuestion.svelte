<script lang="ts">
	import { writable } from 'svelte/store';


	export let pairId: any | null = null;
	export let question: any | null = null;
	export let answer: any | null = null;
	export let link: any | null = null;

	const displayed_question = writable();
	const displayed_answer = writable();

	$: displayed_question.set(question)
	$: displayed_answer.set(answer)
</script>

<div>
	<form action="?/saveQuestionAnswerPair" method="POST">
		<input type="hidden" id="pairId" name="pairId" value={pairId} />

		<label>
			question
			<input id="question" name="question" value={$displayed_question} on:keyup={event => question = event.target.value}/>
		</label>

		<label>
			answer
			<input id="answer" name="answer"   value={$displayed_answer} on:keyup={event => answer = event.target.value} />
		</label>

		<button formaction="?/saveQuestionAnswerPair">Submit</button>
	</form>

	{link ? link : ''}

	<div>
		{$displayed_question ? 'Question: ' + $displayed_question : ''}
		{$displayed_answer ? 'Answer: ' + $displayed_answer : ''}
	</div>
</div>

<style>
</style>
