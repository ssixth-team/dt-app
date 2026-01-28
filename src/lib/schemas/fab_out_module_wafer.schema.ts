import { type MPW_CORNER } from '$lib/schemas/corner.schema';

export interface MPW_FAB_OUT_MODULE_WAFER {
  id: number;
  moduleId: number;
  wafer: string;
  corner: MPW_CORNER;
}

export const fabOutModuleWaferSchema = '++id, &[moduleId+waferNo+corner]';
