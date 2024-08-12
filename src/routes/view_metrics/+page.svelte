<script lang="ts">
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import { Button, Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { buildLink, doFetch, debounce, getHumanReadableDate, copyUrlToClipBoard } from '$lib/utils';
    import { type PaginatedResponse, type QuestionAnswerPairModel, type UserQuestionMetric } from '$lib/types';
    import Dropdown from '$lib/components/Dropdown.svelte';
	import { FileCopyAltOutline } from 'flowbite-svelte-icons';

	/** @type {import('./$types').PageData} */
    export let data: {
        questions: PaginatedResponse<QuestionAnswerPairModel>,
        questionTitle?: string,
        question?: string,
        email?: string,
        id?: string,
        metrics?: UserQuestionMetric[],
        students: string[],
    };

    let metrics: UserQuestionMetric[] = data?.metrics ?? [];
    let email: string | undefined = data?.email;
    let question: string | undefined = data?.question;
    let questionTitle: string | undefined = data?.questionTitle;
    let id: string | undefined = data?.id;
    let questions: PaginatedResponse<QuestionAnswerPairModel> = data.questions;
    let emails: string[] = data.students;

    const display_question_title = writable();
    const display_email = writable();
    const display_question = writable();
    const display_questions = writable();
    const display_metrics = writable();
    const display_emails = writable();

    $: display_question_title.set(questionTitle);
    $: display_metrics.set(metrics);
    $: display_question.set(question);
    $: display_email.set(email);
    $: display_questions.set(questions);
    $: display_emails.set(emails);

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
    function updateQuestion(newQuestionId: string, title?: string, newQuestion?: string) {
        id = newQuestionId;
        if (!title || !newQuestion) {
            const foundQuestion = questions.data.find(q => q.id === newQuestionId);
            questionTitle = foundQuestion?.title;
            question = foundQuestion?.question;
        } else {
            questionTitle = title;
            questionTitle = title;
            question = newQuestion;
        }
        searchMetrics();
    }

    onMount(() => {
        doFetch('/api/question')
        .then(x => {
            questions = x;
            // if no question selected, select the first one
            if (!id && questions.data.length) {
                const q = questions.data[0];
                updateQuestion(q.id!, q.title, q.question);
            }
        }).catch(e => console.error(e));
        doFetch('/api/student')
        .then(x => {
            emails = x.data.map(u => u.email);
            if (!email && emails.length) {
                updateEmail(emails[0]);
            }
        }).catch(e => console.error(e));
    });

</script>

<section>
    <div class="flex">
        <span class="flex-1">
        metrics for <Dropdown
            label={$display_email}
            items={$display_emails.map(e => ({value: e, label: e}))}
            onChange={updateEmail}
        /> for <Dropdown
                    onChange={updateQuestion}
                    label={$display_question_title}
                    items={questions.data.map(q => ({ value: q.id, label: q.title }))}
                />
        </span>

        <Button
            icon="FileCopyAltOutline"
            color="light"
            on:click={() => copyUrlToClipBoard(buildLink(`${window.location.pathname}?email=${email}&id=${id}`))}
        >
            <FileCopyAltOutline/>link
        </Button>
    </div>
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