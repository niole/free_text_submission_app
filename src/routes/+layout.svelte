<script>
	import '../app.css';
	import { Navbar, NavLi, NavUl } from 'flowbite-svelte';
</script>

<div class="app">
	<Navbar rounded color="form">
		<NavUl>
			<NavLi><a href="/">View</a></NavLi>
			<NavLi><a href="/create">Create</a></NavLi>
			<NavLi><a href="/view_metrics">Metrics</a></NavLi>
		</NavUl>
	</Navbar>
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
