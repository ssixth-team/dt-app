<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { getTeams } from '$lib/api/teams';
  import type { MPW_ASM_TEAM } from '$lib/schemas/asm_team.schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus, RefreshCw } from '@lucide/svelte';
  import { Window } from '$lib/components/ui/window';
  import TeamForm from './TeamForm.svelte';

  let tableDiv: HTMLDivElement;
  let table: Tabulator;
  let teams = $state<MPW_ASM_TEAM[]>([]);
  let loading = $state(false);
  let addWindowOpen = $state(false);
  let editWindowOpen = $state(false);
  let selectedTeam = $state<MPW_ASM_TEAM | null>(null);

  async function loadTeams() {
    loading = true;
    try {
      teams = await getTeams();
      if (table) {
        table.setData(teams);
      }
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      loading = false;
    }
  }

  function handleRowClick(_e: any, row: any) {
    const data = row.getData() as MPW_ASM_TEAM;
    selectedTeam = data;
    editWindowOpen = true;
  }

  onMount(async () => {
    await loadTeams();

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: teams,
      rowHeight: 45,
      columns: [
        { title: 'ID', field: 'id', width: 80, hozAlign: 'center', sorter: 'number' },
        { title: 'Team Code', field: 'teamCode', width: 150 },
        { title: 'Team Name', field: 'teamName', width: 250 },
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

  function handleTeamAdded() {
    addWindowOpen = false;
    loadTeams();
  }

  function handleTeamUpdated() {
    editWindowOpen = false;
    selectedTeam = null;
    loadTeams();
  }
</script>

<div class="team-container">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold mb-2">Team Management</h2>
      <p class="text-muted-foreground">Assembly Team 관리 페이지입니다.</p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={loadTeams} disabled={loading}>
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

<Window bind:open={addWindowOpen} title="Add New Team" width="600px" modal={false}>
  <TeamForm onSuccess={handleTeamAdded} onCancel={() => (addWindowOpen = false)} />
</Window>

<Window bind:open={editWindowOpen} title="Edit Team" width="600px" modal={false}>
  <TeamForm
    editMode={true}
    initialData={selectedTeam}
    onSuccess={handleTeamUpdated}
    onCancel={() => {
      editWindowOpen = false;
      selectedTeam = null;
    }}
  />
</Window>

<style>
  .team-container {
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
