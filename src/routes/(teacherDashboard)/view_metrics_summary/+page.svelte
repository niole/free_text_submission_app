<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { Button, Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { defaultPaginatedResponse, type QuestionAnswerPairModel, type UserModel, type PaginatedResponse, type QuestionAnswerSummary } from '$lib/types';
    import { doFetch } from '$lib/utils';
    import Dropdown from '$lib/components/Dropdown.svelte';

    /** @type {import('./$types').PageData} */
    export let data: PaginatedResponse<QuestionAnswerSummary>

    let filterState: { email?: string, questionId?: string } = {};
    const display_filter_state = writable();
    $: display_filter_state.set(filterState)

    let summaries: PaginatedResponse<QuestionAnswerSummary> = data ?? defaultPaginatedResponse;
    const display_summaries = writable();
    $: display_summaries.set(data)

    let students: string[] = [];
    const display_students = writable();
    $: display_students.set(students);

    let questions: PaginatedResponse<QuestionAnswerPairModel> = defaultPaginatedResponse;
    const display_questions = writable();
    $: display_questions.set(questions);

    function updateFilterState(opt: Partial<FilterState>) {
        filterState = {...filterState, ...opt};
        updateSummaries({ page: 1, pageSize: 10, ...filterState });
    }

    async function updateSummaries(opts: {
        page: number,
        pageSize: number,
        email?: string,
        title?: string,
        questionId?: string,
    } = { page: 1, pageSize: 10 }) {
        const {
            page,
            pageSize,
            email,
            title,
            questionId,
        } = opts;

        const data = new FormData();
        data.append('page', page);
        data.append('pageSize', pageSize);
        if (email) {
            data.append('email', email);
        }
        if (title) {
            data.append('title', title);
        }
        if (questionId) {
            data.append('questionId', questionId);
        }

        try {
            const response = await doFetch('?/getSummary', { method: 'POST', body: data}, true);
            // TODO IDK why it wouldn't work when setting equal so summaries
            $: display_summaries.set(response.data);
        } catch (e) {
            console.error('Failed to fetch summaries: ', e);
            // TODO toast?
        }
    }

    async function updateStudents(q: string = '') {
        try {
            const response = await doFetch(`/api/student?q=${q}`);
            students = response.data.map(x => x.email);
        } catch (e) {
            console.error('Failed to fetch students: ', e);
            // TODO toast?
        }
    }

    async function updateQuestions(q: string = '') {
        try {
            const response = await doFetch(`/api/question?q=${q}`);
            questions = response;
        } catch (e) {
            console.error('Failed to fetch students: ', e);
            // TODO toast?
        }
    }

    onMount(async () => {
        updateStudents();
        updateQuestions();
    });

</script>

<svelte:head>
    <title>Student Responses</title>
</svelte:head>

<div class="mb-5">
    <Dropdown
        label="Filter by question"
        isTypeahead={true}
        onSearch={updateQuestions}
        onChange={x => updateFilterState({ questionId: x || undefined })}
        items={[{ value: '', label: 'none'}, ...questions.data.map(x => ({ value: x.id, label: x.title })) ]}
    />
    <Dropdown
        label="Filter by student"
        isTypeahead={true}
        onSearch={updateStudents}
        onChange={x => updateFilterState({ email: x || undefined })}
        items={[{ value: '', label: 'none'}, ...students.map(x => ({ value: x, label: x })) ]}
    />
</div>

<div>
    <Table>
        <TableHead>
            <TableHeadCell>email</TableHeadCell>
            <TableHeadCell>question title</TableHeadCell>
            <TableHeadCell>answered correctly</TableHeadCell>
            <TableHeadCell></TableHeadCell>
        </TableHead>
        <TableBody>
            {#if $display_summaries.data.length == 0}
                <TableBodyRow>
                    <TableBodyCell colspan="4" class="text-center">no metrics to show</TableBodyCell>
                </TableBodyRow>
            {/if}
            {#each $display_summaries.data as m}
                <TableBodyRow>
                    <TableBodyCell>{m.email}</TableBodyCell>
                    <TableBodyCell>{m.title}</TableBodyCell>
                    <TableBodyCell>{m.correct ?? 'n/a'}</TableBodyCell>
                    <TableBodyCell>
                        <Button target="_none" color="blue" href={`/view_metrics?email=${m.email}&id=${m.questionId}`}>
                            Details
                        </Button>
                    </TableBodyCell>
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
