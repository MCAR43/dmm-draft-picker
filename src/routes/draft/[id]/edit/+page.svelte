<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { getDraftBoard } from '$lib/services/draftService';
    import DraftBoard from '$lib/components/DraftBoard.svelte';
    import { user } from '$lib/stores/authStore';
    import { goto } from '$app/navigation';
    
    let isLoading = $state(true);
    let error = $state('');
    let captains = $state<string[]>([]);
    let title = $state('');
    let serializedSelections = $state('');
    let userId = $state('');
    
    onMount(async () => {
        if (!$user) {
            goto('/login');
            return;
        }
        
        const boardId = $page.params.id;
        await loadDraftBoard(boardId);
    });
    
    async function loadDraftBoard(id: string) {
        isLoading = true;
        error = '';
        
        try {
            const { data, error: loadError } = await getDraftBoard(id);
            
            if (loadError) {
                error = loadError.message;
                return;
            }
            
            if (data) {
                // Check if the user owns this draft board
                userId = data.user_id;
                if (userId !== $user?.id) {
                    error = "You don't have permission to edit this draft board";
                    return;
                }
                
                title = data.title;
                captains = data.captains;
                
                // Serialize selections for the initialState prop
                if (data.selections) {
                    const jsonString = JSON.stringify(data.selections);
                    serializedSelections = btoa(jsonString);
                }
            } else {
                error = 'Draft board not found';
            }
        } catch (err) {
            console.error('Error loading draft board:', err);
            error = 'An error occurred while loading the draft board';
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="max-w-6xl mx-auto">
    {#if isLoading}
        <div class="flex justify-center items-center h-64">
            <p class="text-xl">Loading draft board...</p>
        </div>
    {:else if error}
        <div class="bg-osrs-red text-white p-6 rounded-lg text-center">
            <p class="mb-4">{error}</p>
            <a 
                href="/profile" 
                class="bg-osrs-gold hover:bg-osrs-goldHighlight text-black font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors inline-block mt-2"
            >
                Back to Profile
            </a>
        </div>
    {:else}
        <h1 class="text-2xl font-bold mb-4">Edit Draft Board</h1>
        <DraftBoard 
            boardId={$page.params.id} 
            captains={captains} 
            title={title}
            totalPicks={captains.length * 6}
            initialState={serializedSelections}
        />
    {/if}
</div> 