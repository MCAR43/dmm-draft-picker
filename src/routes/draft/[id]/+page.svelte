<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { getDraftBoard } from '$lib/services/draftService';
    import DraftBoard from '$lib/components/DraftBoard.svelte';
    
    let isLoading = $state(true);
    let error = $state('');
    let captains = $state<string[]>([]);
    let title = $state('');
    let selections = $state<string[] | null[]>([]);
    
    onMount(async () => {
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
                title = data.title;
                captains = data.captains;
                selections = data.selections;
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
        <div class="flex justify-center items-center h-64 text-black">
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
        <DraftBoard 
            boardId={$page.params.id} 
            captains={captains} 
            title={title}
            totalPicks={captains.length * 6} 
        />
    {/if}
</div> 