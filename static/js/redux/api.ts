import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AvailableTokensResponse,
  CoinData,
  PollData,
  VoteRequest,
} from 'Models/Poll';
import { BaseResponse, CreateResponse, NonceResponse } from 'Models/Generics';
import {
  LoginRequest,
  LoginResponse,
  NumberRequst,
  NumberResponse,
  UserData,
} from 'Models/User';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    nonce: builder.mutation<NonceResponse, string>({
      query: (reqData) => ({
        url: `authentication/nonce?walletid=${reqData}`,
        method: 'GET',
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'authentication/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<BaseResponse, void>({
      query: () => ({
        url: 'authentication/logout',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        console.log('logout');
        dispatch(api.util.resetApiState());
      },
    }),
    coinTreshold: builder.mutation<NumberResponse, void>({
      query: () => ({
        url: `polls/coin_threshold`,
        method: 'GET',
      }),
    }),
    updateCoinTreshold: builder.mutation<BaseResponse, NumberRequst>({
      query: (data) => ({
        url: `polls/coin_threshold`,
        method: 'PUT',
        body: data,
      }),
    }),
    totalRewards: builder.mutation<NumberResponse, void>({
      query: () => ({
        url: `polls/total_rewards`,
        method: 'GET',
      }),
    }),
    polls: builder.query<PollData[], void>({
      query: () => `polls/`,
      keepUnusedDataFor: 60 * 30, // 30 minutes
    }),
    userVotes: builder.mutation<UserData, number>({
      query: (data) => ({
        url: `polls/${data}/votes`,
        method: 'GET',
      }),
    }),
    pollVoteCoin: builder.mutation<BaseResponse, VoteRequest>({
      query: (reqData) => ({
        url: `polls/${reqData.pollId}/votes`,
        method: 'POST',
        body: reqData.voteData,
      }),
    }),
    createPoll: builder.mutation<CreateResponse, PollData>({
      query: (data) => ({
        url: `polls/`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePoll: builder.mutation<BaseResponse, PollData>({
      query: (data) => ({
        url: `polls/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deletePoll: builder.mutation<BaseResponse, number>({
      query: (data) => ({
        url: `polls/${data}`,
        method: 'DELETE',
      }),
    }),
    pollCoins: builder.mutation<CoinData[], number>({
      query: (data) => ({
        url: `polls/${data}/coins`,
        method: 'GET',
      }),
    }),
    pollAvailableTokens: builder.mutation<AvailableTokensResponse, number>({
      query: (data) => ({
        url: `polls/${data}/available_nfts`,
        method: 'GET',
      }),
    }),
    createPollCoin: builder.mutation<CreateResponse, CoinData>({
      query: (data) => ({
        url: `polls/${data.poll}/coins`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePollCoin: builder.mutation<BaseResponse, CoinData>({
      query: (data) => ({
        url: `polls/${data.poll}/coins`,
        method: 'PUT',
        body: data,
      }),
    }),
    deletePollCoin: builder.mutation<BaseResponse, CoinData>({
      query: (data) => ({
        url: `polls/${data.poll}/coins/${data.id}`,
        method: 'DELETE',
        body: data,
      }),
    }),
    makeClaimablePoll: builder.mutation<BaseResponse, number>({
      query: (data) => ({
        url: `polls/${data}/make_claimable`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useNonceMutation,
  useLoginMutation,
  useLogoutMutation,
  useCoinTresholdMutation,
  useUpdateCoinTresholdMutation,
  useTotalRewardsMutation,
  usePollsQuery,
  useUserVotesMutation,
  usePollVoteCoinMutation,
  useCreatePollMutation,
  useUpdatePollMutation,
  useDeletePollMutation,
  usePollCoinsMutation,
  usePollAvailableTokensMutation,
  useCreatePollCoinMutation,
  useUpdatePollCoinMutation,
  useDeletePollCoinMutation,
  useMakeClaimablePollMutation,
} = api;
