<script lang="ts">
    import { onDestroy } from 'svelte';
    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    import { writable } from 'svelte/store';
    import { debounce } from '$lib/utils';

    export let items: { value: string, label: string }[] = [];
    export let onChange: (value: string) => void;
    export let value: string | undefined = undefined;
    export let label: string | undefined = undefined;
    export let isTypeahead: boolean = false;
    export let onSearch: ((value: string) => void) | undefined;

    const displayItems = writable();
    const displaySelected = writable();
    const displayLabel = writable();

    $: displayItems.set(items);
    $: displayLabel.set(label);

    if (label) {
        $: displayLabel.set(label);
    } else {
        const v = getSelectedLabel(items, value);
        $: displaySelected.set(v);
    }

    const unsubscribeItems = displayItems.subscribe(newItems => {
        if (!label && newItems) {
            displaySelected.set(getSelectedLabel(newItems, value));
        }
    });

    function getSelectedLabel(items: { value: string, label: string }[], value?: string) {
        if (value === undefined) {
            if (items.length) {
                return items[0].label;
            }
            return undefined;
        }
        const found = items.find(i => i.value === value);
        return found?.label;
    }

    const localSearch = debounce((value: string) => {
        if (onSearch) {
            onSearch(value);
        }
    });

    function localOnChange(value: string) {
        if (!label) {
            displaySelected.set(getSelectedLabel(items, value));
        }
        if (onChange) {
            onChange(value);
        }
    }

    onDestroy(unsubscribeItems);
</script>

    {#if isTypeahead}
        <Button color="light" class="w-100">
            <input
                placeholder={$displayLabel}
                on:keyup={event => localSearch(event.target.value)}
            />
            <ChevronDownOutline class="w-6 h-6 ms-2 dark:text-white" />
        </Button>
    {:else}
        <Button color="blue">
            {$displayLabel}
            <ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" />
        </Button>
    {/if}
<Dropdown>
    {#each $displayItems as x}
        <DropdownItem on:click={() => localOnChange(x.value)}>
            {x.label}
        </DropdownItem>
    {/each}
</Dropdown>