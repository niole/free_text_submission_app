<script lang="ts">
	import { FileCopyAltOutline } from 'flowbite-svelte-icons';
	import { copyUrlToClipBoard } from '$lib/utils';
    import { Button, Modal } from 'flowbite-svelte';

    let clickOutsideModal = false;
    export let copyText: string | undefined;
    export let buildCopyText: () => string;
    export let label: string = 'link';

    function handleOpen() {
        const success = copyUrlToClipBoard(copyText);
        if (!success) {
            clickOutsideModal = true;
        }
    }
</script>

<Button on:click={handleOpen}
    icon="FileCopyAltOutline"
    color="light"
>
<FileCopyAltOutline/>{label}
</Button>
<Modal title="Copy Text" bind:open={clickOutsideModal} autoclose outsideclose>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        {#if !copyText}
            {buildCopyText()}
        {:else}
            {copyText}
        {/if}
    </p>
    <svelte:fragment slot="footer">
        <Button on:click={() => clickOutsideModal = false}>Dismiss</Button>
    </svelte:fragment>
</Modal>
