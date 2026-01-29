<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { getDecisionTypes } from '$lib/api/decision-types';
  import type { MPW_ASM_DECISION_TYPE } from '$lib/schemas/asm_decision_type.schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus, RefreshCw } from '@lucide/svelte';
  import { Window } from '$lib/components/ui/window';
  import DecisionTypeForm from './DecisionTypeForm.svelte';

  let tableDiv: HTMLDivElement;
  let table: Tabulator;
  let decisionTypes = $state<MPW_ASM_DECISION_TYPE[]>([]);
  let loading = $state(false);
  let addWindowOpen = $state(false);
  let editWindowOpen = $state(false);
  let selectedDecisionType = $state<MPW_ASM_DECISION_TYPE | null>(null);

  async function loadDecisionTypes() {
    loading = true;
    try {
      decisionTypes = await getDecisionTypes();
      if (table) {
        table.setData(decisionTypes);
      }
    } catch (error) {
      console.error('Failed to load decision types:', error);
    } finally {
      loading = false;
    }
  }

  function handleRowClick(_e: any, row: any) {
    const data = row.getData() as MPW_ASM_DECISION_TYPE;
    selectedDecisionType = data;
    editWindowOpen = true;
  }

  onMount(async () => {
    await loadDecisionTypes();

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: decisionTypes,
      rowHeight: 45,
      columns: [
        { title: 'Code', field: 'code', width: 150, hozAlign: 'center', sorter: 'string' },
        { title: 'Name', field: 'name', width: 200 },
        {
          title: 'Use Auto Sub',
          field: 'use_auto_sub',
          width: 130,
          hozAlign: 'center',
          formatter: (cell: any) => {
            const value = cell.getValue();
            const color = value === 'Y' ? '#2e7d32' : '#c62828';
            const bg = value === 'Y' ? '#e8f5e9' : '#ffebee';
            return `<span style="background-color: ${bg}; color: ${color}; padding: 4px 12px; border-radius: 12px; font-weight: 500;">${value}</span>`;
          }
        },
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

  function handleDecisionTypeAdded() {
    addWindowOpen = false;
    loadDecisionTypes();
  }

  function handleDecisionTypeUpdated() {
    editWindowOpen = false;
    selectedDecisionType = null;
    loadDecisionTypes();
  }
</script>

<div class="decision-type-container">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold mb-2">Decision Type Management</h2>
      <p class="text-muted-foreground">Assembly Decision Type 관리 페이지입니다.</p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={loadDecisionTypes} disabled={loading}>
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

<Window bind:open={addWindowOpen} title="Add New Decision Type" width="600px" modal={false}>
  <DecisionTypeForm onSuccess={handleDecisionTypeAdded} onCancel={() => (addWindowOpen = false)} />
</Window>

<Window bind:open={editWindowOpen} title="Edit Decision Type" width="600px" modal={false}>
  <DecisionTypeForm
    editMode={true}
    initialData={selectedDecisionType}
    onSuccess={handleDecisionTypeUpdated}
    onCancel={() => {
      editWindowOpen = false;
      selectedDecisionType = null;
    }}
  />
</Window>

<style>
  .decision-type-container {
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
