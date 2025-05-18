<script lang="ts">
	import '../app.css';
	import Layout from '$lib/components/Layout/Layout.svelte';
</script>

<div class="min-h-screen bg-gray-100">
	<Layout>
		<div class="max-w-6xl mx-auto p-4">
			<slot />
		</div>
	</Layout>
</div>