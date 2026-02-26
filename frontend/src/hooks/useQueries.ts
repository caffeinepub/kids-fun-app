import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Principal } from '@icp-sdk/core/principal';
import type {
  UserProfile as BackendUserProfile,
  VirtualPetHub as BackendVirtualPetHub,
  UserApprovalInfo,
  ApprovalStatus,
} from '../backend';

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
  generalFeedback = 'general',
  bugReport = 'bug',
  featureRequest = 'feature',
  safetyConcern = 'safety',
  parentFeedback = 'parent',
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
  active = 'active',
  restricted = 'restricted',
  suspended = 'suspended',
  banned = 'banned',
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
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Avatar Config Hook
export function useSaveAvatarConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarConfig: AvatarConfig) => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      if (!profile) throw new Error('Profile not found');

      const updatedProfile = {
        ...profile,
        avatarConfig,
      };

      return actor.saveCallerUserProfile(updatedProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Authorization Hooks
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
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
    queryKey: ['isApproved'],
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
      if (!actor) throw new Error('Actor not available');
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isApproved'] });
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvals'],
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
    mutationFn: async ({ user, status }: { user: Principal; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

// Story Builder Hooks - localStorage based (backend methods not available)
export function useGetCallerStoryProjects() {
  return useQuery<StoryProject[]>({
    queryKey: ['callerStoryProjects'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('storyProjects');
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
      const existing: StoryProject[] = JSON.parse(localStorage.getItem('storyProjects') || '[]');
      const idx = existing.findIndex((s) => s.id === story.id);
      if (idx >= 0) {
        existing[idx] = story;
      } else {
        existing.push(story);
      }
      localStorage.setItem('storyProjects', JSON.stringify(existing));
      return story;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerStoryProjects'] });
    },
  });
}

// Virtual Pet Hooks
export function useGetCallerVirtualPet() {
  const { actor, isFetching } = useActor();

  return useQuery<BackendVirtualPetHub | null>({
    queryKey: ['callerVirtualPet'],
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
      if (!actor) throw new Error('Actor not available');
      return actor.saveVirtualPetHub(pet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerVirtualPet'] });
    },
  });
}

export const useSaveVirtualPetHub = useSaveCallerVirtualPet;

export function useGetUserTrophies() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['userTrophies'],
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
      queryClient.invalidateQueries({ queryKey: ['callerVirtualPet'] });
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
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
      queryClient.invalidateQueries({ queryKey: ['callerVirtualPet'] });
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
    },
  });
}

// Game States Hook - localStorage based
export function useGetMyGameStates() {
  return useQuery<GameState[]>({
    queryKey: ['myGameStates'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('gameStates');
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
    queryKey: ['userRewards'],
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
      const completed: string[] = JSON.parse(localStorage.getItem('completedCraftProjects') || '[]');
      if (!completed.includes(projectId)) {
        completed.push(projectId);
        localStorage.setItem('completedCraftProjects', JSON.stringify(completed));
      }
      return [true, []] as [boolean, BadgeProof[]];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBadgeProofs'] });
    },
  });
}

export function useGetUserBadgeProofs() {
  return useQuery<BadgeProof[]>({
    queryKey: ['userBadgeProofs'],
    queryFn: async () => {
      const proofs = localStorage.getItem('badgeProofs');
      return proofs ? JSON.parse(proofs) : [];
    },
  });
}

// Video Channel Hooks - localStorage based
export function useGetVideoChannels() {
  return useQuery<VideoChannel[]>({
    queryKey: ['videoChannels'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('videoChannels');
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
      const channels: VideoChannel[] = JSON.parse(localStorage.getItem('videoChannels') || '[]');
      const idx = channels.findIndex((c) => c.channelId === channelId);
      if (idx >= 0) {
        channels[idx] = { ...channels[idx], views: channels[idx].views + BigInt(1) };
        localStorage.setItem('videoChannels', JSON.stringify(channels));
      }
      return channelId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoChannels'] });
    },
  });
}

