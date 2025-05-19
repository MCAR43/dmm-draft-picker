<script lang="ts">
  import { user, signOut } from '$lib/stores/authStore';
  
  let isLoading = $state(false);
  
  async function handleSignOut() {
    isLoading = true;
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex items-center">
  <div class="mr-4">
    <span class="text-sm text-gray-700">
      {$user?.email}
    </span>
  </div>
  <button
    on:click={handleSignOut}
    disabled={isLoading}
    class="bg-gray-100 text-gray-800 border-2 border-gray-800 px-3 py-1 rounded text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
  >
    {isLoading ? 'Logging out...' : 'Logout'}
  </button>
</div> 