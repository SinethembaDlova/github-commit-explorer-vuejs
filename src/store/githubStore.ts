import { defineStore } from 'pinia';
import * as githubApi from '../services/githubApi';
import type {
  Repository,
  Commit,
  FavoriteCommit,
  SortOrder,
  GitHubStore,
} from '../types/github';

