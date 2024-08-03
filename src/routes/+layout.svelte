<script>
	import { jwtDecode } from "jwt-decode";
    import { onMount } from "svelte";
	import '../app.css';

	const YOUR_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

	onMount(() => {
		function handleCredentialResponse(res) {
			const cred = jwtDecode(res.credential);
			console.log(cred);
			console.log(cred.email);
			document.cookie = `email=${cred.email}; max-age: 86400; SameSite=Strict; Path=/`;
		}
//		window.google.accounts.id.initialize({
//			client_id: YOUR_CLIENT_ID,
//			callback: handleCredentialResponse
//		});
//		window.google.accounts.id.prompt(notification => {
//			console.log(notification);
//            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
//				console.log('skipped');
//                document.cookie =  `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
//                google.accounts.id.prompt();
//            }
//		});
	});
</script>

<div class="app">
	<nav>
		<ol>
			<li><a href="/">View</a></li>
			<li><a href="/create">Create</a></li>
			<li><a href="/view_metrics">Metrics</a></li>
		</ol>
	</nav>
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
