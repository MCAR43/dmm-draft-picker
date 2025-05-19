<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="min-h-screen bg-gray-100">
	<Navbar />
	<div class="max-w-6xl mx-auto p-4 pt-6">
		<slot />
	</div>
</div>