<script lang="ts">
    import { onMount } from 'svelte';
    
    type Player = {
        name: string;
        src: string;
    };
    
    const { 
        players,
        onSelect
    } = $props<{
        players: Player[];
        onSelect: (player: Player) => void;
    }>();
    
    let selectedPlayer = $state<Player | null>(null);
    let isDropdownOpen = $state(false);
    
    function selectPlayer(player: Player) {
        selectedPlayer = player;
        isDropdownOpen = false;
        onSelect(player);
    }
    
    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }
    
    // Close dropdown when clicking outside
    onMount(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('player-dropdown');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                isDropdownOpen = false;
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div class="relative w-full max-w-md mx-auto" id="player-dropdown">
  <button 
    class="flex items-center justify-between w-full px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-lg font-medium text-gray-800 hover:bg-gray-200 transition-colors"
    on:click|stopPropagation={toggleDropdown}
  >
    {#if selectedPlayer}
      <div class="flex items-center">
        <img 
          src={selectedPlayer.src} 
          alt={selectedPlayer.name} 
          class="w-8 h-8 mr-3 rounded object-cover border border-gray-300"
        />
        <span class="capitalize">{selectedPlayer.name}</span>
      </div>
    {:else}
      <span>Select a player</span>
    {/if}
    
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
    </svg>
  </button>
  
  {#if isDropdownOpen}
    <div class="absolute z-10 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {#each players as player}
        <button 
          class="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition-colors text-left"
          on:click={() => selectPlayer(player)}
        >
          <img 
            src={player.src} 
            alt={player.name} 
            class="w-8 h-8 mr-3 rounded object-cover border border-gray-300"
          />
          <span class="capitalize">{player.name}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>