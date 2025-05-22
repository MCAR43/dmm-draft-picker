<script lang="ts">
  import { onMount } from 'svelte';
  import { getDraftStats } from '$lib/services/draftService';
  import MiniDraftBoard from '$lib/components/MiniDraftBoard.svelte';
  import type { DraftBoard } from '$lib/services/draftService';
  import { fly } from 'svelte/transition';
  
  // The final correct draft result
  const correctDraft = [
    "westham",
    "dubiedobies",
    "portKhazard",
    "ditterbitter",
    "rhys",
    "purpp",
    "mika",
    "eliop14",
    "purespam",
    "lake",
    "alfie",
    "skiddler",
    "pip",
    "cEngineer",
    "vTheVictim",
    "evscape",
    "muts",
    "sickNerd",
    "coxie",
    "mmorpg",
    "verf",
    "raikesy",
    "sparcMac",
    "mrMammal"
  ];
  
  // Stats
  let allBoards = $state<DraftBoard[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let currentRound = $state(1);
  let eliminatedBoardIds = $state<Set<string>>(new Set());
  let remainingBoards = $state(0);
  let totalBoards = $state(0);
  let remainingBoardsList = $state<DraftBoard[]>([]);
  let funnyMessage = $state('');
  
  // Funny messages for when no boards remain
  const noBoardsMessages = [
    "Dying on my DDM Draft Locked Hardcore Ironman... completed",
    "All boards have been wiped! Time to rebuild from scratch!",
    "All boards have been sent to Lumbridge! Better luck next time!",
    "Sit down you zoggy"
  ];
  
  // Fetch all boards
  async function fetchBoards() {
    loading = true;
    error = null;
    
    try {
      const { data, error: fetchError } = await getDraftStats('7b20c7d5-0946-446b-a0df-6f11a4f7a71d');
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (data) {
        allBoards = data.map(board => ({
          ...board,
          // Convert selections to array of strings if not already
          selections: Array.isArray(board.selections) 
            ? board.selections
            : []
        }));
        
        totalBoards = allBoards.length;
        remainingBoards = totalBoards;
        processEliminations(1);
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred while fetching boards';
    } finally {
      loading = false;
    }
  }
  
  // Process eliminations for a specific round
  function processEliminations(round: number) {
    if (round < 1 || round > correctDraft.length) return;
    
    currentRound = round;
    eliminatedBoardIds = new Set(eliminatedBoardIds);
    
    // Check each board against the correct draft for this round
    for (const board of allBoards) {
      // Skip already eliminated boards
      if (eliminatedBoardIds.has(board.id || '')) continue;
      
      // Check if the board's selection for this round matches the correct draft
      const boardSelection = board.selections?.[round - 1];
      if (boardSelection !== correctDraft[round - 1]) {
        eliminatedBoardIds.add(board.id || '');
      }
    }
    
    remainingBoards = totalBoards - eliminatedBoardIds.size;
    remainingBoardsList = allBoards.filter(board => !eliminatedBoardIds.has(board.id || ''));
    funnyMessage = noBoardsMessages[Math.floor(Math.random() * noBoardsMessages.length)];
  }
  
  // Change round
  function goToRound(round: number) {
    // Reset eliminations
    eliminatedBoardIds = new Set();
    
    // Process eliminations up to the selected round
    for (let i = 1; i <= round; i++) {
      processEliminations(i);
    }
  }
  
  onMount(() => {
    fetchBoards();
  });
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Draft Results - Elimination Rounds</h1>
  
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Error: {error}</p>
      <button class="mt-2 bg-red-200 px-2 py-1 rounded" on:click={fetchBoards}>
        Try Again
      </button>
    </div>
  {:else}
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-semibold">Round {currentRound}: {correctDraft[currentRound - 1]}</h2>
          <p class="text-sm text-gray-600">
            Remaining boards: <span class="font-medium">{remainingBoards}</span> of {totalBoards}
            ({Math.round((remainingBoards / totalBoards) * 100)}%)
          </p>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded disabled:opacity-50" 
            disabled={currentRound <= 1}
            on:click={() => goToRound(currentRound - 1)}
          >
            Previous
          </button>
          
          <select 
            class="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={currentRound}
            on:change={(e) => goToRound(parseInt(e.currentTarget.value))}
          >
            {#each Array(Math.min(correctDraft.length, 24)) as _, i}
              <option value={i + 1}>Round {i + 1}: {correctDraft[i]}</option>
            {/each}
          </select>
          
          <button 
            class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded disabled:opacity-50" 
            disabled={currentRound >= correctDraft.length}
            on:click={() => goToRound(currentRound + 1)}
          >
            Next
          </button>
        </div>
      </div>
      
      <div class="flex items-center space-x-4 text-sm">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-100 border border-green-300 mr-1"></div>
          <span>Correct pick</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-red-100 border border-red-300 mr-1"></div>
          <span>Incorrect pick</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 border border-gray-300 ring-2 ring-blue-500 mr-1"></div>
          <span>Current round</span>
        </div>
      </div>
    </div>
    
    {#if remainingBoards === 0}
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center" transition:fly={{ y: 20, duration: 500 }}>
        <h3 class="text-xl font-bold text-yellow-800 mb-2">No Boards Remaining!</h3>
        <p class="text-yellow-700">{funnyMessage}</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
        {#each remainingBoardsList as board, i (board.id)}
          <div transition:fly={{ y: -20, duration: 300, delay: i * 20 }}>
            <MiniDraftBoard
              {board}
              {correctDraft}
              {currentRound}
            />
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div> 