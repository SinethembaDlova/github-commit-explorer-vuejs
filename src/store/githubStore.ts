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
})
