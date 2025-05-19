<script>
  const { 
    captain
  } = $props();
  
  // CSS classes from captain.color (if available)
  const colorClasses = captain.color || '';
</script>

<div class="flex flex-col items-center p-2 bg-gray-100 border-2 border-gray-800 rounded">
  <img 
    src={captain.profileImage || "/images/captains/captain_dino.png"} 
    alt={captain.name} 
    class="w-20 h-20 rounded-full mb-2 border-2 border-gray-800 object-cover"
  />
  <span 
    class="font-bold drop-shadow-md text-gray-800"
  >{captain.name}</span>
  <span class="text-sm text-gray-600">{captain.team}</span>
</div>
