<script lang="ts">
	/** @type {import('./$types').PageData} */
    export let data: { email: string, id: string };
    console.log(data)
</script>
<h2>
    Metrics for {data.email}
</h2>