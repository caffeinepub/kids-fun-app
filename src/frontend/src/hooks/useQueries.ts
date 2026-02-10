import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserApprovalInfo, ApprovalStatus, UserProfile as BackendUserProfile, ActivityEvent, StoryProject as BackendStoryProject, VirtualPetHub as BackendVirtualPetHub, Prop as BackendProp } from '../backend';
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
  trophies: bigint;
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

// Re-export ActivityEvent from backend
export type { ActivityEvent };

// Helper function to convert backend StoryProject to frontend StoryProject
function convertBackendStoryProject(backendStory: BackendStoryProject): StoryProject {
  return {
    ...backendStory,
    scenes: backendStory.scenes.map(scene => ({
      ...scene,
      characters: scene.characters.map(char => ({
        ...char,
        position: { x: Number(char.position.x), y: Number(char.position.y) }
      })),
      props: scene.props.map(prop => ({
        name: prop.name,
        position: { x: Number(prop.position.x), y: Number(prop.position.y) },
        type_: prop.type
      })),
      textBubbles: scene.textBubbles.map(bubble => ({
        ...bubble,
        position: { x: Number(bubble.position.x), y: Number(bubble.position.y) }
      }))
    }))
  };
}

// Helper function to convert frontend StoryProject to backend StoryProject
function convertToBackendStoryProject(story: StoryProject): BackendStoryProject {
  return {
    ...story,
    scenes: story.scenes.map(scene => ({
      ...scene,
      characters: scene.characters.map(char => ({
        ...char,
        position: { x: BigInt(char.position.x), y: BigInt(char.position.y) }
      })),
      props: scene.props.map(prop => ({
        name: prop.name,
        position: { x: BigInt(prop.position.x), y: BigInt(prop.position.y) },
        type: prop.type_
      })),
      textBubbles: scene.textBubbles.map(bubble => ({
        ...bubble,
        position: { x: BigInt(bubble.position.x), y: BigInt(bubble.position.y) }
      }))
    }))
  };
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

export function useSaveAvatarConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarConfig: AvatarConfig) => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      if (!profile) throw new Error('Profile not found');
      
      const updatedProfile = { ...profile, avatarConfig };
      await actor.saveCallerUserProfile(updatedProfile);
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
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameState: GameState) => {
      const stored = localStorage.getItem('gameStates');
      const allStates: GameState[] = stored ? JSON.parse(stored) : [];
      allStates.push(gameState);
      localStorage.setItem('gameStates', JSON.stringify(allStates));

      // Record game play activity (non-blocking)
      if (actor) {
        try {
          const gameId = gameState.id.toString();
          const gameName = gameState.gameName;
          await actor.recordGamePlay(gameId, gameName);
        } catch (error) {
          console.error('Failed to record game play activity:', error);
          // Don't throw - activity tracking failure should not block game save
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myGameStates'] });
      queryClient.invalidateQueries({ queryKey: ['myHighScore'] });
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
      queryClient.invalidateQueries({ queryKey: ['virtualPetHub'] });
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivityEvents'] });
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
      if (!actor) return 70;
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

// Activity Events Queries (Admin-only)
export function useGetRecentActivityEvents(limit: number = 50) {
  const { actor, isFetching } = useActor();

  return useQuery<ActivityEvent[]>({
    queryKey: ['recentActivityEvents', limit],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const events = await actor.getRecentActivityEvents(BigInt(limit));
        return events;
      } catch (error) {
        console.error('Error fetching activity events:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

// Jokes Queries
export function useGetAllJokes() {
  const { actor, isFetching } = useActor();

  return useQuery<Joke[]>({
    queryKey: ['allJokes'],
    queryFn: async () => {
      if (!actor) return [];
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
      const stored = localStorage.getItem('jokes');
      const allJokes: Joke[] = stored ? JSON.parse(stored) : [];
      return allJokes.filter(joke => joke.category === category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useSubmitJoke() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jokeData: { category: string; content: string }) => {
      if (!actor || !identity) throw new Error('Actor not available');
      const stored = localStorage.getItem('jokes');
      const jokes: Joke[] = stored ? JSON.parse(stored) : [];
      const newJoke: Joke = {
        id: `joke_${Date.now()}`,
        category: jokeData.category,
        content: jokeData.content,
        submittedBy: identity.getPrincipal(),
        approved: false,
        rating: BigInt(0),
      };
      jokes.push(newJoke);
      localStorage.setItem('jokes', JSON.stringify(jokes));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allJokes'] });
    },
  });
}

export function useRateJoke() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jokeId, rating }: { jokeId: string; rating: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      const stored = localStorage.getItem('jokes');
      const jokes: Joke[] = stored ? JSON.parse(stored) : [];
      const jokeIndex = jokes.findIndex(j => j.id === jokeId);
      if (jokeIndex !== -1) {
        jokes[jokeIndex].rating = rating;
        localStorage.setItem('jokes', JSON.stringify(jokes));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allJokes'] });
    },
  });
}

export function useToggleFavoriteJoke() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jokeId: string) => {
      if (!actor || !identity) throw new Error('Actor not available');
      const userId = identity.getPrincipal().toText();
      const stored = localStorage.getItem(`favorites_${userId}`);
      const favorites: string[] = stored ? JSON.parse(stored) : [];
      
      const index = favorites.indexOf(jokeId);
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(jokeId);
      }
      
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteJokes'] });
    },
  });
}

