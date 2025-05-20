<script lang="ts">
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { goto, replaceState } from '$app/navigation';
    import PlayerSelector from '$lib/components/PlayerSelector.svelte';
    import StatCard from '$lib/components/StatCard.svelte';
    import PickDistributionChart from '$lib/components/PickDistributionChart.svelte';
    import TweenedNumber from '$lib/components/TweenedNumber.svelte';
    import ReadOnlyDraftBoard from '$lib/components/ReadOnlyDraftBoard.svelte';
    import captains from '$lib/data/captains.json';
    import playersData from '$lib/data/players.json';
    const { data } = $props();
    
    // Use pre-calculated stats from the server
    const stats = $derived(data.stats);
    const allPlayerStats = $derived(data.allPlayerStats);
    
    // Player list from imported data
    const allPlayers = playersData;

    const results = $derived(data.results);
    // Updated reactive state
    let selectedPlayer = $state<{name: string, src: string}>({
      name: 'Westham',
      src: '/images/players/westham.png'
    });
    let selectedPlayerStats = $derived(allPlayerStats[selectedPlayer.name]);

     // Initialize selectedPlayer from URL param only on initial page load
     onMount(() => {
        if (browser) {
            const urlPlayer = $page.url.searchParams.get('player');
            if (urlPlayer) {
                selectedPlayer = allPlayers.find(p => p.name === urlPlayer)!;
            }
        }
    });
    
    function handlePlayerSelect(player: {name: string, src: string}) {
        // Update selected player
        selectedPlayer = player;
        
        // Update URL without causing page navigation
        if (browser) {
            const url = new URL(window.location.href);
            url.searchParams.set('player', player.name);
            replaceState(url, {});
        }
    } 

    // Add algorithm types definition
    const algorithmTypes = [
        { 
          id: 'borda', 
          name: 'Borda Count', 
          description: 'Players are ranked using the Borda Count algorithm to determine a weighted ranking of their draft positions across all submitted draft boards.\nThis esssentialy creates a tier list of players.'  
        },
        { 
          id: 'modePositionFrequency', 
          name: 'Mode Position', 
          description: 'Players are ranked using a custom approach of HEAVILY weighting their draft position in boards instead of their average ranking.  This is a naive approach and does not take into account the actual rankings of the players.' }
    ];
    
    let selectedAlgorithm = $state(algorithmTypes[1]);
</script>
  
<main>
  <div class="flex flex-col gap-4 w-full max-w-full">
    <!-- Main Stats Box -->
    <div class="w-full">
      <div class="bg-white border-4 border-gray-200 rounded-lg p-6 text-gray-900">
        <h1 class="text-3xl font-bold mb-6 text-center">Draft Stats</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Submissions">
                <div class="text-5xl font-bold text-indigo-600">
                  <TweenedNumber value={stats.totalBoards} />
                </div>
                <p class="text-gray-600 mt-2">Total draft boards submitted</p>
            </StatCard>
            
            <StatCard title="Most Popular First Pick">
              <div class="text-5xl font-bold text-indigo-600 capitalize flex items-center gap-2">
                  {stats.mostPopularFirstPick.name}
                  <span class="text-4xl">👑</span>
              </div>
              <p class="text-gray-600 mt-2">
                  Chosen first in <TweenedNumber value={stats.mostPopularFirstPick.count} /> boards 
                  (<TweenedNumber value={stats.firstPickPercentage} decimals={1} />%)
              </p>
          </StatCard>
        </div>
      </div>
    </div>

    
    <!-- Player Stats Box -->
    <div class="w-full">
      <div class="bg-white border-4 border-gray-200 rounded-lg p-6 text-gray-900">
        <h2 class="text-2xl font-bold mb-6 text-center">Player Draft Stats</h2>
        
        <!-- Player Selector Component -->
        <div class="mb-8">
          <PlayerSelector 
            players={allPlayers}
            onSelect={handlePlayerSelect}
          />
        </div>
        
        <!-- Player Stats Display -->
        {#if selectedPlayer && selectedPlayerStats}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard title="Average Pick">
                <div class="text-4xl font-bold text-indigo-600">
                    {#if selectedPlayerStats.averagePickPosition > 0}
                      <TweenedNumber value={selectedPlayerStats.averagePickPosition} decimals={1} />
                    {:else}
                      N/A
                    {/if}
                </div>
                <p class="text-gray-600 mt-2">Average draft position</p>
            </StatCard>
            
            <StatCard title="Most Likely Team">
                {#if selectedPlayerStats.mostLikelyTeam.captain}
                    <div class="flex items-center mb-2">
                      <div class="relative w-14 h-14 mr-3 rounded-full overflow-hidden border-2 {selectedPlayerStats.mostLikelyTeam.captain.borderColor}">
                        <img 
                          src={selectedPlayerStats.mostLikelyTeam.captain.profileImage} 
                          alt={selectedPlayerStats.mostLikelyTeam.captain.name} 
                          class="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div class="text-2xl font-bold {selectedPlayerStats.mostLikelyTeam.captain.textColor}">
                          {selectedPlayerStats.mostLikelyTeam.captain.name}
                        </div>
                        <div class="text-lg font-medium text-gray-700">
                          {selectedPlayerStats.mostLikelyTeam.captain.team}
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-bold text-indigo-600 mb-1">
                      <TweenedNumber value={selectedPlayerStats.mostLikelyTeam.percentage} decimals={1} />%
                    </div>
                    <p class="text-gray-600 mt-1">
                      Drafted to this team <TweenedNumber value={selectedPlayerStats.mostLikelyTeam.count} /> times
                    </p>
                {:else}
                    <div class="text-4xl font-bold text-gray-400">N/A</div>
                    <p class="text-gray-600 mt-2">No data available</p>
                {/if}
            </StatCard>
          </div>
          
          <!-- Pick Distribution Chart -->
          <div class="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4 text-center">Pick Distribution</h3>
            <PickDistributionChart 
              pickPositions={selectedPlayerStats.pickPositions} 
              maxPickPosition={stats.maxPickPosition}
            />
          </div>
        {:else}
          <div class="text-center text-gray-600 py-10">
            <p>Select a player to view their draft statistics</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Borda Results Draft Board -->
    <div class="w-full">
      <div class="bg-white border-4 border-gray-200 rounded-lg p-6 text-gray-900">
        <div class="flex flex-col items-center gap-4 mb-6">
          <h2 class="text-2xl font-bold">Community Consensus Board</h2>
          <select 
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            bind:value={selectedAlgorithm}
          >
            {#each algorithmTypes as algorithm}
              <option value={algorithm}>{algorithm.name}</option>
            {/each}
          </select>
        </div>
        <p class="text-gray-600 mb-6 text-center">
          {selectedAlgorithm.description}
        </p>

        <ReadOnlyDraftBoard 
          captains={captains}
          totalPicks={24}
          title="Community Consensus Draft"
          results={results}
          playerStats={allPlayerStats}
          selectedAlgorithm={selectedAlgorithm.id}
        />
      </div>
    </div>
  </div>
</main>