import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'redux/store';

type WalletState = {
  provider?: string;
  address?: string;
  authenticated: boolean;
};

const slice = createSlice({
  name: 'wallet',
  initialState: { authenticated: false } as WalletState,
  reducers: {
    setWallet: (data, value: PayloadAction<WalletState>) => {
      data.provider = value.payload.provider;
      data.address = value.payload.address;
      data.authenticated = value.payload.authenticated;
    },
  },
});

export default slice.reducer;

export const { setWallet } = slice.actions;
export const selectWallet = (state: RootState) => state.wallet;
