<script>
  import DraftBoard from '$lib/components/DraftBoard.svelte';
  import FAQModal from '$lib/components/FAQModal.svelte';
  
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

  let isFAQModalOpen = $state(false);

  function toggleFAQModal() {
    isFAQModalOpen = !isFAQModalOpen;
  }
</script>

<main>
  <div class="absolute top-4 left-4">
    <button 
      class="bg-osrs-buttonBg text-osrs-yellow border-2 border-osrs-interfaceBorder px-4 py-2 rounded-full font-bold hover:bg-osrs-buttonHover transition-colors"
      on:click={toggleFAQModal}
    >
      ?
    </button>
  </div>

  <div class="mb-6 text-center">
    <h1 class="text-3xl font-bold text-black">Draft Picker</h1>
    <p class="text-black mt-2">Create, save, and share your draft board.</p>
  </div>
  
  <div>
    <DraftBoard {captains} {totalPicks} {title} />
  </div>

  {#if isFAQModalOpen}
    <FAQModal onClose={toggleFAQModal} />
  {/if}
</main>
