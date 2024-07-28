<script lang="ts">
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
<h2>
    Metrics
</h2>

<section>
    <table>
        <thead>
            <tr>
                <th>Email</th>
                <th>Question</th>
                <th>User Answer</th>
                <th>Correct</th>
                <th>Page Views</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Total Time</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {#each data.metrics as { pairId, question, answer, email, correct, totalVisits, totalTimeSpentMs, start, end }}
                <tr>
                    <td>{email}</td>
                    <td>{question}</td>
                    <td>{answer}</td>
                    <td>{correct}</td>
                    <td>{totalVisits}</td>
                    <td>{getHumanReadableDate(start)}</td>
                    <td>{getHumanReadableDate(end)}</td>
                    <td>{getDurationMs(totalTimeSpentMs)} minutes</td>
                    <td><a href={`/view_metrics/question/${pairId}/email/${email}`}>view all</a></td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>