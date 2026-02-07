import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserApprovalInfo, ApprovalStatus, UserProfile as BackendUserProfile } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

// Local type definitions for features not yet in backend interface
export interface Badge {
  name: string;
  description: string;
  category: string;
  requirement: string;
  rewardPoints: bigint;
}

export interface BadgeProof {
  badge: Badge;
  proof: string;
  timestamp: bigint;
}

export interface AvatarConfig {
  body: string;
  head: string;
  hair: string;
  pants: string;
  headwear: string;
  shoes: string;
}

export interface AdminDashboardSection {
  overview: AdminDashboardOverview;
  manageUsers: UserProfile[];
  restrictions: AdminFeatureRestriction[];
  settings: { adminPreferences: string };
  safetyAlerts: string[];
}

export interface AdminDashboardOverview {
  activeUsers: Principal[];
  userStats: { total: bigint; active: bigint; restricted: bigint; suspended: bigint; banned: bigint };
  activitySummary: { recentActivities: bigint; systemEvents: bigint };
}

export enum AdminUserStatus {
  active = 'active',
  restricted = 'restricted',
  suspended = 'suspended',
  banned = 'banned',
}

export interface AdminFeatureRestriction {
  userId: Principal;
  feature: string;
  restrictedBy: Principal;
  reason?: string;
  createdAt: bigint;
  updatedAt?: bigint;
}

export interface Joke {
  id: string;
  category: string;
  content: string;
  submittedBy?: Principal;
  approved: boolean;
  rating: bigint;
}

export interface OnlineUser {
  userId: Principal;
  lastSeen: bigint;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  sender: Principal;
  recipient: Principal;
  content: string;
  timestamp: bigint;
  isGroupChat: boolean;
  groupId?: string;
}

export interface UserProfile {
  name: string;
  age: bigint;
  parentPrincipal: Principal;
  approvedContacts: Principal[];
  screenTimeLimit: bigint;
  contentFilterLevel: string;
  avatarUrl: string;
  theme: string;
  mascotPreference: string;
  accessibilitySettings: {
    readAloudEnabled: boolean;
    highContrastMode: boolean;
    largeText: boolean;
  };
  avatarConfig?: AvatarConfig;
}

export interface GameState {
  id: bigint;
  gameName: string;
  progress: bigint;
  player: Principal;
  score: bigint;
  highScore: bigint;
  isMultiplayer: boolean;
  achievements: string[];
  rewards: string[];
  difficulty: string;
  lastPlayed: bigint;
}

export enum FeedbackType {
  bugReport = 'bugReport',
  featureRequest = 'featureRequest',
  generalFeedback = 'generalFeedback',
  safetyConcern = 'safetyConcern',
  parentFeedback = 'parentFeedback',
}

export interface Feedback {
  id: bigint;
  feedbackType: FeedbackType;
  text: string;
  author: Principal;
  timestamp: bigint;
  isResolved: boolean;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  startDate: bigint;
  endDate: bigint;
  theme: string;
  activities: string[];
  isActive: boolean;
}

export interface StoryProject {
  id: string;
  owner: Principal;
  title: string;
  scenes: Scene[];
  createdAt: bigint;
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
  type_: string;
}

export interface TextBubble {
  content: string;
  position: { x: number; y: number };
  character: string;
  style: string;
}

export interface CraftProject {
  id: string;
  category: string;
  title: string;
  difficulty: string;
  steps: string[];
  materials: string[];
  safetyTips: string[];
  completedBy: Principal[];
  badges: string[];
}

export interface ArtGallerySubmission {
  id: string;
  owner: Principal;
  title: string;
  artworkUrl: string;
  category: string;
  createdAt: bigint;
  isPublic: boolean;
  approved: boolean;
}

export interface Reward {
  userId: Principal;
  points: number;
  badges: string[];
  achievements: string[];
  virtualPetLevel: number;
}

export interface SpinReward {
  rewardType: string;
  value: string;
  timestamp: number;
}

export interface SpinRewardUpdate {
  spinReward: SpinReward;
  badgesEarned: BadgeProof[];
  pointsAwarded: number;
  extraSpin: boolean;
}

export interface Certificate {
  id: string;
  userId: Principal;
  achievement: string;
  date: number;
}

