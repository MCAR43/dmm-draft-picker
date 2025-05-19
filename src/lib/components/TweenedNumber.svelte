<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';

    const props = $props<{
        value: number;
        duration?: number;
        format?: (n: number) => string;
        decimals?: number;
    }>();

    // Create a tweened value starting at 0
    const displayValue = tweened(0, {
        duration: props.duration ?? 1000,
        easing: cubicOut
    });

    // Reset the tween when the input value changes
    $effect(() => {
        displayValue.set(props.value);
    });

    // Format the number with provided format function or default to fixed decimals
    const formattedValue = $derived(props.format 
        ? props.format($displayValue) 
        : Number($displayValue).toFixed(props.decimals ?? 0));
</script>

{formattedValue} 