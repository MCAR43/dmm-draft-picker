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
      title = 'OSRS Draft Board'
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
              onPick={(player) => handlePlayerPick(round[colIndex], player)}
            />
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>