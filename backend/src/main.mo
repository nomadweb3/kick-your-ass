import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Types "types";
import TrieSet "mo:base/TrieSet";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import {DAY} "mo:time-consts";

actor {

  type Error = Types.Error;
  type TwitterMetaData = Types.TwitterMetaData;
  type ClickData = Types.ClickData;
  type ClickAmoutMetaData = Types.ClickAmoutMetaData;
  type ClickType = Types.ClickType;

  stable var kickMap_entries: [(Text, Nat)] = [];
  stable var kissMap_entries: [(Text, Nat)] = [];
  stable var twitterInfos_entries: [(Text, TwitterMetaData)] = [];
  stable var clickInfos_entries: [(Principal, TrieSet.Set<ClickData>)] = [];
  stable var userClickAmoutMap_entries: [(Principal, ClickAmoutMetaData)] = [];

  let kickMap = TrieMap.fromEntries<Text, Nat>(kickMap_entries.vals(), Text.equal, Text.hash);
  let kissMap = TrieMap.fromEntries<Text, Nat>(kissMap_entries.vals(), Text.equal, Text.hash);
  let twitterInfos = TrieMap.fromEntries<Text, TwitterMetaData>(twitterInfos_entries.vals(), Text.equal, Text.hash);
  let clickInfos = TrieMap.fromEntries<Principal, TrieSet.Set<ClickData>>(clickInfos_entries.vals(), Principal.equal, Principal.hash);
  let userClickAmoutMap = TrieMap.fromEntries<Principal, ClickAmoutMetaData>(userClickAmoutMap_entries.vals(),Principal.equal, Principal.hash);

  stable var DAY_CLICK_AMOUNT: Nat = 3;
  stable var handles = TrieSet.empty<Text>();

  public shared({caller}) func updateUserTwitterInfo(userName: Text, profilePicURL: Text): async Result.Result<(), Error> {
    twitterInfos.put(userName, ({
      userName = userName;
      profilePicURL = profilePicURL;
    }));
    #ok(())
  };

  public shared({caller}) func create(handle: Text): async Result.Result<(), Error> {
    if(TrieSet.mem<Text>(handles, handle, Text.hash(handle), Text.equal)) {
      return #err(#AlreadyCreated);
    };
    handles := TrieSet.put<Text>(handles, handle, Text.hash(handle), Text.equal);
    #ok(())
  };

  public shared({caller}) func kick(
    handle: Text,
    time: Time.Time,
  ): async Result.Result<(), Error> {
    if(isAnonymous(caller)) return #err(#AnonymousCaller);
    // 检查是否可点击
    if(not checkUserClickAmout(caller, time)) return #err(#ClickAmountNotEnough);
    switch(kickMap.get(handle)) {
      case(null) {
        if(not TrieSet.mem<Text>(handles, handle, Text.hash(handle), Text.equal)) {
          return #err(#NotFoundTheHandle);
        };
        kickMap.put(handle, 1:Nat);
        addClick(handle, caller, #Kick, time);
      };
      case(?cnt) {
        kickMap.put(handle, cnt + 1);
        addClick(handle, caller, #Kick, time);
      };
    };
    #ok(())
  };

  public shared({caller}) func kiss(
    handle: Text,
    time: Time.Time,
  ): async Result.Result<(), Error> {
    if(isAnonymous(caller)) return #err(#AnonymousCaller);
    // 检查是否可点击
    if(not checkUserClickAmout(caller, time)) return #err(#ClickAmountNotEnough);
    switch(kissMap.get(handle)) {
      case(null) {
        if(not TrieSet.mem<Text>(handles, handle, Text.hash(handle), Text.equal)) {
          return #err(#NotFoundTheHandle);
        };
        kissMap.put(handle, 1:Nat);      
        addClick(handle, caller, #Kiss, time);  
      };
      case(?cnt) {
        kissMap.put(handle, cnt + 1);
        addClick(handle, caller, #Kiss, time);  
      };
    };
    #ok(())
  };

  public query({caller}) func getTotalKickAmount(): async Nat {
    var amount: Nat = 0;
    for(v in kickMap.vals()) {
      amount += v;
    };
    amount
  };

  public query({caller}) func getTotalUserAmount(): async Nat {
    Iter.size(clickInfos.keys())
  };

  public query({caller}) func getTotalKissAmount(): async Nat {
    var amount: Nat = 0;
    for(v in kissMap.vals()) {
      amount += v;
    };
    amount
  };

  public query({caller}) func getUserTwitterPicURL(userName: Text): async ?Text {
    switch(twitterInfos.get(userName)) {
      case(?metaData) {
        return ?metaData.profilePicURL;
      };
      case(null) { return null;};
    };
    null
  };

  public query({caller}) func isHaveTwitterInfo(userName: Text): async Bool {
    switch(twitterInfos.get(userName)) {
      case(?metadata) {
        return true;
      };
      case(null) {
        return false;
      };
    };
    false
  };

  public query({caller}) func isCreated(handle: Text): async Bool {
    TrieSet.mem<Text>(handles, handle, Text.hash(handle), Text.equal)
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

  public query({caller}) func get_DAY_CLICK_AMOUNT(): async Nat { DAY_CLICK_AMOUNT };

  public query({caller}) func getUserClickAmoutMapEntries(): async [(Principal, ClickAmoutMetaData)] {
    Iter.toArray(userClickAmoutMap.entries())
  };

  public query({caller}) func getClickInfosEntries(): async [(Principal, [ClickData])] {
    Iter.toArray(TrieMap.map<Principal, TrieSet.Set<ClickData>, [ClickData]>(
      clickInfos,
      Principal.equal,
      Principal.hash,
      func(k, v1): [ClickData] {
        TrieSet.toArray(v1)
      }
    ).entries())
  };

  public query({caller}) func getTwitterInfosEntries(): async [(Text, TwitterMetaData)] {
    Iter.toArray(twitterInfos.entries())
  };

  private func isAnonymous(caller: Principal): Bool {
    Principal.isAnonymous(caller)
  };

  // 新增一次点击，
  // 需要处理clickInfos 和 userClickAmoutMap
  private func addClick(
    handle: Text, 
    user: Principal,
    clickType: ClickType,
    time: Time.Time,
  ) {
    switch(clickInfos.get(user)) {
      case(?clickSet) {
        let newClickSet = TrieSet.put(
          clickSet, {
            handle = handle;
            time = time;
            clickType = clickType;
          }, Types.clickDataHash({
            handle = handle;
            time = time;
            clickType = clickType;
          }), Types.clickDataEqual
        );
        clickInfos.put(user, newClickSet);
      };
      case(null) {
        let clickSet = TrieSet.fromArray([{
          handle = handle;
          time = time;
          clickType = clickType;
        }], Types.clickDataHash, Types.clickDataEqual);
        clickInfos.put(user, clickSet);
      };
    };
    switch(userClickAmoutMap.get(user)) {
      case(?amountMetaData) {
        if(amountMetaData.amount < DAY_CLICK_AMOUNT) {
          userClickAmoutMap.put(user, {
            amount = amountMetaData.amount + 1;
            lastClickTime = time;
          });
        } else {
          userClickAmoutMap.put(user, {
            amount = 1;
            lastClickTime = time;
          });
        };
      };
      case(null) {
        // 第一次点击，初始化点击次数
        userClickAmoutMap.put(user,{
          amount = 1;
          lastClickTime = time;
        });
      };
    };
  };

  private func checkUserClickAmout(user: Principal, time: Time.Time): Bool {
    switch(userClickAmoutMap.get(user)) {
      case(null) { return true}; // 没有点击过，可以点击
      case(?metaData) {
        // 点击过但小于DAY_CLICK_AMOUNT次，可以直接点击
        if(metaData.amount < DAY_CLICK_AMOUNT) { 
          return true;
        } else {
          // 点击已经达到3次，检查前后两次的点击时间间隔是否大于一天
          let interval = time - metaData.lastClickTime;
          if(interval > DAY) {
            // 间隔超过一天,重置amount
            userClickAmoutMap.put(user, ({
              amount = 0;
              lastClickTime = Time.now();
            }));
            return true;
          } else { //间隔不足一天
            return false;
          }
        }
      };
    };
    false
  };

  system func preupgrade() {
    kickMap_entries := Iter.toArray(kickMap.entries());
    kissMap_entries := Iter.toArray(kissMap.entries());
    twitterInfos_entries := Iter.toArray(twitterInfos.entries());
    clickInfos_entries := Iter.toArray(clickInfos.entries());
    userClickAmoutMap_entries := Iter.toArray(userClickAmoutMap.entries());
  };

  system func postupgrade() {
    kickMap_entries := [];
    kissMap_entries := [];
    twitterInfos_entries := [];
    clickInfos_entries := [];
    userClickAmoutMap_entries := [];
    DAY_CLICK_AMOUNT := 20;
  };

};
