<script lang="ts">
  import ReadOnlyDraftBoardItem from './ReadOnlyDraftBoardItem.svelte';
  import DraftBoardHeader from './DraftBoardHeader.svelte';
  import playersData from '$lib/data/players.json';

  type Player = {
    name: string;
    src: string;
  };
  
  type PickStats = {
    count: number;
    percentage: number;
  };

  type BordaCountResult = {
    playerName: string;
    totalPoints: number;
    averagePoints: number;
    boardsAppearing: number;
  };

  const { 
    captains = [], 
    totalPicks = 24,
    title = 'Deadman Allstars Draft',
    bordaResults = [],
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
  
  // Process Borda results to populate selections
  $effect(() => {
    if (bordaResults && bordaResults.length > 0) {
      // Sort by total points (highest first) just to be sure
      const sortedResults = [...bordaResults].sort((a, b) => b.totalPoints - a.totalPoints);
      
      // Take only top totalPicks players
      const topPicks = sortedResults.slice(0, totalPicks);
      
      // Create new selections array based on Borda count rankings
      for (let i = 0; i < totalPicks; i++) {
        if (i < topPicks.length) {
          const bordaResult = topPicks[i];
          const player = allPlayers.find(p => p.name === bordaResult.playerName);
          selections[i] = player || null;
        } else {
          selections[i] = null;
        }
      }
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
            <ReadOnlyDraftBoardItem
              pickNumber={round[colIndex]}
              captain={captain}
              selection={selections[round[colIndex] - 1]}
              stats={null}
            />
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>
