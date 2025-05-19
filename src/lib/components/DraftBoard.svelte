<script lang="ts">
    import DraftBoardItem from './DraftBoardItem.svelte';
    import DraftBoardHeader from './DraftBoardHeader.svelte';
    import InfoModal from './InfoModal.svelte';
    import { saveDraftBoard, updateDraftBoard, getDraftBoard, getDraftBoardByUser } from '$lib/services/draftService';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user } from '$lib/stores/authStore';
    import { get } from 'svelte/store';
  
    type Player = {
      name: string;
      src: string;
    };
  
    const { 
      captains = [], 
      totalPicks = 24,
      title = 'Deadman Allstars Draft',
      boardId = ''
    } = $props();
  
    const numTeams = captains.length;
    const rounds = Math.ceil(totalPicks / numTeams);
  
    const selections = $state(Array(totalPicks).fill(null));
    const availablePlayers = $state<Player[]>([
      { name: "alfie", src: "/images/players/alfie.png" },
      { name: "cEngineer", src: "/images/players/c_engineer.png" },
      { name: "coxie", src: "/images/players/coxie.png" },
      { name: "ditterbitter", src: "/images/players/ditterbitter.png" },
      { name: "dubiedobies", src: "/images/players/dubiedobies.png" },
      { name: "eliop14", src: "/images/players/eliop14.png" },
      { name: "evscape", src: "/images/players/evscape.png" },
      { name: "lake", src: "/images/players/lake.png" },
      { name: "mika", src: "/images/players/mika.png" },
      { name: "mmorpg", src: "/images/players/mmorpg.png" },
      { name: "mrMammal", src: "/images/players/mr_mammal.png" },
      { name: "muts", src: "/images/players/muts.png" },
      { name: "pip", src: "/images/players/pip.png" },
      { name: "portKhazard", src: "/images/players/port_khazard.png" },
      { name: "purespam", src: "/images/players/purespam.png" },
      { name: "purpp", src: "/images/players/purpp.png" },
      { name: "raikesy", src: "/images/players/raikesy.png" },
      { name: "rhys", src: "/images/players/rhys.png" },
      { name: "sickNerd", src: "/images/players/sick_nerd.png" },
      { name: "skiddler", src: "/images/players/skiddler.png" },
      { name: "sparcMac", src: "/images/players/sparc_mac.png" },
      { name: "vTheVictim", src: "/images/players/v_the_victim.png" },
      { name: "verf", src: "/images/players/verf.png" },
      { name: "westham", src: "/images/players/westham.png" }
    ]);
    
    const allOriginalPlayers = [...availablePlayers];
    let serializedInput = $state('');
    let saveError = $state('');
    let saveSuccess = $state('');
    let isSaving = $state(false);
    let exportedData = $state('');
    let showExportedData = $state(false);
    let copySuccess = $state(false);
    let isInfoModalOpen = $state(false);
  
    // Create a matrix to represent the snake draft order
    const draftMatrix: number[][] = [];
  
    let pickNumber = 1;
    for (let round = 0; round < rounds; round++) {
      const row = Array(numTeams);
  
      for (let teamIndex = 0; teamIndex < numTeams; teamIndex++) {
        const col = round % 2 === 0 ? teamIndex : numTeams - 1 - teamIndex;
        row[col] = pickNumber <= totalPicks ? pickNumber++ : null;
      }
  
      draftMatrix.push(row);
    }
    
    function handlePlayerPick(pickNumber: number, player: Player | null) {
      const currentSelection = selections[pickNumber - 1];
      
      // If there's a current selection, add it back to the player pool
      if (currentSelection) {
        availablePlayers.push(currentSelection);
      }
      
      // Update selection with new player (or null for deselection)
      selections[pickNumber - 1] = player;
      
      // Remove the newly selected player from available players
      if (player) {
        const indexToRemove = availablePlayers.findIndex(p => p.name === player.name);
        if (indexToRemove > -1) {
          availablePlayers.splice(indexToRemove, 1);
        }
      }
    }
    
    // Check if all draft slots are filled with players
    function isAllDraftSlotsFilled() {
      return selections.every(selection => selection !== null);
    }
    
    // Serialize the draft board to base64
    function serializeDraftBoard() {
      // Only serialize the picks, not captains or title
      const picksToSerialize = selections.map(player => player?.name || null);
      const jsonString = JSON.stringify(picksToSerialize);
      return btoa(jsonString);
    }
    
    // Deserialize from base64
    function deserializeDraftBoard(base64String: string) {
      try {
        const jsonString = atob(base64String);
        const picksData = JSON.parse(jsonString);
        
        // Reset available players
        availablePlayers.length = 0;
        availablePlayers.push(...allOriginalPlayers);
        
        // Update selections
        if (Array.isArray(picksData)) {
          for (let i = 0; i < picksData.length && i < selections.length; i++) {
            const playerName = picksData[i];
            if (playerName) {
              const player = availablePlayers.find(p => p.name === playerName);
              if (player) {
                selections[i] = player;
                const playerIndex = availablePlayers.findIndex(p => p.name === playerName);
                if (playerIndex > -1) {
                  availablePlayers.splice(playerIndex, 1);
                }
              }
            } else {
              selections[i] = null;
            }
          }
        }
        
        // Clear input after successful load
        serializedInput = '';
      } catch (error) {
        console.error('Error deserializing draft board:', error);
        alert('Invalid serialized data. Please check and try again.');
      }
    }
    
    // Reset the draft board to its initial state
    function resetDraftBoard() {
      selections.fill(null);
      availablePlayers.length = 0;
      availablePlayers.push(...allOriginalPlayers);
      saveError = '';
      saveSuccess = '';
      showExportedData = false;
      exportedData = '';
    }

        // Handle saving to Supabase
    async function handleSave() {
      isSaving = true;
      saveError = '';
      saveSuccess = '';
      
      try {
        const picksData = selections.map(player => player?.name || null);
        const currentUser = get(user);
        const isLoggedIn = !!currentUser;
        
        const draftBoardData = {
          title: title,
          captains: captains,
          selections: picksData,
          user_id: currentUser?.id
        };
        
        // Always use saveDraftBoard - it will handle creating or updating
        const { error } = await saveDraftBoard(draftBoardData);
        
        if (error) {
          saveError = error.message;
        } else {
          saveSuccess = isLoggedIn 
            ? 'Board saved successfully! Your submission will count for the competition.' 
            : 'Anonymous board saved. Submission will not count for the competition.';
          
          // If it's a new save, redirect after a delay
          if (!boardId) {
            setTimeout(() => {
              goto('/');
            }, 1500);
          }
        }
      } catch (err) {
        console.error('Error saving draft board:', err);
        saveError = 'An error occurred while saving the draft board';
      } finally {
        isSaving = false;
      }
    }
    
    // Handle exporting the board
    function handleExport() {
      exportedData = serializeDraftBoard();
      showExportedData = true;
      copySuccess = false;
    }
    
    // Copy serialized data to clipboard
    async function copyToClipboard() {
      try {
        await navigator.clipboard.writeText(exportedData);
        copySuccess = true;
        setTimeout(() => {
          copySuccess = false;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
    
    // Handle loading serialized state
    function handleLoadState() {
      if (!serializedInput.trim()) {
        alert('Please enter a serialized draft board string');
        return;
      }
      
      deserializeDraftBoard(serializedInput.trim());
    }
    
    function toggleInfoModal() {
      isInfoModalOpen = !isInfoModalOpen;
    }
</script>
  
<div class="bg-white border-4 border-gray-200 rounded-lg p-6 text-gray-900">
  <DraftBoardHeader {title} {captains} onToggleInfo={toggleInfoModal} />

  <div class="grid grid-cols-{numTeams} gap-4">
    {#each captains as captain, colIndex}
      <div class="flex flex-col gap-4">
        {#each draftMatrix as round}
          {#if round[colIndex] !== null}
            <DraftBoardItem
              pickNumber={round[colIndex]}
              captain={captain}
              selection={selections[round[colIndex] - 1]}
              {availablePlayers}
              onPick={(player: Player | null) => handlePlayerPick(round[colIndex], player)}
            />
          {/if}
        {/each}
      </div>
    {/each}
  </div>
  
  <div class="mt-6 flex flex-col gap-4">
    {#if saveError}
      <div class="bg-red-900 text-white p-3 rounded">
        {saveError}
      </div>
    {/if}
    
    {#if saveSuccess}
      <div class="bg-gray-800 text-white p-3 rounded">
        {saveSuccess}
      </div>
    {/if}
    
    <div class="text-center mb-2">
      {#if !isAllDraftSlotsFilled()}
        <p class="text-red-900 font-medium">You must fill all draft positions before saving</p>
      {:else}
        <p class="text-gray-800 font-medium">Your board is complete and ready to save!</p>
      {/if}
    </div>
    
    <div class="text-center flex flex-wrap justify-center gap-3">
      <button 
        class="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-2 px-4 rounded border-2 border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        on:click={handleSave}
        disabled={isSaving || !isAllDraftSlotsFilled()}
        title={!isAllDraftSlotsFilled() ? 'Fill out the entire board to save' : ''}
      >
        {isSaving ? 'Saving...' : boardId ? 'Update Board' : 'Save Board'}
      </button>
      
      <button
        class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border-2 border-gray-200 transition-colors"
        on:click={resetDraftBoard}
      >
        Reset
      </button>
      
      {#if isAllDraftSlotsFilled()}
        <button 
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border-2 border-gray-200 transition-colors"
          on:click={handleExport}
        >
          Export Board
        </button>
      {/if}
    </div>
    
    {#if showExportedData}
      <div class="mt-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-bold text-gray-900">Exported Board Data</h3>
          <button 
            class="text-gray-400 hover:text-gray-500"
            on:click={() => showExportedData = false}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="relative">
          <textarea 
            class="w-full h-20 p-2 bg-white border border-gray-200 rounded text-sm font-mono" 
            readonly
            value={exportedData}
          ></textarea>
          <button 
            class="absolute right-2 bottom-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold py-1 px-2 rounded border border-gray-200 transition-colors"
            on:click={copyToClipboard}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p class="text-sm mt-2 text-gray-600">Use this code to share your board or load it later.</p>
      </div>
    {/if}
    
    <div class="mt-2 flex flex-col sm:flex-row gap-2 justify-center items-center">
      <input
        type="text"
        bind:value={serializedInput}
        placeholder="Paste serialized draft board here"
        class="p-2 rounded border-2 border-gray-200 bg-gray-50 text-gray-900 w-full sm:w-auto sm:flex-grow max-w-lg"
      />
      <button
        class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border-2 border-gray-200 transition-colors w-full sm:w-auto"
        on:click={handleLoadState}
      >
        Load Draft Board
      </button>
    </div>
  </div>

  {#if isInfoModalOpen}
    <InfoModal onClose={toggleInfoModal} />
  {/if}
</div>