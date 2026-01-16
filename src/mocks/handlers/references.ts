import { http, HttpResponse } from 'msw';
import { db, type Reference } from '../db';

export const referenceHandlers = [
  // GET /api/references - 목록 조회
  http.get('/api/references', async () => {
    const references = await db.references.toArray();
    return HttpResponse.json(references);
  }),

  // GET /api/references/:id - 단건 조회
  http.get('/api/references/:id', async ({ params }) => {
    const { id } = params;
    const reference = await db.references.get(Number(id));

    if (!reference) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(reference);
  }),

  // POST /api/references - 등록
  http.post('/api/references', async ({ request }) => {
    const body = (await request.json()) as Omit<Reference, 'id' | 'createDate'>;
    const id = await db.references.add({
      ...body,
      createDate: new Date().toISOString()
    } as any);

    const newReference = await db.references.get(id);
    return HttpResponse.json(newReference, { status: 201 });
  }),

  // PUT /api/references/:id - 수정
  http.put('/api/references/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Omit<Reference, 'id' | 'createDate'>>;

    const existingReference = await db.references.get(Number(id));
    if (!existingReference) {
      return new HttpResponse(null, { status: 404 });
    }

    await db.references.update(Number(id), body);
    const updatedReference = await db.references.get(Number(id));

    return HttpResponse.json(updatedReference);
  }),

  // DELETE /api/references/:id - 삭제
  http.delete('/api/references/:id', async ({ params }) => {
    const { id } = params;

    const existingReference = await db.references.get(Number(id));
    if (!existingReference) {
      return new HttpResponse(null, { status: 404 });
    }

    await db.references.delete(Number(id));
    return new HttpResponse(null, { status: 204 });
  })
];
