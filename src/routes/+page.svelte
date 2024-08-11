<script lang="ts">
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { FileCopyAltOutline } from 'flowbite-svelte-icons';
	import { copyUrlToClipBoard } from '$lib/utils';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>View</title>
	<meta name="description" content="View question answer pairs" />
</svelte:head>

<h2 class="text-3xl">
	View
</h2>

{#if data.qs.length === 0}
	<a href="/create">Create a question</a>
{/if}
<Table>
	<TableHead>
		<TableHeadCell>question</TableHeadCell>
		<TableHeadCell>answer</TableHeadCell>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell></TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y handle-overflow">
		{#each data.qs as q}
			<TableBodyRow>
				<TableBodyCell tdClass="handle-overflow">{q.question}</TableBodyCell>
				<TableBodyCell tdClass="handle-overflow">{q.answer}</TableBodyCell>
				<TableBodyCell>
					<Button icon="FileCopyAltOutline" color="light" on:click={() => copyUrlToClipBoard(q.link)}><FileCopyAltOutline/>link</Button>
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

<style>
	.handle-overflow {
		max-width: 200px;
		white-space: wrap;
	}
</style>