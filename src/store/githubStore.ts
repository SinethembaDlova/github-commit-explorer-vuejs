import { defineStore } from 'pinia';
import * as githubApi from '../services/githubApi';
import type {
  Repository,
  Commit,
  FavoriteCommit,
  SortOrder,
  GitHubStore,
} from '../types/github';

type GitHubState = Omit<
  GitHubStore,
  | 'fetchRepositories'
  | 'fetchCommits'
  | 'fetchCommitDetails'
  | 'addFavorite'
  | 'removeFavorite'
  | 'setSelectedRepo'
  | 'setSortOrder'
  | 'clearError'
  | 'resetCommits'
  | 'clearSelectedCommitDetails'
>

// Helper function to validate favorite commit data
function isValidFavorite(favorite: any): favorite is FavoriteCommit {
  return (
    favorite &&
    typeof favorite === 'object' &&
    typeof favorite.sha === 'string' &&
    favorite.sha.length > 0 &&
    typeof favorite.message === 'string' &&
    typeof favorite.author === 'string' &&
    typeof favorite.date === 'string' &&
    typeof favorite.repoName === 'string' &&
    typeof favorite.username === 'string'
  );
}

// Helper function to load and validate favorites from localStorage
function loadFavoritesFromStorage(): FavoriteCommit[] {
  try {
    const stored = localStorage.getItem('github-favorites-storage');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    // Filter out invalid favorites
    const validFavorites = parsed.filter(isValidFavorite);
    
    // If we filtered out any invalid favorites, update localStorage
    if (validFavorites.length !== parsed.length) {
      localStorage.setItem('github-favorites-storage', JSON.stringify(validFavorites));
    }
    
    return validFavorites;
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem('github-favorites-storage');
    return [];
  }
}

export const useGitHubStore = defineStore('github', {
  state: (): GitHubState => ({
    repositories: [],
    commits: [],
    favorites: loadFavoritesFromStorage(),
    selectedRepo: null,
    selectedCommitDetails: null,
    currentPage: 1,
    hasMoreCommits: true,
    sortOrder: 'newest',
    loading: false,
    error: null,
  }),

  actions: {
    persistFavorites() {
      try {
        // Validate favorites before saving
        const validFavorites = this.favorites.filter(isValidFavorite);
        localStorage.setItem(
          'github-favorites-storage',
          JSON.stringify(validFavorites)
        );
      } catch (error) {
        console.error('Error persisting favorites:', error);
      }
    },

    async fetchRepositories(username: string) {
      this.loading = true;
      this.error = null;
      this.repositories = [];

      try {
        const repos = await githubApi.fetchUserRepositories(username);
        this.repositories = repos;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : 'Failed to fetch repositories';
      } finally {
        this.loading = false;
      }
    },

    async fetchCommits(username: string, repoName: string, page = 1) {
      this.loading = true;
      this.error = null;

      try {
        const newCommits = await githubApi.fetchRepositoryCommits(
          username,
          repoName,
          page,
          10
        );

        const hasMore = newCommits.length === 10;
        this.commits =
          page === 1 ? newCommits : [...this.commits, ...newCommits];
        this.currentPage = page;
        this.hasMoreCommits = hasMore;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'Failed to fetch commits';
      } finally {
        this.loading = false;
      }
    },

    async fetchCommitDetails(username: string, repoName: string, sha: string) {
      this.loading = true;
      this.error = null;
      try {
        const details = await githubApi.fetchCommitDetails(username, repoName, sha);
        this.selectedCommitDetails = details;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : 'Failed to fetch commit details';
      } finally {
        this.loading = false;
      }
    },

    addFavorite(commit: Commit, repoName: string, username: string) {
      // Validate commit data before adding
      if (!commit || !commit.sha || !commit.commit) {
        console.error('Invalid commit data');
        return;
      }

      const favorite: FavoriteCommit = {
        sha: commit.sha,
        message: commit.commit.message || 'No message',
        author: commit.commit.author?.name || 'Unknown',
        date: commit.commit.author?.date || new Date().toISOString(),
        repoName,
        username,
        avatarUrl: commit.author?.avatar_url,
      };

      if (!this.favorites.some((fav) => fav.sha === commit.sha)) {
        this.favorites.push(favorite);
        this.persistFavorites();
      }
    },

    removeFavorite(sha: string) {
      this.favorites = this.favorites.filter((fav) => fav.sha !== sha);
      this.persistFavorites();
    },

    setSelectedRepo(repo: Repository | null) {
      this.selectedRepo = repo;
    },

    setSortOrder(order: SortOrder) {
      this.sortOrder = order;
    },

    clearError() {
      this.error = null;
    },

    resetCommits() {
      this.commits = [];
      this.currentPage = 1;
      this.hasMoreCommits = true;
    },

    clearSelectedCommitDetails() {
      this.selectedCommitDetails = null;
    },

    // New action to clear all favorites
    clearAllFavorites() {
      this.favorites = [];
      localStorage.removeItem('github-favorites-storage');
    },

    // New action to clean up invalid favorites manually
    cleanupFavorites() {
      const validFavorites = this.favorites.filter(isValidFavorite);
      if (validFavorites.length !== this.favorites.length) {
        this.favorites = validFavorites;
        this.persistFavorites();
      }
    },
  }
});