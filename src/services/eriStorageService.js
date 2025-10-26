// services/eriStorageService.js
const ERI_STORAGE_KEY = 'export_readiness_score';

export const eriStorageService = {
    // Save the ERI score
    saveScore: (score) => {
        try {
            const scoreData = {
                score: score,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(ERI_STORAGE_KEY, JSON.stringify(scoreData));
            return true;
        } catch (error) {
            console.error('Failed to save ERI score:', error);
            return false;
        }
    },

    // Get the ERI score
    getScore: () => {
        try {
            const stored = localStorage.getItem(ERI_STORAGE_KEY);
            if (stored) {
                const scoreData = JSON.parse(stored);
                // Optional: Check if the score is still valid (e.g., less than 30 days old)
                const storedDate = new Date(scoreData.timestamp);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - storedDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 30) { // Score valid for 30 days
                    return scoreData.score;
                }
            }
            return null; // No valid score found
        } catch (error) {
            console.error('Failed to get ERI score:', error);
            return null;
        }
    },

    // Clear the stored score
    clearScore: () => {
        try {
            localStorage.removeItem(ERI_STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Failed to clear ERI score:', error);
            return false;
        }
    }
};