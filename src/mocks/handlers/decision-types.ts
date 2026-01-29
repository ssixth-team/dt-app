import { http, HttpResponse } from 'msw';
import { db } from '../db';
import type { MPW_ASM_DECISION_TYPE } from '$lib/schemas/asm_decision_type.schema';

export const decisionTypeHandlers = [
  http.get('/api/decision-types', async () => {
    const decisionTypes = await db.decisionTypes.toArray();
    return HttpResponse.json(decisionTypes);
  }),

  http.post('/api/decision-types', async ({ request }) => {
    const data = (await request.json()) as Omit<MPW_ASM_DECISION_TYPE, 'code'>;
    const allTypes = await db.decisionTypes.toArray();
    const maxNum = allTypes.reduce((max, dt) => {
      const num = parseInt(dt.code.replace('DT', ''));
      return num > max ? num : max;
    }, 0);
    const newCode = `DT${String(maxNum + 1).padStart(3, '0')}`;
    const newType: MPW_ASM_DECISION_TYPE = { code: newCode, ...data };
    await db.decisionTypes.add(newType);
    return HttpResponse.json(newType, { status: 201 });
  }),

  http.put('/api/decision-types/:code', async ({ params, request }) => {
    const { code } = params;
    const data = (await request.json()) as Partial<Omit<MPW_ASM_DECISION_TYPE, 'code'>>;
    const existing = await db.decisionTypes.get(code as string);
    if (!existing) {
      return HttpResponse.json({ error: 'Decision Type not found' }, { status: 404 });
    }
    const updated: MPW_ASM_DECISION_TYPE = { ...existing, ...data };
    await db.decisionTypes.put(updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/decision-types/:code', async ({ params }) => {
    await db.decisionTypes.delete(params.code as string);
    return HttpResponse.json({ success: true }, { status: 204 });
  })
];
