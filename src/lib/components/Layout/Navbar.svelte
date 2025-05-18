<script lang="ts">
  import { user, signOut } from '$lib/stores/authStore';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let isLoggingOut = $state(false);
  
  async function handleSignOut() {
    isLoggingOut = true;
    try {
      await signOut();
      goto('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      isLoggingOut = false;
    }
  }
</script>

<nav class="bg-osrs-interface border-b-4 border-osrs-interfaceBorder p-4 text-black">
  <div class="container mx-auto flex flex-wrap justify-between items-center">
    <a href="/" class="text-2xl font-bold text-osrs-gold">Draft Picker</a>
    
    <div class="flex items-center space-x-4">
      {#if $user}
        <a 
          href="/create" 
          class="text-black hover:text-osrs-gold transition-colors"
        >
          New Draft
        </a>
        <a 
          href="/profile" 
          class="text-black hover:text-osrs-gold transition-colors"
        >
          My Drafts
        </a>
        <button 
          on:click={handleSignOut}
          disabled={isLoggingOut}
          class="bg-osrs-red hover:bg-osrs-redHighlight text-white font-medium py-1 px-3 rounded border-2 border-osrs-interfaceBorder transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      {:else}
        <a 
          href="/login" 
          class="bg-osrs-gold hover:bg-osrs-goldHighlight text-black font-medium py-1 px-3 rounded border-2 border-osrs-interfaceBorder transition-colors"
        >
          Login
        </a>
      {/if}
    </div>
  </div>
</nav> 