<script lang="ts">
  import LoginForm from './LoginForm.svelte';
  import SignupForm from './SignupForm.svelte';
  
  let activeTab = $state('login');
</script>

<div class="bg-osrs-interface border-4 border-osrs-interfaceBorder rounded-lg p-6 max-w-md mx-auto text-black">
  <div class="flex border-b border-osrs-interfaceBorder mb-6">
    <button
      class="px-4 py-2 font-medium {activeTab === 'login' ? 'bg-osrs-gold text-black' : 'bg-osrs-interfaceLight text-black'}"
      on:click={() => activeTab = 'login'}
    >
      Login
    </button>
    <button
      class="px-4 py-2 font-medium {activeTab === 'signup' ? 'bg-osrs-gold text-black' : 'bg-osrs-interfaceLight text-black'}"
      on:click={() => activeTab = 'signup'}
    >
      Sign Up
    </button>
  </div>
  
  {#if activeTab === 'login'}
    <LoginForm />
  {:else}
    <SignupForm />
  {/if}
</div> 