<script>
  const { 
    captain
  } = $props();
  
  // CSS classes from captain.color (if available)
  const colorClasses = captain.color || '';
</script>

<div class="flex flex-col items-center p-2 bg-osrs-buttonBg border-2 border-osrs-interfaceBorder rounded">
  <img 
    src={captain.profileImage || "/images/captains/captain_dino.png"} 
    alt={captain.name} 
    class="w-20 h-20 rounded-full mb-2 border-2 border-osrs-interfaceBorder object-cover"
    class:border-red-600={captain.name === 'Torvesta'}
    class:border-green-600={captain.name === 'Dino'}
    class:border-pink-600={captain.name === 'Skill Specs'}
    class:border-sky-500={captain.name === 'B0aty'}
    class:border-amber-200={captain.name === 'Oda'}
    class:border-yellow-500={captain.name === 'Solo Mission'}
  />
  <span 
    class="font-bold drop-shadow-md"
    class:text-red-600={captain.name === 'Torvesta'}
    class:text-green-600={captain.name === 'Dino'}
    class:text-pink-600={captain.name === 'Skill Specs'}
    class:text-sky-500={captain.name === 'B0aty'}
    class:text-amber-200={captain.name === 'Oda'}
    class:text-yellow-500={captain.name === 'Solo Mission'}
    class:text-osrs-yellow={!['Torvesta', 'Dino', 'Skill Specs', 'B0aty', 'Oda', 'Solo Mission'].includes(captain.name)}
  >{captain.name}</span>
  <span class="text-sm text-osrs-lightGray">{captain.team}</span>
</div>