// Admin Activity Hooks - localStorage based
export function useGetRecentActivityEvents() {
  return useQuery<ActivityEvent[]>({
    queryKey: ['recentActivityEvents'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('activityEvents');
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
    mutationFn: async ({ gameId, gameName }: { gameId: string; gameName: string }) => {
      const events: ActivityEvent[] = JSON.parse(localStorage.getItem('activityEvents') || '[]');
      const newEvent: ActivityEvent = {
        id: Date.now(),
        userId: 'local',
        activityType: { game_played: { gameId, gameName } },
        timestamp: Date.now(),
      };
      events.unshift(newEvent);
      localStorage.setItem('activityEvents', JSON.stringify(events.slice(0, 50)));
      return newEvent;
    },
  });
}

// Admin User Management Hooks
export function useSetUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: Principal; status: AdminUserStatus }) => {
      const statuses = JSON.parse(localStorage.getItem('userStatuses') || '{}');
      statuses[userId.toString()] = status;
      localStorage.setItem('userStatuses', JSON.stringify(statuses));
      return status;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useAddRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, feature, reason }: { userId: Principal; feature: string; reason: string }) => {
      const restrictions = JSON.parse(localStorage.getItem('userRestrictions') || '{}');
      if (!restrictions[userId.toString()]) {
        restrictions[userId.toString()] = [];
      }
      restrictions[userId.toString()].push({ feature, reason, timestamp: Date.now() });
      localStorage.setItem('userRestrictions', JSON.stringify(restrictions));
      return { userId, feature, reason };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useRemoveRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, feature }: { userId: Principal; feature: string }) => {
      const restrictions = JSON.parse(localStorage.getItem('userRestrictions') || '{}');
      if (restrictions[userId.toString()]) {
        restrictions[userId.toString()] = restrictions[userId.toString()].filter(
          (r: any) => r.feature !== feature
        );
        localStorage.setItem('userRestrictions', JSON.stringify(restrictions));
      }
      return { userId, feature };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

// Scary Hub Games - localStorage based
export function useGetScaryHubGames() {
  return useQuery<ScaryHubGameEntry[]>({
    queryKey: ['scaryHubGames'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('scaryHubGames');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

// Helper function to convert Uint8Array to base64 efficiently
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

// Sticker Hooks
export function useCreateSticker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, image }: { name: string; image: Uint8Array }) => {
      if (!actor) throw new Error('Actor not available');

      const stickerId = `sticker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const stickers = JSON.parse(localStorage.getItem('stickers') || '[]');
      stickers.push({
        id: stickerId,
        name,
        imageData: uint8ArrayToBase64(image),
        approved: false,
        timestamp: Date.now(),
      });
      localStorage.setItem('stickers', JSON.stringify(stickers));

      return stickerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedStickers'] });
    },
  });
}

export function useGetApprovedStickers() {
  return useQuery<Sticker[]>({
    queryKey: ['approvedStickers'],
    queryFn: async () => {
      try {
        const stickers = JSON.parse(localStorage.getItem('stickers') || '[]');
        return stickers
          .filter((s: any) => s.approved)
          .map((s: any) => ({
            id: s.id,
            creator: 'user',
            name: s.name,
            image: {
              getDirectURL: () => `data:image/png;base64,${s.imageData}`,
            },
            isModerated: true,
            approved: true,
          }));
      } catch (error) {
        console.error('Error loading stickers:', error);
        return [];
      }
    },
  });
}

// Music Remix Studio Hooks - localStorage based
export function useSaveRemixStudio() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (remix: Omit<MusicRemixStudio, 'id' | 'creator'>) => {
      if (!identity) throw new Error('User not authenticated');

      const remixId = `remix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const fullRemix: MusicRemixStudio = {
        id: remixId,
        creator: identity.getPrincipal(),
        ...remix,
      };

      const remixes: MusicRemixStudio[] = JSON.parse(localStorage.getItem('remixStudios') || '[]');
      remixes.push(fullRemix);
      localStorage.setItem('remixStudios', JSON.stringify(remixes));

      return remixId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedRemixStudios'] });
    },
  });
}

