import React, { useState } from "react";
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { cn } from '../lib/utils'
import Header from './Header'
import { Label } from './ui/label'
import { useAuth } from "../features/auth/AuthContext"; // <-- Import your auth context
import { useNavigate } from "react-router-dom";

interface LoginFormProps extends React.ComponentProps<'div'> {
  onLogin?: () => void;
}

export function LoginForm({ className, onLogin, ...props }: LoginFormProps) {
  // 1. Add state for email, password, and error
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loginSurgeryTeam } = useAuth(); // 2. Use the login function from context
  const navigate = useNavigate();

  // 3. Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName === 'surgery' && password === 'team') {
      loginSurgeryTeam();
      navigate("/surgery-team"); // Always navigate, even if already there
      if (onLogin) onLogin();
      return;
    }
    const success = await login(userName, password);
    if (success) {
      navigate("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Header />
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-4 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">User Name</Label>
                <Input
                  id="userName"
                  type="input"
                  required
                  value={userName}
                  onChange={e => setUserName(e.target.value)} // 4. Make input controlled
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)} // 4. Make input controlled
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Login
              </Button>
              {error && <div className="text-red-500">{error}</div>} {/* 5. Show error */}
              <div className='text-sm'>
                <div className='mb-5'>Hard-coded login credentials:</div>
                <span className='font-bold'>Admin:</span> user@example.com / password <br />
                <span className='font-bold'>Surgery Team</span>: surgery / team
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img src="/doctors.jpg" alt="Image" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}