export interface Sticker {
  id: string;
  creator: Principal;
  name: string;
  image: {
    getDirectURL: () => string;
  };
  isModerated: boolean;
  approved: boolean;
}

export interface MusicRemix {
  id: string;
  creator: Principal;
  title: string;
  audio: {
    getDirectURL: () => string;
  };
  duration: bigint;
  isPublic: boolean;
  approved: boolean;
}

export interface VirtualPetHub {
  userId: Principal;
  petName: string;
  happinessLevel: bigint;
  growthStage: bigint;
  accessories: string[];
  decorations: string[];
  homeStyle: string;
  warnedAboutExtremeChanges: boolean;
  trophies?: bigint;
}

export interface InventionStory {
  id: string;
  title: string;
  content: string;
  author: string;
  visualAssets: string[];
  narrationAudio?: string;
  recommendedAge: number;
  discoveryLevel: string;
  category: string;
  visualStyle: {
    colorPalette: string[];
    animationType: string;
    transitionEffects: string[];
    sceneryType: string;
  };
  narrationStyle: string;
  backgroundMusic?: string;
  interactiveElements: string[];
  achievementBadge: string;
  certificateId?: string;
  funFacts: string[];
  mascotCommentary: string[];
}

export interface Event {
  id: string;
  owner: Principal;
  eventType: string;
  title: string;
  date: bigint;
  description: string;
  rsvps: Principal[];
  photos: string[];
  checklist: string[];
  isSeasonal: boolean;
  seasonalType?: string;
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getCallerUserProfile();
        return result || null;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
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
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Real-Time Chat Queries
export function useGetOnlineUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<OnlineUser[]>({
    queryKey: ['onlineUsers'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('onlineUsers');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useUpdateOnlineStatus() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isOnline: boolean) => {
      if (!actor || !identity) return;
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('onlineUsers');
      const users: OnlineUser[] = stored ? JSON.parse(stored) : [];
      const userId = identity.getPrincipal();
      const userIndex = users.findIndex(u => u.userId.toText() === userId.toText());
      
      if (isOnline) {
        const user: OnlineUser = {
          userId,
          lastSeen: BigInt(Date.now()),
          isOnline: true,
        };
        if (userIndex >= 0) {
          users[userIndex] = user;
        } else {
          users.push(user);
        }
      } else {
        if (userIndex >= 0) {
          users.splice(userIndex, 1);
        }
      }
      
      localStorage.setItem('onlineUsers', JSON.stringify(users));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onlineUsers'] });
    },
  });
}

export function useSendChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: ChatMessage) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('chatMessages');
      const messages: ChatMessage[] = stored ? JSON.parse(stored) : [];
      messages.push(message);
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });
}

export function useGetChatMessages(otherUserId: string | null) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', otherUserId],
    queryFn: async () => {
      if (!actor || !otherUserId || !identity) return [];
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('chatMessages');
      const allMessages: ChatMessage[] = stored ? JSON.parse(stored) : [];
      const currentUserId = identity.getPrincipal().toText();
      
      return allMessages.filter(msg => 
        (msg.sender.toText() === currentUserId && msg.recipient.toText() === otherUserId) ||
        (msg.sender.toText() === otherUserId && msg.recipient.toText() === currentUserId)
      );
    },
    enabled: !!actor && !isFetching && !!otherUserId,
    refetchInterval: 2000,
  });
}

export function useGetMyMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['myMessages'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('chatMessages');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsUserOnline() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('onlineUsers');
      const users: OnlineUser[] = stored ? JSON.parse(stored) : [];
      return users.some(u => u.userId.toText() === userId.toText() && u.isOnline);
    },
  });
}

