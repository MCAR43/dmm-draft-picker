<script lang="ts">
  type Player = {
    name: string;
    src: string;
  };

  type PickStats = {
    count: number;
    percentage: number;
  };

  const { 
    pickNumber = 0, 
    captain = {} as any,
    selection = null as Player | null,
    stats = null as PickStats | null
  } = $props();
</script>

<div 
  class="rounded-lg p-4 flex flex-col shadow-md {captain.bgColor || 'bg-gray-100'}"
>
  <div class="flex items-center gap-3 mb-3">
    {#if captain.profileImage}
      <img 
        src={captain.profileImage} 
        alt={captain.name} 
        class="w-10 h-10 rounded-full object-cover border-2 {captain.borderColor || 'border-gray-300'}"
      />
    {/if}
    
    <div>
      <div class="text-xs font-semibold text-gray-500">Pick #{pickNumber}</div>
      <div class={`text-sm font-bold ${captain.textColor || 'text-gray-700'}`}>
        {captain.name}
      </div>
      {#if captain.team}
        <div class="text-xs text-gray-500">{captain.team}</div>
      {/if}
    </div>
  </div>
  
  <div class="w-full border-t {captain.borderColor || 'border-gray-200'} mb-3 opacity-50"></div>
  
  {#if selection}
    <div class="flex flex-col items-center">
      <div class="w-20 h-20 mb-2 bg-white rounded-md overflow-hidden border-2 {captain.borderColor || 'border-gray-300'} shadow-sm">
        {#if selection.src}
          <img src={selection.src} alt={selection.name} class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        {/if}
      </div>
      <div class="text-center font-medium {captain.textColor || 'text-gray-700'}">{selection.name}</div>
      
      {#if stats}
        <div class="mt-2 text-center">
          <div class="text-xs text-gray-600">Pick count: <span class="font-semibold">{stats.count}</span></div>
          <div class="text-xs text-gray-600">Pick %: <span class="font-semibold">{stats.percentage}%</span></div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex flex-col items-center">
      <div class="w-20 h-20 mb-2 bg-white/50 rounded-md flex items-center justify-center border-2 border-dashed {captain.borderColor || 'border-gray-300'}">
        <span class={`text-2xl ${captain.textColor || 'text-gray-500'}`}>?</span>
      </div>
      <div class="text-center text-sm text-gray-600">No selection</div>
    </div>
  {/if}
</div>
