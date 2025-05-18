<script lang="ts">
    import DraftBoardItem from './DraftBoardItem.svelte';
    import DraftBoardHeader from './DraftBoardHeader.svelte';
  
    type Player = {
      name: string;
      src: string;
    };
  
    const { 
      captains = [], 
      totalPicks = 24,
      title = 'Deadman Allstars Draft',
      initialState = ''
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
    }
    
    // Handle submit action
    function handleSubmit() {
      const serializedData = serializeDraftBoard();
      console.log('Serialized Draft Board:', serializedData);
      alert(`Board serialized! Copy this string to save your draft:\n${serializedData}`);
      resetDraftBoard();
    }
    
    // Handle loading serialized state
    function handleLoadState() {
      if (!serializedInput.trim()) {
        alert('Please enter a serialized draft board string');
        return;
      }
      
      deserializeDraftBoard(serializedInput.trim());
    }
    
    // Initialize from initialState if provided
    $effect(() => {
      if (initialState) {
        deserializeDraftBoard(initialState);
      }
    });
</script>
  
<div class="bg-osrs-interface border-4 border-osrs-interfaceBorder rounded-lg p-6">
  <DraftBoardHeader {title} {captains} />

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
    {#if isAllDraftSlotsFilled()}
      <div class="text-center">
        <button 
          class="bg-osrs-gold hover:bg-osrs-goldHighlight text-black font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors"
          on:click={handleSubmit}
        >
          Submit Draft Board
        </button>
      </div>
    {/if}
    
    <div class="mt-2 flex flex-col sm:flex-row gap-2 justify-center items-center">
      <input
        type="text"
        bind:value={serializedInput}
        placeholder="Paste serialized draft board here"
        class="p-2 rounded border-2 border-osrs-interfaceBorder bg-osrs-interfaceLight text-black w-full sm:w-auto sm:flex-grow max-w-lg"
      />
      <button
        class="bg-osrs-blue hover:bg-osrs-blueHighlight text-white font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors w-full sm:w-auto"
        on:click={handleLoadState}
      >
        Load Draft Board
      </button>
      <button
        class="bg-osrs-red hover:bg-osrs-redHighlight text-white font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors w-full sm:w-auto"
        on:click={resetDraftBoard}
      >
        Reset
      </button>
    </div>
  </div>
</div>