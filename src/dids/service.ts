import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Error = { 'ClickAmountNotEnough' : null } |
  { 'AlreadyCreated' : null } |
  { 'NotFoundTheHandle' : null } |
  { 'AnonymousCaller' : null };
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Time = bigint;
export interface _SERVICE {
  'create' : ActorMethod<[string], Result>,
  'getKickByHandle' : ActorMethod<[string], [] | [bigint]>,
  'getKicksFromLargeToSmall' : ActorMethod<[], Array<[string, bigint]>>,
  'getKicksFromSmallToLarge' : ActorMethod<[], Array<[string, bigint]>>,
  'getKissByHandle' : ActorMethod<[string], [] | [bigint]>,
  'getKisssFromLargeToSmall' : ActorMethod<[], Array<[string, bigint]>>,
  'getKisssFromSmallToLarge' : ActorMethod<[], Array<[string, bigint]>>,
  'getTotalKickAmount' : ActorMethod<[], bigint>,
  'getTotalKissAmount' : ActorMethod<[], bigint>,
  'getTotalUserAmount' : ActorMethod<[], bigint>,
  'getUserTwitterPicURL' : ActorMethod<[string], [] | [string]>,
  'get_DAY_CLICK_AMOUNT' : ActorMethod<[], bigint>,
  'isCreated' : ActorMethod<[string], boolean>,
  'isHaveTwitterInfo' : ActorMethod<[string], boolean>,
  'kick' : ActorMethod<[string, Time], Result>,
  'kiss' : ActorMethod<[string, Time], Result>,
  'updateUserTwitterInfo' : ActorMethod<[string, string], Result>,
}
