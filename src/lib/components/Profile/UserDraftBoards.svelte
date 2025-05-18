<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/authStore';
  import { getUserDraftBoards, deleteDraftBoard, type DraftBoard } from '$lib/services/draftService';
  import { goto } from '$app/navigation';

  let draftBoards = $state<DraftBoard[]>([]);
  let isLoading = $state(true);
  let error = $state('');

  onMount(async () => {
    await loadDraftBoards();
  });

  async function loadDraftBoards() {
    if (!$user) return;
    
    isLoading = true;
    error = '';
    
    try {
      const { data, error: loadError } = await getUserDraftBoards($user.id);
      
      if (loadError) {
        error = loadError.message;
      } else {
        draftBoards = data || [];
      }
    } catch (err) {
      console.error('Error loading draft boards:', err);
      error = 'Failed to load your draft boards.';
    } finally {
      isLoading = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this draft board?')) return;
    
    try {
      const { error: deleteError } = await deleteDraftBoard(id);
      
      if (deleteError) {
        error = deleteError.message;
      } else {
        // Remove from local list
        draftBoards = draftBoards.filter(board => board.id !== id);
      }
    } catch (err) {
      console.error('Error deleting draft board:', err);
      error = 'Failed to delete the draft board.';
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
</script>

<div class="bg-osrs-interface border-4 border-osrs-interfaceBorder rounded-lg p-6 text-black">
  <h2 class="text-2xl font-bold mb-4">Your Draft Boards</h2>
  
  {#if error}
    <div class="bg-osrs-red text-black p-3 rounded mb-4">
      {error}
    </div>
  {/if}
  
  {#if isLoading}
    <p class="text-center py-4">Loading your draft boards...</p>
  {:else if draftBoards.length === 0}
    <div class="text-center py-6">
      <p class="mb-4">You haven't created any draft boards yet.</p>
      <a 
        href="/create" 
        class="bg-osrs-gold hover:bg-osrs-goldHighlight text-black font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors"
      >
        Create New Draft
      </a>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2">
      {#each draftBoards as board}
        <div class="bg-osrs-interfaceLight border-2 border-osrs-interfaceBorder rounded p-4">
          <h3 class="text-xl font-bold mb-2">{board.title}</h3>
          <p class="text-sm opacity-75 mb-3">Created: {formatDate(board.created_at || '')}</p>
          
          <div class="flex gap-2 mt-2">
            <a 
              href={`/draft/${board.id}`}
              class="bg-osrs-blue hover:bg-osrs-blueHighlight text-black py-1 px-3 rounded border border-osrs-interfaceBorder transition-colors text-sm"
            >
              View
            </a>
            <a 
              href={`/draft/${board.id}/edit`}
              class="bg-osrs-gold hover:bg-osrs-goldHighlight text-black py-1 px-3 rounded border border-osrs-interfaceBorder transition-colors text-sm"
            >
              Edit
            </a>
            <button 
              on:click={() => handleDelete(board.id || '')}
              class="bg-osrs-red hover:bg-osrs-redHighlight text-black py-1 px-3 rounded border border-osrs-interfaceBorder transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="mt-6 text-center">
      <a 
        href="/create" 
        class="bg-osrs-gold hover:bg-osrs-goldHighlight text-black font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors"
      >
        Create New Draft
      </a>
    </div>
  {/if}
</div> 