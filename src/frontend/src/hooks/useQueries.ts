import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApprovalStatus,
  UserProfile as BackendUserProfile,
  VirtualPetHub as BackendVirtualPetHub,
  UserApprovalInfo,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Re-export backend types
export type { BackendUserProfile as UserProfile };
export type { BackendVirtualPetHub as VirtualPetHub };
export type { UserApprovalInfo, ApprovalStatus };

// Local type definitions for types not in backend interface
export interface ActivityEvent {
  id: number;
  userId: string;
  activityType: {
    game_played?: { gameId: string; gameName: string };
    user_created?: null;
  };
  timestamp: number;
}

export interface StoryProject {
  id: string;
  owner: string;
  title: string;
  scenes: Scene[];
  createdAt: number;
  published: boolean;
  approved: boolean;
}

export interface Scene {
  background: string;
  characters: Character[];
  props: Prop[];
  animations: string[];
  textBubbles: TextBubble[];
}

export interface Character {
  name: string;
  position: { x: number; y: number };
  avatarConfig: AvatarConfig;
}

export interface Prop {
  name: string;
  position: { x: number; y: number };
  type: string;
}

export interface TextBubble {
  content: string;
  position: { x: number; y: number };
  character: string;
  style: string;
}

export interface VideoChannel {
  channelId: string;
  name: string;
  description: string;
  playlistUrl: string;
  iconUrl: string;
  categoryId: string;
  safe: boolean;
  approved: boolean;
  createdAt: bigint;
  lastUpdated?: bigint;
  lastPlayed?: bigint;
  isFavorite: boolean;
  totalVideos: bigint;
  views: bigint;
}

export interface ScaryHubGameEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  isScary: boolean;
  difficulty: string;
  theme: string;
  instructions: string;
  assets: string[];
  highScore: bigint;
  lastPlayed: bigint;
  isFavorite: boolean;
}

export interface BadgeProof {
  badge: {
    name: string;
    description: string;
    category: string;
    requirement: string;
    rewardPoints: bigint;
  };
  proof: string;
  timestamp: bigint;
}

export interface MusicRemixStudio {
  id: string;
  creator: Principal;
  title: string;
  tempo: bigint;
  pitch: bigint;
  volume: bigint;
  reverb: bigint;
  delay: bigint;
}

export interface AvatarConfig {
  body: string;
  head: string;
  hair: string;
  pants: string;
  headwear: string;
  shoes: string;
}

export interface GameState {
  id: string;
  gameName: string;
  score: number;
  highScore: number;
  achievements: string[];
  lastPlayed: number;
}

export enum FeedbackType {
  generalFeedback = "general",
  bugReport = "bug",
  featureRequest = "feature",
  safetyConcern = "safety",
  parentFeedback = "parent",
}

export interface Feedback {
  id: string;
  submitter: string;
  feedbackType: FeedbackType;
  content: string;
  timestamp: number;
  response?: string;
  anonymous: boolean;
  resolved?: boolean;
}

export interface OnlineUser {
  userId: string;
  lastSeen: number;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  isGroupChat: boolean;
  groupId?: string;
}

export interface Event {
  id: string;
  owner: string;
  eventType: string;
  title: string;
  date: number;
  description: string;
  rsvps: string[];
  photos: string[];
  checklist: string[];
  isSeasonal: boolean;
  seasonalType?: string;
}

export interface SpinReward {
  rewardType: string;
  value: string;
  timestamp: number;
}

export interface LocalSticker {
  id: string;
  creator: string;
  name: string;
  imageDataUrl: string;
  isModerated: boolean;
  approved: boolean;
}

export interface Sticker {
  id: string;
  creator: string;
  name: string;
  image: {
    getDirectURL: () => string;
  };
  isModerated: boolean;
  approved: boolean;
}

export interface MusicRemix {
  id: string;
  creator: string;
  title: string;
  audio: {
    getDirectURL: () => string;
  };
  duration: bigint;
  isPublic: boolean;
  approved: boolean;
}

export interface InventionStory {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  discoveryLevel: string;
  funFacts: string[];
}

export interface Reward {
  userId: string;
  points: number;
  badges: string[];
  achievements: string[];
  virtualPetLevel: number;
}

export interface Certificate {
  id: string;
  userId: string;
  achievement: string;
  date: number;
}

export enum AdminUserStatus {
  active = "active",
  restricted = "restricted",
  suspended = "suspended",
  banned = "banned",
}

export interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  recentActivity: any[];
  overview: {
    userStats: {
      total: number;
      active: number;
      restricted: number;
      suspended: number;
      banned: number;
    };
  };
  manageUsers: BackendUserProfile[];
  safetyAlerts: string[];
}

export interface Joke {
  id: string;
  category: string;
  content: string;
  submittedBy?: string;
  approved: boolean;
  rating: number;
}

export interface ArtworkSubmission {
  id: string;
  owner: string;
  title: string;
  artworkUrl: string;
  category: string;
  createdAt: number;
  isPublic: boolean;
  approved: boolean;
}

// User Profile Hooks
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<BackendUserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: BackendUserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Avatar Config Hook
export function useSaveAvatarConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarConfig: AvatarConfig) => {
      if (!actor) throw new Error("Actor not available");
      const profile = await actor.getCallerUserProfile();
      if (!profile) throw new Error("Profile not found");

      const updatedProfile = {
        ...profile,
        avatarConfig,
      };

      return actor.saveCallerUserProfile(updatedProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Authorization Hooks
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isApproved"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isApproved"] });
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ["approvals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      user,
      status,
    }: { user: Principal; status: ApprovalStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
    },
  });
}

// Story Builder Hooks - localStorage based (backend methods not available)
export function useGetCallerStoryProjects() {
  return useQuery<StoryProject[]>({
    queryKey: ["callerStoryProjects"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("storyProjects");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

export function useSaveStoryProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (story: StoryProject) => {
      const existing: StoryProject[] = JSON.parse(
        localStorage.getItem("storyProjects") || "[]",
      );
      const idx = existing.findIndex((s) => s.id === story.id);
      if (idx >= 0) {
        existing[idx] = story;
      } else {
        existing.push(story);
      }
      localStorage.setItem("storyProjects", JSON.stringify(existing));
      return story;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerStoryProjects"] });
    },
  });
}

// Virtual Pet Hooks
export function useGetCallerVirtualPet() {
  const { actor, isFetching } = useActor();

  return useQuery<BackendVirtualPetHub | null>({
    queryKey: ["callerVirtualPet"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVirtualPetHub();
    },
    enabled: !!actor && !isFetching,
  });
}

export const useGetVirtualPetHub = useGetCallerVirtualPet;

export function useSaveCallerVirtualPet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pet: BackendVirtualPetHub) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveVirtualPetHub(pet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerVirtualPet"] });
    },
  });
}

export const useSaveVirtualPetHub = useSaveCallerVirtualPet;

export function useGetUserTrophies() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ["userTrophies"],
    queryFn: async () => {
      if (!actor) return 70;
      const pet = await actor.getVirtualPetHub();
      return pet ? Number(pet.trophies) : 70;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateGamesTrophies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // No-op: backend method not available
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerVirtualPet"] });
      queryClient.invalidateQueries({ queryKey: ["userTrophies"] });
    },
  });
}

export function useWelcomeBackReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // No-op: backend method not available
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerVirtualPet"] });
      queryClient.invalidateQueries({ queryKey: ["userTrophies"] });
    },
  });
}

// Game States Hook - localStorage based
export function useGetMyGameStates() {
  return useQuery<GameState[]>({
    queryKey: ["myGameStates"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("gameStates");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

// Alias for backward compatibility
export const useGetMyGameStatesAlias = useGetMyGameStates;

// User Rewards Hook - uses backend getCallerRewards
export function useGetUserRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<Reward | null>({
    queryKey: ["userRewards"],
    queryFn: async () => {
      if (!actor) return null;
      const backendReward = await actor.getCallerRewards();
      if (!backendReward) return null;
      return {
        userId: backendReward.userId.toString(),
        points: Number(backendReward.points),
        badges: backendReward.badges,
        achievements: backendReward.achievements,
        virtualPetLevel: Number(backendReward.virtualPetLevel),
      };
    },
    enabled: !!actor && !isFetching,
  });
}

// Craft Project Hooks - localStorage based
export function useMarkCraftProjectCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const completed: string[] = JSON.parse(
        localStorage.getItem("completedCraftProjects") || "[]",
      );
      if (!completed.includes(projectId)) {
        completed.push(projectId);
        localStorage.setItem(
          "completedCraftProjects",
          JSON.stringify(completed),
        );
      }
      return [true, []] as [boolean, BadgeProof[]];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBadgeProofs"] });
    },
  });
}

