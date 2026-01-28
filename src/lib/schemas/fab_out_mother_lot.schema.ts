import { type MPW_FAB_OUT_CHILD_LOT} from '$lib/schemas/fab_out_child_lot.schema';
import { type MPW_FAB_OUT_MOTHER_LOT_WAFER } from '$lib/schemas/fab_out_mother_lot_wafer.schema';

export interface MPW_FAB_OUT_MOTHER_LOT {
  id: number;
  motherLotId: string;
  fabOutId: number;
  wafers: [MPW_FAB_OUT_MOTHER_LOT_WAFER];
  childLots: [MPW_FAB_OUT_CHILD_LOT];
  comment: string;
}

export const fabOutLotSchema = '++id, &[motherLotId]';
