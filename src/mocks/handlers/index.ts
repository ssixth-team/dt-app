import { itemHandlers } from './items';
import { referenceHandlers } from './references';

export const handlers = [...itemHandlers, ...referenceHandlers];
