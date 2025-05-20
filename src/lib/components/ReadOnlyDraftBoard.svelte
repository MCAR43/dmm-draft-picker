<script lang="ts">
  import ReadOnlyDraftBoardItem from './ReadOnlyDraftBoardItem.svelte';
  import DraftBoardHeader from './DraftBoardHeader.svelte';
  import playersData from '$lib/data/players.json';

  type Player = {
    name: string;
    src: string;
  };
  
  type PlayerStats = {
    playerName: string;
    pickPositions: number[];
    averagePickPosition: number;
    mostLikelyTeam: {
      captain: any;
      count: number;
      percentage: number;
    };
  };

  type Results = {
    borda: any[];
    modePositionFrequency: any[];
  };

  const { 
    captains = [], 
    totalPicks = 24,
    title = 'Deadman Allstars Draft',
    results = { borda: [], modePositionFrequency: [] } as Results,
    playerStats = {} as Record<string, PlayerStats>,
    selectedAlgorithm = 'borda'
  } = $props();

  const numTeams = captains.length;
  const rounds = Math.ceil(totalPicks / numTeams);

  const selections = $state(Array(totalPicks).fill(null) as (Player | null)[]);
  const allPlayers = [...playersData];
  
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
  
  // Process results to populate selections based on selected algorithm
  $effect(() => {
    const currentResults = results[selectedAlgorithm] || [];
    
    if (currentResults && currentResults.length > 0) {
      // Sort by total points (highest first) just to be sure
      const sortedResults = [...currentResults].sort((a, b) => b.totalPoints - a.totalPoints);
      
      // Take only top totalPicks players
      const topPicks = sortedResults.slice(0, totalPicks);
      
      // Create new selections array based on rankings
      for (let i = 0; i < totalPicks; i++) {
        if (i < topPicks.length) {
          const result = topPicks[i];
          const player = allPlayers.find(p => p.name === result.playerName);
          selections[i] = player || null;
        } else {
          selections[i] = null;
        }
      }
    } else {
      // Reset selections if no results
      selections.fill(null);
    }
  });
</script>

<div class="bg-white border-4 border-gray-200 rounded-lg p-4 sm:p-6 text-gray-900">
  <DraftBoardHeader {title} {captains} showToggleInfo={false} />
  <!-- Responsive grid for draft board -->
  <div class="grid grid-cols-{numTeams} gap-4">
    {#each captains as captain, colIndex}
      <div class="flex flex-col gap-4">
        {#each draftMatrix as round}
          {#if round[colIndex] !== null}
            {@const currentSelection = selections[round[colIndex] - 1]}
            <ReadOnlyDraftBoardItem
              pickNumber={round[colIndex]}
              captain={captain}
              selection={currentSelection}
              playerStats={currentSelection ? playerStats[currentSelection.name] : null}
            />
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>
