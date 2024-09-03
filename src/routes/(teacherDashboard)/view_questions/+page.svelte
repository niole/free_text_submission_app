<script lang="ts">
	import CopyTextModal from '$lib/components/CopyTextModal.svelte';
	import { Input, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { doFetch, debounce, buildLink, copyUrlToClipBoard } from '$lib/utils';
	import Pagination from '$lib/components/Pagination.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const debouncedSearch = debounce((v: string) => {
		doFetch(`/api/question?q=${v}`)
		.then(x => {
			data = { qs: x };
		})
		.catch(e => console.error(e));
	});

	function updatePage(opts) {
		doFetch(`/api/question?page=${opts.page}&pageSize=${opts.pageSize}`)
		.then(x => {
			data = { qs: x };
		})
		.catch(e => console.error(e));
    }
</script>

<svelte:head>
	<title>Questions</title>
	<meta name="description" content="View question answer pairs" />
</svelte:head>

<div class="page-header">
	<h2 class="text-3xl">
		Questions
	</h2>
	<h3>view, manage, and get links to questions</h3>
</div>

{#if data.qs.data.length === 0}
<div class="text-center mb-5">
	<Button color="blue" class="mb-5" href="/create">Create a question</Button>
</div>
{/if}
<Input class="mb-5 w-200px" placeholder="search" on:keyup={e => debouncedSearch(e.target.value)} />
<Pagination
    pageSize={data.qs.pagination.page.pageSize}
    page={data.qs.pagination.page.page}
    totalItems={data.qs.pagination.totalItems}
    onPageChange={updatePage}
/>
<Table>
	<TableHead>
		<TableHeadCell>title</TableHeadCell>
		<TableHeadCell>content</TableHeadCell>
		<TableHeadCell>answer</TableHeadCell>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell></TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y handle-overflow">
		{#if data.qs.data.length == 0}
			<TableBodyRow>
				<TableBodyCell colspan="6" class="text-center">no questions to show</TableBodyCell>
			</TableBodyRow>
		{/if}
		{#each data.qs.data as q}
			<TableBodyRow>
				<TableBodyCell tdClass="handle-overflow">{q.title}</TableBodyCell>
				<TableBodyCell tdClass="handle-overflow">{q.question}</TableBodyCell>
				<TableBodyCell tdClass="handle-overflow">{q.answer}</TableBodyCell>
				<TableBodyCell>
					<CopyTextModal
						buildCopyText={() => buildLink(`/question_input/${q.id}`)}
					/>
				</TableBodyCell>
				<TableBodyCell>
					<Button color="blue" href={`/create?pairId=${q.id}`}>edit</Button>
				</TableBodyCell>
				<TableBodyCell>
					<Button
						color="red"
						on:click={() => {
							const shouldDelete = confirm(`Are you sure that you want to delete ${q.title}?`);
							if (shouldDelete) {
								fetch(`/api/question/${q.id}`, { method: 'DELETE'})
								.then(() => {
									window.location.reload();
								})
								.catch(e => {
									console.error(`Failed to delete question ${q.id}`, e);
									alert('Failed to delete question');
								});
							}
						}}>delete</Button>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<style>
	.handle-overflow {
		max-width: 200px;
		white-space: wrap;
	}
</style>
