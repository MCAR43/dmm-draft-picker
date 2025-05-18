<script>
	import CaptainHeader from "./CaptainHeader.svelte";

    const { 
      title = 'OSRS Draft Board',
      captains = [] 
    } = $props();
  </script>
  
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-osrs-yellow text-center mb-6 drop-shadow-md">{title}</h2>
    
    <div class="grid grid-cols-6 gap-4">
      {#each captains as captain}
        <CaptainHeader captain={captain} />
      {/each}
    </div>
  </div>