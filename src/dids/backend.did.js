export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'ClickAmountNotEnough' : IDL.Null,
    'AlreadyCreated' : IDL.Null,
    'NotFoundTheHandle' : IDL.Null,
    'AnonymousCaller' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const Time = IDL.Int;
  return IDL.Service({
    'create' : IDL.Func([IDL.Text], [Result], []),
    'getKickByHandle' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
    'getKicksFromLargeToSmall' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getKicksFromSmallToLarge' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getKissByHandle' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
    'getKisssFromLargeToSmall' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getKisssFromSmallToLarge' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getUserTwitterPicURL' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'isCreated' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'isHaveTwitterInfo' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'kick' : IDL.Func([IDL.Text, Time], [Result], []),
    'kiss' : IDL.Func([IDL.Text, Time], [Result], []),
    'updateUserTwitterInfo' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
