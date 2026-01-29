<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { getTaskFlows } from '$lib/api/task-flows';
  import type { MPW_ASM_FLOW } from '$lib/schemas/asm_flow.schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus, RefreshCw } from '@lucide/svelte';
  import { Window } from '$lib/components/ui/window';
  import TaskFlowForm from './TaskFlowForm.svelte';

  let tableDiv: HTMLDivElement;
  let table: Tabulator;
  let taskFlows = $state<MPW_ASM_FLOW[]>([]);
  let loading = $state(false);
  let addWindowOpen = $state(false);
  let editWindowOpen = $state(false);
  let selectedTaskFlow = $state<MPW_ASM_FLOW | null>(null);

  async function loadTaskFlows() {
    loading = true;
    try {
      taskFlows = await getTaskFlows();
      if (table) {
        table.setData(taskFlows);
      }
    } catch (error) {
      console.error('Failed to load task flows:', error);
    } finally {
      loading = false;
    }
  }

  function handleRowClick(_e: any, row: any) {
    const data = row.getData() as MPW_ASM_FLOW;
    selectedTaskFlow = data;
    editWindowOpen = true;
  }

  onMount(async () => {
    await loadTaskFlows();

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: taskFlows,
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

  function handleTaskFlowAdded() {
    addWindowOpen = false;
    loadTaskFlows();
  }

  function handleTaskFlowUpdated() {
    editWindowOpen = false;
    selectedTaskFlow = null;
    loadTaskFlows();
  }
</script>

<div class="task-flow-container">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold mb-2">Task Flow Management</h2>
      <p class="text-muted-foreground">Assembly Task Flow 관리 페이지입니다.</p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={loadTaskFlows} disabled={loading}>
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

<Window bind:open={addWindowOpen} title="Add New Task Flow" width="600px" modal={false}>
  <TaskFlowForm onSuccess={handleTaskFlowAdded} onCancel={() => (addWindowOpen = false)} />
</Window>

<Window bind:open={editWindowOpen} title="Edit Task Flow" width="600px" modal={false}>
  <TaskFlowForm
    editMode={true}
    initialData={selectedTaskFlow}
    onSuccess={handleTaskFlowUpdated}
    onCancel={() => {
      editWindowOpen = false;
      selectedTaskFlow = null;
    }}
  />
</Window>

<style>
  .task-flow-container {
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
