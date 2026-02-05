import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Star, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllCraftProjects, useMarkCraftProjectCompleted } from '../hooks/useQueries';

export default function CraftDIYPage() {
  const { data: craftProjects = [] } = useGetAllCraftProjects();
  const markCompleted = useMarkCraftProjectCompleted();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const categories = ['Art', 'Science', 'Cooking', 'Seasonal'];
  const [selectedCategory, setSelectedCategory] = useState('Art');

  const filteredProjects = craftProjects.filter((p) => p.category === selectedCategory);

  const handleComplete = async (projectId: string) => {
    try {
      await markCompleted.mutateAsync(projectId);
      toast.success('Project completed! 🎉 Badge earned!');
    } catch (error) {
      toast.error('Failed to mark as completed');
      console.error(error);
    }
  };

  const mockProjects = [
    {
      id: '1',
      category: 'Art',
      title: 'Paper Plate Animals',
      difficulty: 'Easy',
      steps: [
        'Gather paper plates, markers, and glue',
        'Draw animal face on the plate',
        'Cut out ears from extra plates',
        'Glue ears to the main plate',
        'Add details with markers',
      ],
      materials: ['Paper plates', 'Markers', 'Glue', 'Scissors'],
      safetyTips: ['Use child-safe scissors', 'Adult supervision recommended'],
      badges: ['First Craft', 'Animal Artist'],
    },
    {
      id: '2',
      category: 'Science',
      title: 'Volcano Eruption',
      difficulty: 'Medium',
      steps: [
        'Build a volcano shape with clay',
        'Place a small cup in the center',
        'Add baking soda to the cup',
        'Pour vinegar and watch it erupt!',
        'Add food coloring for extra fun',
      ],
      materials: ['Baking soda', 'Vinegar', 'Clay', 'Food coloring', 'Small cup'],
      safetyTips: ['Do this outside or on a tray', 'Wear old clothes'],
      badges: ['Science Explorer', 'Volcano Master'],
    },
    {
      id: '3',
      category: 'Cooking',
      title: 'No-Bake Energy Balls',
      difficulty: 'Easy',
      steps: [
        'Mix oats, honey, and peanut butter',
        'Add chocolate chips',
        'Roll into small balls',
        'Refrigerate for 30 minutes',
        'Enjoy your healthy snack!',
      ],
      materials: ['Oats', 'Honey', 'Peanut butter', 'Chocolate chips'],
      safetyTips: ['Check for allergies', 'Wash hands before cooking'],
      badges: ['Junior Chef', 'Healthy Eater'],
    },
    {
      id: '4',
      category: 'Seasonal',
      title: 'Holiday Ornaments',
      difficulty: 'Medium',
      steps: [
        'Cut shapes from cardboard',
        'Paint with festive colors',
        'Add glitter and decorations',
        'Punch a hole at the top',
        'Thread ribbon through for hanging',
      ],
      materials: ['Cardboard', 'Paint', 'Glitter', 'Ribbon', 'Hole punch'],
      safetyTips: ['Use non-toxic paint', 'Let paint dry completely'],
      badges: ['Holiday Spirit', 'Decorator'],
    },
  ];

  const displayProjects = filteredProjects.length > 0 ? filteredProjects : mockProjects.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
          Craft & DIY Ideas ✂️
        </h1>
        <p className="text-xl text-gray-700">Create amazing projects with step-by-step guides!</p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project) => (
                <Card
                  key={project.id}
                  className="border-4 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedProject(project.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge variant={project.difficulty === 'Easy' ? 'default' : 'secondary'}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{project.badges.length} badges available</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img src="/assets/generated/diy-example.dim_300x200.png" alt={project.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                    <Button className="w-full">View Project</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedProject && (
        <Card className="border-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {displayProjects.find((p) => p.id === selectedProject)?.title}
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Difficulty: {displayProjects.find((p) => p.id === selectedProject)?.difficulty}
                </CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Safety Tips
              </h3>
              <ul className="space-y-2">
                {displayProjects
                  .find((p) => p.id === selectedProject)
                  ?.safetyTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500">⚠️</span>
                      <span>{tip}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Materials Needed</h3>
              <div className="flex flex-wrap gap-2">
                {displayProjects
                  .find((p) => p.id === selectedProject)
                  ?.materials.map((material, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {material}
                    </Badge>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Step-by-Step Instructions</h3>
              <div className="space-y-3">
                {displayProjects
                  .find((p) => p.id === selectedProject)
                  ?.steps.map((step, index) => (
                    <Card key={index} className="p-4 border-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <p className="flex-1">{step}</p>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Badges You'll Earn</h3>
              <div className="flex flex-wrap gap-2">
                {displayProjects
                  .find((p) => p.id === selectedProject)
                  ?.badges.map((badge, index) => (
                    <Badge key={index} className="text-sm">
                      🏆 {badge}
                    </Badge>
                  ))}
              </div>
            </div>

            <Button
              onClick={() => handleComplete(selectedProject)}
              disabled={markCompleted.isPending}
              className="w-full text-lg h-12"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Mark as Completed
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
