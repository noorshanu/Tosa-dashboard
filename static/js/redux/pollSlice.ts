import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'redux/store';
import { CoinData, PollData, PollStatus, VoteData } from 'Models/Poll';
import { api } from './api';

type PollState = {
  items: PollData[];
  loading: boolean;
  selected: number;
};

export const emptyPoll: PollData = {
  coins: [],
  id: undefined,
  limit: 50000,
  name: 'new Poll',
  status: PollStatus.CREATED,
  creationDate: undefined,
  current: 0,
  lastModDate: undefined,
  startDate: undefined,
  winner: undefined,
};

export const emptyCoin: CoinData = {
  id: undefined,
  poll: -1,
  name: '',
  symbol: undefined,
  address: '',
  url: '',
  urlImage: '',
  voteCount: undefined,
  voters: undefined,
};

const slice = createSlice({
  name: 'poll',
  initialState: {
    items: [],
    loading: false,
    selected: -1,
  } as PollState,
  reducers: {
    pollSelectAction: (data, value: PayloadAction<number | undefined>) => {
      if (value.payload) {
        data.selected = data.items.findIndex(
          (poll) => poll.id === value.payload,
        );
      } else {
        data.selected = -1;
      }
    },
    pollCreateAction: (data, value: PayloadAction<PollData>) => {
      data.items.push(value.payload);
      data.selected = data.items.length - 1;
    },
    pollUpdateAction: (data, value: PayloadAction<PollData>) => {
      const poll = data.items.find((poll) => poll.id === value.payload.id);
      if (!poll) {
        console.error(`pollUpdateAction poll non trovata: ${value.payload.id}`);
        return;
      }
      poll.name = value.payload.name;
      poll.limit = value.payload.limit;
      poll.status = value.payload.status;
    },
    pollDeleteAction: (data, value: PayloadAction<number>) => {
      data.selected = -1;
      const index = data.items.findIndex((poll) => poll.id === value.payload);
      data.items.splice(index, 1);
    },
    pollResetCoinsAction: (data, value: PayloadAction<CoinData[]>) => {
      data.items[data.selected] = {
        ...data.items[data.selected],
        coins: value.payload,
      };
    },
    pollCoinCreateAction: (data, value: PayloadAction<CoinData>) => {
      data.items[data.selected].coins.push(value.payload);
    },
    pollCoinUpdateAction: (data, value: PayloadAction<CoinData>) => {
      const index = data.items[data.selected].coins.findIndex(
        (coin) => coin.id === value.payload.id,
      );
      data.items[data.selected].coins[index] = value.payload;
    },
    pollCoinUpdateCreationAction: (data, value: PayloadAction<CoinData>) => {
      console.log(value.payload);
      data.items[data.selected].coins[
        data.items[data.selected].coins.length - 1
      ] = value.payload;
    },
    pollCoinDeleteAction: (data, value: PayloadAction<CoinData>) => {
      const index = data.items[data.selected].coins.findIndex(
        (coin) => coin.id === value.payload.id,
      );
      data.items[data.selected].coins.splice(index, 1);
    },
    pollAddVoteAction: (
      data,
      value: PayloadAction<{ address: string; data: VoteData }>,
    ) => {
      const coin = data.items[data.selected].coins.find(
        (coin) => coin.id === value.payload.data.coinId,
      );
      if (!coin) {
        console.error(
          `COIN NON TROVATA. poll index: ${data.selected}, coin id: ${value.payload.data.coinId}`,
        );
        return;
      }
      if (!coin.voters) {
        console.log('VOTERS NON INIZIALIZZATI');
        coin.voters = [];
        coin.voteCount = 0;
      }
      let voter = coin.voters.find(
        (voter) => voter.address === value.payload.address,
      );
      if (!voter) {
        coin.voters.push({ address: value.payload.address, quantity: 0 });
        voter = coin.voters[coin.voters.length - 1];
      }
      voter.quantity = voter.quantity + 1;
      coin.voteCount = coin.voteCount! + 1;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(api.endpoints.polls.matchFulfilled, (state, action) => {
      state.items = action.payload;
      return state;
    });
  },
});

export const {
  pollSelectAction,
  pollCreateAction,
  pollUpdateAction,
  pollDeleteAction,
  pollResetCoinsAction,
  pollCoinCreateAction,
  pollCoinUpdateAction,
  pollCoinUpdateCreationAction,
  pollCoinDeleteAction,
  pollAddVoteAction,
} = slice.actions;

export default slice.reducer;

export const selectPollList = (state: RootState) => state.poll.items;
export const selectPollSelected = (state: RootState) =>
  state.poll.selected === -1
    ? undefined
    : state.poll.items[state.poll.selected];
