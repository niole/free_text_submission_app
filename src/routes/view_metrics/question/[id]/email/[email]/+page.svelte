<script lang="ts">
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import { Input, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { doFetch, debounce, getHumanReadableDate } from '$lib/utils';
    import { type QuestionAnswerPairModel, type UserQuestionMetric } from '$lib/types';
    import Dropdown from '$lib/components/Dropdown.svelte';

	/** @type {import('./$types').PageData} */
    export let data: { question: string, email: string, id: string, metrics: UserQuestionMetric[] };

    let metrics: UserQuestionMetric[] = data.metrics;
    let email: string = data.email;
    let question: string = data.question;
    let id: string = data.id;
    let questions: QuestionAnswerPairModel[] = [];

    const display_email = writable();
    const display_question = writable();
    const display_questions = writable();
    const display_metrics = writable();

    $: display_metrics.set(metrics);
    $: display_question.set(question);
    $: display_email.set(email);
    $: display_questions.set(questions);

    const searchMetrics = (q: string = '') => {
        doFetch(`/api/metrics/question/${id}/email/${email}?q=${q}`)
            .then(x => {
                metrics = x.data;
            })
            .catch(e => console.error(e));
    }

    const debouncedSearchMetrics = debounce(searchMetrics);

    function updateEmail(newEmail: string) {
        email = newEmail;
        searchMetrics();
    }
    function updateQuestion(newQuestionId: string) {
        id = newQuestionId;
        question = questions.find(q => q.id === newQuestionId)?.question ?? '';
        searchMetrics();
    }

    onMount(() => {
        doFetch('/api/question')
        .then(x => {
            questions = x.data;
        }).catch(e => console.error(e));
    });
</script>

<div class="mb-5">
    <Button color="blue" href="/view_metrics">Back</Button>
</div>

<section>
    metrics for <Dropdown
        value={$display_email}
        items={[{value: 'niolenelson@gmail.com', label: 'niolenelson@gmail.com' }, {value: 'all', label: 'all'}]}
        onChange={updateEmail}
    /> for <Dropdown onChange={updateQuestion} label="question" items={questions.map(q => ({ value: q.id, label: q.question }))} />
    <pre>
        {$display_question}
    </pre>
</section>

<div>
    <Input class="mb-5 w-200px" placeholder="search" on:keyup={e => debouncedSearchMetrics(e.target.value)} />
    <Table>
        <TableHead>
            <TableHeadCell>metric name</TableHeadCell>
            <TableHeadCell>created at</TableHeadCell>
            <TableHeadCell>answer</TableHeadCell>
            <TableHeadCell>correct</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each $display_metrics as m}
                <TableBodyRow>
                    <TableBodyCell>{m.name}</TableBodyCell>
                    <TableBodyCell>{getHumanReadableDate(m.createdAt)}</TableBodyCell>
                    <TableBodyCell>{m.answer ? m.answer : ''}</TableBodyCell>
                    <TableBodyCell>{m.correct === undefined ? '' : m.correct}</TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>

<style>
    pre {
        white-space: pre-wrap;
    }
</style>