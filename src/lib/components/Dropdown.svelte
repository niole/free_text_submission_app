<script lang="ts">
    import { onDestroy } from 'svelte';
    import { Label, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    import { writable } from 'svelte/store';
    import { debounce } from '$lib/utils';

    export let items: { value: string, label: string }[] = [];
    export let onChange: (value: string) => void;
    export let value: string | undefined = undefined;
    export let label: string | undefined = undefined;
    export let placeholder: string | undefined = undefined;
    export let isTypeahead: boolean = false;
    export let onSearch: ((value: string) => void) | undefined;

    let dropdownOpen: boolean = false;

    const displayItems = writable();
    const displaySelected = writable();
    const displayValue = writable();
    const displayLabel = writable();

    $: displayLabel.set(label);
    $: displayItems.set(items);
    $: displayValue.set('');

    if (value) {
        $: displayValue.set(value);
    } else {
        const v = getSelectedLabel(items, value);
        $: displayValue.set(v);
    }

    const unsubscribeItems = displayItems.subscribe(newItems => {
        if (!value && newItems) {
            displayValue.set(getSelectedLabel(newItems, value));
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
        dropdownOpen = true;
        if (onSearch) {
            onSearch(value);
        }
    });

    function localOnChange(newValue: string) {
        dropdownOpen = false;
        if (!value) {
            displayValue.set(getSelectedLabel(items, newValue));
        }
        if (onChange) {
            onChange(newValue);
        }
    }

    onDestroy(unsubscribeItems);
</script>

<span class="flex flex-col">
    {#if label}
        <Label>
            {$displayLabel}
        </Label>
    {/if}
    {#if isTypeahead}
        <Button color="light" class="w-100">
            <input
                value={$displayValue}
                on:keyup={event => localSearch(event.target.value)}
            />
            <ChevronDownOutline class="w-6 h-6 ms-2 dark:text-white" />
        </Button>
    {:else}
        <Button color="blue">
            {$displayValue}
            <ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" />
        </Button>
    {/if}
</span>
<Dropdown bind:open={dropdownOpen}>
    {#each $displayItems as x}
        <DropdownItem on:click={() => localOnChange(x.value)}>
            {x.label}
        </DropdownItem>
    {/each}
</Dropdown>
