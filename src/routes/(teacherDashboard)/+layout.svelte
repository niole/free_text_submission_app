<script>
	import '../../app.css';
	import { Navbar, NavLi, NavUl } from 'flowbite-svelte';

	let appDomain = '';
	try {
		appDomain = process.env.APP_DOMAIN;
    } catch {
		appDomain = window.location.origin;
    }
</script>

<div class="app">
	<Navbar rounded color="form">
		<NavUl>
			<NavLi><a href="/view_questions">Questions</a></NavLi>
			<NavLi><a href="/create">Create</a></NavLi>
			<NavLi><a href="/view_metrics_summary">Metrics</a></NavLi>
			<NavLi><a href={`${appDomain}/api/logout`}>Logout</a></NavLi>
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
