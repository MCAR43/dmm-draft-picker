<script lang="ts">
  import { signIn } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let errorMessage = $state('');
  let isLoading = $state(false);

  const handleLogin = async () => {
    if (!email || !password) {
      errorMessage = 'Please enter both email and password';
      return;
    }
    
    isLoading = true;
    errorMessage = '';
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        errorMessage = error.message;
      } else {
        // Redirect to home page after successful login
        goto('/');
      }
    } catch (err) {
      errorMessage = 'An error occurred during login';
      console.error(err);
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="w-full max-w-md mx-auto">
  <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
  
  {#if errorMessage}
    <div class="bg-osrs-red text-black p-3 rounded mb-4">
      {errorMessage}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div>
      <label for="email" class="block mb-1 font-medium">Email</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        class="w-full p-2 border-2 border-osrs-interfaceBorder rounded bg-osrs-interfaceLight"
        placeholder="Email address"
        required
      />
    </div>
    
    <div>
      <label for="password" class="block mb-1 font-medium">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        class="w-full p-2 border-2 border-osrs-interfaceBorder rounded bg-osrs-interfaceLight"
        placeholder="Password"
        required
      />
    </div>
    
    <button
      type="submit"
      disabled={isLoading}
      class="w-full bg-osrs-gold hover:bg-osrs-goldHighlight text-black font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors disabled:opacity-50"
    >
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  </form>
</div> 