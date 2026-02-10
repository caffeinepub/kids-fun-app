import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
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

function App() {
  const [currentPage, setCurrentPage] = useState<ModulePage>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'games':
        return <GamesHub onNavigate={setCurrentPage} />;
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
        return <CreativeFunHub onNavigate={setCurrentPage} />;
      case 'interactive-shorts':
        return <InteractiveShortsPage onNavigate={setCurrentPage} />;
      case 'green-screen-fun':
        return <GreenScreenFunPage onNavigate={setCurrentPage} />;
      case 'karaoke-mode':
        return <KaraokeModePage onNavigate={setCurrentPage} />;
      case 'dance-challenge':
        return <DanceChallengePage onNavigate={setCurrentPage} />;
      case 'learn-hub':
        return <LearnHubPage onNavigate={setCurrentPage} />;
      case 'virtual-pet-hub':
        return <VirtualPetHubPage />;
      case 'smart-hub':
        return <SmartHubPage onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'scary-hub':
        return <ScaryHub onNavigate={setCurrentPage} />;
      case 'funny-fart-hub':
        return <FunnyFartHub onNavigate={setCurrentPage} />;
      case 'video-hub':
        return <VideoHubPage onNavigate={setCurrentPage} />;
      case 'game:balloon-pop':
        return <BalloonPop onNavigate={setCurrentPage} />;
      case 'game:super-speedy-racer':
        return <SuperSpeedyRacer onNavigate={setCurrentPage} />;
      case 'game:ambulance-rescue':
        return <AmbulanceRescue onNavigate={setCurrentPage} />;
      case 'game:eclipse-now-solo':
        return <EclipseNowSolo onNavigate={setCurrentPage} />;
      case 'game:forest-night':
        return <ForestNight onNavigate={setCurrentPage} />;
      case 'game:memory-match':
        return <MemoryMatch onNavigate={setCurrentPage} />;
      case 'game:birthday-cake-maker':
        return <BirthdayCakeMaker onNavigate={setCurrentPage} />;
      case 'game:birthday-cake-decorator':
        return <BirthdayCakeDecorator onNavigate={setCurrentPage} />;
      case 'game:famous-places':
        return <FamousPlaces onNavigate={setCurrentPage} />;
      case 'game:word-wizard':
        return <WordWizard onNavigate={setCurrentPage} />;
      case 'game:police-buddy-chase':
        return <PoliceBuddyChase onNavigate={setCurrentPage} />;
      case 'game:number-runner':
        return <NumberRunner onNavigate={setCurrentPage} />;
      case 'game:bibble-adventure':
        return <BibbleAdventure onNavigate={setCurrentPage} />;
      case 'game:shape-shifting-world':
        return <ShapeShiftingWorld onNavigate={setCurrentPage} />;
      case 'game:time-control-adventure':
        return <TimeControlAdventure onNavigate={setCurrentPage} />;
      case 'game:theme-park-builder':
        return <ThemeParkBuilder onNavigate={setCurrentPage} />;
      case 'game:mind-maze-puzzle':
        return <MindMazePuzzle onNavigate={setCurrentPage} />;
      case 'game:space-station-life':
        return <SpaceStationLife onNavigate={setCurrentPage} />;
      case 'game:superpower-training':
        return <SuperpowerTraining onNavigate={setCurrentPage} />;
      case 'game:escape-room-universe':
        return <EscapeRoomUniverse onNavigate={setCurrentPage} />;
      case 'game:gadget-combat':
        return <GadgetCombat onNavigate={setCurrentPage} />;
      case 'game:grandma-secret-arcade':
        return <GrandmaSecretArcade onNavigate={setCurrentPage} />;
      case 'game:screen-is-enemy':
        return <ScreenIsEnemy onNavigate={setCurrentPage} />;
      case 'game:control-enemies':
        return <ControlEnemies onNavigate={setCurrentPage} />;
      case 'game:everything-breaks':
        return <EverythingBreaks onNavigate={setCurrentPage} />;
      case 'game:sound-based-world':
        return <SoundBasedWorld onNavigate={setCurrentPage} />;
      case 'game:reverse-progression':
        return <ReverseProgression onNavigate={setCurrentPage} />;
      case 'game:enemies-platforms':
        return <EnemiesPlatforms onNavigate={setCurrentPage} />;
      case 'game:pause-mechanic':
        return <PauseMechanic onNavigate={setCurrentPage} />;
      case 'game:youre-late-always':
        return <YoureLateAlways onNavigate={setCurrentPage} />;
      case 'game:lies-and-truths':
        return <LiesAndTruths onNavigate={setCurrentPage} />;
      case 'game:tiny-hero-giant-world':
        return <TinyHeroGiantWorld onNavigate={setCurrentPage} />;
      case 'game:tic-tac-toe':
        return <TicTacToe onNavigate={setCurrentPage} />;
      case 'game:monster-maze':
        return <MonsterMaze onNavigate={setCurrentPage} />;
      case 'game:spider-web-puzzle':
        return <SpiderWebPuzzle onNavigate={setCurrentPage} />;
      case 'game:pumpkin-smash':
        return <PumpkinSmash onNavigate={setCurrentPage} />;
      case 'game:cronker-kontry':
        return <CronkerKontry onNavigate={setCurrentPage} />;
      case 'game:pac-man':
        return <PacMan onNavigate={setCurrentPage} />;
      case 'game:tetris':
        return <Tetris onNavigate={setCurrentPage} />;
      case 'game:space-invaders':
        return <SpaceInvaders onNavigate={setCurrentPage} />;
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
                onClick={() => setCurrentPage('games')}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-xl font-bold hover:opacity-90 transition-opacity"
              >
                Back to Games Hub
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background">
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          {renderPage()}
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
