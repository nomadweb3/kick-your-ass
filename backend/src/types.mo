import Order "mo:base/Order";
import Time "mo:base/Time";
import Hash "mo:base/Hash";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Int "mo:base/Int";

module {

    public type Error = {
        #AlreadyCreated;
        #NotFoundTheHandle;
        #AnonymousCaller;
        #ClickAmountNotEnough;
    };

    public type TwitterMetaData = {
        userName: Text;
        profilePicURL: Text;
    };

    public type ClickType = {
        #Kiss;
        #Kick;
    };

    public type ClickData = {
        handle: Text;
        time: Time.Time;
        clickType: ClickType;
    };

    public type ClickAmoutMetaData = {
        amount: Nat;
        lastClickTime: Time.Time;
    };

    public func clickTypeHash(x: ClickType): Hash.Hash {
        switch(x) {
            case(#Kiss) { return Text.hash("Kiss");};
            case(#Kick) { return Text.hash("Kick");};
        };
    };

    public func clickDataHash(x: ClickData): Hash.Hash {
        Text.hash(
            Nat32.toText(Text.hash(x.handle))
            # Nat32.toText(Int.hash(x.time))
            # Nat32.toText(clickTypeHash(x.clickType))
        )
    };

    public func clickDataEqual(x: ClickData, y: ClickData): Bool {
        if(x.handle != y.handle) return false;
        if(x.time != y.time) return false;
        if(x.clickType != y.clickType) return false;
        true
    };

    public func compareSmallToLarge(x: (Text, Nat), y: (Text, Nat)): Order.Order {
        if (x.1 < y.1) { #less } else if (x == y) { #equal } else { #greater }
    };

    public func compareLargeToSmall(x: (Text, Nat), y: (Text, Nat)): Order.Order {
        if (x.1 > y.1) { #less } else if (x == y) { #equal } else { #greater }
    };
    
}