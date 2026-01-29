import { itemHandlers } from './items';
import { referenceHandlers } from './references';
import { authHandlers } from './auth';
import { bumpHandlers } from './bumps';
import { cornerHandlers } from './corners';
import { statusHandlers } from './statuses';
import { limitsHandlers } from './limits';
import { teamHandlers } from './teams';
import { decisionTypeHandlers } from './decision-types';
import { taskFlowHandlers } from './task-flows';
import { resultStatusHandlers } from './result-statuses';

export const handlers = [
  ...itemHandlers,
  ...referenceHandlers,
  ...authHandlers,
  ...bumpHandlers,
  ...cornerHandlers,
  ...statusHandlers,
  ...limitsHandlers,
  ...teamHandlers,
  ...decisionTypeHandlers,
  ...taskFlowHandlers,
  ...resultStatusHandlers
];
