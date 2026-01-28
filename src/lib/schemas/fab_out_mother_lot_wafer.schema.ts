import { type MPW_CORNER } from '$lib/schemas/corner.schema';

export interface MPW_FAB_OUT_MOTHER_LOT_WAFER {
  id: number;
  motherId: number;
  wafer: string;
  corner: MPW_CORNER;
}

export const fabOutMotherLotWaferSchema = '++id, &[motherId+waferNo+corner]';
