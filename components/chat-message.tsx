'use client';

import { FaRobot } from 'react-icons/fa';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';
import ProfileImage from './profile-image';

interface ChatMessageProps {
  variant: 'user' | 'assistant' | 'quiz';
  message?: string;
  user?: {
    name: string
  };
  quizData?: {
    title: string;
    estimatedTime: string;
    currentQuestion: number;
    totalQuestions: number;
    question: string;
    options: string[];
  };
  introText?: string;
}

const ChatMessage = ({
  variant,
  message = '',
  user = {'name': 'US'},
  quizData,
  introText = "Perfect! I've generated a personalized quiz based on our conversation.",
}: ChatMessageProps) => {
  // User message variant
  if (variant === 'user') {
    return (
      <div className="flex gap-3 justify-end">
        <div className="bg-orange-500 text-white rounded-lg p-4 max-w-md">
          <p className="text-sm">{message}</p>
        </div>
         <ProfileImage user={user} />
      </div>
    );
  }

  // Assistant message variant
  if (variant === 'assistant') {
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium"><FaRobot /></span>
        </div>
        <div className={`flex-1 max-w-[100%] ${message.length < 300 ? 'sm:max-w-[80%]': ''}`}>
          <div className="bg-muted rounded-lg p-4 mb-2">
            <p className="text-sm text-foreground">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Quiz message variant
  if (variant === 'quiz') {
    return (
      <div className="flex gap-3 w-fit">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium"><FaRobot /></span>
        </div>
        <div className="flex-1">
          <div className="bg-muted rounded-lg p-4 mb-4">
            <p className="text-sm mb-4 text-foreground">{introText}</p>

            {/* Quiz Card */}
            <Card className="p-4 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {quizData?.title || 'Quiz'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {quizData?.totalQuestions || 5} questions • {quizData?.estimatedTime || '3 minutes'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  {quizData?.currentQuestion || 1}/{quizData?.totalQuestions || 5}
                </Badge>
              </div>

              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ 
                    width: `${((quizData?.currentQuestion || 1) / (quizData?.totalQuestions || 5)) * 100}%` 
                  }}
                ></div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-3 text-foreground">
                  {quizData?.question || 'Sample question text?'}
                </h4>

                <div className="space-y-2">
                  {quizData?.options?.map((option, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 text-sm flex-wrap">
                <Button size="sm" variant="outline">
                  Explain concepts
                </Button>
                <Button size="sm" variant="outline">
                  Create a study schedule
                </Button>
                <Button size="sm" variant="outline">
                  More practice questions
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatMessage;