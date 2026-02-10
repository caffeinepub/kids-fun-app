import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TextBubble {
    content: string;
    character: string;
    style: string;
    position: {
        x: bigint;
        y: bigint;
    };
}
export type Time = bigint;
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
export interface ScaryHubGameEntry {
    id: string;
    lastPlayed: bigint;
    theme: string;
    title: string;
    isScary: boolean;
    difficulty: string;
    assets: Array<string>;
    description: string;
    isFavorite: boolean;
    instructions: string;
    highScore: bigint;
    category: string;
}
export type ActivityType = {
    __kind__: "user_created";
    user_created: null;
} | {
    __kind__: "game_played";
    game_played: {
        gameId: string;
        gameName: string;
    };
};
export interface Character {
    name: string;
    position: {
        x: bigint;
        y: bigint;
    };
    avatarConfig: AvatarConfig;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface Prop {
    name: string;
    type: string;
    position: {
        x: bigint;
        y: bigint;
    };
}
export interface ActivityEvent {
    id: bigint;
    activityType: ActivityType;
    userId: Principal;
    timestamp: Time;
}
export interface VideoChannel {
    categoryId: string;
    lastPlayed?: Time;
    channelId: string;
    views: bigint;
    name: string;
    createdAt: Time;
    safe: boolean;
    lastUpdated?: Time;
    description: string;
    isFavorite: boolean;
    playlistUrl: string;
    approved: boolean;
    totalVideos: bigint;
    iconUrl: string;
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
export interface StoryProject {
    id: string;
    title: string;
    owner: Principal;
    scenes: Array<Scene>;
    published: boolean;
    createdAt: bigint;
    approved: boolean;
}
export interface Scene {
    background: string;
    textBubbles: Array<TextBubble>;
    characters: Array<Character>;
    animations: Array<string>;
    props: Array<Prop>;
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
    addVideoChannel(channel: VideoChannel): Promise<void>;
    approveStoryProject(storyId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteStoryProject(storyId: string): Promise<void>;
    deleteVideoChannel(channelId: string): Promise<void>;
    getAllStoryProjects(): Promise<Array<StoryProject>>;
    getCallerFavoriteChannels(): Promise<Array<string>>;
    getCallerStoryProjects(): Promise<Array<StoryProject>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerVirtualPet(): Promise<VirtualPetHub | null>;
    getRecentActivityEvents(limit: bigint): Promise<Array<ActivityEvent>>;
    getScaryHubGames(): Promise<Array<ScaryHubGameEntry>>;
    getStoryProject(storyId: string): Promise<StoryProject | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoChannel(channelId: string): Promise<VideoChannel | null>;
    getVideoChannels(): Promise<Array<VideoChannel>>;
    getVirtualPet(user: Principal): Promise<VirtualPetHub | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    markChannelAsFavorite(channelId: string): Promise<void>;
    publishStoryProject(storyId: string): Promise<void>;
    recordGamePlay(gameId: string, gameName: string): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCallerVirtualPet(pet: VirtualPetHub): Promise<void>;
    saveStoryProject(story: StoryProject): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    unmarkChannelAsFavorite(channelId: string): Promise<void>;
    updateGamesTrophies(): Promise<bigint>;
    updateStoryProject(storyId: string, updatedStory: StoryProject): Promise<void>;
    updateVideoChannel(channelId: string, updatedChannel: VideoChannel): Promise<void>;
    updateVideoChannelViews(channelId: string): Promise<void>;
    welcomeBackReward(): Promise<void>;
}
