import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import GamesHub from './pages/GamesHub';
import ProfileCustomization from './pages/ProfileCustomization';
import EventsPage from './pages/EventsPage';
import SeasonalEventsPage from './pages/SeasonalEventsPage';
import AvatarCreatorPage from './pages/AvatarCreatorPage';
import StoryBuilderPage from './pages/StoryBuilderPage';
import CraftDIYPage from './pages/CraftDIYPage';
import ArtGalleryPage from './pages/ArtGalleryPage';
import VideoGeneratorPage from './pages/VideoGeneratorPage';
import ChatPage from './pages/ChatPage';
import EventCardsPage from './pages/EventCardsPage';
import JokesPage from './pages/JokesPage';
import RewardsPage from './pages/RewardsPage';
import FeedbackPage from './pages/FeedbackPage';
import SpinWheelPage from './pages/SpinWheelPage';
import StickerCreatorPage from './pages/StickerCreatorPage';
import MusicRemixPage from './pages/MusicRemixPage';
import CertificatesPage from './pages/CertificatesPage';
import CreativeFunHub from './pages/CreativeFunHub';
import InteractiveShortsPage from './pages/InteractiveShortsPage';
import GreenScreenFunPage from './pages/GreenScreenFunPage';
import KaraokeModePage from './pages/KaraokeModePage';
import DanceChallengePage from './pages/DanceChallengePage';
import LearnHubPage from './pages/LearnHubPage';
import VirtualPetHubPage from './pages/VirtualPetHubPage';
import SmartHubPage from './pages/SmartHubPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ScaryHub from './pages/ScaryHub';
import FunnyFartHub from './pages/FunnyFartHub';
import VideoHubPage from './pages/VideoHubPage';
import PreLoginExperiencePage from './pages/PreLoginExperiencePage';

// Game imports
import BalloonPop from './pages/games/BalloonPop';
import SuperSpeedyRacer from './pages/games/SuperSpeedyRacer';
import AmbulanceRescue from './pages/games/AmbulanceRescue';
import EclipseNowSolo from './pages/games/EclipseNowSolo';
import ForestNight from './pages/games/ForestNight';
import MemoryMatch from './pages/games/MemoryMatch';
import BirthdayCakeMaker from './pages/games/BirthdayCakeMaker';
import BirthdayCakeDecorator from './pages/games/BirthdayCakeDecorator';
import FamousPlaces from './pages/games/FamousPlaces';
import WordWizard from './pages/games/WordWizard';
import PoliceBuddyChase from './pages/games/PoliceBuddyChase';
import NumberRunner from './pages/games/NumberRunner';
import BibbleAdventure from './pages/games/BibbleAdventure';
import ShapeShiftingWorld from './pages/games/ShapeShiftingWorld';
import TimeControlAdventure from './pages/games/TimeControlAdventure';
import ThemeParkBuilder from './pages/games/ThemeParkBuilder';
import MindMazePuzzle from './pages/games/MindMazePuzzle';
import SpaceStationLife from './pages/games/SpaceStationLife';
import SuperpowerTraining from './pages/games/SuperpowerTraining';
import EscapeRoomUniverse from './pages/games/EscapeRoomUniverse';
import GadgetCombat from './pages/games/GadgetCombat';
import GrandmaSecretArcade from './pages/games/GrandmaSecretArcade';
import ScreenIsEnemy from './pages/games/ScreenIsEnemy';
import ControlEnemies from './pages/games/ControlEnemies';
import EverythingBreaks from './pages/games/EverythingBreaks';
import SoundBasedWorld from './pages/games/SoundBasedWorld';
import ReverseProgression from './pages/games/ReverseProgression';
import EnemiesPlatforms from './pages/games/EnemiesPlatforms';
import PauseMechanic from './pages/games/PauseMechanic';
import YoureLateAlways from './pages/games/YoureLateAlways';
import LiesAndTruths from './pages/games/LiesAndTruths';
import TinyHeroGiantWorld from './pages/games/TinyHeroGiantWorld';
import TicTacToe from './pages/games/TicTacToe';
import MonsterMaze from './pages/games/MonsterMaze';
import SpiderWebPuzzle from './pages/games/SpiderWebPuzzle';
import PumpkinSmash from './pages/games/PumpkinSmash';
import CronkerKontry from './pages/games/CronkerKontry';
import PacMan from './pages/games/PacMan';
import Tetris from './pages/games/Tetris';
import SpaceInvaders from './pages/games/SpaceInvaders';

