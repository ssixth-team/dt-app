<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { getResultStatuses } from '$lib/api/result-statuses';
  import type { MPW_ASM_RESULT_STATUS } from '$lib/schemas/asm_result_status.schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus, RefreshCw } from '@lucide/svelte';
  import { Window } from '$lib/components/ui/window';
  import ResultStatusForm from './ResultStatusForm.svelte';

  let tableDiv: HTMLDivElement;
  let table: Tabulator;
  let resultStatuses = $state<MPW_ASM_RESULT_STATUS[]>([]);
  let loading = $state(false);
  let addWindowOpen = $state(false);
  let editWindowOpen = $state(false);
  let selectedResultStatus = $state<MPW_ASM_RESULT_STATUS | null>(null);

  async function loadResultStatuses() {
    loading = true;
    try {
      resultStatuses = await getResultStatuses();
      if (table) {
        table.setData(resultStatuses);
      }
    } catch (error) {
      console.error('Failed to load result statuses:', error);
    } finally {
      loading = false;
    }
  }

  function handleRowClick(_e: any, row: any) {
    const data = row.getData() as MPW_ASM_RESULT_STATUS;
    selectedResultStatus = data;
    editWindowOpen = true;
  }

  onMount(async () => {
    await loadResultStatuses();

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: resultStatuses,
      rowHeight: 45,
      columns: [
        { title: 'Code', field: 'code', width: 150, hozAlign: 'center', sorter: 'string' },
        { title: 'Name', field: 'name', width: 200 },
        { title: 'Sort', field: 'sort', width: 100, hozAlign: 'right', sorter: 'number' },
        {
          title: 'Avail',
          field: 'avail',
          width: 100,
          hozAlign: 'center',
          formatter: (cell: any) => {
            const value = cell.getValue();
            const color = value === 'Y' ? '#2e7d32' : '#c62828';
            const bg = value === 'Y' ? '#e8f5e9' : '#ffebee';
            return `<span style="background-color: ${bg}; color: ${color}; padding: 4px 12px; border-radius: 12px; font-weight: 500;">${value}</span>`;
          }
        }
      ],
      movableColumns: true,
      resizableColumns: true,
      pagination: true,
      paginationSize: 10,
      paginationSizeSelector: [10, 20, 50, 100]
    });

    (table as any).on('rowClick', handleRowClick);
  });

  function handleResultStatusAdded() {
    addWindowOpen = false;
    loadResultStatuses();
  }

  function handleResultStatusUpdated() {
    editWindowOpen = false;
    selectedResultStatus = null;
    loadResultStatuses();
  }
</script>

<div class="result-status-container">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold mb-2">Result Status Management</h2>
      <p class="text-muted-foreground">Assembly Result Status 관리 페이지입니다.</p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={loadResultStatuses} disabled={loading}>
        <RefreshCw class="h-4 w-4 mr-2 {loading ? 'animate-spin' : ''}" />
        새로고침
      </Button>
      <Button size="sm" onclick={() => (addWindowOpen = true)}>
        <Plus class="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  </div>

  <div bind:this={tableDiv}></div>
</div>

<Window bind:open={addWindowOpen} title="Add New Result Status" width="600px" modal={false}>
  <ResultStatusForm onSuccess={handleResultStatusAdded} onCancel={() => (addWindowOpen = false)} />
</Window>

<Window bind:open={editWindowOpen} title="Edit Result Status" width="600px" modal={false}>
  <ResultStatusForm
    editMode={true}
    initialData={selectedResultStatus}
    onSuccess={handleResultStatusUpdated}
    onCancel={() => {
      editWindowOpen = false;
      selectedResultStatus = null;
    }}
  />
</Window>

<style>
  .result-status-container {
    width: 100%;
  }

  :global(.tabulator) {
    font-size: 14px;
  }

  :global(.tabulator .tabulator-header) {
    background-color: hsl(var(--muted));
    border-bottom: 2px solid hsl(var(--border));
  }

  :global(.tabulator .tabulator-row:hover) {
    background-color: hsl(var(--muted) / 0.5);
  }
</style>
