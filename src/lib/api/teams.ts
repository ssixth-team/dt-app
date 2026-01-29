import type { MPW_ASM_TEAM } from '$lib/schemas/asm_team.schema';

export type CreateTeamDto = Omit<MPW_ASM_TEAM, 'id'>;
export type UpdateTeamDto = Partial<Omit<MPW_ASM_TEAM, 'id'>>;

export async function getTeams(): Promise<MPW_ASM_TEAM[]> {
  const response = await fetch('/api/teams');
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }
  return response.json();
}

export async function createTeam(data: CreateTeamDto): Promise<MPW_ASM_TEAM> {
  const response = await fetch('/api/teams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create team');
  }
  return response.json();
}

export async function updateTeam(id: number, data: UpdateTeamDto): Promise<MPW_ASM_TEAM> {
  const response = await fetch(`/api/teams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update team');
  }
  return response.json();
}

export async function deleteTeam(id: number): Promise<void> {
  const response = await fetch(`/api/teams/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete team');
  }
}
