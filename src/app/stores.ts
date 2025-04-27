import { configureStore } from '@reduxjs/toolkit';
import historySlice from './stores/historySlice.ts';

export const store = configureStore({
    reducer: {
        history:historySlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;