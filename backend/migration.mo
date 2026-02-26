import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  public type OldReward = {
    userId : Principal;
    points : Nat;
    badges : [Text];
    achievements : [Text];
    virtualPetLevel : Nat;
  };

  public type NewReward = {
    userId : Principal;
    points : Nat;
    badges : [Text];
    achievements : [Text];
    virtualPetLevel : Nat;
    totalTrophies : Nat;
  };

  public type OldActor = {
    rewards : Map.Map<Principal, OldReward>;
  };

  public type NewActor = {
    rewards : Map.Map<Principal, NewReward>;
  };

  public func run(old : OldActor) : NewActor {
    let newRewards = old.rewards.map<Principal, OldReward, NewReward>(
      func(_id, oldReward) {
        { oldReward with totalTrophies = 0 };
      }
    );
    { old with rewards = newRewards };
  };
};
