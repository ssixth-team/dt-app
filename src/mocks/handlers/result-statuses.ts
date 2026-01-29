import { http, HttpResponse } from 'msw';
import { db } from '../db';
import type { MPW_ASM_RESULT_STATUS } from '$lib/schemas/asm_result_status.schema';

export const resultStatusHandlers = [
  http.get('/api/result-statuses', async () => {
    const resultStatuses = await db.resultStatuses.toArray();
    return HttpResponse.json(resultStatuses);
  }),

  http.post('/api/result-statuses', async ({ request }) => {
    const data = (await request.json()) as Omit<MPW_ASM_RESULT_STATUS, 'code'>;
    const allStatuses = await db.resultStatuses.toArray();
    const maxNum = allStatuses.reduce((max, status) => {
      const num = parseInt(status.code.replace('RS', ''));
      return num > max ? num : max;
    }, 0);
    const newCode = `RS${String(maxNum + 1).padStart(3, '0')}`;
    const newStatus: MPW_ASM_RESULT_STATUS = { code: newCode, ...data };
    await db.resultStatuses.add(newStatus);
    return HttpResponse.json(newStatus, { status: 201 });
  }),

  http.put('/api/result-statuses/:code', async ({ params, request }) => {
    const { code } = params;
    const data = (await request.json()) as Partial<Omit<MPW_ASM_RESULT_STATUS, 'code'>>;
    const existing = await db.resultStatuses.get(code as string);
    if (!existing) {
      return HttpResponse.json({ error: 'Result Status not found' }, { status: 404 });
    }
    const updated: MPW_ASM_RESULT_STATUS = { ...existing, ...data };
    await db.resultStatuses.put(updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/result-statuses/:code', async ({ params }) => {
    await db.resultStatuses.delete(params.code as string);
    return HttpResponse.json({ success: true }, { status: 204 });
  })
];
