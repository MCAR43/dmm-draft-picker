<script lang="ts">
  import Login from './Login.svelte';
  
  const { onClose } = $props<{ onClose: () => void }>();
</script>

<div class="fixed inset-0 backdrop-blur-md z-40 flex justify-center items-center">
  <div class="relative z-50 w-full max-w-md mx-auto">
    <div class="absolute top-0 right-0 p-4">
      <button 
        on:click={onClose}
        class="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <Login onSuccess={onClose} />
  </div>
</div> 