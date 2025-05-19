<script>
  import DraftBoard from '$lib/components/DraftBoard.svelte';
  
  // Format captains as objects with required properties
  const captains = [
    { 
      name: "Dino", 
      team: "Nuggets", 
      profileImage: "/images/captains/captain_dino.png", 
      textColor: "text-green-600",
      borderColor: "border-green-600",
      bgColor: "bg-green-100"
    },
    { 
      name: "Skill Specs", 
      team: "Smorcs", 
      profileImage: "/images/captains/captain_skilly.png", 
      textColor: "text-pink-600",
      borderColor: "border-pink-600",
      bgColor: "bg-pink-100"
    },
    { 
      name: "B0aty", 
      team: "Brawlers", 
      profileImage: "/images/captains/captain_boaty.png", 
      textColor: "text-sky-500",
      borderColor: "border-sky-500",
      bgColor: "bg-sky-100"
    },
    { 
      name: "Odablock", 
      team: "Warriors", 
      profileImage: "/images/captains/captain_oda.png", 
      textColor: "text-amber-200",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50"
    },
    { 
      name: "Solo Mission", 
      team: "Snakes", 
      profileImage: "/images/captains/captain_solo.png", 
      textColor: "text-yellow-500",
      borderColor: "border-yellow-500",
      bgColor: "bg-yellow-100"
    },
    { 
      name: "Torvesta", 
      team: "Titans", 
      profileImage: "/images/captains/captain_torvesta.png", 
      textColor: "text-red-600",
      borderColor: "border-red-600",
      bgColor: "bg-red-100"
    },
  ];
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
