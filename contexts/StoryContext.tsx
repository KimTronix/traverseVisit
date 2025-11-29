import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Story {
  id: string;
  uri: string;
  type: 'image' | 'video';
  caption?: string;
  timestamp: number;
  expiresAt: number;
  views: number;
  isLive: boolean;
  userId?: string;
  userName?: string;
}

interface StoryContextType {
  userStories: Story[];
  addUserStory: (story: Omit<Story, 'id' | 'timestamp' | 'expiresAt' | 'views'>) => void;
  removeExpiredStories: () => void;
  incrementStoryViews: (storyId: string) => void;
  getUserStories: () => Story[];
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

interface StoryProviderProps {
  children: ReactNode;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({ children }) => {
  const [userStories, setUserStories] = useState<Story[]>([]);

  const addUserStory = (storyData: Omit<Story, 'id' | 'timestamp' | 'expiresAt' | 'views'>) => {
    const newStory: Story = {
      ...storyData,
      id: Date.now().toString(),
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
      views: 0,
    };

    setUserStories(prev => [...prev, newStory]);
  };

  const removeExpiredStories = () => {
    const now = Date.now();
    setUserStories(prev => prev.filter(story => story.expiresAt > now));
  };

  const incrementStoryViews = (storyId: string) => {
    setUserStories(prev => 
      prev.map(story => 
        story.id === storyId 
          ? { ...story, views: story.views + 1 }
          : story
      )
    );
  };

  const getUserStories = () => {
    // Remove expired stories before returning
    const now = Date.now();
    return userStories.filter(story => story.expiresAt > now);
  };

  // Clean up expired stories periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      removeExpiredStories();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <StoryContext.Provider
      value={{
        userStories,
        addUserStory,
        removeExpiredStories,
        incrementStoryViews,
        getUserStories,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};
