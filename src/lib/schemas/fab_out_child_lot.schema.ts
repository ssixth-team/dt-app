import { type MPW_FAB_OUT_MODULE } from '$lib/schemas/fab_out_module.schema';

export interface MPW_FAB_OUT_CHILD_LOT {
  id: number;
  childLotId: string;
  motherId: number;
  modules: [MPW_FAB_OUT_MODULE];
}

export const fabOutChildLotSchema = '++id, &[childLotId]';
