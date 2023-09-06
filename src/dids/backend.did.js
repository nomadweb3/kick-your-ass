export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'AlreadyCreated' : IDL.Null,
    'NotFoundTheHandle' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
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
    'isCreated' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'kick' : IDL.Func([IDL.Text], [Result], []),
    'kiss' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
