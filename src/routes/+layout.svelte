<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-100">
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-6xl mx-auto p-4 border-4 border-osrs-yellow bg-osrs-interface rounded-lg shadow-lg">
			{@render children()}
		</div>
	</div>
</div>