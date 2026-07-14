import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

interface BirthdayData {
  celebrantName: string;
  backgroundMusic?: string; // Optional custom music URL
  memories: {
    id: number;
    image: string;
    title: string;
    message: string;
  }[];
  finalMessage: string;
}

function AdminPage() {
  const [data, setData] = useState<BirthdayData>({
    celebrantName: 'Amelia',
    backgroundMusic: undefined,
    memories: [],
    finalMessage: 'May this new chapter of your life be filled with beautiful memories, exciting adventures, peaceful days, and dreams slowly becoming reality. Never forget how special you are and how much happiness you bring into the lives of the people around you.',
  });

  const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>({});
  const [musicPreview, setMusicPreview] = useState<string | undefined>();

  // Load existing data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('birthdayData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      
      // Load preview images
      const savedPreviews = localStorage.getItem('birthdayPreviews');
      if (savedPreviews) {
        setPreviewImages(JSON.parse(savedPreviews));
      }
      
      // Load music preview
      if (parsed.backgroundMusic) {
        setMusicPreview(parsed.backgroundMusic);
      }
    } else {
      // Initialize with default data from memories.ts
      import('@/data/memories').then(({ memories, birthdayConfig }) => {
        const defaultMemories = memories.map(m => ({
          id: m.id,
          image: m.image,
          title: m.title,
          message: m.message,
        }));
        setData({
          celebrantName: birthdayConfig.celebrantName,
          memories: defaultMemories,
          finalMessage: birthdayConfig.finalMessage,
        });
      });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('birthdayData', JSON.stringify(data));
    localStorage.setItem('birthdayPreviews', JSON.stringify(previewImages));
    alert('Changes saved successfully! Refresh the main page to see updates.');
  };

  const handleGenerateLink = async () => {
    // First save the data
    localStorage.setItem('birthdayData', JSON.stringify(data));
    localStorage.setItem('birthdayPreviews', JSON.stringify(previewImages));
    
    // Generate shareable link
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const baseUrl = window.location.origin;
    const shareableLink = `${baseUrl}/?data=${encoded}`;
    
    // Show loading message
    const loadingMsg = 'Generating shareable link... Please wait...';
    
    try {
      // Try to shorten the URL using TinyURL API
      const tinyUrlEndpoint = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(shareableLink)}`;
      const response = await fetch(tinyUrlEndpoint);
      
      if (response.ok) {
        const shortUrl = await response.text();
        
        // Verify it's actually a short URL
        if (shortUrl && shortUrl.startsWith('https://tinyurl.com/')) {
          // Copy short URL to clipboard
          await navigator.clipboard.writeText(shortUrl);
          alert('✅ SHORT LINK CREATED!\n\n' + shortUrl + '\n\n📱 Link copied! Send this to share your customized birthday greeting!');
          return;
        }
      }
      
      throw new Error('Shortening failed');
    } catch (error) {
      console.error('URL shortening error:', error);
      // Fallback: copy original long link
      try {
        await navigator.clipboard.writeText(shareableLink);
        alert('✅ Link copied!\n\n(URL shortening unavailable - using full link)\n\n📱 Send this link to share your customized birthday greeting:\n\n' + shareableLink.substring(0, 100) + '...');
      } catch {
        prompt('Copy this shareable link:', shareableLink);
      }
    }
  };

  const handleImageUpload = (memoryId: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImages(prev => ({ ...prev, [memoryId]: result }));
      
      // Update memory image path
      setData(prev => ({
        ...prev,
        memories: prev.memories.map(m =>
          m.id === memoryId ? { ...m, image: result } : m
        ),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleMusicUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setMusicPreview(result);
      setData(prev => ({ ...prev, backgroundMusic: result }));
    };
    reader.readAsDataURL(file);
  };

  const clearCustomMusic = () => {
    setMusicPreview(undefined);
    setData(prev => ({ ...prev, backgroundMusic: undefined }));
  };

  const updateMemory = (memoryId: number, field: 'title' | 'message', value: string) => {
    setData(prev => ({
      ...prev,
      memories: prev.memories.map(m =>
        m.id === memoryId ? { ...m, [field]: value } : m
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold text-berry mb-2">
            Birthday Template Admin
          </h1>
          <p className="text-gray-600">Customize your birthday experience</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="photos">Photos & Captions</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Birthday Person's Name</CardTitle>
                <CardDescription>Customize who this birthday gift is for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={data.celebrantName}
                    onChange={(e) => setData(prev => ({ ...prev, celebrantName: e.target.value }))}
                    placeholder="Enter name"
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500">
                    This appears as "for [name]" on the intro screen and throughout the experience
                  </p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Label htmlFor="music">Background Music (Optional)</Label>
                  <div className="space-y-3">
                    {musicPreview ? (
                      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800">Custom music uploaded</p>
                          <p className="text-xs text-green-600">Your custom audio will play instead of the default</p>
                        </div>
                        <Button
                          onClick={clearCustomMusic}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Default:</strong> Kabisado - IV OF SPADES
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Upload an MP3 file to use your own music
                        </p>
                      </div>
                    )}
                    <Input
                      id="music"
                      type="file"
                      accept="audio/mp3,audio/mpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMusicUpload(file);
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Intro Screen Preview:</p>
                  <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-pink-100 p-8 rounded-2xl">
                    <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl border border-pink-200/50 text-center">
                      <p className="text-sm text-pink-600 mb-3">for {data.celebrantName}</p>
                      <h3 className="text-2xl font-serif text-gray-800 mb-3 leading-tight">
                        A little birthday surprise is waiting for you 🎀
                      </h3>
                      <p className="text-base text-gray-600 italic">Ready to open your gift?</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Memory Photos</CardTitle>
                <CardDescription>Upload photos and add both a title and detailed message for each memory in the scrapbook</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.memories.map((memory) => (
                    <div key={memory.id} className="space-y-3 border rounded-lg p-4 bg-white shadow-sm">
                      <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative">
                        {(previewImages[memory.id] || memory.image) ? (
                          <img
                            src={previewImages[memory.id] || memory.image}
                            alt={`Memory ${memory.id}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`photo-${memory.id}`} className="text-sm font-semibold">
                            Photo {memory.id}
                          </Label>
                          <Input
                            id={`photo-${memory.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(memory.id, file);
                            }}
                            className="text-sm mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`title-${memory.id}`} className="text-sm font-semibold">
                            Title
                          </Label>
                          <Input
                            id={`title-${memory.id}`}
                            value={memory.title}
                            onChange={(e) => updateMemory(memory.id, 'title', e.target.value)}
                            placeholder="Short title for photo..."
                            className="text-sm mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Appears at the bottom of the photo
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor={`message-${memory.id}`} className="text-sm font-semibold">
                            Message
                          </Label>
                          <Textarea
                            id={`message-${memory.id}`}
                            value={memory.message}
                            onChange={(e) => updateMemory(memory.id, 'message', e.target.value)}
                            placeholder="Write a longer memory message..."
                            className="text-sm mt-1 min-h-[80px]"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Appears on the right page in the scrapbook
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Final Greeting Message</CardTitle>
                <CardDescription>Customize the birthday message at the end of the experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="finalMessage">Birthday Greeting</Label>
                  <Textarea
                    id="finalMessage"
                    value={data.finalMessage}
                    onChange={(e) => setData(prev => ({ ...prev, finalMessage: e.target.value }))}
                    placeholder="Enter your birthday message..."
                    className="min-h-[200px] text-base"
                  />
                  <p className="text-sm text-gray-500">
                    This heartfelt message appears after the wish scene at the end of the celebration. Edit the text above to personalize your birthday wishes.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Message Preview:</p>
                  <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-6 rounded-lg">
                    <p className="text-gray-700 italic leading-relaxed">{data.finalMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 flex justify-between items-center">
          <a
            href="/"
            className="text-berry hover:underline"
          >
            ← Back to Birthday Experience
          </a>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              size="lg"
              className="bg-berry hover:bg-berry/90 text-white"
            >
              Save Changes
            </Button>
            <Button
              onClick={handleGenerateLink}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              🔗 Generate Shareable Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
