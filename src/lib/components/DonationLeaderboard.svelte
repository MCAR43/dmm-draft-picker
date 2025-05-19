<script lang="ts">
  import donationData from '$lib/data/donations.json';

  // Sort donations by amount in descending order
  $: sortedDonations = [...donationData].sort((a, b) => b.amount - a.amount);
  
  // Format the date to display in a more readable format
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }
  
  // Format the amount to display with 'm' suffix
  function formatCurrency(amount: number): string {
    return `${amount}m`;
  }
</script>

<div class="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border-2 border-indigo-700">
  <div class="bg-indigo-700 text-white py-3 px-4">
    <h2 class="text-xl font-bold">Donation Leaderboard</h2>
  </div>
  
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-indigo-100 text-indigo-800">
        <tr>
          <th class="py-2 px-4 text-left font-semibold">Rank</th>
          <th class="py-2 px-4 text-left font-semibold">Username</th>
          <th class="py-2 px-4 text-left font-semibold">Amount</th>
          <th class="py-2 px-4 text-left font-semibold">Date</th>
        </tr>
      </thead>
      <tbody>
        {#each sortedDonations as donation, index}
          <tr class={index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}>
            <td class="py-3 px-4 border-t border-gray-200">
              <div class="flex items-center">
                <span class="font-medium">{index + 1}</span>
                {#if index < 3}
                  <span class="ml-1">
                    {#if index === 0}
                      <span class="text-yellow-500">🏆</span>
                    {:else if index === 1}
                      <span class="text-gray-400">🥈</span>
                    {:else}
                      <span class="text-amber-600">🥉</span>
                    {/if}
                  </span>
                {/if}
              </div>
            </td>
            <td class="py-3 px-4 border-t border-gray-200 font-medium">{donation.username}</td>
            <td class="py-3 px-4 border-t border-gray-200 font-semibold text-green-600">{formatCurrency(donation.amount)}</td>
            <td class="py-3 px-4 border-t border-gray-200 text-gray-600">{formatDate(donation.date)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div> 