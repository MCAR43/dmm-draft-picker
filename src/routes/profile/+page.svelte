<script lang="ts">
    import { user } from '$lib/stores/authStore';
    import UserDraftBoards from '$lib/components/Profile/UserDraftBoards.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    onMount(() => {
        // Redirect if not logged in
        if (!$user) {
            goto('/login');
        }
    });
</script>

<div class="max-w-4xl mx-auto">
    {#if $user}
        <UserDraftBoards />
    {:else}
        <div class="bg-osrs-interface border-4 border-osrs-interfaceBorder rounded-lg p-6 text-center">
            <p class="mb-4">You need to be logged in to view your draft boards.</p>
            <a 
                href="/login" 
                class="bg-osrs-gold hover:bg-osrs-goldHighlight text-black font-bold py-2 px-4 rounded border-2 border-osrs-interfaceBorder transition-colors inline-block"
            >
                Login
            </a>
        </div>
    {/if}
</div> 