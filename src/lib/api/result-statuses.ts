import type { MPW_ASM_RESULT_STATUS } from '$lib/schemas/asm_result_status.schema';

export type CreateResultStatusDto = Omit<MPW_ASM_RESULT_STATUS, 'code'>;
export type UpdateResultStatusDto = Partial<Omit<MPW_ASM_RESULT_STATUS, 'code'>>;

export async function getResultStatuses(): Promise<MPW_ASM_RESULT_STATUS[]> {
  const response = await fetch('/api/result-statuses');
  if (!response.ok) {
    throw new Error('Failed to fetch result statuses');
  }
  return response.json();
}

export async function createResultStatus(
  data: CreateResultStatusDto
): Promise<MPW_ASM_RESULT_STATUS> {
  const response = await fetch('/api/result-statuses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create result status');
  }
  return response.json();
}

export async function updateResultStatus(
  code: string,
  data: UpdateResultStatusDto
): Promise<MPW_ASM_RESULT_STATUS> {
  const response = await fetch(`/api/result-statuses/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update result status');
  }
  return response.json();
}

export async function deleteResultStatus(code: string): Promise<void> {
  const response = await fetch(`/api/result-statuses/${code}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete result status');
  }
}