const queryClient = new QueryClient();

export type ModulePage =
  | 'pre-login'
  | 'dashboard'
  | 'games'
  | 'profile'
  | 'events'
  | 'seasonal-events'
  | 'avatar-creator'
  | 'story-builder'
  | 'craft-diy'
  | 'art-gallery'
  | 'video-generator'
  | 'chat'
  | 'event-cards'
  | 'jokes'
  | 'rewards'
  | 'feedback'
  | 'spin-wheel'
  | 'sticker-creator'
  | 'music-remix'
  | 'certificates'
  | 'creative-fun-hub'
  | 'interactive-shorts'
  | 'green-screen-fun'
  | 'karaoke-mode'
  | 'dance-challenge'
  | 'learn-hub'
  | 'virtual-pet-hub'
  | 'smart-hub'
  | 'admin-dashboard'
  | 'scary-hub'
  | 'funny-fart-hub'
  | 'video-hub'
  | 'game:balloon-pop'
  | 'game:super-speedy-racer'
  | 'game:ambulance-rescue'
  | 'game:eclipse-now-solo'
  | 'game:forest-night'
  | 'game:memory-match'
  | 'game:birthday-cake-maker'
  | 'game:birthday-cake-decorator'
  | 'game:famous-places'
  | 'game:word-wizard'
  | 'game:police-buddy-chase'
  | 'game:number-runner'
  | 'game:bibble-adventure'
  | 'game:shape-shifting-world'
  | 'game:time-control-adventure'
  | 'game:theme-park-builder'
  | 'game:mind-maze-puzzle'
  | 'game:space-station-life'
  | 'game:superpower-training'
  | 'game:escape-room-universe'
  | 'game:gadget-combat'
  | 'game:grandma-secret-arcade'
  | 'game:screen-is-enemy'
  | 'game:control-enemies'
  | 'game:everything-breaks'
  | 'game:sound-based-world'
  | 'game:reverse-progression'
  | 'game:enemies-platforms'
  | 'game:pause-mechanic'
  | 'game:youre-late-always'
  | 'game:lies-and-truths'
  | 'game:tiny-hero-giant-world'
  | 'game:tic-tac-toe'
  | 'game:monster-maze'
  | 'game:spider-web-puzzle'
  | 'game:pumpkin-smash'
  | 'game:cronker-kontry'
  | 'game:pac-man'
  | 'game:tetris'
  | 'game:space-invaders'
  | 'game:floor-is-liar'
  | 'game:inventory-is-enemy'
  | 'game:speed-is-health'
  | 'game:enemy-controls-camera'
  | 'game:one-room-infinite-games'
  | 'game:move-when-blink'
  | 'game:bosses-learn-habits'
  | 'game:everything-is-button'
  | 'game:delayed-controls'
  | 'game:tutorial-is-villain';

// Trial games that can be played without authentication - centralized source of truth
export const TRIAL_GAMES: ModulePage[] = [
  'game:balloon-pop',
  'game:memory-match',
  'game:tic-tac-toe',
  'game:birthday-cake-maker',
  'game:birthday-cake-decorator',
];

// Pages that can be accessed without authentication
const UNAUTHENTICATED_PAGES: ModulePage[] = [
  'pre-login',
  'games',
  ...TRIAL_GAMES,
];

