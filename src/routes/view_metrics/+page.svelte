<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

    function getHumanReadableDate(ms: string) {
        const d = new Date(ms);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    }

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
                <th>Total Time Minutes</th>
            </tr>
        </thead>
        <tbody>
            {#each data.metrics as { question, answer, email, correct, totalVisits, totalTimeSpentMs, start, end }}
                <tr>
                    <td>{email}</td>
                    <td>{question}</td>
                    <td>{answer}</td>
                    <td>{correct}</td>
                    <td>{totalVisits}</td>
                    <td>{getHumanReadableDate(start)}</td>
                    <td>{getHumanReadableDate(end)}</td>
                    <td>{getDurationMs(totalTimeSpentMs)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>