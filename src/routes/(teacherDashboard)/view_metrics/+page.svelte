<script lang="ts">
    import { writable } from 'svelte/store';
    import { Button, Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { buildLink, doFetch, debounce, getHumanReadableDate, copyUrlToClipBoard } from '$lib/utils';
    import { type PaginatedResponse,  type UserQuestionMetric } from '$lib/types';

    /** @type {import('./$types').PageData} */
    export let data: {
        questionTitle?: string,
        question?: string,
        email?: string,
        id?: string,
        metrics?: UserQuestionMetric[],
    };

    let metrics: UserQuestionMetric[] = data?.metrics ?? [];
    let email: string | undefined = data?.email;
    let question: string | undefined = data?.question;
    let questionTitle: string | undefined = data?.questionTitle;
    let id: string | undefined = data?.id;

    const display_question_title = writable();
    const display_email = writable();
    const display_question = writable();
    const display_metrics = writable();

    $: display_question_title.set(questionTitle);
    $: display_metrics.set(metrics);
    $: display_question.set(question);
    $: display_email.set(email);

    const searchMetrics = (q: string = '') => {
        doFetch(`/api/metrics/question/${id}/email/${email}?q=${q}`)
            .then(x => {
                metrics = x.data;
            })
            .catch(e => console.error(e));
    }

    const debouncedSearchMetrics = debounce(searchMetrics);
</script>

<svelte:head>
	<title>Metrics</title>
	<meta name="description" content="View student metrics" />
</svelte:head>

<section>
    {#if $display_email}
        <div>
            metrics for <strong>{$display_email}</strong>, question <strong>{$display_question_title}</strong>:
        </div>
    {/if}

</section>

<div>
    {#if $display_question_title}
        <pre>
            {$display_question}
        </pre>
        <Input
            class="mb-5 w-200px"
            placeholder="search metrics"
            on:keyup={e => debouncedSearchMetrics(e.target.value)}
        />
        <Table>
            <TableHead>
                <TableHeadCell>metric name</TableHeadCell>
                <TableHeadCell>created at</TableHeadCell>
                <TableHeadCell>answer</TableHeadCell>
                <TableHeadCell>correct</TableHeadCell>
            </TableHead>
            <TableBody>
                {#if metrics.length == 0}
                    <TableBodyRow>
                        <TableBodyCell colspan="4" class="text-center">no metrics to show</TableBodyCell>
                    </TableBodyRow>
                {/if}
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
    {:else}
    <div class="p-5 text-center">
        no metrics to show
    </div>
    {/if}
</div>

<style>
    pre {
        white-space: pre-wrap;
    }
</style>
