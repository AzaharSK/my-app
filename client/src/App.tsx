import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { TutorialProvider } from "./context/TutorialContext";

// Pages
import Home from "@/pages/Home";
import Tutorial from "@/pages/Tutorial";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import UserDashboard from "@/pages/UserDashboard";
import Marketplace from "@/pages/Marketplace";
import Whiteboard from "@/pages/Whiteboard";
import CompilerTutorial from "@/pages/CompilerTutorial";
import MarkdownNotebook from "@/pages/MarkdownNotebook";
import LanguageReference from "@/pages/LanguageReference";
import NotFound from "@/pages/not-found";

// Layout
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function AppContent() {
  const [location] = useLocation();
  
  // Using a separate AppContent component that's wrapped in AuthProvider
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/tutorial/:category/:slug" component={Tutorial} />
          <Route path="/tutorial/:category" component={Tutorial} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={UserDashboard} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/whiteboard" component={Whiteboard} />
          <Route path="/compiler/:language" component={CompilerTutorial} />
          <Route path="/compiler" component={CompilerTutorial} />
          <Route path="/notebook" component={MarkdownNotebook} />
          <Route path="/reference/:language/:functionName" component={LanguageReference} />
          <Route path="/reference/:language" component={LanguageReference} />
          <Route path="/vscode" component={() => {
            window.location.href = 'https://vscode.dev/';
            return null;
          }} />
          <Route component={NotFound} />
        </Switch>
      </div>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <TutorialProvider>
            <AppContent />
            <Toaster />
          </TutorialProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