function AppContent() {
  const [currentPage, setCurrentPage] = useState<ModulePage>('pre-login');
  const [redirectMessage, setRedirectMessage] = useState<string>('');
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;

  // Handle navigation with access gating
  const handleNavigate = (page: ModulePage) => {
    // If not authenticated and trying to access restricted page
    if (!isAuthenticated && !UNAUTHENTICATED_PAGES.includes(page)) {
      setRedirectMessage('Please log in to access this section.');
      setCurrentPage('pre-login');
      return;
    }

    // Clear redirect message on successful navigation
    setRedirectMessage('');
    setCurrentPage(page);
  };

  // Redirect to pre-login if not authenticated and on restricted page
  useEffect(() => {
    if (!isInitializing && !isAuthenticated && !UNAUTHENTICATED_PAGES.includes(currentPage)) {
      setRedirectMessage('Please log in to access this section.');
      setCurrentPage('pre-login');
    }
  }, [isAuthenticated, isInitializing, currentPage]);

  // Set default page based on authentication status
  useEffect(() => {
    if (!isInitializing) {
      if (isAuthenticated && currentPage === 'pre-login') {
        setCurrentPage('dashboard');
      } else if (!isAuthenticated && currentPage === 'dashboard') {
        setCurrentPage('pre-login');
      }
    }
  }, [isAuthenticated, isInitializing, currentPage]);

  const renderPage = () => {
    // Show pre-login for unauthenticated users
    if (!isAuthenticated && currentPage === 'pre-login') {
      return <PreLoginExperiencePage onNavigate={handleNavigate} redirectMessage={redirectMessage} />;
    }

    // Render authenticated or trial pages
    switch (currentPage) {
      case 'pre-login':
        return <PreLoginExperiencePage onNavigate={handleNavigate} redirectMessage={redirectMessage} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'games':
        return <GamesHub onNavigate={handleNavigate} isAuthenticated={isAuthenticated} />;
      case 'profile':
        return <ProfileCustomization />;
      case 'events':
        return <EventsPage />;
      case 'seasonal-events':
        return <SeasonalEventsPage />;
      case 'avatar-creator':
        return <AvatarCreatorPage />;
      case 'story-builder':
        return <StoryBuilderPage />;
      case 'craft-diy':
        return <CraftDIYPage />;
      case 'art-gallery':
        return <ArtGalleryPage />;
      case 'video-generator':
        return <VideoGeneratorPage />;
      case 'chat':
        return <ChatPage />;
      case 'event-cards':
        return <EventCardsPage />;
      case 'jokes':
        return <JokesPage />;
      case 'rewards':
        return <RewardsPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'spin-wheel':
        return <SpinWheelPage />;
      case 'sticker-creator':
        return <StickerCreatorPage />;
      case 'music-remix':
        return <MusicRemixPage />;
      case 'certificates':
        return <CertificatesPage />;
      case 'creative-fun-hub':
        return <CreativeFunHub onNavigate={handleNavigate} />;
      case 'interactive-shorts':
        return <InteractiveShortsPage onNavigate={handleNavigate} />;
      case 'green-screen-fun':
        return <GreenScreenFunPage onNavigate={handleNavigate} />;
      case 'karaoke-mode':
        return <KaraokeModePage onNavigate={handleNavigate} />;
      case 'dance-challenge':
        return <DanceChallengePage onNavigate={handleNavigate} />;
      case 'learn-hub':
        return <LearnHubPage onNavigate={handleNavigate} />;
      case 'virtual-pet-hub':
        return <VirtualPetHubPage />;
      case 'smart-hub':
        return <SmartHubPage onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'scary-hub':
        return <ScaryHub onNavigate={handleNavigate} />;
      case 'funny-fart-hub':
        return <FunnyFartHub onNavigate={handleNavigate} />;
      case 'video-hub':
        return <VideoHubPage onNavigate={handleNavigate} />;
      case 'game:balloon-pop':
        return <BalloonPop onNavigate={handleNavigate} />;
      case 'game:super-speedy-racer':
        return <SuperSpeedyRacer onNavigate={handleNavigate} />;
      case 'game:ambulance-rescue':
        return <AmbulanceRescue onNavigate={handleNavigate} />;
      case 'game:eclipse-now-solo':
        return <EclipseNowSolo onNavigate={handleNavigate} />;
      case 'game:forest-night':
        return <ForestNight onNavigate={handleNavigate} />;
      case 'game:memory-match':
        return <MemoryMatch onNavigate={handleNavigate} />;
      case 'game:birthday-cake-maker':
        return <BirthdayCakeMaker onNavigate={handleNavigate} />;
      case 'game:birthday-cake-decorator':
        return <BirthdayCakeDecorator onNavigate={handleNavigate} />;
      case 'game:famous-places':
        return <FamousPlaces onNavigate={handleNavigate} />;
      case 'game:word-wizard':
        return <WordWizard onNavigate={handleNavigate} />;
      case 'game:police-buddy-chase':
        return <PoliceBuddyChase onNavigate={handleNavigate} />;
      case 'game:number-runner':
        return <NumberRunner onNavigate={handleNavigate} />;
      case 'game:bibble-adventure':
        return <BibbleAdventure onNavigate={handleNavigate} />;
      case 'game:shape-shifting-world':
        return <ShapeShiftingWorld onNavigate={handleNavigate} />;
      case 'game:time-control-adventure':
        return <TimeControlAdventure onNavigate={handleNavigate} />;
      case 'game:theme-park-builder':
        return <ThemeParkBuilder onNavigate={handleNavigate} />;
      case 'game:mind-maze-puzzle':
        return <MindMazePuzzle onNavigate={handleNavigate} />;
      case 'game:space-station-life':
        return <SpaceStationLife onNavigate={handleNavigate} />;
      case 'game:superpower-training':
        return <SuperpowerTraining onNavigate={handleNavigate} />;
      case 'game:escape-room-universe':
        return <EscapeRoomUniverse onNavigate={handleNavigate} />;
      case 'game:gadget-combat':
        return <GadgetCombat onNavigate={handleNavigate} />;
      case 'game:grandma-secret-arcade':
        return <GrandmaSecretArcade onNavigate={handleNavigate} />;
      case 'game:screen-is-enemy':
        return <ScreenIsEnemy onNavigate={handleNavigate} />;
      case 'game:control-enemies':
        return <ControlEnemies onNavigate={handleNavigate} />;
      case 'game:everything-breaks':
        return <EverythingBreaks onNavigate={handleNavigate} />;
      case 'game:sound-based-world':
        return <SoundBasedWorld onNavigate={handleNavigate} />;
      case 'game:reverse-progression':
        return <ReverseProgression onNavigate={handleNavigate} />;
      case 'game:enemies-platforms':
        return <EnemiesPlatforms onNavigate={handleNavigate} />;
      case 'game:pause-mechanic':
        return <PauseMechanic onNavigate={handleNavigate} />;
      case 'game:youre-late-always':
        return <YoureLateAlways onNavigate={handleNavigate} />;
      case 'game:lies-and-truths':
        return <LiesAndTruths onNavigate={handleNavigate} />;
      case 'game:tiny-hero-giant-world':
        return <TinyHeroGiantWorld onNavigate={handleNavigate} />;
      case 'game:tic-tac-toe':
        return <TicTacToe onNavigate={handleNavigate} />;
      case 'game:monster-maze':
        return <MonsterMaze onNavigate={handleNavigate} />;
      case 'game:spider-web-puzzle':
        return <SpiderWebPuzzle onNavigate={handleNavigate} />;
      case 'game:pumpkin-smash':
        return <PumpkinSmash onNavigate={handleNavigate} />;
      case 'game:cronker-kontry':
        return <CronkerKontry onNavigate={handleNavigate} />;
      case 'game:pac-man':
        return <PacMan onNavigate={handleNavigate} />;
      case 'game:tetris':
        return <Tetris onNavigate={handleNavigate} />;
      case 'game:space-invaders':
        return <SpaceInvaders onNavigate={handleNavigate} />;
      case 'game:floor-is-liar':
      case 'game:inventory-is-enemy':
      case 'game:speed-is-health':
      case 'game:enemy-controls-camera':
      case 'game:one-room-infinite-games':
      case 'game:move-when-blink':
      case 'game:bosses-learn-habits':
      case 'game:everything-is-button':
      case 'game:delayed-controls':
      case 'game:tutorial-is-villain':
        return (
          <div className="min-h-screen flex items-center justify-center bg-background p-8">
            <div className="text-center space-y-6 max-w-2xl bg-card p-12 rounded-3xl shadow-lg">
              <h1 className="text-5xl font-bold text-foreground">Coming Soon! 🎮</h1>
              <p className="text-2xl text-foreground">
                This game is currently under development and will be available soon!
              </p>
              <button
                onClick={() => handleNavigate('games')}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-xl font-bold hover:opacity-90 transition-opacity"
              >
                Back to Games Hub
              </button>
            </div>
          </div>
        );
      default:
        return isAuthenticated ? <Dashboard onNavigate={handleNavigate} /> : <PreLoginExperiencePage onNavigate={handleNavigate} redirectMessage={redirectMessage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={currentPage} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} />
      {renderPage()}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
