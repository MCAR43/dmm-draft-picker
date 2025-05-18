<script lang="ts">
  import { signUp } from '$lib/stores/authStore';

  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let errorMessage = $state('');
  let successMessage = $state('');
  let isLoading = $state(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      errorMessage = 'Please fill in all fields';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match';
      return;
    }
    
    isLoading = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      const { error } = await signUp(email, password);
      if (error) {
        errorMessage = error.message;
      } else {
        successMessage = 'Check your email for the confirmation link';
        email = '';
        password = '';
        confirmPassword = '';
      }
    } catch (err) {
      errorMessage = 'An error occurred during signup';
      console.error(err);
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="w-full max-w-md mx-auto">
  <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>
  
  {#if errorMessage}
    <div class="bg-osrs-red text-white p-3 rounded mb-4">
      {errorMessage}
    </div>
  {/if}

  {#if successMessage}
    <div class="bg-green-600 text-white p-3 rounded mb-4">
      {successMessage}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleSignup} class="space-y-4">
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

    <div>
      <label for="confirm-password" class="block mb-1 font-medium">Confirm Password</label>
      <input
        type="password"
        id="confirm-password"
        bind:value={confirmPassword}
        class="w-full p-2 border-2 border-osrs-interfaceBorder rounded bg-osrs-interfaceLight"
        placeholder="Confirm password"
        required
      />
    </div>
    
    <button
      type="submit"
      disabled={isLoading}
      class="w-full bg-osrs-gold hover:bg-osrs-goldHighlight text-black font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors disabled:opacity-50"
    >
      {isLoading ? 'Signing up...' : 'Sign Up'}
    </button>
  </form>
</div> 