export function useGetFavoriteJokes() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Joke[]>({
    queryKey: ['favoriteJokes'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const userId = identity.getPrincipal().toText();
      const stored = localStorage.getItem(`favorites_${userId}`);
      const favoriteIds: string[] = stored ? JSON.parse(stored) : [];
      
      // Get all jokes and filter by favorite IDs
      const jokesStored = localStorage.getItem('jokes');
      const allJokes: Joke[] = jokesStored ? JSON.parse(jokesStored) : [];
      return allJokes.filter(joke => favoriteIds.includes(joke.id));
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// Aliases for compatibility
export const useAddJokeToFavorites = useToggleFavoriteJoke;
export const useRemoveJokeFromFavorites = useToggleFavoriteJoke;
export const useGetMyFavoriteJokes = useGetFavoriteJokes;

// Feedback Queries
export function useSubmitFeedback() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackData: { feedbackType: FeedbackType; text: string }) => {
      if (!actor || !identity) throw new Error('Actor not available');
      const stored = localStorage.getItem('feedback');
      const allFeedback: Feedback[] = stored ? JSON.parse(stored) : [];
      const newFeedback: Feedback = {
        id: BigInt(Date.now()),
        feedbackType: feedbackData.feedbackType,
        text: feedbackData.text,
        author: identity.getPrincipal(),
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

export function useGetMyFeedback() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Feedback[]>({
    queryKey: ['myFeedback'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const stored = localStorage.getItem('feedback');
      const allFeedback: Feedback[] = stored ? JSON.parse(stored) : [];
      const userId = identity.getPrincipal().toText();
      return allFeedback.filter(f => f.author.toText() === userId);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// Rewards Queries
export function useGetUserRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<Reward>({
    queryKey: ['userRewards'],
    queryFn: async () => {
      if (!actor) return { userId: Principal.anonymous(), points: 0, badges: [], achievements: [], virtualPetLevel: 0 };
      const stored = localStorage.getItem('rewards');
      return stored ? JSON.parse(stored) : { userId: Principal.anonymous(), points: 0, badges: [], achievements: [], virtualPetLevel: 0 };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateUserRewards() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reward: Reward) => {
      if (!actor) throw new Error('Actor not available');
      localStorage.setItem('rewards', JSON.stringify(reward));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
    },
  });
}

export function useGetUserBadgeProofs() {
  const { actor, isFetching } = useActor();

  return useQuery<BadgeProof[]>({
    queryKey: ['userBadgeProofs'],
    queryFn: async () => {
      if (!actor) return [];
      const stored = localStorage.getItem('badgeProofs');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Story Builder Queries
export function useGetCallerStoryProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<StoryProject[]>({
    queryKey: ['callerStoryProjects'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const projects = await actor.getCallerStoryProjects();
        return projects.map(convertBackendStoryProject);
      } catch (error) {
        console.error('Error fetching story projects:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveStoryProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (story: StoryProject) => {
      if (!actor) throw new Error('Actor not available');
      const backendStory = convertToBackendStoryProject(story);
      await actor.saveStoryProject(backendStory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerStoryProjects'] });
    },
  });
}

// Virtual Pet Hub Queries
export function useGetCallerVirtualPet() {
  const { actor, isFetching } = useActor();

  return useQuery<VirtualPetHub | null>({
    queryKey: ['virtualPetHub'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const pet = await actor.getCallerVirtualPet();
        return pet || null;
      } catch (error) {
        console.error('Error fetching virtual pet:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCallerVirtualPet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pet: VirtualPetHub) => {
      if (!actor) throw new Error('Actor not available');
      const backendPet: BackendVirtualPetHub = {
        ...pet,
        trophies: pet.trophies || BigInt(70),
      };
      await actor.saveCallerVirtualPet(backendPet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualPetHub'] });
      queryClient.invalidateQueries({ queryKey: ['userTrophies'] });
    },
  });
}

// Aliases for compatibility
export const useGetVirtualPetHub = useGetCallerVirtualPet;
export const useSaveVirtualPetHub = useSaveCallerVirtualPet;

// Art Gallery Queries
export function useGetCallerArtwork() {
  const { actor, isFetching } = useActor();

  return useQuery<ArtGallerySubmission[]>({
    queryKey: ['callerArtwork'],
    queryFn: async () => {
      if (!actor) return [];
      const stored = localStorage.getItem('artGallery');
      const allArt: ArtGallerySubmission[] = stored ? JSON.parse(stored) : [];
      return allArt;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublicArtwork() {
  const { actor, isFetching } = useActor();

  return useQuery<ArtGallerySubmission[]>({
    queryKey: ['publicArtwork'],
    queryFn: async () => {
      if (!actor) return [];
      const stored = localStorage.getItem('artGallery');
      const allArt: ArtGallerySubmission[] = stored ? JSON.parse(stored) : [];
      return allArt.filter(art => art.isPublic && art.approved);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitArtwork() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artworkData: { title: string; artworkUrl: string; category: string; isPublic: boolean }) => {
      if (!actor || !identity) throw new Error('Actor not available');
      const stored = localStorage.getItem('artGallery');
      const allArt: ArtGallerySubmission[] = stored ? JSON.parse(stored) : [];
      const newArt: ArtGallerySubmission = {
        id: `art_${Date.now()}`,
        owner: identity.getPrincipal(),
        title: artworkData.title,
        artworkUrl: artworkData.artworkUrl,
        category: artworkData.category,
        createdAt: BigInt(Date.now()),
        isPublic: artworkData.isPublic,
        approved: false,
      };
      allArt.push(newArt);
      localStorage.setItem('artGallery', JSON.stringify(allArt));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerArtwork'] });
      queryClient.invalidateQueries({ queryKey: ['publicArtwork'] });
    },
  });
}

// Craft Projects Queries
export function useGetAllCraftProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<CraftProject[]>({
    queryKey: ['allCraftProjects'],
    queryFn: async () => {
      if (!actor) return [];
      const stored = localStorage.getItem('craftProjects');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkCraftProjectCompleted() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!actor || !identity) throw new Error('Actor not available');
      const stored = localStorage.getItem('craftProjects');
      const projects: CraftProject[] = stored ? JSON.parse(stored) : [];
      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        const userId = identity.getPrincipal();
        if (!projects[projectIndex].completedBy.some(p => p.toText() === userId.toText())) {
          projects[projectIndex].completedBy.push(userId);
        }
        localStorage.setItem('craftProjects', JSON.stringify(projects));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCraftProjects'] });
    },
  });
}

// Certificates Queries
export function useCreateCertificate() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certificateData: { achievement: string }) => {
      if (!actor || !identity) throw new Error('Actor not available');
      const stored = localStorage.getItem('certificates');
      const certificates: Certificate[] = stored ? JSON.parse(stored) : [];
      const newCert: Certificate = {
        id: `cert_${Date.now()}`,
        userId: identity.getPrincipal(),
        achievement: certificateData.achievement,
        date: Date.now(),
      };
      certificates.push(newCert);
      localStorage.setItem('certificates', JSON.stringify(certificates));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCertificates'] });
    },
  });
}

export function useGetUserCertificates() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Certificate[]>({
    queryKey: ['userCertificates'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const stored = localStorage.getItem('certificates');
      const allCerts: Certificate[] = stored ? JSON.parse(stored) : [];
      const userId = identity.getPrincipal().toText();
      return allCerts.filter(cert => cert.userId.toText() === userId);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// Sticker Queries
export function useCreateSticker() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stickerData: { name: string; image: any }) => {
      if (!actor || !identity) throw new Error('Actor not available');
      const stored = localStorage.getItem('stickers');
      const stickers: Sticker[] = stored ? JSON.parse(stored) : [];
      const newSticker: Sticker = {
        id: `sticker_${Date.now()}`,
        creator: identity.getPrincipal(),
        name: stickerData.name,
        image: stickerData.image,
        isModerated: false,
        approved: false,
      };
      stickers.push(newSticker);
      localStorage.setItem('stickers', JSON.stringify(stickers));
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
      if (!actor) return [];
      const stored = localStorage.getItem('stickers');
      const allStickers: Sticker[] = stored ? JSON.parse(stored) : [];
      return allStickers.filter(s => s.approved);
    },
    enabled: !!actor && !isFetching,
  });
}

// Music Remix Queries
export function useCreateMusicRemix() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (remixData: { title: string; audio: any; duration: number; isPublic: boolean }) => {
      if (!actor || !identity) throw new Error('Actor not available');
      const stored = localStorage.getItem('musicRemixes');
      const remixes: MusicRemix[] = stored ? JSON.parse(stored) : [];
      const newRemix: MusicRemix = {
        id: `remix_${Date.now()}`,
        creator: identity.getPrincipal(),
        title: remixData.title,
        audio: remixData.audio,
        duration: BigInt(remixData.duration),
        isPublic: remixData.isPublic,
        approved: false,
      };
      remixes.push(newRemix);
      localStorage.setItem('musicRemixes', JSON.stringify(remixes));
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
      if (!actor) return [];
      const stored = localStorage.getItem('musicRemixes');
      const allRemixes: MusicRemix[] = stored ? JSON.parse(stored) : [];
      return allRemixes.filter(r => r.approved);
    },
    enabled: !!actor && !isFetching,
  });
}

// Spin Wheel Queries
export function useSpinWheel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<SpinRewardUpdate> => {
      if (!actor) throw new Error('Actor not available');
      const reward: SpinReward = {
        rewardType: 'points',
        value: '100',
        timestamp: Date.now(),
      };
      const stored = localStorage.getItem('spinRewards');
      const rewards: SpinReward[] = stored ? JSON.parse(stored) : [];
      rewards.push(reward);
      localStorage.setItem('spinRewards', JSON.stringify(rewards));
      
      // Return SpinRewardUpdate with all required fields
      return {
        spinReward: reward,
        badgesEarned: [],
        pointsAwarded: 100,
        extraSpin: false,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spinRewardHistory'] });
    },
  });
}

export function useGetSpinRewardHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<SpinReward[]>({
    queryKey: ['spinRewardHistory'],
    queryFn: async () => {
      if (!actor) return [];
      const stored = localStorage.getItem('spinRewards');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Seasonal Events Queries
export function useGetActiveSeasonalEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<SeasonalEvent[]>({
    queryKey: ['activeSeasonalEvents'],
    queryFn: async () => {
      if (!actor) return [];
      const stored = localStorage.getItem('seasonalEvents');
      const allEvents: SeasonalEvent[] = stored ? JSON.parse(stored) : [];
      return allEvents.filter(e => e.isActive);
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
      const stored = localStorage.getItem('events');
      const allEvents: Event[] = stored ? JSON.parse(stored) : [];
      const today = new Date().toDateString();
      return allEvents.filter(e => new Date(Number(e.date)).toDateString() === today);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDismissEventNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!actor) throw new Error('Actor not available');
      const stored = localStorage.getItem('dismissedEvents');
      const dismissed: string[] = stored ? JSON.parse(stored) : [];
      if (!dismissed.includes(eventId)) {
        dismissed.push(eventId);
      }
      localStorage.setItem('dismissedEvents', JSON.stringify(dismissed));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todaysEvents'] });
    },
  });
}

// Invention Stories Queries
export function useGetAllInventionStories() {
  const { actor, isFetching } = useActor();

  return useQuery<InventionStory[]>({
    queryKey: ['allInventionStories'],
    queryFn: async () => {
      if (!actor) return [];
      const stored = localStorage.getItem('inventionStories');
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin Dashboard Queries
export function useGetAdminDashboard() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminDashboardSection>({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      if (!actor) {
        return {
          overview: {
            activeUsers: [],
            userStats: { total: BigInt(0), active: BigInt(0), restricted: BigInt(0), suspended: BigInt(0), banned: BigInt(0) },
            activitySummary: { recentActivities: BigInt(0), systemEvents: BigInt(0) },
          },
          manageUsers: [],
          restrictions: [],
          settings: { adminPreferences: '' },
          safetyAlerts: [],
        };
      }
      const stored = localStorage.getItem('adminDashboard');
      return stored ? JSON.parse(stored) : {
        overview: {
          activeUsers: [],
          userStats: { total: BigInt(0), active: BigInt(0), restricted: BigInt(0), suspended: BigInt(0), banned: BigInt(0) },
          activitySummary: { recentActivities: BigInt(0), systemEvents: BigInt(0) },
        },
        manageUsers: [],
        restrictions: [],
        settings: { adminPreferences: '' },
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
      const stored = localStorage.getItem('adminDashboard');
      const dashboard: AdminDashboardSection = stored ? JSON.parse(stored) : {
        overview: {
          activeUsers: [],
          userStats: { total: BigInt(0), active: BigInt(0), restricted: BigInt(0), suspended: BigInt(0), banned: BigInt(0) },
          activitySummary: { recentActivities: BigInt(0), systemEvents: BigInt(0) },
        },
        manageUsers: [],
        restrictions: [],
        settings: { adminPreferences: '' },
        safetyAlerts: [],
      };
      
      localStorage.setItem('adminDashboard', JSON.stringify(dashboard));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useAddRestriction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, feature, reason }: { userId: Principal; feature: string; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      const stored = localStorage.getItem('adminDashboard');
      const dashboard: AdminDashboardSection = stored ? JSON.parse(stored) : {
        overview: {
          activeUsers: [],
          userStats: { total: BigInt(0), active: BigInt(0), restricted: BigInt(0), suspended: BigInt(0), banned: BigInt(0) },
          activitySummary: { recentActivities: BigInt(0), systemEvents: BigInt(0) },
        },
        manageUsers: [],
        restrictions: [],
        settings: { adminPreferences: '' },
        safetyAlerts: [],
      };
      
      localStorage.setItem('adminDashboard', JSON.stringify(dashboard));
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
      const stored = localStorage.getItem('adminDashboard');
      const dashboard: AdminDashboardSection = stored ? JSON.parse(stored) : {
        overview: {
          activeUsers: [],
          userStats: { total: BigInt(0), active: BigInt(0), restricted: BigInt(0), suspended: BigInt(0), banned: BigInt(0) },
          activitySummary: { recentActivities: BigInt(0), systemEvents: BigInt(0) },
        },
        manageUsers: [],
        restrictions: [],
        settings: { adminPreferences: '' },
        safetyAlerts: [],
      };
      
      localStorage.setItem('adminDashboard', JSON.stringify(dashboard));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const isAdmin = await actor.isCallerAdmin();
        return isAdmin;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// User Approval Queries
export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerApproved'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const isApproved = await actor.isCallerApproved();
        return isApproved;
      } catch (error) {
        console.error('Error checking approval status:', error);
        return false;
      }
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
      await actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvalsList'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const approvals = await actor.listApprovals();
        return approvals;
      } catch (error) {
        console.error('Error fetching approvals:', error);
        return [];
      }
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
      await actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvalsList'] });
    },
  });
}
