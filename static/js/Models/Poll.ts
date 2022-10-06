import { BaseResponse } from './Generics';

export interface PollData {
  id?: number;
  name: string;
  startDate?: string;
  creationDate?: string;
  lastModDate?: string;
  coins: CoinData[];
  status: PollStatus;
  limit: number;
  current: number;
  winner?: CoinData;
  addressVault?: string;
}

export interface CoinData {
  id?: number;
  poll: number;
  name: string;
  symbol?: string;
  address: string;
  url: string;
  urlImage: string;
  voteCount?: number;
  voters?: VoterData[];
}

export interface VoterData {
  address: string;
  quantity: number;
}

export enum PollStatus {
  CREATED = 0,
  OPENED = 1,
  CLOSED = 2,
  PENDING_CLAIM = 3,
  CLAIMABLE = 4,
}

export enum VoteType {
  COIN = 0,
  NFT = 1,
}

export interface VoteData {
  assetType: VoteType;
  assetId: number;
  coinId: number;
}

export interface VoteRequest {
  pollId: number;
  voteData: VoteData;
}

export interface AvailableTokensResponse extends BaseResponse {
  ids: number[];
}
