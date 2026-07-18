import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createPasscode, getActivePasscodes, revokePasscode } from '@/lib/supabase';

export const Route = createFileRoute('/dev')({
  component: DevPage,
});

// Your secret master password - change this!
const MASTER_PASSWORD = import.meta.env.VITE_DEV_PASSWORD || 'BirthdayDev2024!';

function DevPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterInput, setMasterInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [clientLabel, setClientLabel] = useState('');
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<{ passcode: string; expiresAt: Date; label: string } | null>(null);
  const [activeCodes, setActiveCodes] = useState<Array<{ code: string; label: string; expires_at: string }>>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);

  // Check if already authenticated in session
  useEffect(() => {
    const auth = sessionStorage.getItem('devAuth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadCodes();
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (masterInput === MASTER_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('devAuth', 'true');
      setAuthError('');
    } else {
      setAuthError('Wrong password. Try again.');
      setMasterInput('');
    }
  };

  const loadCodes = async () => {
    setLoadingCodes(true);
    const codes = await getActivePasscodes();
    setActiveCodes(codes);
    setLoadingCodes(false);
  };

  const handleGenerate = async () => {
    if (!clientLabel.trim()) {
      alert('Please enter a client name or label first.');
      return;
    }
    setGenerating(true);
    const result = await createPasscode(clientLabel.trim());
    if (result) {
      setLastGenerated({ ...result, label: clientLabel.trim() });
      setClientLabel('');
      await loadCodes();
    } else {
      alert('Failed to generate passcode. Check Supabase connection.');
    }
    setGenerating(false);
  };

  const handleRevoke = async (code: string) => {
    if (!confirm(`Revoke passcode ${code}? The client will lose access immediately.`)) return;
    await revokePasscode(code);
    await loadCodes();
    if (lastGenerated?.passcode === code) setLastGenerated(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatExpiry = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const hoursLeft = Math.round((d.getTime() - now.getTime()) / 3600000);
    return `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${hoursLeft}h left)`;
  };

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <Card className="w-full max-w-sm bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">🔐 Developer Access</CardTitle>
            <CardDescription className="text-gray-400">Enter master password to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Master Password</Label>
              <Input
                type="password"
                value={masterInput}
                onChange={(e) => setMasterInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
              {authError && <p className="text-red-400 text-sm">{authError}</p>}
            </div>
            <Button onClick={handleLogin} className="w-full bg-berry hover:bg-berry/90 text-white">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Developer Dashboard ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">🛠️ Developer Dashboard</h1>
            <p className="text-gray-400 mt-1">Generate passcodes for your clients</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('devAuth'); }}
            className="border-gray-700 text-gray-400 hover:text-white"
          >
            Logout
          </Button>
        </div>

        {/* Generate Passcode */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Generate Client Passcode</CardTitle>
            <CardDescription className="text-gray-400">
              Each passcode is valid for 24 hours. Share it with your client so they can access /admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Client Name / Label</Label>
              <Input
                value={clientLabel}
                onChange={(e) => setClientLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Maria Santos - Birthday for Juan"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
              <p className="text-xs text-gray-500">This is just for your reference - the client won't see it.</p>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {generating ? '⏳ Generating...' : '🔑 Generate Passcode'}
            </Button>
          </CardContent>
        </Card>

        {/* Last Generated */}
        {lastGenerated && (
          <Card className="bg-green-950 border-green-800">
            <CardHeader>
              <CardTitle className="text-green-300">✅ Passcode Generated!</CardTitle>
              <CardDescription className="text-green-500">
                For: {lastGenerated.label} · Expires in 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-900/50 rounded-lg p-4 text-center">
                <p className="text-4xl font-mono font-bold text-white tracking-widest">
                  {lastGenerated.passcode}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 space-y-1">
                <p className="text-xs text-gray-400">Send this message to your client:</p>
                <p className="text-sm text-gray-200">
                  🎂 Your birthday template is ready!{'\n'}
                  Go to: <strong>{window.location.origin}/admin</strong>{'\n'}
                  Your access code: <strong>{lastGenerated.passcode}</strong>{'\n'}
                  (Valid for 24 hours only)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(lastGenerated.passcode)}
                  variant="outline"
                  className="flex-1 border-green-700 text-green-300 hover:bg-green-900"
                >
                  📋 Copy Code
                </Button>
                <Button
                  onClick={() => copyToClipboard(
                    `🎂 Your birthday template is ready!\nGo to: ${window.location.origin}/admin\nYour access code: ${lastGenerated.passcode}\n(Valid for 24 hours only)`
                  )}
                  variant="outline"
                  className="flex-1 border-green-700 text-green-300 hover:bg-green-900"
                >
                  📱 Copy Message
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Passcodes */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Active Passcodes</CardTitle>
              <CardDescription className="text-gray-400">
                {activeCodes.length} active {activeCodes.length === 1 ? 'passcode' : 'passcodes'}
              </CardDescription>
            </div>
            <Button
              onClick={loadCodes}
              variant="outline"
              size="sm"
              disabled={loadingCodes}
              className="border-gray-700 text-gray-400 hover:text-white"
            >
              {loadingCodes ? '⏳' : '🔄 Refresh'}
            </Button>
          </CardHeader>
          <CardContent>
            {activeCodes.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No active passcodes</p>
            ) : (
              <div className="space-y-3">
                {activeCodes.map((item) => (
                  <div key={item.code} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <div>
                      <p className="font-mono font-bold text-white tracking-wider">{item.code}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
                      <p className="text-xs text-yellow-500 mt-0.5">⏰ Expires: {formatExpiry(item.expires_at)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(item.code)}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-400 hover:text-white"
                      >
                        📋
                      </Button>
                      <Button
                        onClick={() => handleRevoke(item.code)}
                        variant="outline"
                        size="sm"
                        className="border-red-900 text-red-400 hover:bg-red-950"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