// Game State Queries
export function useGetMyGameStates() {
  const { actor, isFetching } = useActor();

  return useQuery<GameState[]>({
    queryKey: ['myGameStates'],
    queryFn: async () => {
      const stored = localStorage.getItem('gameStates');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyGameStatesByName(gameName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<GameState[]>({
    queryKey: ['myGameStates', gameName],
    queryFn: async () => {
      const stored = localStorage.getItem('gameStates');
      const allStates: GameState[] = stored ? JSON.parse(stored) : [];
      return allStates.filter(gs => gs.gameName === gameName);
    },
    enabled: !!actor && !isFetching && !!gameName,
  });
}

export function useGetMyHighScore(gameName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['myHighScore', gameName],
    queryFn: async () => {
      const stored = localStorage.getItem('gameStates');
      const allStates: GameState[] = stored ? JSON.parse(stored) : [];
      const gameStates = allStates.filter(gs => gs.gameName === gameName);
      if (gameStates.length === 0) return BigInt(0);
      return BigInt(Math.max(...gameStates.map(gs => Number(gs.highScore))));
    },
    enabled: !!actor && !isFetching && !!gameName,
  });
}

export function useAddGameState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameState: GameState) => {
      const stored = localStorage.getItem('gameStates');
      const allStates: GameState[] = stored ? JSON.parse(stored) : [];
      allStates.push(gameState);
      localStorage.setItem('gameStates', JSON.stringify(allStates));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myGameStates'] });
      queryClient.invalidateQueries({ queryKey: ['myHighScore'] });
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
      queryClient.invalidateQueries({ queryKey: ['virtualPetHub'] });
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
    },
  });
}

export function useUpdateGameState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameId, gameState }: { gameId: bigint; gameState: GameState }) => {
      const stored = localStorage.getItem('gameStates');
      const allStates: GameState[] = stored ? JSON.parse(stored) : [];
      const index = allStates.findIndex(gs => gs.id === gameId);
      if (index !== -1) {
        allStates[index] = gameState;
        localStorage.setItem('gameStates', JSON.stringify(allStates));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myGameStates'] });
      queryClient.invalidateQueries({ queryKey: ['myHighScore'] });
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
      queryClient.invalidateQueries({ queryKey: ['virtualPetHub'] });
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
    },
  });
}

export function useGetLeaderboard(gameName: string, limit: number = 10) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, bigint]>>({
    queryKey: ['leaderboard', gameName, limit],
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !isFetching && !!gameName,
  });
}

// Trophy System Queries
export function useGetUserTrophies() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['userTrophies'],
    queryFn: async () => {
      if (!actor) return 70; // Default trophies
      try {
        const stored = localStorage.getItem('virtualPetHub');
        if (stored) {
          const petHub: VirtualPetHub = JSON.parse(stored);
          return petHub.trophies ? Number(petHub.trophies) : 70;
        }
        return 70;
      } catch (error) {
        console.error('Error fetching trophies:', error);
        return 70;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateGamesTrophies() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<number> => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const result = await actor.updateGamesTrophies();
        return Number(result);
      } catch (error: any) {
        if (error.message && error.message.includes('Not enough trophies')) {
          throw new Error('Not enough trophies to play a game');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
      queryClient.invalidateQueries({ queryKey: ['virtualPetHub'] });
    },
  });
}

export function useWelcomeBackReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.welcomeBackReward();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
      queryClient.invalidateQueries({ queryKey: ['virtualPetHub'] });
    },
  });
}

// Jokes Queries - Backend Integration
export function useGetAllJokes() {
  const { actor, isFetching } = useActor();

  return useQuery<Joke[]>({
    queryKey: ['allJokes'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('jokes');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJokesByCategory(category?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Joke[]>({
    queryKey: ['jokesByCategory', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('jokes');
      const allJokes: Joke[] = stored ? JSON.parse(stored) : [];
      return allJokes.filter(j => j.category === category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useSubmitJoke() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, content }: { category: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('jokes');
      const jokes: Joke[] = stored ? JSON.parse(stored) : [];
      const newJoke: Joke = {
        id: `joke_${Date.now()}`,
        category,
        content,
        approved: false,
        rating: BigInt(0),
      };
      jokes.push(newJoke);
      localStorage.setItem('jokes', JSON.stringify(jokes));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allJokes'] });
      queryClient.invalidateQueries({ queryKey: ['jokesByCategory'] });
    },
  });
}

export function useRateJoke() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jokeId, rating }: { jokeId: string; rating: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('jokes');
      const jokes: Joke[] = stored ? JSON.parse(stored) : [];
      const index = jokes.findIndex(j => j.id === jokeId);
      if (index >= 0) {
        jokes[index].rating = rating;
        localStorage.setItem('jokes', JSON.stringify(jokes));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allJokes'] });
      queryClient.invalidateQueries({ queryKey: ['jokesByCategory'] });
    },
  });
}

export function useAddJokeToFavorites() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jokeId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('favoriteJokes');
      const favorites: string[] = stored ? JSON.parse(stored) : [];
      if (!favorites.includes(jokeId)) {
        favorites.push(jokeId);
        localStorage.setItem('favoriteJokes', JSON.stringify(favorites));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFavoriteJokes'] });
    },
  });
}

