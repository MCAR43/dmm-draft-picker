<script lang="ts">
  import Navbar from './Navbar.svelte';
  import { onMount } from 'svelte';
  import { initAuth } from '$lib/stores/authStore';
  
  onMount(() => {
    initAuth();
  });
</script>

<Navbar />

<main class="container mx-auto p-4">
  <slot />
</main> 