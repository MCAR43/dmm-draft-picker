<script lang="ts">
  import LoginForm from './LoginForm.svelte';
  import SignupForm from './SignupForm.svelte';

  let isLogin = $state(true);

  function toggleForm() {
    isLogin = !isLogin;
  }
</script>

<div class="max-w-md mx-auto mt-8">
  <div class="flex justify-center mb-4">
    <button
      class="px-4 py-2 mr-2 text-white bg-gray-800 rounded hover:bg-gray-700"
      on:click={toggleForm}
    >
      {isLogin ? 'Switch to Signup' : 'Switch to Login'}
    </button>
  </div>

  {#if isLogin}
    <LoginForm on:loginSuccess={() => console.log('Login successful!')} />
  {:else}
    <SignupForm on:signupSuccess={() => console.log('Signup successful!')} />
  {/if}
</div> 