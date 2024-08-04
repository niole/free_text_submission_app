<svelte:head>
	<title>Create</title>
	<meta name="description" content="Create questions" />
</svelte:head>

<script lang="ts">
    import { Button, Textarea, Label, Input } from 'flowbite-svelte';
    import { writable } from 'svelte/store';
    import { onMount } from "svelte";

	/** @type {import('./$types').PageData} */
    export let data: { pair: { question: string, answer: string } | undefined };

    let question: string | undefined = data.pair?.question;
    let answer: string | undefined = data.pair?.answer;
    let pairId: string | undefined;
    
    onMount(() => {
        pairId = new URLSearchParams(window.location.search).get('pairId') || '';
    });

    const display_q = writable();
    const display_a = writable();
    const display_pair_id = writable();

    $: display_pair_id.set(pairId);
    $: display_q.set(question);
    $: display_a.set(answer);
</script>
<h2 class="text-3xl">
	Create
</h2>

<div>
    <form action="?/saveQuestionAnswerPair" method="POST">
        <input type="hidden" id="pairId" name="pairId" value={$display_pair_id} />
        <div>
            <Label for="question">Question</Label>
            <Textarea
                on:keyup={e => question = e.target.value}
                type="text"
                id="question"
                name="question"
                rows="5"
                value={$display_q ?? ''}
            />
        </div>

        <div>
            <Label for="answer">Answer</Label>
            <Textarea
                on:keyup={e => answer = e.target.value}
                type="text"
                id="answer"
                name="answer"
                rows="5"
                value={$display_a ?? ''}
            />
        </div>

        <Button
            color="light"
            disabled={!$display_q || !$display_a}
            formaction="?/saveQuestionAnswerPair">
            {$display_pair_id ? 'Edit' : 'Submit'}
        </Button>
    </form>
</div>

<div class="displayed_output">
    <Label for="question">Question</Label>
    <pre class="displayed_input">
        {$display_q ?? ''}
    </pre>
    <Label for="answer">Answer</Label>
    <pre class="displayed_input">
        {$display_a ?? ''}
    </pre>
</div>

<style>
    .displayed_input {
        white-space: pre-line;
        padding: 5px;
        display: inline-block;
    }
</style>