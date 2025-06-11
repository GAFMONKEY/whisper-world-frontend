// Central export for all services
export { authService } from './authService';
export { userService } from './userService';
export { matchService } from './matchService';
export { chatService } from './chatService';

// Keep backward compatibility with old naming
export { matchService as matchingService } from './matchService';

// Export types and enums
export type { LoginResponse } from './authService';
export type { UserProfile, UpdateProfileData, Answer, Lifestyle, LikertQuestions, Gender, Intentions, YesNo, YesNoSometimes, YesNoMaybe, Politics } from './userService';
export { convertGenderFromBackend, convertGenderToBackend, convertIntentionsFromBackend, convertIntentionsToBackend } from './userService';
export type {
    Match,
    DiscoverUser,
    DisplayMatch,
    LikeResponse
} from './matchService';
export type {
    ChatMessage,
    ChatConversation,
    SendMessageRequest
} from './chatService';
