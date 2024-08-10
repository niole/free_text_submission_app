<script lang="ts">
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { getHumanReadableDate } from '$lib/utils';
	/** @type {import('./$types').PageData} */
	export let data;

    function getDurationMs(ms: number) {
        return Math.round(ms/(1000*60));
    }
</script>

<svelte:head>
	<title>Metrics</title>
</svelte:head>
<h2 class="text-3xl">
    Metrics
</h2>

<section>
    <Table>
        <TableHead>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Question</TableHeadCell>
            <TableHeadCell>User Answer</TableHeadCell>
            <TableHeadCell>Correct</TableHeadCell>
            <TableHeadCell>Page Views</TableHeadCell>
            <TableHeadCell>Start Time</TableHeadCell>
            <TableHeadCell>End Time</TableHeadCell>
            <TableHeadCell>Total Time</TableHeadCell>
            <TableHeadCell></TableHeadCell>
        </TableHead>
        <TableBody>
            {#each data.metrics as { pairId, question, answer, email, correct, totalVisits, totalTimeSpentMs, start, end }}
                <TableBodyRow>
                    <TableBodyCell>{email}</TableBodyCell>
                    <TableBodyCell tdClass="handle-overflow">{question}</TableBodyCell>
                    <TableBodyCell tdClass="handle-overflow">{answer ?? ''}</TableBodyCell>
                    <TableBodyCell>{correct}</TableBodyCell>
                    <TableBodyCell>{totalVisits}</TableBodyCell>
                    <TableBodyCell>{getHumanReadableDate(start)}</TableBodyCell>
                    <TableBodyCell>{getHumanReadableDate(end)}</TableBodyCell>
                    <TableBodyCell>{getDurationMs(totalTimeSpentMs)} minutes</TableBodyCell>
                    <TableBodyCell><Button color="light" href={`/view_metrics/question/${pairId}/email/${email}`}>view all</Button></TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</section>

<style>
	.handle-overflow {
		max-width: 200px;
		white-space: wrap;
	}

	h2 {
		margin-bottom: 50px;
	}
</style>
