import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from 'redux/store';

type ContractState = {
  totalRewards?: number;
};

const slice = createSlice({
  name: 'contract',
  initialState: {} as ContractState,
  reducers: {},
});

export default slice.reducer;

export const selectContract = (state: RootState) => state.contract;
