<script lang="ts">
  import { signIn, signUp } from '$lib/stores/authStore';
  
  const { onSuccess } = $props<{ onSuccess?: () => void }>();
  
  let password = $state('');
  let username = $state('');
  let isLoading = $state(false);
  let isRegister = $state(false);
  let errorMessage = $state('');
  let successMessage = $state('');
  
  function generateEmailFromUsername(username: string): string {
    if (!username) {
      throw new Error('Username cannot be empty');
    }
    
    if (username.includes('@')) {
      throw new Error('Username cannot contain @ symbol');
    }
    
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    
    if (username.length > 30) {
      throw new Error('Username must be less than 30 characters');
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      throw new Error('Username can only contain letters, numbers, underscores, and hyphens');
    }
    
    return `${username}@gmaul.com`;
  }
  
  async function handleSubmit() {
    if (!password) {
      errorMessage = 'Please enter a password';
      return;
    }
    
    if (isRegister && !username) {
      errorMessage = 'Please enter your RuneScape username';
      return;
    }
    
    isLoading = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      const email = generateEmailFromUsername(username);
      const { error } = isRegister 
        ? await signUp(email, password, username)
        : await signIn(username, password);
      if (error) {
        errorMessage = error.message;
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      errorMessage = 'An unexpected error occurred';
      console.error(err);
    } finally {
      isLoading = false;
    }
  }
  
  function toggleMode() {
    isRegister = !isRegister;
    errorMessage = '';
    successMessage = '';
  }
</script>

<div class="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-800">
  <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
    {isRegister ? 'Create Account' : 'Sign In'}
  </h2>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <div class="flex items-center gap-1">
        <label for="username" class="block text-sm font-medium text-gray-700">RuneScape Username</label>
        <div class="relative group">
          <span class="cursor-help text-gray-500 text-xs">?</span>
          <div class="absolute hidden group-hover:block bg-black text-white p-2 rounded text-sm w-48 bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10">
            This is only required for if your bracket wins
          </div>
        </div>
      </div>
      <input
        id="username"
        type="text"
        bind:value={username}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50"
        placeholder="Your in-game name"
        required
      />
    </div>
    
    <div>
      <div class="flex items-center gap-1">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="relative group">
          <span class="cursor-help text-gray-500 text-xs">?</span>
          <div class="absolute hidden group-hover:block bg-black text-white p-2 rounded text-sm w-48 bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10">
            This may seem obvious, but don't use your osrs password
          </div>
        </div>
      </div>
      <input
        id="password"
        type="password"
        bind:value={password}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50"
        placeholder="••••••••"
        required
      />
    </div>
    
    {#if errorMessage}
      <div class="text-red-900 text-sm">{errorMessage}</div>
    {/if}
    
    {#if successMessage}
      <div class="text-green-900 text-sm p-2 bg-green-50 rounded border border-green-200">{successMessage}</div>
    {/if}
    
    <button
      type="submit"
      disabled={isLoading}
      class="w-full bg-gray-100 text-gray-800 border-2 border-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {#if isLoading}
        Loading...
      {:else}
        {isRegister ? 'Sign Up' : 'Sign In'}
      {/if}
    </button>
    
    <div class="text-center mt-4">
      <button 
        type="button" 
        on:click={toggleMode}
        class="text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        {isRegister ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
      </button>
    </div>
  </form>
</div> 