<script lang="ts">
    const { 
        title,
        children = undefined
    } = $props<{
        title: string;
        children?: any;
    }>();
</script>

<div class="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-md border border-gray-200">
    <h3 class="text-xl font-bold text-blue-800 mb-2">{title}</h3>
    <slot />
</div> 