export function useGetUserBadgeProofs() {
  return useQuery<BadgeProof[]>({
    queryKey: ["userBadgeProofs"],
    queryFn: async () => {
      const proofs = localStorage.getItem("badgeProofs");
      return proofs ? JSON.parse(proofs) : [];
    },
  });
}

// Video Channel Hooks - localStorage based
export function useGetVideoChannels() {
  return useQuery<VideoChannel[]>({
    queryKey: ["videoChannels"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("videoChannels");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

export function useUpdateVideoChannelViews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId: string) => {
      const channels: VideoChannel[] = JSON.parse(
        localStorage.getItem("videoChannels") || "[]",
      );
      const idx = channels.findIndex((c) => c.channelId === channelId);
      if (idx >= 0) {
        channels[idx] = {
          ...channels[idx],
          views: channels[idx].views + BigInt(1),
        };
        localStorage.setItem("videoChannels", JSON.stringify(channels));
      }
      return channelId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videoChannels"] });
    },
  });
}

// Admin Activity Hooks - localStorage based
export function useGetRecentActivityEvents() {
  return useQuery<ActivityEvent[]>({
    queryKey: ["recentActivityEvents"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("activityEvents");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
    refetchInterval: 5000,
  });
}

export function useRecordGamePlay() {
  return useMutation({
    mutationFn: async ({
      gameId,
      gameName,
    }: { gameId: string; gameName: string }) => {
      const events: ActivityEvent[] = JSON.parse(
        localStorage.getItem("activityEvents") || "[]",
      );
      const newEvent: ActivityEvent = {
        id: Date.now(),
        userId: "local",
        activityType: { game_played: { gameId, gameName } },
        timestamp: Date.now(),
      };
      events.unshift(newEvent);
      localStorage.setItem(
        "activityEvents",
        JSON.stringify(events.slice(0, 50)),
      );
      return newEvent;
    },
  });
}

// Admin User Management Hooks
export function useSetUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      status,
    }: { userId: Principal; status: AdminUserStatus }) => {
      const statuses = JSON.parse(localStorage.getItem("userStatuses") || "{}");
      statuses[userId.toString()] = status;
      localStorage.setItem("userStatuses", JSON.stringify(statuses));
      return status;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
}

export function useAddRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      feature,
      reason,
    }: { userId: Principal; feature: string; reason: string }) => {
      const restrictions = JSON.parse(
        localStorage.getItem("userRestrictions") || "{}",
      );
      if (!restrictions[userId.toString()]) {
        restrictions[userId.toString()] = [];
      }
      restrictions[userId.toString()].push({
        feature,
        reason,
        timestamp: Date.now(),
      });
      localStorage.setItem("userRestrictions", JSON.stringify(restrictions));
      return { userId, feature, reason };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
}

export function useRemoveRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      feature,
    }: { userId: Principal; feature: string }) => {
      const restrictions = JSON.parse(
        localStorage.getItem("userRestrictions") || "{}",
      );
      if (restrictions[userId.toString()]) {
        restrictions[userId.toString()] = restrictions[
          userId.toString()
        ].filter((r: { feature: string }) => r.feature !== feature);
        localStorage.setItem("userRestrictions", JSON.stringify(restrictions));
      }
      return { userId, feature };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
}

export function useGetAdminDashboard() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminDashboardData>({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const statuses = JSON.parse(localStorage.getItem("userStatuses") || "{}");
      const statusValues = Object.values(statuses) as AdminUserStatus[];

      let manageUsers: BackendUserProfile[] = [];
      if (actor) {
        try {
          const approvals = await actor.listApprovals();
          manageUsers = [];
          void approvals;
        } catch {
          manageUsers = [];
        }
      }

      return {
        totalUsers: statusValues.length,
        activeUsers: statusValues.filter((s) => s === AdminUserStatus.active)
          .length,
        pendingApprovals: 0,
        recentActivity: [],
        overview: {
          userStats: {
            total: statusValues.length,
            active: statusValues.filter((s) => s === AdminUserStatus.active)
              .length,
            restricted: statusValues.filter(
              (s) => s === AdminUserStatus.restricted,
            ).length,
            suspended: statusValues.filter(
              (s) => s === AdminUserStatus.suspended,
            ).length,
            banned: statusValues.filter((s) => s === AdminUserStatus.banned)
              .length,
          },
        },
        manageUsers,
        safetyAlerts: [],
      };
    },
    enabled: !!actor && !isFetching,
  });
}

