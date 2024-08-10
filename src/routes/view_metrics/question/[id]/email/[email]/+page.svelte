<script lang="ts">
    import { writable } from 'svelte/store';
    import { Input, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { debounce, getHumanReadableDate } from '$lib/utils';
    import { type UserQuestionMetric } from '$lib/types';

	/** @type {import('./$types').PageData} */
    export let data: { question: string, email: string, id: string, metrics: UserQuestionMetric[] };

    let metrics: UserQuestionMetric[] = data.metrics;

    const display_metrics = writable();

    $: display_metrics.set(metrics);

    function searchMetrics(q: string) {
        const { id, email } = data;
        fetch(`/api/metrics/question/${id}/email/${email}?q=${q}`)
            .then(x => x.json())
            .then(x => {
                metrics = x.data;
            })
            .catch(e => console.error(e));
    }

    const debouncedSearchMetrics = debounce(searchMetrics);
</script>

<div class="mb-5">
    <Button color="blue" href="/view_metrics">Back</Button>
</div>

<section>
    {data.email}'s metrics for question:
    <pre>
        {data.question}
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