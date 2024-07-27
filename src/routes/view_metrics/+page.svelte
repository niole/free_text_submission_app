<script lang="ts">
    // show metrics for all questions
	import { writable } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data;

    console.log(data);

	const displayed_link = writable();

	//$: displayed_answer.set(answer)
</script>

<svelte:head>
	<title>Metrics</title>
</svelte:head>

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
                    <td>{start}</td>
                    <td>{end}</td>
                    <td>{totalTimeSpentMs}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>