// Spin Wheel Hooks
export function useGetSpinRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<SpinReward[]>({
    queryKey: ["spinRewards"],
    queryFn: async () => {
      if (!actor) return [];
      const rewards = await actor.getSpinRewards();
      return rewards.map((r) => ({
        rewardType: r.rewardType,
        value: r.value,
        timestamp: Number(r.timestamp),
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordSpinReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reward: {
      rewardType: string;
      value: string;
      timestamp: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.recordSpinReward(reward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spinRewards"] });
    },
  });
}

// claimSpinReward: adds points to Virtual Pet and enforces 20-min cooldown
export function useClaimSpinReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (points: number) => {
      if (!actor) throw new Error("Actor not available");
      return actor.claimSpinReward(BigInt(points));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtualPetHub"] });
      queryClient.invalidateQueries({ queryKey: ["callerVirtualPet"] });
      queryClient.invalidateQueries({ queryKey: ["spinCooldown"] });
    },
  });
}

// addTrophiesFromSpin: no-op (backend method removed; trophies are tracked locally)
export function useAddTrophiesFromSpin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_trophies: number) => {
      // No-op: addTrophiesFromSpin is not available in the backend interface.
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerVirtualPet"] });
      queryClient.invalidateQueries({ queryKey: ["userTrophies"] });
    },
  });
}

// addPointsFromSpin: no-op (use useClaimSpinReward instead)
export function useAddPointsFromSpin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_points: number) => {
      // No-op: use useClaimSpinReward (actor.claimSpinReward) to add points to Virtual Pet.
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerVirtualPet"] });
      queryClient.invalidateQueries({ queryKey: ["virtualPetHub"] });
    },
  });
}

