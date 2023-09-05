import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Types "types";
import TrieSet "mo:base/TrieSet";

actor {

  type Error = {
    #AlreadyCreated;
    #NotFoundTheHandle;
  };

  // Text(Twitter Handle) -> Nat
  let kickMap = TrieMap.TrieMap<Text, Nat>(Text.equal, Text.hash);
  let kissMap = TrieMap.TrieMap<Text, Nat>(Text.equal, Text.hash);
  stable var handles = TrieSet.empty<Text>();

  public shared({caller}) func create(handle: Text): async Result.Result<(), Error> {
    if(TrieSet.mem<Text>(handles, handle, Text.hash(handle), Text.equal)) {
      return #err(#AlreadyCreated);
    };
    handles := TrieSet.put<Text>(handles, handle, Text.hash(handle), Text.equal);
    #ok(())
  };

  public shared({caller}) func kick(handle: Text): async Result.Result<(), Error> {
    switch(kickMap.get(handle)) {
      case(null) {
        if(not TrieSet.mem<Text>(handles, handle, Text.hash(handle), Text.equal)) {
          return #err(#NotFoundTheHandle);
        };
        kickMap.put(handle, 1:Nat);
      };
      case(?cnt) {
        kickMap.put(handle, cnt + 1);
      };
    };
    #ok(())
  };

  public shared({caller}) func kiss(handle: Text): async Result.Result<(), Error> {
    switch(kissMap.get(handle)) {
      case(null) {
        if(not TrieSet.mem<Text>(handles, handle, Text.hash(handle), Text.equal)) {
          return #err(#NotFoundTheHandle);
        };
        kissMap.put(handle, 1:Nat);        
      };
      case(?cnt) {
        kissMap.put(handle, cnt + 1);
      };
    };
    #ok(())
  };

  public query({caller}) func getKickByHandle(handle: Text): async ?Nat {
    switch(kickMap.get(handle)) {
      case(?cnt) { return ?cnt };
      case(null) { return null };
    };
  };

  public query({caller}) func getKissByHandle(handle: Text): async ?Nat {
    switch(kissMap.get(handle)) {
      case(?cnt) { return ?cnt };
      case(null) { return null };
    };
  };

  public query({caller}) func getKicksFromSmallToLarge(): async [(Text, Nat)] {
    let kickEntries: [(Text, Nat)] = Iter.toArray(kickMap.entries());
    Array.sort(kickEntries, Types.compareSmallToLarge)
  };

  public query({caller}) func getKisssFromSmallToLarge(): async [(Text, Nat)] {
    let kissEntries: [(Text, Nat)] = Iter.toArray(kissMap.entries());
    Array.sort(kissEntries, Types.compareSmallToLarge)
  };

  public query({caller}) func getKicksFromLargeToSmall(): async [(Text, Nat)] {
    let kickEntries: [(Text, Nat)] = Iter.toArray(kickMap.entries());
    Array.sort(kickEntries, Types.compareLargeToSmall)
  };

  public query({caller}) func getKisssFromLargeToSmall(): async [(Text, Nat)] {
    let kissEntries: [(Text, Nat)] = Iter.toArray(kissMap.entries());
    Array.sort(kissEntries, Types.compareLargeToSmall)
  };

  system func preupgrade() { };

  system func postupgrade() { };

};
