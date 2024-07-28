<script lang="ts">
	// TODO gate with google auth, only allow teacher
	// add teacher registration page or build with configuration for mom only dnelson@mvrhs.org
	/** @type {import('./$types').PageData} */
	export let data;

	function copyUrlToClipBoard(q) {
		navigator.clipboard.writeText(q.link);
	}
</script>

<svelte:head>
	<title>Create</title>
	<meta name="description" content="Create question answer pairs" />
</svelte:head>

<h2>
	View
</h2>

{#if data.qs.length === 0}
	<a href="/create">Create a question</a>
{/if}
<table>
	<thead>
		<tr>
			<th>question</th>
			<th>answer</th>
			<th></th>
			<th></th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each data.qs as q}
			<tr>
				<td>{q.question}</td>
				<td>{q.answer}</td>
				<td>
					<button on:click={() => copyUrlToClipBoard(q)}>link</button>
				</td>
				<td>
					<a href={`/create?pairId=${q.id}`}>edit</a>
				</td>
				<td>
					<button
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
						}}>delete</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>