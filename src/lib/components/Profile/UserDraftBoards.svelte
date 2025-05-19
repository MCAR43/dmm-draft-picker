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

<div class="bg-white border-4 border-gray-800 rounded-lg p-6 text-gray-900">
  <h2 class="text-2xl font-bold mb-4">Your Draft Boards</h2>
  
  {#if error}
    <div class="bg-red-900 text-white p-3 rounded mb-4">
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
        class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded border-2 border-gray-800 transition-colors"
      >
        Create New Draft
      </a>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2">
      {#each draftBoards as board}
        <div class="bg-gray-50 border-2 border-gray-800 rounded p-4">
          <h3 class="text-xl font-bold mb-2">{board.title}</h3>
          <p class="text-sm opacity-75 mb-3">Created: {formatDate(board.created_at || '')}</p>
          
          <div class="flex gap-2 mt-2">
            <a 
              href={`/draft/${board.id}`}
              class="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded border border-gray-800 transition-colors text-sm"
            >
              View
            </a>
            <a 
              href={`/draft/${board.id}/edit`}
              class="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded border border-gray-800 transition-colors text-sm"
            >
              Edit
            </a>
            <button 
              on:click={() => handleDelete(board.id || '')}
              class="bg-red-900 hover:bg-red-800 text-white py-1 px-3 rounded border border-gray-800 transition-colors text-sm"
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
        class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded border-2 border-gray-800 transition-colors"
      >
        Create New Draft
      </a>
    </div>
  {/if}
</div> 