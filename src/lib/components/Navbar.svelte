<script lang="ts">
  import { user, initializeAuth } from '$lib/stores/authStore';
  import UserProfile from '$lib/components/Auth/UserProfile.svelte';
  import AuthModal from '$lib/components/Auth/AuthModal.svelte';
  import FAQModal from '$lib/components/FAQModal.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let isAuthModalOpen = $state(false);
  let isFAQModalOpen = $state(false);
  
  function toggleAuthModal() {
    isAuthModalOpen = !isAuthModalOpen;
  }
  
  function toggleFAQModal() {
    isFAQModalOpen = !isFAQModalOpen;
  }
  
  onMount(() => {
    initializeAuth();
  });
  
  function getNavLinkClass(path: string) {
    const isActive = $page.url.pathname === path;
    return isActive
      ? "border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  }
  
  function getMobileLinkClass(path: string) {
    const isActive = $page.url.pathname === path;
    return isActive
      ? "bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium";
  }
</script>

<nav class="bg-white shadow-md">
  <div class="max-w-6xl mx-auto px-4">
    <div class="flex justify-between h-16">
      <div class="flex">
        <a href="/" class="flex-shrink-0 flex items-center">
          <span class="text-xl font-bold text-indigo-600">DMM Allstars Draft</span>
        </a>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a href="/" class={getNavLinkClass('/') + " text-xl"}>
            Home
          </a>
          <a href="/stats" class={getNavLinkClass('/stats') + " text-xl"}>
            Stats
          </a>
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <button 
          class="bg-indigo-100 text-indigo-600 border-2 border-indigo-700 rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-indigo-200 transition-colors shadow-sm hover:shadow-md"
          on:click={toggleFAQModal}
        >
          ?
        </button>
        
        {#if $user}
          <UserProfile />
        {:else}
          <button 
            class="bg-indigo-100 text-indigo-600 border-2 border-indigo-700 px-4 py-2 rounded font-bold hover:bg-indigo-200 transition-colors shadow-sm hover:shadow-md"
            on:click={toggleAuthModal}
          >
            Login
          </button>
        {/if}
      </div>
    </div>
  </div>
</nav>

<!-- Mobile menu, show/hide based on menu state. -->
<div class="sm:hidden">
  <div class="pt-2 pb-3 space-y-1">
    <a href="/" class={getMobileLinkClass('/')}>
      Home
    </a>
    <a href="/stats" class={getMobileLinkClass('/stats')}>
      Stats
    </a>
  </div>
</div>

{#if isAuthModalOpen}
  <AuthModal onClose={toggleAuthModal} />
{/if} 

{#if isFAQModalOpen}
  <FAQModal onClose={toggleFAQModal} />
{/if} 