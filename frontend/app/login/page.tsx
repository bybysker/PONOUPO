"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub, FaApple } from 'react-icons/fa';
import { useAuth } from "@/hooks/useAuth";

const Auth: React.FC = () => {
  const router = useRouter();
  const {
    user,
    handleGoogleSignIn,
    handleEmailPasswordSignIn,
    registerUser,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redirect if authenticated
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (authMode === 'login') {
        await handleEmailPasswordSignIn(email, password);
      } else {
        await registerUser(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={authMode}
            onValueChange={(value: string) => setAuthMode(value as 'login' | 'signup')}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-gray-200 text-black"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-gray-200 text-black"
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-gray-200 text-black"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-gray-200 text-black"
                />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-2">
            <p className="text-center text-sm text-gray-600 mb-2">Or continue with</p>
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <FaGoogle className="mr-2" /> Google
            </Button>
          </div>

          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
