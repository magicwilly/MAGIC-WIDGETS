import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Key, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const AuthModal = ({ children, defaultTab = 'login' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({
        email: loginForm.email,
        password: loginForm.password
      });

      if (result.success) {
        toast({
          title: "🎩 Welcome Back!",
          description: "Successfully logged into your magical account."
        });
        setIsOpen(false);
        setLoginForm({ email: '', password: '' });
      } else {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (registerForm.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        location: registerForm.location
      });

      if (result.success) {
        toast({
          title: "🎩✨ Welcome to FundMagic!",
          description: "Your magical account has been created successfully."
        });
        setIsOpen(false);
        setRegisterForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          location: ''
        });
      } else {
        toast({
          title: "Registration Failed",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-[#BE5F93]">
            <Sparkles className="h-5 w-5 mr-2" />
            Welcome to <span className="text-[#BE5F93]">i</span>Fund<span className="text-[#BE5F93]">Magic</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="login"
              className="data-[state=active]:bg-[#BE5F93] data-[state=active]:text-white"
            >
              <Key className="h-4 w-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="data-[state=active]:bg-[#BE5F93] data-[state=active]:text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                      disabled={loading}
                      className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                      disabled={loading}
                      className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#BE5F93] hover:bg-[#a04d7d]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Log In
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      required
                      disabled={loading}
                      className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      required
                      disabled={loading}
                      className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-location">Location (Optional)</Label>
                    <Input
                      id="register-location"
                      type="text"
                      placeholder="City, Country"
                      value={registerForm.location}
                      onChange={(e) => setRegisterForm({...registerForm, location: e.target.value})}
                      disabled={loading}
                      className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      required
                      disabled={loading}
                      className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      required
                      disabled={loading}
                      className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#BE5F93] hover:bg-[#a04d7d]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Magical Account
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;