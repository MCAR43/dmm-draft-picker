<script lang="ts">
  import donationsData from '$lib/data/donations.json';
  
  // Sort donations by amount in descending order
  const sortedDonations = [...donationsData].sort((a, b) => b.amount - a.amount);
  
  // Calculate total donations
  const totalDonations = sortedDonations.reduce((sum, donation) => sum + donation.amount, 0);
  
  // Function to get medal for index
  function getMedal(index: number) {
    if (index === 0) return { emoji: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (index === 1) return { emoji: '🥈', color: 'text-gray-400', bg: 'bg-gray-50' };
    if (index === 2) return { emoji: '🥉', color: 'text-amber-700', bg: 'bg-amber-50' };
    return { emoji: '', color: '', bg: '' };
  }
</script>

<div class="bg-white rounded-lg shadow-md p-4 border-2 border-indigo-200">
  <h2 class="text-xl font-bold text-indigo-700 mb-1 text-center">Top Donors</h2>
  <p class="text-center text-indigo-500 text-sm mb-4">Total: {totalDonations}M</p>
  
  <div class="overflow-auto max-h-[500px]">
    <table class="w-full">
      <thead class="bg-indigo-100 text-indigo-700">
        <tr>
          <th class="py-2 px-4 text-left rounded-tl-md">Rank</th>
          <th class="py-2 px-4 text-left">Username</th>
          <th class="py-2 px-4 text-right rounded-tr-md">Amount</th>
        </tr>
      </thead>
      <tbody>
        {#each sortedDonations as donation, i}
          {@const medal = getMedal(i)}
          <tr class="border-b border-gray-200 hover:bg-indigo-50 {medal.bg} transition-colors duration-300 ease-in-out">
            <td class="py-2 px-4 font-bold text-lg {medal.color}">{medal.emoji}</td>
            <td class="py-2 px-4 font-medium">{donation.username}</td>
            <td class="py-2 px-4 text-right font-semibold">{donation.amount}M</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  tr:nth-child(1) {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.1);
    }
    70% {
      box-shadow: 0 0 0 4px rgba(251, 191, 36, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
    }
  }
</style> 