import { createGlobalState } from 'react-hooks-global-state';

/* Global state settings */
export const { GlobalStateProvider, useGlobalState } = createGlobalState(
    { 
        user: "", 
        repo: "" 
    });