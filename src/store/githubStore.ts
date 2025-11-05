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

export const useGitHubStore = defineStore('github', {
  state: (): GitHubState => ({
    repositories: [],
    commits: [],
    favorites: JSON.parse(localStorage.getItem('github-favorites-storage') || '[]'),
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
      localStorage.setItem(
        'github-favorites-storage',
        JSON.stringify(this.favorites)
      )
    },

    async fetchRepositories(username: string) {
      this.loading = true
      this.error = null
      this.repositories = []

      try {
        const repos = await githubApi.fetchUserRepositories(username)
        this.repositories = repos
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : 'Failed to fetch repositories'
      } finally {
        this.loading = false
      }
    },

    async fetchCommits(username: string, repoName: string, page = 1) {
      this.loading = true
      this.error = null

      try {
        const newCommits = await githubApi.fetchRepositoryCommits(
          username,
          repoName,
          page,
          10
        )

        const hasMore = newCommits.length === 10
        this.commits =
          page === 1 ? newCommits : [...this.commits, ...newCommits]
        this.currentPage = page
        this.hasMoreCommits = hasMore
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'Failed to fetch commits'
      } finally {
        this.loading = false
      }
    },

    async fetchCommitDetails(username: string, repoName: string, sha: string) {
      this.loading = true
      this.error = null
      try {
        const details = await githubApi.fetchCommitDetails(username, repoName, sha)
        this.selectedCommitDetails = details
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : 'Failed to fetch commit details'
      } finally {
        this.loading = false
      }
    },

    addFavorite(commit: Commit, repoName: string, username: string) {
      const favorite: FavoriteCommit = {
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        repoName,
        username,
        avatarUrl: commit.author?.avatar_url,
      }

      if (!this.favorites.some((fav) => fav.sha === commit.sha)) {
        this.favorites.push(favorite)
        this.persistFavorites()
      }
    },

    removeFavorite(sha: string) {
      this.favorites = this.favorites.filter((fav) => fav.sha !== sha)
      this.persistFavorites()
    },

  }
});

