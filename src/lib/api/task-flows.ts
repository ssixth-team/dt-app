import type { MPW_ASM_FLOW } from '$lib/schemas/asm_flow.schema';

export type CreateTaskFlowDto = Omit<MPW_ASM_FLOW, 'code'>;
export type UpdateTaskFlowDto = Partial<Omit<MPW_ASM_FLOW, 'code'>>;

export async function getTaskFlows(): Promise<MPW_ASM_FLOW[]> {
  const response = await fetch('/api/task-flows');
  if (!response.ok) {
    throw new Error('Failed to fetch task flows');
  }
  return response.json();
}

export async function createTaskFlow(data: CreateTaskFlowDto): Promise<MPW_ASM_FLOW> {
  const response = await fetch('/api/task-flows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create task flow');
  }
  return response.json();
}

export async function updateTaskFlow(code: string, data: UpdateTaskFlowDto): Promise<MPW_ASM_FLOW> {
  const response = await fetch(`/api/task-flows/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update task flow');
  }
  return response.json();
}

export async function deleteTaskFlow(code: string): Promise<void> {
  const response = await fetch(`/api/task-flows/${code}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete task flow');
  }
}
