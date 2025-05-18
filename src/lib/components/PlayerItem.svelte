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
    class="bg-osrs-buttonBg border-2 border-osrs-interfaceBorder rounded cursor-pointer p-2 transition-all hover:bg-osrs-buttonHover hover:scale-105" 
    on:click={handleSelect}
  >
    <div class="bg-osrs-interface p-1 border border-osrs-interfaceBorder rounded mb-2">
      <img src={player.src} alt={player.name} class="w-full h-48 w-48 object-cover rounded" />
    </div>
    <div class="text-center font-bold text-osrs-yellow drop-shadow-md">{player.name}</div>
  </div>