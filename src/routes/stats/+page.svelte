<script lang="ts">
    import { goto } from '$app/navigation';
    import PlayerSelector from '$lib/components/PlayerSelector.svelte';
    import StatCard from '$lib/components/StatCard.svelte';
    import PickDistributionChart from '$lib/components/PickDistributionChart.svelte';
    import TweenedNumber from '$lib/components/TweenedNumber.svelte';
    import playersData from '$lib/data/players.json';
    import captainsData from '$lib/data/captains.json';
    
    const { data } = $props();
    
    // Use pre-calculated stats from the server
    const stats = $derived(data.stats);
    const playerStats = $derived(data.playerStats);
    
    // Player list from imported data
    const allPlayers = playersData;
    
    // Player selection state - track this separately from server data
    let selectedPlayer = $state<{name: string, src: string} | null>(null);
    
    // Update selectedPlayer when playerStats changes
    $effect(() => {
        if (playerStats?.playerName) {
            selectedPlayer = allPlayers.find(p => p.name === playerStats.playerName) || null;
        }
    });
    
    function handlePlayerSelect(player: {name: string, src: string}) {
        selectedPlayer = player;
        // Update URL with selected player (this will trigger a new server load)
        goto(`?player=${player.name}`, { keepFocus: true });
    }
</script>
  
<main>
  <div class="flex flex-col gap-6 w-full max-w-full">
    <!-- Main Stats Box -->
    <div class="w-full flex-shrink-0">
      <div class="bg-white border-4 border-gray-200 rounded-lg p-6 text-gray-900">
        <h1 class="text-3xl font-bold mb-6 text-center">Draft Stats</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Submissions">
                <div class="text-5xl font-bold text-indigo-600">
                  <TweenedNumber value={stats.totalBoards} />
                </div>
                <p class="text-gray-600 mt-2">Total draft boards submitted</p>
            </StatCard>
            
            <StatCard title="Popular First Pick">
                <div class="text-5xl font-bold text-indigo-600 capitalize">{stats.mostPopularFirstPick.name}</div>
                <p class="text-gray-600 mt-2">
                    Chosen first in <TweenedNumber value={stats.mostPopularFirstPick.count} /> boards 
                    (<TweenedNumber value={stats.firstPickPercentage} decimals={1} />%)
                </p>
            </StatCard>
        </div>
      </div>
    </div>
    
    <!-- Player Stats Box -->
    <div class="w-full flex-shrink-0">
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
        {#if selectedPlayer && playerStats}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard title="Average Pick">
                <div class="text-4xl font-bold text-indigo-600">
                    {#if playerStats.averagePickPosition > 0}
                      <TweenedNumber value={playerStats.averagePickPosition} decimals={1} />
                    {:else}
                      N/A
                    {/if}
                </div>
                <p class="text-gray-600 mt-2">Average draft position</p>
            </StatCard>
            
            <StatCard title="Most Likely Team">
                {#if playerStats.mostLikelyTeam.captain}
                    <div class="flex items-center mb-2">
                      <div class="relative w-14 h-14 mr-3 rounded-full overflow-hidden border-2 {playerStats.mostLikelyTeam.captain.borderColor}">
                        <img 
                          src={playerStats.mostLikelyTeam.captain.profileImage} 
                          alt={playerStats.mostLikelyTeam.captain.name} 
                          class="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div class="text-2xl font-bold {playerStats.mostLikelyTeam.captain.textColor}">
                          {playerStats.mostLikelyTeam.captain.name}
                        </div>
                        <div class="text-lg font-medium text-gray-700">
                          {playerStats.mostLikelyTeam.captain.team}
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-bold text-indigo-600 mb-1">
                      <TweenedNumber value={playerStats.mostLikelyTeam.percentage} decimals={1} />%
                    </div>
                    <p class="text-gray-600 mt-1">
                      Drafted to this team <TweenedNumber value={playerStats.mostLikelyTeam.count} /> times
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
              pickPositions={playerStats.pickPositions} 
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
  </div>
</main>