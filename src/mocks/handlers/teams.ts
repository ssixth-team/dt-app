import { http, HttpResponse } from 'msw';
import { db } from '../db';
import type { MPW_ASM_TEAM } from '$lib/schemas/asm_team.schema';

export const teamHandlers = [
  http.get('/api/teams', async () => {
    const teams = await db.teams.toArray();
    return HttpResponse.json(teams);
  }),

  http.post('/api/teams', async ({ request }) => {
    const data = (await request.json()) as Omit<MPW_ASM_TEAM, 'id'>;
    const id = await db.teams.add(data as any);
    const newTeam = await db.teams.get(id);
    return HttpResponse.json(newTeam, { status: 201 });
  }),

  http.put('/api/teams/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const data = (await request.json()) as Partial<Omit<MPW_ASM_TEAM, 'id'>>;
    const existing = await db.teams.get(id);
    if (!existing) {
      return HttpResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    const updated: MPW_ASM_TEAM = { ...existing, ...data };
    await db.teams.put(updated);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/teams/:id', async ({ params }) => {
    await db.teams.delete(Number(params.id));
    return HttpResponse.json({ success: true }, { status: 204 });
  })
];
