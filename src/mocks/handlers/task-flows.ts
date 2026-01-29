import { http, HttpResponse } from 'msw';
import { db } from '../db';
import type { MPW_ASM_FLOW } from '$lib/schemas/asm_flow.schema';

export const taskFlowHandlers = [
  http.get('/api/task-flows', async () => {
    const taskFlows = await db.taskFlows.toArray();
    return HttpResponse.json(taskFlows);
  }),

  http.post('/api/task-flows', async ({ request }) => {
    const data = (await request.json()) as Omit<MPW_ASM_FLOW, 'code'>;
    const allFlows = await db.taskFlows.toArray();
    const maxNum = allFlows.reduce((max, flow) => {
      const num = parseInt(flow.code.replace('FLOW', ''));
      return num > max ? num : max;
    }, 0);
    const newCode = `FLOW${String(maxNum + 1).padStart(2, '0')}`;
    const newFlow: MPW_ASM_FLOW = { code: newCode, ...data };
    await db.taskFlows.add(newFlow);
    return HttpResponse.json(newFlow, { status: 201 });
  }),

  http.put('/api/task-flows/:code', async ({ params, request }) => {
    const { code } = params;
    const data = (await request.json()) as Partial<Omit<MPW_ASM_FLOW, 'code'>>;
    const existing = await db.taskFlows.get(code as string);
    if (!existing) {
      return HttpResponse.json({ error: 'Task Flow not found' }, { status: 404 });
    }
    const updated: MPW_ASM_FLOW = { ...existing, ...data };
    await db.taskFlows.put(updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/task-flows/:code', async ({ params }) => {
    await db.taskFlows.delete(params.code as string);
    return HttpResponse.json({ success: true }, { status: 204 });
  })
];
