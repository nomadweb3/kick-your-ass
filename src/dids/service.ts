import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Error = { 'AlreadyCreated' : null } |
  { 'NotFoundTheHandle' : null };
export type Result = { 'ok' : null } |
  { 'err' : Error };
export interface _SERVICE {
  'create' : ActorMethod<[string], Result>,
  'getKickByHandle' : ActorMethod<[string], [] | [bigint]>,
  'getKicksFromLargeToSmall' : ActorMethod<[], Array<[string, bigint]>>,
  'getKicksFromSmallToLarge' : ActorMethod<[], Array<[string, bigint]>>,
  'getKissByHandle' : ActorMethod<[string], [] | [bigint]>,
  'getKisssFromLargeToSmall' : ActorMethod<[], Array<[string, bigint]>>,
  'getKisssFromSmallToLarge' : ActorMethod<[], Array<[string, bigint]>>,
  'isCreated' : ActorMethod<[string], boolean>,
  'kick' : ActorMethod<[string], Result>,
  'kiss' : ActorMethod<[string], Result>,
}
