<script lang="ts">
    import { onDestroy } from 'svelte';
    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    import { writable } from 'svelte/store';

    export let items: { value: string, label: string }[] = [];
    export let onChange: (value: string) => void;
    export let value: string | undefined = undefined;
    export let label: string | undefined = undefined;

    const displayItems = writable();
    const displaySelected = writable();

    $: displayItems.set(items);

    if (label) {
        $: displaySelected.set(label);
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

<Button color="blue">{$displaySelected}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
<Dropdown>
    {#each $displayItems as x}
        <DropdownItem on:click={() => localOnChange(x.value)}>
            {x.label}
        </DropdownItem>
    {/each}
</Dropdown>