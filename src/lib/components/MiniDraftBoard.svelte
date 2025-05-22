<script lang="ts">
  import playersData from '$lib/data/players.json';
  import type { DraftBoard } from '$lib/services/draftService';
  
  const { 
    board,
    correctDraft,
    currentRound
  } = $props<{
    board: DraftBoard,
    correctDraft: string[],
    currentRound: number
  }>();

  // Get the player objects from the player names in selections
  const getPlayerByName = (name: string | null) => {
    if (!name) return null;
    return playersData.find(p => p.name === name) || null;
  };
</script>

<div 
  class="border rounded shadow-sm overflow-hidden border-gray-200"
>
  <div class="p-1 bg-gray-100 border-b text-xs truncate" title={board.title}>
    {board.title || 'Unnamed Board'}
  </div>
  <div class="p-1">
    <div class="grid grid-cols-6 gap-0.5">
      {#each (board.selections || []).slice(0, 24) as selection, i}
        {@const isCorrect = selection === correctDraft[i]}
        {@const isCurrentRound = i + 1 === currentRound}
        
        <div 
          class="w-full aspect-square flex items-center justify-center text-[8px] relative border"
          class:bg-green-100={isCorrect}
          class:bg-red-100={!isCorrect}
          class:ring-2={isCurrentRound}
          class:ring-blue-500={isCurrentRound}
          class:bg-blue-50={isCurrentRound}
          title={`Round ${i + 1}: ${selection || 'Empty'}`}
        >
          {#if selection}
            {@const player = getPlayerByName(selection)}
            {#if player?.src}
              <img src={player.src} alt={selection} class="w-full h-full object-cover" />
            {:else}
              {selection.substring(0, 3)}
            {/if}
          {:else}
            -
          {/if}
          {#if isCurrentRound}
            <div class="absolute -top-1 -right-1 bg-blue-500 text-white text-[6px] px-1 rounded-full">
              {i + 1}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>