export function useRemoveJokeFromFavorites() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jokeId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('favoriteJokes');
      const favorites: string[] = stored ? JSON.parse(stored) : [];
      const index = favorites.indexOf(jokeId);
      if (index >= 0) {
        favorites.splice(index, 1);
        localStorage.setItem('favoriteJokes', JSON.stringify(favorites));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFavoriteJokes'] });
    },
  });
}

export function useGetMyFavoriteJokes() {
  const { actor, isFetching } = useActor();

  return useQuery<Joke[]>({
    queryKey: ['myFavoriteJokes'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not available yet, using localStorage
      const favStored = localStorage.getItem('favoriteJokes');
      const favorites: string[] = favStored ? JSON.parse(favStored) : [];
      const jokesStored = localStorage.getItem('jokes');
      const allJokes: Joke[] = jokesStored ? JSON.parse(jokesStored) : [];
      return allJokes.filter(j => favorites.includes(j.id));
    },
    enabled: !!actor && !isFetching,
  });
}

// Feedback Queries
export function useGetMyFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery<Feedback[]>({
    queryKey: ['myFeedback'],
    queryFn: async () => {
      const stored = localStorage.getItem('feedback');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ feedbackType, text }: { feedbackType: FeedbackType; text: string }) => {
      const stored = localStorage.getItem('feedback');
      const allFeedback: Feedback[] = stored ? JSON.parse(stored) : [];
      const newFeedback: Feedback = {
        id: BigInt(Date.now()),
        feedbackType,
        text,
        author: { toText: () => 'anonymous' } as any,
        timestamp: BigInt(Date.now()),
        isResolved: false,
      };
      allFeedback.push(newFeedback);
      localStorage.setItem('feedback', JSON.stringify(allFeedback));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFeedback'] });
    },
  });
}

// Approval Queries
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

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
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

