import type { MPW_ASM_DECISION_TYPE } from '$lib/schemas/asm_decision_type.schema';

export type CreateDecisionTypeDto = Omit<MPW_ASM_DECISION_TYPE, 'code'>;
export type UpdateDecisionTypeDto = Partial<Omit<MPW_ASM_DECISION_TYPE, 'code'>>;

export async function getDecisionTypes(): Promise<MPW_ASM_DECISION_TYPE[]> {
  const response = await fetch('/api/decision-types');
  if (!response.ok) {
    throw new Error('Failed to fetch decision types');
  }
  return response.json();
}

export async function createDecisionType(
  data: CreateDecisionTypeDto
): Promise<MPW_ASM_DECISION_TYPE> {
  const response = await fetch('/api/decision-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create decision type');
  }
  return response.json();
}

export async function updateDecisionType(
  code: string,
  data: UpdateDecisionTypeDto
): Promise<MPW_ASM_DECISION_TYPE> {
  const response = await fetch(`/api/decision-types/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update decision type');
  }
  return response.json();
}

export async function deleteDecisionType(code: string): Promise<void> {
  const response = await fetch(`/api/decision-types/${code}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete decision type');
  }
}
