<script lang="ts">
    import { writable } from 'svelte/store';
    import { Pagination, PaginationItem } from 'flowbite-svelte';

    type PageOpts = {
        page: number,
        pageSize: number,
    };

    export let pageSize: number = 10;
    export let page: number = 1;
    export let totalItems: number = 0;
    export let onPageChange: (p: PageOpts) => void;

    let totalPages: number = calculateTotalPages();
    const display_total_pages = writable();
    $: display_total_pages.set(totalPages);

    function calculateTotalPages(): number {
        return Math.ceil(totalItems/pageSize);
    }

    function getPrevPage() {
        onPageChange({
            page: Math.max(1, page - 1),
            pageSize,
        });
    }

    function getNextPage() {
        onPageChange({
            page: page + 1,
            pageSize,
        });
    }
</script>

<div class="flex">
    <Pagination on:previous={getPrevPage} on:next={getNextPage} />
    <span class="ml-5 p-1">
        Showing {page} of {$display_total_pages} pages
    </span>
</div>
