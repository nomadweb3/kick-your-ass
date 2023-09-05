import Order "mo:base/Order";

module {

    public func compareSmallToLarge(x: (Text, Nat), y: (Text, Nat)): Order.Order {
        if (x.1 < y.1) { #less } else if (x == y) { #equal } else { #greater }
    };

    public func compareLargeToSmall(x: (Text, Nat), y: (Text, Nat)): Order.Order {
        if (x.1 > y.1) { #less } else if (x == y) { #equal } else { #greater }
    };
    
}