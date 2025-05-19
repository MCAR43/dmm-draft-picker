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
	class="fixed inset-0 backdrop-blur-md bg-gray-50/75 flex justify-center items-center z-50"
	on:click={handleOutsideClick}
	on:mousedown|stopPropagation
	on:mouseup|stopPropagation
	on:mousemove|stopPropagation
>
	<div
		class="bg-white border-4 border-gray-800 rounded-lg p-6 w-4/5 max-h-[80vh] overflow-y-auto shadow-xl"
	>
		<h2 class="text-2xl font-bold mb-6 text-gray-800 text-center drop-shadow-md">FAQ</h2>
		<p class="text-gray-900 text-xl">
			This project is a fun initiative aimed at gathering opinions on the best players and analyzing
			draft statistics for the Deadman Allstars event. Rest assured, no personal data is collected,
			no advertisements are displayed, and all images are credited to their respective creators.
			This project will be removed once the draft concludes.
		</p>
		<p class="text-gray-900 mt-4 text-xl">
			Special thanks to Jagex, <a
				href="https://www.youtube.com/@SoloMission"
				class="text-gray-800 underline hover:text-gray-600"
				target="_blank"
				rel="noopener noreferrer">SoloMission</a
			>, and everyone involved for creating my favorite event in any video game.
		</p>
		<p class="text-gray-900 mt-4 text-xl">
			You can play and try Old School RuneScape here: <a
				href="https://oldschool.runescape.com/"
				class="text-gray-800 underline hover:text-gray-600"
				target="_blank"
				rel="noopener noreferrer">oldschool.runescape.com</a
			>
		</p>
		<p class="text-gray-900 mt-4 text-xl">
			For any inquiries, feel free to contact me at hello@gimpsu.dev or in-game: Gimpsu.
		</p>
		<div class="mt-6 flex justify-center">
			<button
				on:click={onClose}
				class="bg-gray-100 text-gray-800 border-2 border-gray-800 px-6 py-2 rounded font-bold hover:bg-gray-200 transition-colors"
			>
				Close
			</button>
		</div>
	</div>
</div>
