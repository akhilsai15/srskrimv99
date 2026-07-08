import { create } from 'zustand';

interface NotificationState {
  globalVibeNotificationsEnabled: boolean;
  toggleGlobalVibeNotifications: () => void;
  likesNotificationsEnabled: boolean;
  toggleLikesNotifications: (val: boolean) => void;
  likesMilestonesOnly: boolean;
  toggleLikesMilestonesOnly: (val: boolean) => void;
  commentsNotificationsEnabled: boolean;
  toggleCommentsNotifications: (val: boolean) => void;
  repliesNotificationsEnabled: boolean;
  toggleRepliesNotifications: (val: boolean) => void;
  blazeRunRemindersEnabled: boolean;
  toggleBlazeRunReminders: (val: boolean) => void;
  blazeRunReminderTime: string;
  setBlazeRunReminderTime: (val: string) => void;
  pulseRewardsEnabled: boolean;
  togglePulseRewards: (val: boolean) => void;
  languageMatchNotificationsEnabled: boolean;
  toggleLanguageMatchNotifications: (val: boolean) => void;
  requestPushPermission: () => void;
  creatorNotificationPrefs: Record<string, boolean>;
  toggleCreatorNotifications: (id: string) => void;
  pulseToasts: any[];
  removePulseToast: (id: string) => void;
  soundEffectsEnabled: boolean;
  toggleSoundEffects: () => void;
  addToast: (points: number, message: string) => void;
}

const playChime = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
    osc2.frequency.setValueAtTime(987.77, audioCtx.currentTime); // B5
    
    osc1.type = "sine";
    osc2.type = "triangle";
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.95);
    
    osc1.start(audioCtx.currentTime);
    osc2.start(audioCtx.currentTime);
    
    osc1.stop(audioCtx.currentTime + 1.0);
    osc2.stop(audioCtx.currentTime + 1.0);
  } catch (e) {
    console.warn("AudioContext failed or blocked:", e);
  }
};

export const useNotificationStore = create<NotificationState>((set) => ({
  globalVibeNotificationsEnabled: true,
  toggleGlobalVibeNotifications: () => set((state) => ({ globalVibeNotificationsEnabled: !state.globalVibeNotificationsEnabled })),
  likesNotificationsEnabled: true,
  toggleLikesNotifications: (val) => set({ likesNotificationsEnabled: val }),
  likesMilestonesOnly: false,
  toggleLikesMilestonesOnly: (val) => set({ likesMilestonesOnly: val }),
  commentsNotificationsEnabled: true,
  toggleCommentsNotifications: (val) => set({ commentsNotificationsEnabled: val }),
  repliesNotificationsEnabled: true,
  toggleRepliesNotifications: (val) => set({ repliesNotificationsEnabled: val }),
  blazeRunRemindersEnabled: true,
  toggleBlazeRunReminders: (val) => set({ blazeRunRemindersEnabled: val }),
  blazeRunReminderTime: '21:00',
  setBlazeRunReminderTime: (val) => set({ blazeRunReminderTime: val }),
  pulseRewardsEnabled: true,
  togglePulseRewards: (val) => set({ pulseRewardsEnabled: val }),
  languageMatchNotificationsEnabled: true,
  toggleLanguageMatchNotifications: (val) => set({ languageMatchNotificationsEnabled: val }),
  requestPushPermission: () => {},
  creatorNotificationPrefs: {},
  toggleCreatorNotifications: (id) => set((state) => ({ creatorNotificationPrefs: { ...state.creatorNotificationPrefs, [id]: !state.creatorNotificationPrefs[id] } })),
  pulseToasts: [],
  removePulseToast: (id) => set((state) => ({ pulseToasts: state.pulseToasts.filter(toast => toast.id !== id) })),
  soundEffectsEnabled: true,
  toggleSoundEffects: () => set((state) => ({ soundEffectsEnabled: !state.soundEffectsEnabled })),
  addToast: (points, message) => set((state) => {
    if (state.soundEffectsEnabled) {
      playChime();
    }
    const newToast = {
      id: `toast-${Date.now()}`,
      points,
      message,
      total: 12500 + points,
    };
    return { pulseToasts: [...state.pulseToasts, newToast] };
  }),
}));

// Mock functions
export const simulateCreatorPost = (user: any, reel: any) => {};
export const simulateVibeLike = (user: any, reel: any, likes: number) => {};
export const simulateVibeComment = (user: any, comment: any, reel: any, reply: boolean) => {};
export const scheduleGrindReminder = () => {};
export const showGrindNotification = (count: number) => {};
export const checkGrindRisk = () => ({ atRisk: false, grindCount: 0 });

export const simulatePulseReward = (event: string) => {
  let points = 50;
  let msg = "Unlocked achievement!";
  if (event.includes("milestone")) {
    points = 100;
    msg = "Reached a brand new follower milestone! 🏆";
  } else if (event.includes("streak")) {
    points = 200;
    msg = "Blaze Streak is hot! You got bonus points! 🔥";
  } else if (event.includes("vibe")) {
    points = 30;
    msg = "Your Vibe post is trending today! 📈";
  } else if (event.includes("birthday")) {
    points = 75;
    msg = "Spark wish successfully sent! Friend is happy! 🎉";
  } else {
    points = 50;
    msg = event || "Received Pulse Reward! ⚡";
  }
  
  useNotificationStore.getState().addToast(points, msg);
};

export const simulateLanguageMatchNotification = (langs: string[], count: number, force: boolean) => {};
