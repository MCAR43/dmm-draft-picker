<script lang="ts">
	import { onMount } from 'svelte';
	const { onClose } = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	function handleOutsideClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		document.body.style.overflow = 'hidden';

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = '';
		};
	});
</script>

<div
	class="fixed inset-0 backdrop-blur-md bg-gray-50 flex justify-center items-center z-50"
	on:click={handleOutsideClick}
	on:mousedown|stopPropagation
	on:mouseup|stopPropagation
	on:mousemove|stopPropagation
>
	<div
		class="bg-white border-4 border-gray-800 rounded-lg p-6 w-4/5 max-h-[80vh] overflow-y-auto shadow-xl"
	>
		<h2 class="text-2xl font-bold mb-6 text-gray-800 text-center drop-shadow-md">
			About the Competition
		</h2>
		
		<div class="text-gray-900 space-y-4 text-xl">
			<p>
				The Deadman Mode Allstars draft has over 620 quintillion possible combinations 
				(24! or 620,448,401,733,239,439,360,000). This platform tracks predictions to 
				see if anyone can accurately predict the entire draft order.
			</p>
			
			<p>
				There's a <span class="font-bold text-gray-800">100M OSRS GP bounty</span> for the first 
				person to submit a completely correct draft board.  This is a small amount but is all i've got as a poor GIM 
			</p>
		</div>
		
		<div class="mt-6 flex justify-center">
			<button
				on:click={onClose}
				class="bg-gray-100 text-gray-800 border-2 border-gray-800 px-6 py-2 rounded font-bold hover:bg-gray-200 transition-colors"
			>:
				C
				lose
			</button>
		</div>
	</div>
</div> 