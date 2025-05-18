<script lang="ts">
    import { user } from '$lib/stores/authStore';
    import DraftBoard from '$lib/components/DraftBoard.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    const captains = $state(['Captain 1', 'Captain 2', 'Captain 3', 'Captain 4']);
    const totalPicks = $state(24);
    const title = $state('Deadman Allstars Draft');
    
    onMount(() => {
        // Redirect if not logged in
        if (!$user) {
            goto('/login');
        }
    });
</script>

<div class="max-w-6xl mx-auto">
    {#if $user}
        <DraftBoard captains={captains} totalPicks={totalPicks} title={title} />
    {:else}
        <div class="bg-osrs-interface border-4 border-osrs-interfaceBorder rounded-lg p-6 text-center">
            <p class="mb-4">You need to be logged in to create a draft board.</p>
            <a 
                href="/login" 
                class="bg-osrs-gold hover:bg-osrs-goldHighlight text-black font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors inline-block"
            >
                Login
            </a>
        </div>
    {/if}
</div> 