"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { User, LogOut, Settings, FileText, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface AuthButtonProps {
  onAuthChange?: (user: SupabaseUser | null) => void
}

export default function AuthButton({ onAuthChange }: AuthButtonProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      onAuthChange?.(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      onAuthChange?.(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [onAuthChange])

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setAuthLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        })
        setShowAuth(false)
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      })
      setShowAuth(false)
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/upload`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      })
      setAuthLoading(false)
    }
  }

  if (loading) {
    return (
      <Button disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.user_metadata?.full_name || user.email} />
              <AvatarFallback>
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>My Portfolios</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (showAuth) {
    return <AuthModal onClose={() => setShowAuth(false)} onSignIn={handleSignIn} onSignUp={handleSignUp} onGoogleSignIn={handleGoogleSignIn} loading={authLoading} />
  }

  return (
    <Button onClick={() => setShowAuth(true)} className="bg-black hover:bg-gray-800 text-white">
      Sign In
    </Button>
  )
}

function AuthModal({
  onClose,
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  loading,
}: {
  onClose: () => void
  onSignIn: (email: string, password: string) => void
  onSignUp: (email: string, password: string, fullName: string) => void
  onGoogleSignIn: () => void
  loading: boolean
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome to Portfolio Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <Button
                onClick={() => onSignIn(email, password)}
                disabled={loading || !email || !password}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign In
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                />
              </div>
              <Button
                onClick={() => onSignUp(email, password, fullName)}
                disabled={loading || !email || !password || !fullName}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign Up
              </Button>
            </TabsContent>
          </Tabs>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button onClick={onGoogleSignIn} disabled={loading} variant="outline" className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Continue with Google
          </Button>

          <div className="flex justify-center mt-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
