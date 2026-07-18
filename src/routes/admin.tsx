import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LZString from 'lz-string';
import { validatePasscode } from '@/lib/supabase';

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

interface BirthdayData {
  celebrantName: string;
  backgroundMusic?: string;
  memories: {
    id: number;
    image: string;
    title: string;
    message: string;
  }[];
  finalMessage: string;
}

// ── Passcode Gate ─────────────────────────────────────────────────────────────
function PasscodeGate({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setChecking(true);
    setError('');
    const valid = await validatePasscode(code.trim());
    setChecking(false);
    if (valid) {
      sessionStorage.setItem('adminPasscode', code.trim());
      onSuccess();
    } else {
      setError('Invalid or expired passcode. Please contact your developer.');
      setCode('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="text-5xl mb-2">🎂</div>
          <CardTitle className="text-2xl font-serif">Birthday Admin</CardTitle>
          <CardDescription>Enter the passcode provided by your developer to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Access Passcode</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="XXXX-XXXX"
              className="text-center text-xl font-mono tracking-widest"
              maxLength={9}
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={checking || !code.trim()}
            className="w-full bg-berry hover:bg-berry/90 text-white"
          >
            {checking ? '⏳ Checking...' : '✨ Enter Admin'}
          </Button>
          <p className="text-xs text-gray-400 text-center">
            Passcodes expire after 24 hours
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated in this session
    const saved = sessionStorage.getItem('adminPasscode');
    if (saved) {
      // Re-validate on mount
      import('@/lib/supabase').then(({ validatePasscode }) => {
        validatePasscode(saved).then((valid) => {
          if (valid) setIsAuthenticated(true);
          else sessionStorage.removeItem('adminPasscode');
        });
      });
    }
  }, []);

  if (!isAuthenticated) {
    return <PasscodeGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminContent />;
}

function AdminContent() {
  const [data, setData] = useState<BirthdayData>({
    celebrantName: 'Amelia',
    backgroundMusic: undefined,
    memories: [],
    finalMessage: 'May this new chapter of your life be filled with beautiful memories, exciting adventures, peaceful days, and dreams slowly becoming reality. Never forget how special you are and how much happiness you bring into the lives of the people around you.',
  });

  const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>({});
  const [musicPreview, setMusicPreview] = useState<string | undefined>();

  // Always load default data - admin never reads from localStorage
  // Each customer's customization lives only in their shareable link
  useEffect(() => {
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
  }, []);

  const handleSave = () => {
    // No longer saving to localStorage - each customer gets their own link
    // Data is preserved in the shareable link only
  };

  const handleGenerateLink = async () => {
    console.log('🚀 Generate Shareable Link clicked');
    
    // Don't save to localStorage - data lives only in the shareable link
    // Generate shareable link with LZString compression
    const compressed = LZString.compressToBase64(JSON.stringify(data));
    console.log('📦 Compressed data length:', compressed.length, 'chars');
    
    const baseUrl = window.location.origin;
    console.log('🌐 Base URL:', baseUrl);
    
    try {
      console.log('📥 Importing Supabase module...');
      // Try to use Supabase for super short URLs
      const { createShortUrl, isSupabaseConfigured } = await import('@/lib/supabase');
      console.log('✅ Supabase module imported');
      
      console.log('🔍 Checking if Supabase is configured...');
      if (isSupabaseConfigured()) {
        console.log('✅ Supabase IS configured, attempting to create short URL...');
        const result = await createShortUrl(compressed, baseUrl);
        console.log('📊 Supabase result:', result);
        
        if (result.shortId && !result.fallback) {
          console.log('🎉 SUCCESS! Super short URL created:', result.shortUrl);
          // Success! Got a database-backed super short URL
          await navigator.clipboard.writeText(result.shortUrl);
          
          // Calculate size reduction
          const originalUrl = `${baseUrl}/?data=${encodeURIComponent(JSON.stringify(data))}`;
          const reduction = Math.round((1 - result.shortUrl.length / originalUrl.length) * 100);
          
          alert(`✅ Super Short Link Copied!\n\n📏 URL reduced by ${reduction}%\n🔗 ${result.shortUrl}\n📊 Only ${result.shortUrl.length} characters!\n\n✨ Works with uploaded photos!\n⏰ Valid for 1 year\n\n📱 Paste and send via:\n• WhatsApp\n• Messenger\n• SMS\n• Email\n\nThe recipient will see your customized birthday greeting!`);
          return;
        } else {
          console.warn('⚠️ Supabase returned fallback response:', result);
        }
      } else {
        console.warn('⚠️ Supabase is NOT configured');
      }
    } catch (error) {
      console.error('💥 Database shortening failed, using fallback:', error);
    }
    
    console.log('📦 Using compression-only fallback...');
    // Fallback: use compressed URL if database fails
    const shareableLink = `${baseUrl}/?d=${encodeURIComponent(compressed)}`;
    
    try {
      await navigator.clipboard.writeText(shareableLink);
      
      // Calculate size reduction
      const originalSize = JSON.stringify(data).length;
      const compressedSize = compressed.length;
      const reduction = Math.round((1 - compressedSize / originalSize) * 100);
      
      // Calculate URL length for display
      const urlLength = shareableLink.length;
      const urlLengthText = urlLength > 1000 ? `${Math.round(urlLength/1000)}k chars` : `${urlLength} chars`;
      
      alert(`✅ Link Copied! (Compressed)\n\n📏 Data compressed by ${reduction}%\n📊 URL length: ${urlLengthText}\n\n💡 For super short URLs (95% reduction):\n   Set up Supabase database\n   See SUPABASE-SETUP.md for instructions\n\n📱 Paste and send via:\n• WhatsApp\n• Messenger\n• SMS\n• Email\n\nThe recipient will see your customized birthday greeting!`);
    } catch (error) {
      // Fallback if clipboard fails
      prompt('Copy this shareable link:', shareableLink);
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

  const handleClearGeneral = () => {
    if (!confirm('Reset name and music to defaults?')) return;
    setData(prev => ({ ...prev, celebrantName: 'Amelia', backgroundMusic: undefined }));
    setMusicPreview(undefined);
  };

  const handleClearPhotos = () => {
    if (!confirm('Reset all photos, titles, and messages to defaults? This cannot be undone.')) return;
    import('@/data/memories').then(({ memories }) => {
      const defaultMemories = memories.map(m => ({
        id: m.id,
        image: m.image,
        title: m.title,
        message: m.message,
      }));
      setData(prev => ({ ...prev, memories: defaultMemories }));
      setPreviewImages({});
    });
  };

  const handleClearMessages = () => {
    if (!confirm('Reset the final message to default?')) return;
    setData(prev => ({
      ...prev,
      finalMessage: 'May this new chapter of your life be filled with beautiful memories, exciting adventures, peaceful days, and dreams slowly becoming reality. Never forget how special you are and how much happiness you bring into the lives of the people around you.',
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
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Birthday Person's Name</CardTitle>
                  <CardDescription>Customize who this birthday gift is for</CardDescription>
                </div>
                <Button
                  onClick={handleClearGeneral}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                >
                  🗑️ Reset to Default
                </Button>
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
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Memory Photos</CardTitle>
                  <CardDescription>Upload photos and add both a title and detailed message for each memory in the scrapbook</CardDescription>
                </div>
                <Button
                  onClick={handleClearPhotos}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                >
                  🗑️ Reset All Photos
                </Button>
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
                          <p className="text-xs text-amber-600 mt-1">
                            ⚠️ Uploading files makes URLs very long. For shorter links, use image URLs instead.
                          </p>
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
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Final Greeting Message</CardTitle>
                  <CardDescription>Customize the birthday message at the end of the experience</CardDescription>
                </div>
                <Button
                  onClick={handleClearMessages}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                >
                  🗑️ Reset to Default
                </Button>
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

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between items-center">
          <a
            href="/"
            className="text-berry hover:underline"
          >
            ← Back to Birthday Experience
          </a>
          <div className="flex gap-3">
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