// Admin Dashboard Queries
export function useGetAdminDashboard() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminDashboardSection | null>({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('adminDashboard');
      return stored ? JSON.parse(stored) : {
        overview: {
          activeUsers: [],
          userStats: { total: BigInt(0), active: BigInt(0), restricted: BigInt(0), suspended: BigInt(0), banned: BigInt(0) },
          activitySummary: { recentActivities: BigInt(0), systemEvents: BigInt(0) },
        },
        manageUsers: [],
        restrictions: [],
        settings: { adminPreferences: 'Default settings' },
        safetyAlerts: [],
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetUserStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status, reason }: { userId: Principal; status: AdminUserStatus; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available yet, using localStorage
      console.log('Setting user status:', { userId: userId.toText(), status, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useAddRestriction() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, feature, reason }: { userId: Principal; feature: string; reason: string }) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      // Backend method not available yet, using localStorage
      console.log('Adding restriction:', { userId: userId.toText(), feature, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useRemoveRestriction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, feature }: { userId: Principal; feature: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available yet, using localStorage
      console.log('Removing restriction:', { userId: userId.toText(), feature });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useGetUserRestrictions() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available yet, using localStorage
      return [];
    },
  });
}

// Seasonal Events Queries
export function useGetActiveSeasonalEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<SeasonalEvent[]>({
    queryKey: ['activeSeasonalEvents'],
    queryFn: async () => {
      const stored = localStorage.getItem('seasonalEvents');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Avatar Config Queries
export function useSaveAvatarConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: AvatarConfig) => {
      localStorage.setItem('avatarConfig', JSON.stringify(config));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Story Builder Queries
export function useGetCallerStories() {
  const { actor, isFetching } = useActor();

  return useQuery<StoryProject[]>({
    queryKey: ['callerStories'],
    queryFn: async () => {
      const stored = localStorage.getItem('storyProjects');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStoryProject() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, scenes, background }: { title: string; scenes: any[][]; background: string }) => {
      if (!identity) throw new Error('User not authenticated');
      
      const storyProject: StoryProject = {
        id: Date.now().toString(),
        owner: identity.getPrincipal(),
        title,
        scenes: scenes.map(scene => ({
          background,
          characters: [],
          props: [],
          animations: [],
          textBubbles: [],
        })),
        createdAt: BigInt(Date.now()),
        published: false,
        approved: false,
      };
      
      const stored = localStorage.getItem('storyProjects');
      const allProjects: StoryProject[] = stored ? JSON.parse(stored) : [];
      allProjects.push(storyProject);
      localStorage.setItem('storyProjects', JSON.stringify(allProjects));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerStories'] });
    },
  });
}

// Craft & DIY Queries
export function useGetAllCraftProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<CraftProject[]>({
    queryKey: ['allCraftProjects'],
    queryFn: async () => {
      const stored = localStorage.getItem('craftProjects');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkCraftProjectCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const stored = localStorage.getItem('craftProjects');
      const allProjects: CraftProject[] = stored ? JSON.parse(stored) : [];
      const index = allProjects.findIndex(p => p.id === projectId);
      if (index !== -1) {
        localStorage.setItem('craftProjects', JSON.stringify(allProjects));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCraftProjects'] });
    },
  });
}

// Art Gallery Queries
export function useGetCallerArtwork() {
  const { actor, isFetching } = useActor();

  return useQuery<ArtGallerySubmission[]>({
    queryKey: ['callerArtwork'],
    queryFn: async () => {
      const stored = localStorage.getItem('artGallery');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublicArtwork() {
  const { actor, isFetching } = useActor();

  return useQuery<ArtGallerySubmission[]>({
    queryKey: ['publicArtwork'],
    queryFn: async () => {
      const stored = localStorage.getItem('artGallery');
      const allArtwork: ArtGallerySubmission[] = stored ? JSON.parse(stored) : [];
      return allArtwork.filter(a => a.isPublic && a.approved);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitArtwork() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, category, isPublic, artworkUrl }: { title: string; category: string; isPublic: boolean; artworkUrl: string }) => {
      if (!identity) throw new Error('User not authenticated');
      
      const submission: ArtGallerySubmission = {
        id: Date.now().toString(),
        owner: identity.getPrincipal(),
        title,
        category,
        isPublic,
        artworkUrl,
        createdAt: BigInt(Date.now()),
        approved: true,
      };
      
      const stored = localStorage.getItem('artGallery');
      const allArtwork: ArtGallerySubmission[] = stored ? JSON.parse(stored) : [];
      allArtwork.push(submission);
      localStorage.setItem('artGallery', JSON.stringify(allArtwork));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerArtwork'] });
      queryClient.invalidateQueries({ queryKey: ['publicArtwork'] });
    },
  });
}

// Rewards Queries
export function useGetUserRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<Reward>({
    queryKey: ['userRewards'],
    queryFn: async () => {
      const spinRewardsStored = localStorage.getItem('spinRewards');
      const spinRewards: SpinReward[] = spinRewardsStored ? JSON.parse(spinRewardsStored) : [];
      
      const stored = localStorage.getItem('gameStates');
      const gameStates: GameState[] = stored ? JSON.parse(stored) : [];
      
      let points = 0;
      const badges: string[] = [];
      
      spinRewards.forEach(reward => {
        if (reward.rewardType === 'Points') {
          points += parseInt(reward.value) || 0;
        } else if (reward.rewardType === 'Badge') {
          badges.push(reward.value);
        }
      });
      
      gameStates.forEach(gs => {
        points += Number(gs.highScore);
      });
      
      const virtualPetLevel = Math.floor(points / 1000) + 1;
      
      return {
        userId: { toText: () => 'user' } as any,
        points,
        badges,
        achievements: [],
        virtualPetLevel,
      };
    },
    enabled: !!actor && !isFetching,
  });
}

// Badge Queries
export function useGetUserBadgeProofs() {
  const { actor, isFetching } = useActor();

  return useQuery<BadgeProof[]>({
    queryKey: ['userBadgeProofs'],
    queryFn: async () => {
      const stored = localStorage.getItem('badgeProofs');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Spin Wheel Queries
export function useSpinWheel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<SpinRewardUpdate> => {
      const lastSpinTime = localStorage.getItem('lastSpinTime');
      if (lastSpinTime) {
        const elapsed = Date.now() - parseInt(lastSpinTime);
        const cooldown = 20 * 60 * 1000;
        if (elapsed < cooldown) {
          throw new Error('Wheel cannot be spun yet. Please wait for cooldown.');
        }
      }

      const rewards = [
        { rewardType: 'Points', value: '100', weight: 3 },
        { rewardType: 'Points', value: '250', weight: 2 },
        { rewardType: 'Points', value: '500', weight: 1 },
        { rewardType: 'Badge', value: 'Lucky Star', weight: 2 },
        { rewardType: 'Badge', value: 'Golden Trophy', weight: 1 },
        { rewardType: 'Mystery Box', value: 'Extra Spin', weight: 1 },
      ];

      // Weighted random selection
      const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
      let random = Math.random() * totalWeight;
      let selectedReward = rewards[0];
      
      for (const reward of rewards) {
        random -= reward.weight;
        if (random <= 0) {
          selectedReward = reward;
          break;
        }
      }

      const spinReward: SpinReward = {
        rewardType: selectedReward.rewardType,
        value: selectedReward.value,
        timestamp: Date.now(),
      };

      const stored = localStorage.getItem('spinRewards');
      const allRewards: SpinReward[] = stored ? JSON.parse(stored) : [];
      allRewards.push(spinReward);
      localStorage.setItem('spinRewards', JSON.stringify(allRewards));

      // Handle Mystery Box - grant extra spin
      if (selectedReward.rewardType === 'Mystery Box') {
        return {
          spinReward,
          badgesEarned: [],
          pointsAwarded: 0,
          extraSpin: true,
        };
      }

      // Handle Points
      let pointsAwarded = 0;
      if (selectedReward.rewardType === 'Points') {
        pointsAwarded = parseInt(selectedReward.value) || 0;
      }

      // Handle Badges
      const badgesEarned: BadgeProof[] = [];
      if (selectedReward.rewardType === 'Badge') {
        const badge: Badge = {
          name: selectedReward.value,
          description: `Won from spin wheel`,
          category: 'Spin Wheel',
          requirement: 'Spin the wheel',
          rewardPoints: BigInt(50),
        };

        const badgeProof: BadgeProof = {
          badge,
          proof: `Won on ${new Date().toLocaleDateString()}`,
          timestamp: BigInt(Date.now()),
        };

        badgesEarned.push(badgeProof);

        // Store badge proof
        const badgeProofsStored = localStorage.getItem('badgeProofs');
        const allBadgeProofs: BadgeProof[] = badgeProofsStored ? JSON.parse(badgeProofsStored) : [];
        allBadgeProofs.push(badgeProof);
        localStorage.setItem('badgeProofs', JSON.stringify(allBadgeProofs));
      }

      return {
        spinReward,
        badgesEarned,
        pointsAwarded,
        extraSpin: false,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spinRewardHistory'] });
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
      queryClient.invalidateQueries({ queryKey: ['virtualPetHub'] });
      queryClient.invalidateQueries({ queryKey: ['userBadgeProofs'] });
    },
  });
}

export function useGetSpinRewardHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<SpinReward[]>({
    queryKey: ['spinRewardHistory'],
    queryFn: async () => {
      const stored = localStorage.getItem('spinRewards');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Certificate Queries
export function useCreateCertificate() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ achievement }: { achievement: string; pdfData?: Uint8Array }) => {
      if (!identity) throw new Error('User not authenticated');
      
      const certificate: Certificate = {
        id: Date.now().toString(),
        userId: identity.getPrincipal(),
        achievement,
        date: Date.now(),
      };
      
      const stored = localStorage.getItem('certificates');
      const allCertificates: Certificate[] = stored ? JSON.parse(stored) : [];
      allCertificates.push(certificate);
      localStorage.setItem('certificates', JSON.stringify(allCertificates));
      
      return certificate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCertificates'] });
    },
  });
}

export function useGetUserCertificates() {
  const { actor, isFetching } = useActor();

  return useQuery<Certificate[]>({
    queryKey: ['userCertificates'],
    queryFn: async () => {
      const stored = localStorage.getItem('certificates');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Sticker Creator Queries
export function useCreateSticker() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, imageData }: { name: string; imageData: Uint8Array }) => {
      if (!identity) throw new Error('User not authenticated');
      
      const dataArray = Array.from(imageData);
      const blob = new Blob([new Uint8Array(dataArray)], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
      const sticker: Sticker = {
        id: Date.now().toString(),
        creator: identity.getPrincipal(),
        name,
        image: {
          getDirectURL: () => url,
        },
        isModerated: true,
        approved: true,
      };
      
      const stored = localStorage.getItem('stickers');
      const allStickers: Sticker[] = stored ? JSON.parse(stored) : [];
      allStickers.push(sticker);
      localStorage.setItem('stickers', JSON.stringify(allStickers));
      
      return sticker;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedStickers'] });
    },
  });
}

export function useGetApprovedStickers() {
  const { actor, isFetching } = useActor();

  return useQuery<Sticker[]>({
    queryKey: ['approvedStickers'],
    queryFn: async () => {
      const stored = localStorage.getItem('stickers');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Music Remix Queries
export function useCreateMusicRemix() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, audioData, duration }: { title: string; audioData: Uint8Array; duration: number }) => {
      if (!identity) throw new Error('User not authenticated');
      
      const dataArray = Array.from(audioData);
      const blob = new Blob([new Uint8Array(dataArray)], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      const remix: MusicRemix = {
        id: Date.now().toString(),
        creator: identity.getPrincipal(),
        title,
        audio: {
          getDirectURL: () => url,
        },
        duration: BigInt(duration),
        isPublic: true,
        approved: true,
      };
      
      const stored = localStorage.getItem('musicRemixes');
      const allRemixes: MusicRemix[] = stored ? JSON.parse(stored) : [];
      allRemixes.push(remix);
      localStorage.setItem('musicRemixes', JSON.stringify(allRemixes));
      
      return remix;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedRemixes'] });
    },
  });
}

export function useGetApprovedRemixes() {
  const { actor, isFetching } = useActor();

  return useQuery<MusicRemix[]>({
    queryKey: ['approvedRemixes'],
    queryFn: async () => {
      const stored = localStorage.getItem('musicRemixes');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Virtual Pet Hub Queries
export function useGetVirtualPetHub() {
  const { actor, isFetching } = useActor();

  return useQuery<VirtualPetHub | null>({
    queryKey: ['virtualPetHub'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getCallerVirtualPet();
        return result || null;
      } catch (error) {
        console.error('Error fetching virtual pet:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveVirtualPetHub() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hub: {
      petName: string;
      happinessLevel: number;
      growthStage: number;
      accessories: string[];
      decorations: string[];
      homeStyle: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');

      // Get current pet data to preserve trophies
      let currentTrophies = BigInt(70); // Default value
      try {
        const currentPet = await actor.getCallerVirtualPet();
        if (currentPet && currentPet.trophies !== undefined) {
          currentTrophies = currentPet.trophies;
        }
      } catch (error) {
        console.log('No existing pet found, using default trophies');
      }

      const petHub = {
        userId: identity.getPrincipal(),
        petName: hub.petName,
        happinessLevel: BigInt(hub.happinessLevel),
        growthStage: BigInt(hub.growthStage),
        accessories: hub.accessories,
        decorations: hub.decorations,
        homeStyle: hub.homeStyle,
        warnedAboutExtremeChanges: false,
        trophies: currentTrophies,
      };

      await actor.saveCallerVirtualPet(petHub);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualPetHub'] });
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
    },
  });
}

// Invention Stories Queries
export function useGetAllInventionStories() {
  const { actor, isFetching } = useActor();

  return useQuery<InventionStory[]>({
    queryKey: ['allInventionStories'],
    queryFn: async () => {
      const stored = localStorage.getItem('inventionStories');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Events Queries
export function useGetTodaysEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['todaysEvents'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('events');
      const allEvents: Event[] = stored ? JSON.parse(stored) : [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = BigInt(today.getTime());
      
      return allEvents.filter(event => {
        const eventDate = new Date(Number(event.date));
        eventDate.setHours(0, 0, 0, 0);
        return BigInt(eventDate.getTime()) === todayTimestamp;
      });
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDismissEventNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      // Backend method not available yet, using localStorage
      const stored = localStorage.getItem('dismissedEventNotifications');
      const dismissed: string[] = stored ? JSON.parse(stored) : [];
      if (!dismissed.includes(eventId)) {
        dismissed.push(eventId);
        localStorage.setItem('dismissedEventNotifications', JSON.stringify(dismissed));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todaysEvents'] });
    },
  });
}
