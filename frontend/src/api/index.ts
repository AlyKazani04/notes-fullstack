export {notes} from './notes';
export {folders} from './folders';
export {auth} from './auth';

import request from './client';
export const health = () => request('/health');