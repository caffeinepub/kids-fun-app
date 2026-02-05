import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Set "mo:core/Set";

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

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
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
      Runtime.trap("Unauthorized: Only users can save profiles");
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
    userProfiles.add(caller, profile);
  };

  // Story Builder Functions with proper authorization

  // User can save their own story project
  public shared ({ caller }) func saveStoryProject(story : StoryProject) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save stories");
    };

    if (story.owner != caller) {
      Runtime.trap("Unauthorized: Cannot save story for another user");
    };

    storyProjects.add(story.id, story);
  };

  // User retrieves all their own story projects
  public query ({ caller }) func getCallerStoryProjects() : async [StoryProject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view stories");
    };

    let allStories = storyProjects.values().toArray();
    allStories.filter<StoryProject>(func(story) { story.owner == caller });
  };

  // User or admin can view a specific story project
  public query ({ caller }) func getStoryProject(storyId : Text) : async ?StoryProject {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view stories");
    };

    switch (storyProjects.get(storyId)) {
      case (?story) {
        // Owner can view their own story, admin can view any story
        if (story.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?story;
        } else {
          Runtime.trap("Unauthorized: Can only view your own stories");
        };
      };
      case (null) { null };
    };
  };

  // User can update their own story project
  public shared ({ caller }) func updateStoryProject(storyId : Text, updatedStory : StoryProject) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update stories");
    };

    switch (storyProjects.get(storyId)) {
      case (?existingStory) {
        if (existingStory.owner != caller) {
          Runtime.trap("Unauthorized: Can only update your own stories");
        };

        if (updatedStory.owner != caller) {
          Runtime.trap("Unauthorized: Cannot change story ownership");
        };

        storyProjects.add(storyId, updatedStory);
      };
      case (null) {
        Runtime.trap("Story not found");
      };
    };
  };

  // User can delete their own story project
  public shared ({ caller }) func deleteStoryProject(storyId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete stories");
    };

    switch (storyProjects.get(storyId)) {
      case (?story) {
        if (story.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own stories");
        };

        storyProjects.remove(storyId);
      };
      case (null) {
        Runtime.trap("Story not found");
      };
    };
  };

  // User can publish their story (requires parental approval in specification)
  public shared ({ caller }) func publishStoryProject(storyId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can publish stories");
    };

    switch (storyProjects.get(storyId)) {
      case (?story) {
        if (story.owner != caller) {
          Runtime.trap("Unauthorized: Can only publish your own stories");
        };

        let updatedStory = {
          story with
          published = true;
          approved = false; // Requires admin approval
        };

        storyProjects.add(storyId, updatedStory);
      };
      case (null) {
        Runtime.trap("Story not found");
      };
    };
  };

  // Admin can view all story projects for moderation
  public query ({ caller }) func getAllStoryProjects() : async [StoryProject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all stories");
    };

    storyProjects.values().toArray();
  };

  // Admin can approve a published story
  public shared ({ caller }) func approveStoryProject(storyId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve stories");
    };

    switch (storyProjects.get(storyId)) {
      case (?story) {
        let updatedStory = {
          story with
          approved = true;
        };

        storyProjects.add(storyId, updatedStory);
      };
      case (null) {
        Runtime.trap("Story not found");
      };
    };
  };

  // Virtual Pet Hub Functions
  public query ({ caller }) func getCallerVirtualPet() : async ?VirtualPetHub {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access virtual pets");
    };
    virtualPetHubMap.get(caller);
  };

  public query ({ caller }) func getVirtualPet(user : Principal) : async ?VirtualPetHub {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own virtual pet");
    };
    virtualPetHubMap.get(user);
  };

  public shared ({ caller }) func saveCallerVirtualPet(pet : VirtualPetHub) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save virtual pets");
    };

    if (pet.userId != caller) {
      Runtime.trap("Unauthorized: Cannot save virtual pet for another user");
    };

    virtualPetHubMap.add(caller, pet);
  };

  public query ({ caller }) func getScaryHubGames() : async [ScaryHubGameEntry] {
    scaryHubGames.values().toArray();
  };

  public shared ({ caller }) func updateGamesTrophies() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update trophies from games");
    };

    let currentTrophies = switch (virtualPetHubMap.get(caller)) {
      case (?existingPet) { existingPet.trophies };
      case (null) { DEFAULT_TROPHIES };
    };

    if (currentTrophies < TROPHIES_PER_GAME) {
      Runtime.trap("Not enough trophies to play a game");
    };

    let userId : Principal = caller;

    let updatedTrophies = currentTrophies - TROPHIES_PER_GAME;

    let currentPet = switch (virtualPetHubMap.get(userId)) {
      case (?pet) { pet };
      case null {
        {
          userId;
          petName = "Pet";
          happinessLevel = 0;
          growthStage = 0;
          accessories = [];
          decorations = [];
          homeStyle = "";
          warnedAboutExtremeChanges = false;
          trophies = 0;
        };
      };
    };

    let updatedPet : VirtualPetHub = {
      currentPet with
      trophies = updatedTrophies;
    };
    virtualPetHubMap.add(userId, updatedPet);

    updatedTrophies;
  };

  public shared ({ caller }) func welcomeBackReward() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can receive welcome back rewards");
    };

    let currentTrophies = switch (virtualPetHubMap.get(caller)) {
      case (?existingPet) { existingPet.trophies };
      case (null) { DEFAULT_TROPHIES };
    };

    let updatedTrophies = currentTrophies + WELCOME_BACK_BONUS;
    let userId : Principal = caller;

    let currentPet = switch (virtualPetHubMap.get(userId)) {
      case (?pet) { pet };
      case null {
        {
          userId;
          petName = "Pet";
          happinessLevel = 0;
          growthStage = 0;
          accessories = [];
          decorations = [];
          homeStyle = "";
          warnedAboutExtremeChanges = false;
          trophies = 0;
        };
      };
    };

    let updatedPet : VirtualPetHub = {
      currentPet with
      trophies = updatedTrophies;
    };
    virtualPetHubMap.add(userId, updatedPet);
  };

  // Video Hub Functions
  // Admin-only: Add new video channel
  public shared ({ caller }) func addVideoChannel(channel : VideoChannel) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add video channels");
    };
    videoChannels.add(channel.channelId, channel);
  };

  // Admin-only: Update existing video channel
  public shared ({ caller }) func updateVideoChannel(channelId : Text, updatedChannel : VideoChannel) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update video channels");
    };

    switch (videoChannels.get(channelId)) {
      case (?_) {
        videoChannels.add(channelId, updatedChannel);
      };
      case (null) {
        Runtime.trap("Video channel not found");
      };
    };
  };

  // Admin-only: Delete video channel
  public shared ({ caller }) func deleteVideoChannel(channelId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete video channels");
    };

    switch (videoChannels.get(channelId)) {
      case (?_) {
        videoChannels.remove(channelId);
      };
      case (null) {
        Runtime.trap("Video channel not found");
      };
    };
  };

  // Public: Get all video channels (browsing is public for kids)
  public query ({ caller }) func getVideoChannels() : async [VideoChannel] {
    videoChannels.values().toArray();
  };

  // Public: Get specific video channel details
  public query ({ caller }) func getVideoChannel(channelId : Text) : async ?VideoChannel {
    videoChannels.get(channelId);
  };

  // Public: Update video channel views
  // Note: This is intentionally public to allow anonymous view tracking
  // for educational content. No sensitive data is exposed or modified.
  public shared ({ caller }) func updateVideoChannelViews(channelId : Text) : async () {
    switch (videoChannels.get(channelId)) {
      case (?channel) {
        let updatedChannel = {
          channel with
          views = channel.views + 1;
          lastPlayed = ?Time.now();
        };
        videoChannels.add(channelId, updatedChannel);
      };
      case (null) {
        Runtime.trap("Video channel not found");
      };
    };
  };

  // User-only: Mark channel as favorite
  public shared ({ caller }) func markChannelAsFavorite(channelId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can mark favorites");
    };

    switch (videoChannels.get(channelId)) {
      case (?_) {
        let userFavorites = switch (userFavoriteChannels.get(caller)) {
          case (?favorites) { favorites };
          case (null) { Set.empty<Text>() };
        };

        userFavorites.add(channelId);
        userFavoriteChannels.add(caller, userFavorites);
      };
      case (null) {
        Runtime.trap("Video channel not found");
      };
    };
  };

  // User-only: Unmark channel as favorite
  public shared ({ caller }) func unmarkChannelAsFavorite(channelId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can unmark favorites");
    };

    switch (userFavoriteChannels.get(caller)) {
      case (?favorites) {
        favorites.remove(channelId);
        userFavoriteChannels.add(caller, favorites);
      };
      case (null) {};
    };
  };

  // User-only: Get caller's favorite channels
  public query ({ caller }) func getCallerFavoriteChannels() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view favorites");
    };

    switch (userFavoriteChannels.get(caller)) {
      case (?favorites) {
        favorites.toArray();
      };
      case (null) { [] };
    };
  };
};
