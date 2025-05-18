<script lang="ts">
    import PlayerItem from './PlayerItem.svelte';
    import { onMount } from 'svelte';
    
    const { 
      availablePlayers = [],
      onSelectPlayer,
      onClose
    } = $props();
    
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
        <h2 class="text-2xl font-bold mb-6 text-osrs-yellow text-center drop-shadow-md">Select a Player</h2>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
            {#each availablePlayers as player}
                <PlayerItem {player} onSelect={onSelectPlayer} />
            {/each}
        </div>
        
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