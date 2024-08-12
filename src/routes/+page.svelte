<script lang="ts">
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { FileCopyAltOutline } from 'flowbite-svelte-icons';
	import { buildLink, copyUrlToClipBoard } from '$lib/utils';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>Questions</title>
	<meta name="description" content="View question answer pairs" />
</svelte:head>

<h2 class="text-3xl">
	Questions
</h2>

{#if data.qs.data.length === 0}
	<Button color="blue" href="/create">Create a question</Button>
{:else}
<Table>
	<TableHead>
		<TableHeadCell>question</TableHeadCell>
		<TableHeadCell>answer</TableHeadCell>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell></TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y handle-overflow">
		{#each data.qs.data as q}
			<TableBodyRow>
				<TableBodyCell tdClass="handle-overflow">{q.question}</TableBodyCell>
				<TableBodyCell tdClass="handle-overflow">{q.answer}</TableBodyCell>
				<TableBodyCell>
					<Button
						icon="FileCopyAltOutline"
						color="light"
						on:click={() => copyUrlToClipBoard(buildLink(`/question_input/${q.id}`))}
					>
					<FileCopyAltOutline/>link
					</Button>
				</TableBodyCell>
				<TableBodyCell>
					<Button color="light" href={`/create?pairId=${q.id}`}>edit</Button>
				</TableBodyCell>
				<TableBodyCell>
					<Button
						color="red"
						on:click={() => {
							const shouldDelete = confirm("Are you sure?");
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
{/if}

<style>
	.handle-overflow {
		max-width: 200px;
		white-space: wrap;
	}
</style>