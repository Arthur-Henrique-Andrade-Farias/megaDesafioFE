// src/constants.js

// Estados da API (exemplos, ajuste conforme seu backend)
export const API_STATE_BACKLOG = 'Backlog';
export const API_STATE_TODO = 'To Do';
export const API_STATE_DOING = 'Doing';
export const API_STATE_DONE = 'Done';
export const API_STATE_STOPPED = 'Stopped';

// Se você ainda tem IDs de coluna fixos no frontend para alguma lógica
// que não foi totalmente substituída pelo `task.state` da API:
// export const TODO_COLUMN_ID = 'col-2'; // Exemplo, pode ser o mesmo que API_STATE_TODO
// export const DONE_COLUMN_ID = 'col-4'; // Exemplo, pode ser o mesmo que API_STATE_DONE

// Mapeamento de prioridade (UI para API e vice-versa, se necessário globalmente)
export const PRIORITY_MAP_TO_NUMBER = {
    high: 1,
    medium: 2,
    low: 3,
};
export const PRIORITY_MAP_TO_STRING = {
    1: 'high',
    2: 'medium',
    3: 'low',
};