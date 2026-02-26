import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Set "mo:core/Set";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  let SPIN_COOLDOWN = 1200000000000; // 20 minutes
  let DEFAULT_TROPHIES : Nat = 70;
  let TROPHIES_PER_GAME : Nat = 2;
  let WELCOME_BACK_BONUS : Nat = 40;

  public type UserProfile = {
    name : Text;
    age : Nat;
    parentPrincipal : Principal;
    approvedContacts : [Principal];
    screenTimeLimit : Nat;
    contentFilterLevel : Text;
    avatarUrl : Text;
    theme : Text;
    mascotPreference : Text;
    accessibilitySettings : AccessibilitySettings;
    avatarConfig : ?AvatarConfig;
  };
  public type AccessibilitySettings = {
    readAloudEnabled : Bool;
    highContrastMode : Bool;
    largeText : Bool;
  };
  public type AvatarConfig = {
    body : Text;
    head : Text;
    hair : Text;
    pants : Text;
    headwear : Text;
    shoes : Text;
  };
  public type GameProgress = {
    gameId : Text;
    highScore : Nat;
    level : Nat;
    achievements : [Text];
    completionStats : Text;
    lastPlayed : Int;
    difficulty : Text;
  };
  public type EclipseAIBehavior = {
    userId : Principal;
    gameId : Text;
    sessionId : Text;
    playerActions : [PlayerAction];
    aiResponses : [AIResponse];
    difficultyLevel : Nat;
    performanceMetrics : PerformanceMetrics;
    dialogueEvolution : [DialogueState];
    timestamp : Int;
  };
  public type PlayerAction = {
    actionType : Text;
    timestamp : Int;
    success : Bool;
    resourcesCollected : Nat;
    enemiesDefeated : Nat;
  };
  public type AIResponse = {
    responseType : Text;
    hintProvided : ?Text;
    difficultyAdjustment : Int;
    timestamp : Int;
  };
  public type PerformanceMetrics = {
    survivalTime : Nat;
    resourceEfficiency : Nat;
    combatSuccess : Nat;
    explorationScore : Nat;
  };
  public type DialogueState = {
    tone : Text;
    pacing : Text;
    adaptationLevel : Nat;
    timestamp : Int;
  };
  public type Event = {
    id : Text;
    owner : Principal;
    eventType : Text;
    title : Text;
    date : Int;
    description : Text;
    rsvps : [Principal];
    photos : [Text];
    checklist : [Text];
    isSeasonal : Bool;
    seasonalType : ?Text;
  };
  public type ChatMessage = {
    id : Text;
    sender : Principal;
    recipient : Principal;
    content : Text;
    timestamp : Int;
    isGroupChat : Bool;
    groupId : ?Text;
  };
  public type OnlineUser = {
    userId : Principal;
    lastSeen : Int;
    isOnline : Bool;
  };
  public type CardDesign = {
    id : Text;
    owner : Principal;
    template : Text;
    content : Text;
    createdAt : Int;
  };
  public type Joke = {
    id : Text;
    category : Text;
    content : Text;
    submittedBy : ?Principal;
    approved : Bool;
    rating : Nat;
  };
  public type Feedback = {
    id : Text;
    submitter : Principal;
    feedbackType : Text;
    content : Text;
    timestamp : Int;
    response : ?Text;
    anonymous : Bool;
  };
  public type Reward = {
    userId : Principal;
    points : Nat;
    badges : [Text];
    achievements : [Text];
    virtualPetLevel : Nat;
    totalTrophies : Nat;
  };
  public type ParentalControl = {
    childPrincipal : Principal;
    parentPrincipal : Principal;
    screenTimeLimit : Nat;
    contentFilter : Text;
    approvedContacts : [Principal];
    chatMonitoring : Bool;
  };
  public type Game = {
    id : Text;
    title : Text;
    description : Text;
    category : Text;
    difficulty : Text;
    instructions : Text;
    assets : [Text];
    highScore : Nat;
    lastPlayed : Int;
    isFavorite : Bool;
  };
  public type HubCategory = {
    id : Text;
    name : Text;
    description : Text;
    games : [Text];
  };
  public type SeasonalEvent = {
    id : Text;
    name : Text;
    startDate : Int;
    endDate : Int;
    theme : Text;
    activities : [Text];
    isActive : Bool;
  };
  public type MascotInteraction = {
    userId : Principal;
    interactionType : Text;
    timestamp : Int;
    message : Text;
  };
  public type StoryProject = {
    id : Text;
    owner : Principal;
    title : Text;
    scenes : [Scene];
    createdAt : Int;
    published : Bool;
    approved : Bool;
  };
  public type Scene = {
    background : Text;
    characters : [Character];
    props : [Prop];
    animations : [Text];
    textBubbles : [TextBubble];
  };
  public type Character = {
    name : Text;
    position : { x : Nat; y : Nat };
    avatarConfig : AvatarConfig;
  };
  public type Prop = {
    name : Text;
    position : { x : Nat; y : Nat };
    type_ : Text;
  };
  public type TextBubble = {
    content : Text;
    position : { x : Nat; y : Nat };
    character : Text;
    style : Text;
  };
  public type CraftProject = {
    id : Text;
    category : Text;
    title : Text;
    difficulty : Text;
    steps : [Text];
    materials : [Text];
    safetyTips : [Text];
    completedBy : [Principal];
    badges : [Text];
  };
  public type ArtGallerySubmission = {
    id : Text;
    owner : Principal;
    title : Text;
    artworkUrl : Text;
    category : Text;
    createdAt : Int;
    isPublic : Bool;
    approved : Bool;
  };
  public type SpinReward = {
    rewardType : Text;
    value : Text;
    timestamp : Int;
  };
  public type Sticker = {
    id : Text;
    creator : Principal;
    name : Text;
    image : Storage.ExternalBlob;
    isModerated : Bool;
    approved : Bool;
  };
  public type VideoProject = {
    id : Text;
    owner : Principal;
    title : Text;
    duration : Nat;
    createdAt : Int;
    exportUrl : ?Text;
    characters : [Text];
    scenes : [Text];
    animations : [Text];
    isPublic : Bool;
    approved : Bool;
  };
  public type MusicRemix = {
    id : Text;
    creator : Principal;
    title : Text;
    audio : Storage.ExternalBlob;
    duration : Nat;
    isPublic : Bool;
    approved : Bool;
  };
  public type MusicRemixStudio = {
    id : Text;
    creator : Principal;
    title : Text;
    tempo : Nat;
    pitch : Int;
    volume : Nat;
    reverb : Nat;
    delay : Nat;
  };
  public type Certificate = {
    id : Text;
    userId : Principal;
    achievement : Text;
    date : Int;
    pdfUrl : Storage.ExternalBlob;
    award : Text;
    mascot : Text;
    backgroundColor : Text;
    theme : Text;
  };
  public type InteractiveShort = {
    id : Text;
    title : Text;
    description : Text;
    owner : Principal;
    scenes : [ShortScene];
    choices : [[ShortChoice]];
    endingSummary : Text;
    isPublic : Bool;
    approved : Bool;
  };
  public type ShortScene = {
    id : Text;
    description : Text;
    visualAssets : [Text];
    soundEffects : [Text];
    transitions : [Text];
    backgroundMusic : ?Text;
    visualStyles : VisualStyle;
  };
  public type ShortChoice = {
    id : Text;
    description : Text;
    leadsToScene : Text;
  };
  public type VisualStyle = {
    colorPalette : [Text];
    animationType : Text;
    transitionEffects : [Text];
    sceneryType : Text;
  };
  public type GreenScreenFun = {
    id : Text;
    owner : Principal;
    sceneTitle : Text;
    sceneDescription : Text;
    background : Text;
    overlays : [Text];
    privacyFilterEnabled : Bool;
    contentWarnings : ?Text;
    adjustedPreview : Text;
    originalImage : Text;
    positionings : [(Text, (Nat, Nat))];
    isPublic : Bool;
    approved : Bool;
  };
  public type KaraokeMode = {
    songId : Text;
    owner : Principal;
    title : Text;
    lyrics : Text;
    audioBlob : Storage.ExternalBlob;
    vocalVolume : Nat;
    backgroundMusicVolume : Nat;
    visualizationsEnabled : Bool;
    animationAssets : [Text];
    visualStyles : VisualStyle;
    recordingUrl : ?Text;
    isPublic : Bool;
  };
  public type DanceRoutine = {
    id : Text;
    owner : Principal;
    title : Text;
    musicTrack : Storage.ExternalBlob;
    difficulty : Text;
    poseGuideAssets : [Text];
    cameraRequired : Bool;
    visualStyles : VisualStyle;
    encouragementMessages : [Text];
    completedBy : [Principal];
  };
  public type CreativeFunHub = {
    userId : Principal;
    shortsWatched : Nat;
    greenScreenCreations : Nat;
    karaokePerformances : Nat;
    danceChallengesCompleted : Nat;
    preferences : CreativeFunPreferences;
    lastAccessed : Int;
  };
  public type CreativeFunPreferences = {
    preferredVisualStyle : Text;
    mascotVoiceEnabled : Bool;
    language : Text;
    accessibilityMode : Bool;
  };
  public type LearnHub = {
    userId : Principal;
    readingProgress : ReadingProgress;
    scienceProgress : ScienceProgress;
    artsMusicProgress : ArtsMusicProgress;
    discoveryZoneProgress : DiscoveryZoneProgress;
    preferences : LearnHubPreferences;
    lastAccessed : Int;
  };
  public type LearnHubPreferences = {
    preferredCategory : Text;
    mascotVoiceEnabled : Bool;
    language : Text;
    accessibilityMode : Bool;
  };
  public type Lesson = {
    id : Text;
    title : Text;
    content : Text;
    category : Text;
    difficulty : Text;
    isCompleted : Bool;
    score : ?Nat;
    attempts : Nat;
    starsEarned : [Text];
  };
  public type ReadingProgress = {
    progressLevel : Text;
    lessonsCompleted : [Lesson];
    starsEarned : [Text];
  };
  public type ScienceProgress = {
    focusArea : Text;
    lessonsCompleted : [Lesson];
    badgesEarned : [Text];
  };
  public type ArtsMusicProgress = {
    progressArea : Text;
    lessonsCompleted : [Lesson];
    artisticAchievements : [Text];
  };
  public type DiscoveryZoneProgress = {
    curiosityScore : Nat;
    lessonsCompleted : [Lesson];
    discoveryAchievements : [Text];
    inventionStoriesRead : [Text];
    currentInventionStoryId : ?Text;
    lastStoryStartedAt : ?Time.Time;
  };
  public type VirtualPetHub = {
    userId : Principal;
    petName : Text;
    happinessLevel : Nat;
    growthStage : Nat;
    accessories : [Text];
    decorations : [Text];
    homeStyle : Text;
    warnedAboutExtremeChanges : Bool;
    trophies : Nat;
  };
  public type RecentlyPlayedItem = {
    activityId : Text;
    title : Text;
    activityType : Text;
    timestamp : Time.Time;
    difficulty : Text;
  };
  public type SmartHubData = {
    userId : Principal;
    recommendedActivities : [Text];
    recentlyPlayed : [RecentlyPlayedItem];
    dailyPick : Text;
    createdAt : Time.Time;
    lastUpdated : Time.Time;
    difficultySetting : Text;
    dailyPickChangedAt : Time.Time;
    dailyPickPrevious : ?Text;
  };
  public type InventionStory = {
    id : Text;
    title : Text;
    content : Text;
    author : Text;
    visualAssets : [Text];
    narrationAudio : ?Storage.ExternalBlob;
    recommendedAge : Nat;
    discoveryLevel : Text;
    category : Text;
    visualStyle : VisualStyle;
    narrationStyle : Text;
    backgroundMusic : ?Text;
    interactiveElements : [Text];
    achievementBadge : Text;
    certificateId : ?Text;
    funFacts : [Text];
    mascotCommentary : [Text];
  };
  public type AdminUserStatus = {
    #active;
    #restricted;
    #suspended;
    #banned;
  };
  public type AdminStatusRecord = {
    userId : Principal;
    status : AdminUserStatus;
    reason : ?Text;
    changedBy : Principal;
    changedAt : Time.Time;
  };
  public type AdminFeatureRestriction = {
    userId : Principal;
    feature : Text;
    restrictedBy : Principal;
    reason : ?Text;
    createdAt : Time.Time;
    updatedAt : ?Time.Time;
  };
  public type AdminDashboardOverview = {
    activeUsers : [Principal];
    userStats : { total : Nat; active : Nat; restricted : Nat; suspended : Nat; banned : Nat };
    activitySummary : { recentActivities : Nat; systemEvents : Nat };
  };
  public type AdminDashboardSection = {
    overview : AdminDashboardOverview;
    manageUsers : [UserProfile];
    restrictions : [AdminFeatureRestriction];
    settings : { adminPreferences : Text };
    safetyAlerts : [Text];
  };
  public type TicTacToe = {
    userId : ?Principal;
    opponentId : ?Principal;
    mode : Text;
    moves : [Move];
    outcome : TicTacToeOutcome;
  };
  public type Move = {
    player : Text;
    playerId : ?Principal;
    x : Nat;
    y : Nat;
  };
  public type TicTacToeOutcome = {
    #won : Text;
    #draw;
    #ongoing;
  };
  public type Badge = {
    name : Text;
    description : Text;
    category : Text;
    requirement : Text;
    rewardPoints : Nat;
  };
  public type BadgeProof = {
    badge : Badge;
    proof : Text;
    timestamp : Int;
  };
  public type SpinRewardUpdate = {
    spinReward : SpinReward;
    badgesEarned : [BadgeProof];
    pointsAwarded : Nat;
    extraSpin : Bool;
  };
  public type ScaryHubGameEntry = {
    id : Text;
    title : Text;
    description : Text;
    category : Text;
    isScary : Bool;
    difficulty : Text;
    theme : Text;
    instructions : Text;
    assets : [Text];
    highScore : Nat;
    lastPlayed : Int;
    isFavorite : Bool;
  };
  public type VideoChannelCategory = {
    categoryId : Text;
    name : Text;
    ageRange : Text;
    description : Text;
    channels : [VideoChannel];
  };
  public type VideoChannel = {
    channelId : Text;
    name : Text;
    description : Text;
    playlistUrl : Text;
    iconUrl : Text;
    categoryId : Text;
    safe : Bool;
    approved : Bool;
    createdAt : Time.Time;
    lastUpdated : ?Time.Time;
    lastPlayed : ?Time.Time;
    isFavorite : Bool;
    totalVideos : Nat;
    views : Nat;
  };
  public type ActivityType = {
    #user_created;
    #game_played : { gameId : Text; gameName : Text };
  };
  public type ActivityEvent = {
    id : Nat;
    userId : Principal;
    activityType : ActivityType;
    timestamp : Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let adminUserStatuses = Map.empty<Principal, AdminUserStatus>();
  let adminFeatureRestrictions = Map.empty<Principal, [AdminFeatureRestriction]>();

  let gameProgress = Map.empty<Principal, [GameProgress]>();
  let eclipseAIBehavior = Map.empty<Text, EclipseAIBehavior>();
  let events = Map.empty<Text, Event>();
  let chatMessages = Map.empty<Text, ChatMessage>();
  let onlineUsers = Map.empty<Principal, OnlineUser>();
  let videoProjects = Map.empty<Text, VideoProject>();
  let cardDesigns = Map.empty<Text, CardDesign>();
  let jokes = Map.empty<Text, Joke>();
  let feedback = Map.empty<Text, Feedback>();
  let rewards = Map.empty<Principal, Reward>();
  let badges = Map.empty<Text, Badge>();
  let badgeProofs = Map.empty<Principal, [BadgeProof]>();
  let parentalControls = Map.empty<Principal, ParentalControl>();
  let games = Map.empty<Text, Game>();
  let hubCategories = Map.empty<Text, HubCategory>();
  let seasonalEvents = Map.empty<Text, SeasonalEvent>();
  let mascotInteractions = Map.empty<Principal, [MascotInteraction]>();
  let storyProjects = Map.empty<Text, StoryProject>();
  let craftProjects = Map.empty<Text, CraftProject>();
  let artGallery = Map.empty<Text, ArtGallerySubmission>();
  let spinRewards = Map.empty<Principal, [SpinReward]>();
  let lastSpinTime = Map.empty<Principal, Int>();
  let stickers = Map.empty<Text, Sticker>();
  let musicRemixes = Map.empty<Text, MusicRemix>();
  let musicRemixStudios = Map.empty<Text, MusicRemixStudio>();
  let certificates = Map.empty<Text, Certificate>();
  let interactiveShorts = Map.empty<Text, InteractiveShort>();
  let greenScreenFun = Map.empty<Text, GreenScreenFun>();
  let karaokeMode = Map.empty<Text, KaraokeMode>();
  let danceRoutines = Map.empty<Text, DanceRoutine>();
  let creativeFunHub = Map.empty<Principal, CreativeFunHub>();
  let learnHub = Map.empty<Principal, LearnHub>();
  let virtualPetHubMap = Map.empty<Principal, VirtualPetHub>();
  let smartHub = Map.empty<Principal, SmartHubData>();
  let inventionStories = Map.empty<Text, InventionStory>();
  let ticTacToes = Map.empty<Text, TicTacToe>();
  let jokeFavorites = Map.empty<Principal, [Text]>();
  let jokeRatings = Map.empty<Principal, Map.Map<Text, Nat>>();
  let eventNotificationsDismissed = Map.empty<Principal, Set.Set<Text>>();
  let scaryHubGames = Map.empty<Text, ScaryHubGameEntry>();
  let videoChannels = Map.empty<Text, VideoChannel>();
  let userFavoriteChannels = Map.empty<Principal, Set.Set<Text>>();

  let activityLog = List.empty<ActivityEvent>();
  var nextActivityId : Nat = 0;

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only guard is enforced inside AccessControl.assignRole
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let isNewProfile = switch (userProfiles.get(caller)) {
      case (null) { true };
      case (?_) { false };
    };

    userProfiles.add(caller, profile);

    if (isNewProfile) {
      let activity : ActivityEvent = {
        id = nextActivityId;
        userId = caller;
        activityType = #user_created;
        timestamp = Time.now();
      };
      activityLog.add(activity);
      nextActivityId += 1;
    };
  };

  // Total Score: returns the caller's accumulated points (trophies added from spin wheel)
  public query ({ caller }) func getTotalScore() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their total score");
    };
    switch (rewards.get(caller)) {
      case (?reward) { reward.points };
      case (null) { 0 };
    };
  };

  // Add trophies earned from the spin wheel to the user's Total Score (rewards map points + totalTrophies).
  // Preserves all existing reward fields and existing VirtualPetHub fields.
  public shared ({ caller }) func addTrophiesFromSpin(trophies : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can earn trophies from spinning");
    };

    // Update rewards map: add trophies to points and totalTrophies
    let currentReward = switch (rewards.get(caller)) {
      case (?r) { r };
      case (null) {
        {
          userId = caller;
          points = 0;
          badges = [];
          achievements = [];
          virtualPetLevel = 0;
          totalTrophies = 0;
        }
      };
    };

    let updatedReward : Reward = {
      currentReward with
      points = currentReward.points + trophies;
      totalTrophies = currentReward.totalTrophies + trophies;
    };
    rewards.add(caller, updatedReward);

    // Also reflect trophies in the VirtualPetHub trophies field, preserving existing pet data
    let currentPet = switch (virtualPetHubMap.get(caller)) {
      case (?p) { p };
      case (null) {
        {
          userId = caller;
          petName = "";
          happinessLevel = 0;
          growthStage = 0;
          accessories = [];
          decorations = [];
          homeStyle = "";
          warnedAboutExtremeChanges = false;
          trophies = 0;
        }
      };
    };

    let updatedPet : VirtualPetHub = {
      currentPet with
      trophies = currentPet.trophies + trophies;
    };
    virtualPetHubMap.add(caller, updatedPet);
  };

  // Add points earned from the spin wheel to the Virtual Pet progress only (happinessLevel).
  // Points from spin wheel do NOT go to the rewards/total-score tracker.
  // Preserves all existing VirtualPetHub fields.
  public shared ({ caller }) func addPointsFromSpin(points : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can earn points from spinning");
    };

    let currentPet = switch (virtualPetHubMap.get(caller)) {
      case (?p) { p };
      case (null) {
        {
          userId = caller;
          petName = "";
          happinessLevel = 0;
          growthStage = 0;
          accessories = [];
          decorations = [];
          homeStyle = "";
          warnedAboutExtremeChanges = false;
          trophies = 0;
        }
      };
    };

    let updatedPet : VirtualPetHub = {
      currentPet with
      happinessLevel = currentPet.happinessLevel + points;
    };
    virtualPetHubMap.add(caller, updatedPet);
    // Points go only to Virtual Pet progress, not to the rewards/total-score map
  };

  // Get the caller's VirtualPetHub data
  public query ({ caller }) func getVirtualPetHub() : async ?VirtualPetHub {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their virtual pet");
    };
    virtualPetHubMap.get(caller);
  };

  // Save/update the caller's VirtualPetHub data
  public shared ({ caller }) func saveVirtualPetHub(pet : VirtualPetHub) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their virtual pet");
    };
    virtualPetHubMap.add(caller, { pet with userId = caller });
  };

  // Get the caller's rewards record
  public query ({ caller }) func getCallerRewards() : async ?Reward {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their rewards");
    };
    rewards.get(caller);
  };

  // Save/update the caller's rewards record
  public shared ({ caller }) func saveCallerRewards(reward : Reward) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their rewards");
    };
    rewards.add(caller, { reward with userId = caller });
  };

  // Get spin rewards history for the caller
  public query ({ caller }) func getSpinRewards() : async [SpinReward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their spin rewards");
    };
    switch (spinRewards.get(caller)) {
      case (?sr) { sr };
      case (null) { [] };
    };
  };

  // Record a spin reward for the caller
  public shared ({ caller }) func recordSpinReward(reward : SpinReward) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record spin rewards");
    };
    let existing = switch (spinRewards.get(caller)) {
      case (?sr) { sr };
      case (null) { [] };
    };
    spinRewards.add(caller, existing.concat([reward]));
    lastSpinTime.add(caller, Time.now());
  };

  // Get the last spin time for the caller
  public query ({ caller }) func getLastSpinTime() : async ?Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their spin time");
    };
    lastSpinTime.get(caller);
  };
};
