<script lang="ts">
    import { getHumanReadableDate } from '$lib/utils';
	/** @type {import('./$types').PageData} */
    export let data: { question: string, email: string, id: string, metrics: any[] };
</script>
<a href="/view_metrics">Back</a>
<h2>
    {data.email}'s metrics for question:
</h2>
<section>
    <pre>
        {data.question}
    </pre>
</section>

<div>
    <table>
        <thead>
            <th>metric name</th>
            <th>created at</th>
            <th>answer</th>
            <th>correct</th>
        </thead>
        <tbody>
            {#each data.metrics as m}
                <tr>
                    <td>{m.name}</td>
                    <td>{getHumanReadableDate(m.createdAt)}</td>
                    <td>{m.answer ? m.answer : ''}</td>
                    <td>{m.correct === undefined ? '' : m.correct}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    pre {
        white-space: pre-wrap;
    }
</style>