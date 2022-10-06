import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VoteData } from 'Models/Poll';
import { UserData } from 'Models/User';
import type { RootState } from 'redux/store';
import { api } from './api';

const slice = createSlice({
  name: 'user',
  initialState: {
    nftData: {
      balance: 0,
      owneds: [],
    },
    votes: [],
    coinTreshold: 1000,
  } as unknown as UserData,
  reducers: {
    userSetNftsAction: (data, value: PayloadAction<number[]>) => {
      data.nftData = {
        balance: value.payload.length.toLocaleString(),
        owneds: [-1, ...value.payload],
      };
    },
    userAddVoteAction: (data, value: PayloadAction<VoteData>) => {
      data.votes.push(value.payload);
    },
    userSetCoinTreshold: (data, value: PayloadAction<number>) => {
      data.coinTreshold = value.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      api.endpoints.userVotes.matchFulfilled,
      (state, action) => {
        state.votes = action.payload.votes;
        console.log(action.payload);
        return state;
      },
    );
    builder.addMatcher(
      api.endpoints.coinTreshold.matchFulfilled,
      (state, action) => {
        state.coinTreshold = action.payload.value;
        console.log(action.payload);
        return state;
      },
    );
  },
});

export default slice.reducer;

export const selectUser = (state: RootState) => state.user;

export const { userSetNftsAction, userAddVoteAction, userSetCoinTreshold } =
  slice.actions;
