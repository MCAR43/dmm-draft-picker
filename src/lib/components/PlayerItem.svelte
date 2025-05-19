<script lang="ts">
    const { 
      player,
      onSelect
    } = $props();

    function handleSelect() {
      onSelect(player);
    }
  </script>
  
  <div 
    class="bg-gray-100 border-2 border-gray-200 rounded cursor-pointer p-2 transition-all hover:bg-gray-200 hover:scale-105" 
    on:click={handleSelect}
  >
    <div class="bg-white p-1 border border-gray-200 rounded mb-2">
      <img src={player.src} alt={player.name} class="w-full h-48 w-48 object-cover rounded" />
    </div>
    <div class="text-center font-bold text-gray-800 drop-shadow-md">{player.name}</div>
  </div>