export function useGetSavedRemixStudios() {
  return useQuery<MusicRemixStudio[]>({
    queryKey: ['savedRemixStudios'],
    queryFn: async () => {
      try {
        const remixes = JSON.parse(localStorage.getItem('remixStudios') || '[]');
        return remixes.map((r: any) => ({
          id: r.id,
          creator: r.creator,
          title: r.title,
          tempo: BigInt(r.tempo || 0),
          pitch: BigInt(r.pitch || 0),
          volume: BigInt(r.volume || 0),
          reverb: BigInt(r.reverb || 0),
          delay: BigInt(r.delay || 0),
        }));
      } catch {
        return [];
      }
    },
  });
}

// Legacy Music Remix Hooks
export function useCreateMusicRemix() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, audio, duration }: { title: string; audio: Uint8Array; duration: bigint }) => {
      const remixId = `remix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const remixes = JSON.parse(localStorage.getItem('musicRemixes') || '[]');
      remixes.push({
        id: remixId,
        title,
        audioData: uint8ArrayToBase64(audio),
        duration: duration.toString(),
        approved: true,
        timestamp: Date.now(),
      });
      localStorage.setItem('musicRemixes', JSON.stringify(remixes));

      return remixId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedRemixes'] });
    },
  });
}

export function useGetApprovedRemixes() {
  return useQuery<MusicRemix[]>({
    queryKey: ['approvedRemixes'],
    queryFn: async () => {
      try {
        const remixes = JSON.parse(localStorage.getItem('musicRemixes') || '[]');
        return remixes
          .filter((r: any) => r.approved)
          .map((r: any) => ({
            id: r.id,
            creator: 'user',
            title: r.title,
            audio: {
              getDirectURL: () => `data:audio/wav;base64,${r.audioData}`,
            },
            duration: BigInt(r.duration || 0),
            isPublic: true,
            approved: true,
          }));
      } catch (error) {
        console.error('Error loading remixes:', error);
        return [];
      }
    },
  });
}

// Admin Dashboard Hook
export function useGetAdminDashboard() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminDashboardData>({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const defaultData: AdminDashboardData = {
        totalUsers: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        recentActivity: [],
        overview: {
          userStats: {
            total: 0,
            active: 0,
            restricted: 0,
            suspended: 0,
            banned: 0,
          },
        },
        manageUsers: [],
        safetyAlerts: [],
      };

      if (!actor) return defaultData;

      try {
        const approvals = await actor.listApprovals();
        const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;
        const recentActivity = JSON.parse(localStorage.getItem('activityEvents') || '[]');

        return {
          ...defaultData,
          totalUsers: approvals.length,
          activeUsers: approvals.filter((a) => a.status === 'approved').length,
          pendingApprovals,
          recentActivity,
          overview: {
            userStats: {
              total: approvals.length,
              active: approvals.filter((a) => a.status === 'approved').length,
              restricted: 0,
              suspended: 0,
              banned: approvals.filter((a) => a.status === 'rejected').length,
            },
          },
        };
      } catch {
        return defaultData;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

// Spin Wheel Hooks
export function useAddTrophiesFromSpin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trophies: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTrophiesFromSpin(BigInt(trophies));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['totalScore'] });
      queryClient.invalidateQueries({ queryKey: ['callerVirtualPet'] });
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
    },
  });
}

export function useAddPointsFromSpin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (points: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPointsFromSpin(BigInt(points));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerVirtualPet'] });
      queryClient.invalidateQueries({ queryKey: ['virtualPetHub'] });
    },
  });
}

export function useGetTotalScore() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalScore'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalScore();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSpinRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<{ rewardType: string; value: string; timestamp: bigint }>>({
    queryKey: ['spinRewards'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSpinRewards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordSpinReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reward: { rewardType: string; value: string; timestamp: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordSpinReward(reward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spinRewards'] });
    },
  });
}

// Art Gallery Hooks - localStorage based
export function useGetArtGallery() {
  return useQuery<ArtworkSubmission[]>({
    queryKey: ['artGallery'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('artGallery');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

export function useGetCallerArtwork() {
  const { identity } = useInternetIdentity();

  return useQuery<ArtworkSubmission[]>({
    queryKey: ['callerArtwork'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('artGallery');
        const all: ArtworkSubmission[] = stored ? JSON.parse(stored) : [];
        const callerId = identity?.getPrincipal().toString();
        if (!callerId) return [];
        return all.filter((a) => a.owner === callerId);
      } catch {
        return [];
      }
    },
  });
}

export function useGetPublicArtwork() {
  return useQuery<ArtworkSubmission[]>({
    queryKey: ['publicArtwork'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('artGallery');
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
      const gallery: ArtworkSubmission[] = JSON.parse(localStorage.getItem('artGallery') || '[]');
      gallery.push(artwork);
      localStorage.setItem('artGallery', JSON.stringify(gallery));
      return artwork;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artGallery'] });
      queryClient.invalidateQueries({ queryKey: ['callerArtwork'] });
      queryClient.invalidateQueries({ queryKey: ['publicArtwork'] });
    },
  });
}

export function useSaveArtwork() {
  return useSubmitArtwork();
}

// Joke Hooks - localStorage based
export function useGetJokes() {
  return useQuery<Joke[]>({
    queryKey: ['jokes'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('jokes');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

// Alias for backward compatibility
export const useGetAllJokes = useGetJokes;

export function useGetJokesByCategory(category?: string) {
  return useQuery<Joke[]>({
    queryKey: ['jokes', 'category', category],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('jokes');
        const all: Joke[] = stored ? JSON.parse(stored) : [];
        if (!category || category === 'all') return all;
        return all.filter((j) => j.category === category);
      } catch {
        return [];
      }
    },
  });
}

export function useSubmitJoke() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (joke: Omit<Joke, 'id' | 'approved'>) => {
      const jokes: Joke[] = JSON.parse(localStorage.getItem('jokes') || '[]');
      const newJoke: Joke = {
        ...joke,
        id: `joke_${Date.now()}`,
        approved: false,
      };
      jokes.push(newJoke);
      localStorage.setItem('jokes', JSON.stringify(jokes));
      return newJoke;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jokes'] });
    },
  });
}

export function useRateJoke() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jokeId, rating }: { jokeId: string; rating: number }) => {
      const jokes: Joke[] = JSON.parse(localStorage.getItem('jokes') || '[]');
      const idx = jokes.findIndex((j) => j.id === jokeId);
      if (idx >= 0) {
        jokes[idx] = { ...jokes[idx], rating };
        localStorage.setItem('jokes', JSON.stringify(jokes));
      }
      return { jokeId, rating };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jokes'] });
    },
  });
}

export function useGetJokeFavorites() {
  return useQuery<string[]>({
    queryKey: ['jokeFavorites'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('jokeFavorites');
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
      const favorites: string[] = JSON.parse(localStorage.getItem('jokeFavorites') || '[]');
      if (!favorites.includes(jokeId)) {
        favorites.push(jokeId);
        localStorage.setItem('jokeFavorites', JSON.stringify(favorites));
      }
      return jokeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jokeFavorites'] });
    },
  });
}

export function useRemoveJokeFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jokeId: string) => {
      const favorites: string[] = JSON.parse(localStorage.getItem('jokeFavorites') || '[]');
      const updated = favorites.filter((id) => id !== jokeId);
      localStorage.setItem('jokeFavorites', JSON.stringify(updated));
      return jokeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jokeFavorites'] });
    },
  });
}

// Feedback Hooks - localStorage based
export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: Omit<Feedback, 'id' | 'timestamp'>) => {
      const feedbacks: Feedback[] = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      const newFeedback: Feedback = {
        ...feedback,
        id: `feedback_${Date.now()}`,
        timestamp: Date.now(),
      };
      feedbacks.push(newFeedback);
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
      return newFeedback;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });
}

export function useGetFeedbacks() {
  return useQuery<Feedback[]>({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('feedbacks');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

// Alias for backward compatibility
export const useGetMyFeedback = useGetFeedbacks;

// Chat Hooks - localStorage based
export function useGetChatMessages() {
  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('chatMessages');
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

  return useMutation({
    mutationFn: async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      const messages: ChatMessage[] = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      const newMessage: ChatMessage = {
        ...message,
        id: `msg_${Date.now()}`,
        timestamp: Date.now(),
      };
      messages.push(newMessage);
      localStorage.setItem('chatMessages', JSON.stringify(messages.slice(-100)));
      return newMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });
}

// Online Users - localStorage based
export function useGetOnlineUsers() {
  return useQuery<OnlineUser[]>({
    queryKey: ['onlineUsers'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('onlineUsers');
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
    mutationFn: async ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      const users: OnlineUser[] = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
      const idx = users.findIndex((u) => u.userId === userId);
      const updatedUser: OnlineUser = { userId, isOnline, lastSeen: Date.now() };
      if (idx >= 0) {
        users[idx] = updatedUser;
      } else {
        users.push(updatedUser);
      }
      localStorage.setItem('onlineUsers', JSON.stringify(users));
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onlineUsers'] });
    },
  });
}

// Event Hooks - localStorage based
export function useGetEvents() {
  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('events');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

export function useGetTodaysEvents() {
  return useQuery<Event[]>({
    queryKey: ['todaysEvents'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('events');
        const all: Event[] = stored ? JSON.parse(stored) : [];
        const today = new Date();
        return all.filter((e) => {
          const eventDate = new Date(Number(e.date));
          return (
            eventDate.getDate() === today.getDate() &&
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear()
          );
        });
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
      const dismissed: string[] = JSON.parse(localStorage.getItem('dismissedEventNotifications') || '[]');
      if (!dismissed.includes(eventId)) {
        dismissed.push(eventId);
        localStorage.setItem('dismissedEventNotifications', JSON.stringify(dismissed));
      }
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todaysEvents'] });
    },
  });
}

export function useSaveEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Event) => {
      const events: Event[] = JSON.parse(localStorage.getItem('events') || '[]');
      const idx = events.findIndex((e) => e.id === event.id);
      if (idx >= 0) {
        events[idx] = event;
      } else {
        events.push(event);
      }
      localStorage.setItem('events', JSON.stringify(events));
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const events: Event[] = JSON.parse(localStorage.getItem('events') || '[]');
      const filtered = events.filter((e) => e.id !== eventId);
      localStorage.setItem('events', JSON.stringify(filtered));
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// Seasonal Events Hook - localStorage based
export function useGetActiveSeasonalEvents() {
  return useQuery<Event[]>({
    queryKey: ['activeSeasonalEvents'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('events');
        const all: Event[] = stored ? JSON.parse(stored) : [];
        return all.filter((e) => e.isSeasonal);
      } catch {
        return [];
      }
    },
  });
}

// Invention Story Hooks - localStorage based
export function useGetInventionStories() {
  return useQuery<InventionStory[]>({
    queryKey: ['inventionStories'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('inventionStories');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

// Alias for backward compatibility
export const useGetAllInventionStories = useGetInventionStories;

// Certificate Hooks - localStorage based
export function useGetCertificates() {
  return useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('certificates');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  });
}

// Aliases for backward compatibility
export const useGetUserCertificates = useGetCertificates;

export function useSaveCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cert: Certificate) => {
      const certs: Certificate[] = JSON.parse(localStorage.getItem('certificates') || '[]');
      certs.push(cert);
      localStorage.setItem('certificates', JSON.stringify(certs));
      return cert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
}

export function useCreateCertificate() {
  return useSaveCertificate();
}
