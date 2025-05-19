<script>
  import DraftBoard from '$lib/components/DraftBoard.svelte';
  import captains from '$lib/data/captains.json';
  
  const totalPicks = 24;
  const title = "Deadman Allstars Draft";
</script>

<main>
  <div class="flex flex-col lg:flex-row gap-6 w-full max-w-full">
    <div class="w-full flex-shrink-0">
      <DraftBoard {captains} {totalPicks} {title} />
    </div>
    
    <!-- <div class="w-full lg:w-64 flex-shrink-0">
      <DonationTable />
    </div> -->
  </div>
</main>
