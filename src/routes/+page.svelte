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
		</tr>
	</thead>
	<tbody>
		{#each data.qs as q}
			<tr>
				<td>{q.question}</td>
				<td>{q.answer}</td>
				<td>
					<a href={`/create?pairId=${q.id}`}>edit</a>
				</td>
				<td>
					<button on:click={() => copyUrlToClipBoard(q)}>copy url</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	th {
		text-align: left;
	}
</style>