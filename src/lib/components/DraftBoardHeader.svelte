<script>
	import CaptainHeader from "./CaptainHeader.svelte";

    const { 
      title = 'OSRS Draft Board',
      captains = [],
      onToggleInfo = () => {},
      showToggleInfo = true
    }
     = $props();
  </script>
  
  <div class="mb-6">

    {#if showToggleInfo}
      <div class="flex items-center justify-center gap-2 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 text-center drop-shadow-md">{title}</h2>
        <button 
          class="bg-indigo-100 text-indigo-600 border-2 border-indigo-700 rounded px-3 py-1 flex items-center justify-center font-bold hover:bg-indigo-200 transition-colors shadow-sm hover:shadow-md"
          on:click={onToggleInfo}
          aria-label="About the competition"
        >
          Click Me
        </button>
      </div>
    {/if}
    
    <div class="grid grid-cols-6 gap-4">
      {#each captains as captain}
        <CaptainHeader captain={captain} />
      {/each}
    </div>
  </div>