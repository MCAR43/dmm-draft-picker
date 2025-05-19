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

<div class="fixed inset-0 backdrop-blur-md bg-osrs-interface/30 flex justify-center items-center z-50" 
     on:click={handleOutsideClick}
     on:mousedown|stopPropagation
     on:mouseup|stopPropagation
     on:mousemove|stopPropagation>
    <div class="bg-osrs-interface border-4 border-osrs-interfaceBorder rounded-lg p-6 w-4/5 max-h-[80vh] overflow-y-auto shadow-xl">
        <h2 class="text-2xl font-bold mb-6 text-osrs-yellow text-center drop-shadow-md">FAQ</h2>
        <p class="text-black">
          This project is a fun initiative aimed at gathering opinions on the best players and analyzing draft statistics for the Deadman Allstars event. Rest assured, no personal data is collected, no advertisements are displayed, and all images are credited to their respective creators. This project will be removed once the draft concludes.
        </p>
        <p class="text-black mt-4">
          Special thanks to Jagex, SoloMission, and everyone involved for creating my favorite event in any video game.
        </p>
        <p class="text-black mt-4">
          For any inquiries, feel free to contact me at hello@gimpsu.dev or in-game: Gimpsu.
        </p>
        <div class="mt-6 flex justify-center">
            <button 
                on:click={onClose} 
                class="bg-osrs-buttonBg text-osrs-yellow border-2 border-osrs-interfaceBorder px-6 py-2 rounded font-bold hover:bg-osrs-buttonHover transition-colors"
            >
                Close
            </button>
        </div>
    </div>
</div> 