import Dexie, { type EntityTable } from 'dexie';

export interface Item {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface Reference {
  id: number;
  process: 'design' | 'development' | 'testing' | 'deployment';
  rev: 'A' | 'B' | 'C' | 'D';
  createUser: {
    id: string;
    name: string;
    email: string;
  };
  createDate: string;
}

export class AppDB extends Dexie {
  items!: EntityTable<Item, 'id'>;
  references!: EntityTable<Reference, 'id'>;

  constructor() {
    super('app-db');
    this.version(1).stores({
      items: '++id, title, createdAt'
    });
    this.version(2).stores({
      items: '++id, title, createdAt',
      references: '++id, process, rev, createDate'
    });
  }
}

export const db = new AppDB();
