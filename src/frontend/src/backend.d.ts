import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SpinReward {
    value: string;
    rewardType: string;
    timestamp: bigint;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface VirtualPetHub {
    growthStage: bigint;
    accessories: Array<string>;
    userId: Principal;
    warnedAboutExtremeChanges: boolean;
    happinessLevel: bigint;
    petName: string;
    trophies: bigint;
    homeStyle: string;
    decorations: Array<string>;
}
export interface Reward {
    userId: Principal;
    badges: Array<string>;
    achievements: Array<string>;
    totalTrophies: bigint;
    virtualPetLevel: bigint;
    points: bigint;
}
export interface SpinWheelResult {
    remainingCooldown: bigint;
    pointsAdded: bigint;
    message: string;
}
export interface AvatarConfig {
    body: string;
    hair: string;
    head: string;
    headwear: string;
    shoes: string;
    pants: string;
}
export interface AccessibilitySettings {
    highContrastMode: boolean;
    largeText: boolean;
    readAloudEnabled: boolean;
}
export interface UserProfile {
    age: bigint;
    mascotPreference: string;
    theme: string;
    approvedContacts: Array<Principal>;
    parentPrincipal: Principal;
    name: string;
    screenTimeLimit: bigint;
    avatarUrl: string;
    contentFilterLevel: string;
    avatarConfig?: AvatarConfig;
    accessibilitySettings: AccessibilitySettings;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimSpinReward(points: bigint): Promise<SpinWheelResult>;
    getCallerRewards(): Promise<Reward | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLastSpinTime(): Promise<bigint | null>;
    getRemainingSpinCooldown(): Promise<bigint>;
    getSpinRewards(): Promise<Array<SpinReward>>;
    getTotalScore(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVirtualPetHub(): Promise<VirtualPetHub | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    recordSpinReward(reward: SpinReward): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerRewards(reward: Reward): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveVirtualPetHub(pet: VirtualPetHub): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
}