// Feedback Hooks - localStorage based
export function useGetMyFeedback() {
  return useQuery<Feedback[]>({
    queryKey: ["myFeedback"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("myFeedback");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (feedback: Omit<Feedback, "id" | "timestamp">) => {
      const newFeedback: Feedback = {
        ...feedback,
        id: `feedback_${Date.now()}`,
        timestamp: Date.now(),
        submitter: identity?.getPrincipal().toString() || "anonymous",
      };
      const existing: Feedback[] = JSON.parse(
        localStorage.getItem("myFeedback") || "[]",
      );
      existing.unshift(newFeedback);
      localStorage.setItem("myFeedback", JSON.stringify(existing));
      return newFeedback;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myFeedback"] });
    },
  });
}

// Chat Hooks - localStorage based
export function useGetChatMessages() {
  return useQuery<ChatMessage[]>({
    queryKey: ["chatMessages"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("chatMessages");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
    refetchInterval: 2000,
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (
      message: Omit<ChatMessage, "id" | "timestamp" | "sender">,
    ) => {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg_${Date.now()}`,
        timestamp: Date.now(),
        sender: identity?.getPrincipal().toString() || "anonymous",
      };
      const existing: ChatMessage[] = JSON.parse(
        localStorage.getItem("chatMessages") || "[]",
      );
      existing.push(newMessage);
      localStorage.setItem(
        "chatMessages",
        JSON.stringify(existing.slice(-100)),
      );
      return newMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
    },
  });
}

export function useGetOnlineUsers() {
  return useQuery<OnlineUser[]>({
    queryKey: ["onlineUsers"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("onlineUsers");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
    refetchInterval: 5000,
  });
}

export function useUpdateOnlineStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isOnline,
    }: { userId: string; isOnline: boolean }) => {
      const users: OnlineUser[] = JSON.parse(
        localStorage.getItem("onlineUsers") || "[]",
      );
      const idx = users.findIndex((u) => u.userId === userId);
      const updatedUser: OnlineUser = {
        userId,
        isOnline,
        lastSeen: Date.now(),
      };
      if (idx >= 0) {
        users[idx] = updatedUser;
      } else {
        users.push(updatedUser);
      }
      localStorage.setItem("onlineUsers", JSON.stringify(users));
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onlineUsers"] });
    },
  });
}

// Events Hooks - localStorage based
export function useGetTodaysEvents() {
  return useQuery<Event[]>({
    queryKey: ["todaysEvents"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("events");
        const events: Event[] = stored ? JSON.parse(stored) : [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return events.filter(
          (e) => e.date >= today.getTime() && e.date < tomorrow.getTime(),
        );
      } catch {
        return [];
      }
    },
  });
}

export function useDismissEventNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const dismissed: string[] = JSON.parse(
        localStorage.getItem("dismissedEvents") || "[]",
      );
      if (!dismissed.includes(eventId)) {
        dismissed.push(eventId);
        localStorage.setItem("dismissedEvents", JSON.stringify(dismissed));
      }
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todaysEvents"] });
    },
  });
}

export function useGetActiveSeasonalEvents() {
  return useQuery<Event[]>({
    queryKey: ["activeSeasonalEvents"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("seasonalEvents");
        const events: Event[] = stored ? JSON.parse(stored) : [];
        const now = Date.now();
        return events.filter((e) => e.isSeasonal && e.date >= now);
      } catch {
        return [];
      }
    },
  });
}

// Jokes Hooks - localStorage based
export function useGetAllJokes() {
  return useQuery<Joke[]>({
    queryKey: ["allJokes"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("jokes");
        return stored ? JSON.parse(stored) : getDefaultJokes();
      } catch {
        return getDefaultJokes();
      }
    },
  });
}

function getDefaultJokes(): Joke[] {
  return [
    {
      id: "1",
      category: "animals",
      content:
        "Why don't scientists trust atoms? Because they make up everything!",
      approved: true,
      rating: 5,
    },
    {
      id: "2",
      category: "food",
      content: "What do you call a fake noodle? An impasta!",
      approved: true,
      rating: 4,
    },
    {
      id: "3",
      category: "school",
      content:
        "Why did the math book look so sad? Because it had too many problems!",
      approved: true,
      rating: 5,
    },
    {
      id: "4",
      category: "animals",
      content: "What do you call a sleeping dinosaur? A dino-snore!",
      approved: true,
      rating: 4,
    },
    {
      id: "5",
      category: "food",
      content:
        "Why did the banana go to the doctor? Because it wasn't peeling well!",
      approved: true,
      rating: 3,
    },
  ];
}

export function useSubmitJoke() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (joke: Omit<Joke, "id" | "approved">) => {
      const newJoke: Joke = {
        ...joke,
        id: `joke_${Date.now()}`,
        approved: false,
        submittedBy: identity?.getPrincipal().toString(),
      };
      const existing: Joke[] = JSON.parse(
        localStorage.getItem("jokes") || JSON.stringify(getDefaultJokes()),
      );
      existing.push(newJoke);
      localStorage.setItem("jokes", JSON.stringify(existing));
      return newJoke;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allJokes"] });
    },
  });
}

export function useRateJoke() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jokeId,
      rating,
    }: { jokeId: string; rating: number }) => {
      const jokes: Joke[] = JSON.parse(
        localStorage.getItem("jokes") || JSON.stringify(getDefaultJokes()),
      );
      const idx = jokes.findIndex((j) => j.id === jokeId);
      if (idx >= 0) {
        jokes[idx] = { ...jokes[idx], rating };
        localStorage.setItem("jokes", JSON.stringify(jokes));
      }
      return { jokeId, rating };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allJokes"] });
    },
  });
}

export function useGetJokeFavorites() {
  return useQuery<string[]>({
    queryKey: ["jokeFavorites"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("jokeFavorites");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

export function useAddJokeToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jokeId: string) => {
      const favorites: string[] = JSON.parse(
        localStorage.getItem("jokeFavorites") || "[]",
      );
      if (!favorites.includes(jokeId)) {
        favorites.push(jokeId);
        localStorage.setItem("jokeFavorites", JSON.stringify(favorites));
      }
      return jokeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jokeFavorites"] });
    },
  });
}

export function useRemoveJokeFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jokeId: string) => {
      const favorites: string[] = JSON.parse(
        localStorage.getItem("jokeFavorites") || "[]",
      );
      const updated = favorites.filter((id) => id !== jokeId);
      localStorage.setItem("jokeFavorites", JSON.stringify(updated));
      return jokeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jokeFavorites"] });
    },
  });
}

// Art Gallery Hooks
export function useGetCallerArtwork() {
  const { identity } = useInternetIdentity();

  return useQuery<ArtworkSubmission[]>({
    queryKey: ["callerArtwork"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("artGallery");
        const all: ArtworkSubmission[] = stored ? JSON.parse(stored) : [];
        const callerId = identity?.getPrincipal().toString();
        return callerId ? all.filter((a) => a.owner === callerId) : [];
      } catch {
        return [];
      }
    },
    enabled: !!identity,
  });
}

export function useGetPublicArtwork() {
  return useQuery<ArtworkSubmission[]>({
    queryKey: ["publicArtwork"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("artGallery");
        const all: ArtworkSubmission[] = stored ? JSON.parse(stored) : [];
        return all.filter((a) => a.isPublic && a.approved);
      } catch {
        return [];
      }
    },
  });
}

export function useSubmitArtwork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artwork: ArtworkSubmission) => {
      const existing: ArtworkSubmission[] = JSON.parse(
        localStorage.getItem("artGallery") || "[]",
      );
      existing.push(artwork);
      localStorage.setItem("artGallery", JSON.stringify(existing));
      return artwork;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerArtwork"] });
      queryClient.invalidateQueries({ queryKey: ["publicArtwork"] });
    },
  });
}

// Music Remix Hooks - localStorage based
export function useGetMusicRemixStudios() {
  return useQuery<MusicRemixStudio[]>({
    queryKey: ["musicRemixStudios"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("musicRemixStudios");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

// Alias for backward compatibility
export const useGetSavedRemixStudios = useGetMusicRemixStudios;

export function useSaveRemixStudio() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (studio: Omit<MusicRemixStudio, "id" | "creator">) => {
      const newStudio: MusicRemixStudio = {
        ...studio,
        id: `studio_${Date.now()}`,
        creator: identity?.getPrincipal() as Principal,
      };
      const existing: MusicRemixStudio[] = JSON.parse(
        localStorage.getItem("musicRemixStudios") || "[]",
      );
      existing.push(newStudio);
      localStorage.setItem("musicRemixStudios", JSON.stringify(existing));
      return newStudio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicRemixStudios"] });
    },
  });
}

// Sticker Hooks - localStorage based
export function useGetApprovedStickers() {
  return useQuery<Sticker[]>({
    queryKey: ["approvedStickers"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("stickers");
        const stickers: LocalSticker[] = stored ? JSON.parse(stored) : [];
        return stickers
          .filter((s) => s.approved)
          .map((s) => ({
            id: s.id,
            creator: s.creator,
            name: s.name,
            image: {
              getDirectURL: () => s.imageDataUrl,
            },
            isModerated: s.isModerated,
            approved: s.approved,
          }));
      } catch {
        return [];
      }
    },
  });
}

export function useCreateSticker() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      name,
      image,
    }: { name: string; image: Uint8Array }) => {
      // Cast to Uint8Array<ArrayBuffer> to satisfy the Blob constructor's BlobPart type requirement
      const safeImage =
        image.buffer instanceof ArrayBuffer
          ? (image as Uint8Array<ArrayBuffer>)
          : (new Uint8Array(image) as Uint8Array<ArrayBuffer>);

      const blob = new Blob([safeImage], { type: "image/png" });
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const newSticker: LocalSticker = {
        id: `sticker_${Date.now()}`,
        creator: identity?.getPrincipal().toString() || "anonymous",
        name,
        imageDataUrl: dataUrl,
        isModerated: false,
        approved: false,
      };

      const existing: LocalSticker[] = JSON.parse(
        localStorage.getItem("stickers") || "[]",
      );
      existing.push(newSticker);
      localStorage.setItem("stickers", JSON.stringify(existing));
      return newSticker;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvedStickers"] });
    },
  });
}

// Certificate Hooks
export function useGetUserCertificates() {
  const { identity } = useInternetIdentity();

  return useQuery<Certificate[]>({
    queryKey: ["userCertificates"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("certificates");
        const all: Certificate[] = stored ? JSON.parse(stored) : [];
        const userId = identity?.getPrincipal().toString();
        return userId ? all.filter((c) => c.userId === userId) : [];
      } catch {
        return [];
      }
    },
    enabled: !!identity,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certificate: Certificate) => {
      const existing: Certificate[] = JSON.parse(
        localStorage.getItem("certificates") || "[]",
      );
      existing.push(certificate);
      localStorage.setItem("certificates", JSON.stringify(existing));
      return certificate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCertificates"] });
    },
  });
}

// Invention Stories Hooks - localStorage based
export function useGetAllInventionStories() {
  return useQuery<InventionStory[]>({
    queryKey: ["inventionStories"],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem("inventionStories");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}
