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

	nav {
		border-bottom: 1px solid black;
	}

	nav ol {
		display: flex;
		margin: 0px;
		padding: 0px;
	}
	nav li {
		list-style-type: none;
		padding: 15px 25px;
	}
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

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
