/* eslint-disable max-lines */
/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

/* ──────────────────────────────────────────────────────────────────────
 *  ENDPOINT REGISTRY — Every User-Related Pre-live API endpoint
 * ──────────────────────────────────────────────────────────────────── */

interface Param {
  name: string;
  in: 'path' | 'query' | 'header';
  required?: boolean;
  description?: string;
  type?: string;
  enum?: string[];
  example?: string;
}

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description?: string;
  params?: Param[];
  hasBody?: boolean;
  bodyExample?: string;
}

interface Category {
  name: string;
  icon: string;
  description: string;
  endpoints: Endpoint[];
}

const API_CATEGORIES: Category[] = [
  {
    name: 'Activity Days',
    icon: 'calendar_month',
    description: 'Track daily Quran reading activity and estimated reading time.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/activity-days',
        summary: 'Add/update activity day',
        description: 'Add or update an activity day for the authenticated user.',
        hasBody: true,
        bodyExample: JSON.stringify(
          { type: 'QURAN', seconds: 30, ranges: ['1:1-1:7'], mushafId: 4 },
          null,
          2,
        ),
      },
      {
        method: 'GET',
        path: '/v1/activity-days',
        summary: 'Get activity days',
        description: 'List activity days for the authenticated user.',
        params: [
          {
            name: 'from',
            in: 'query',
            type: 'string',
            description: 'Start date (ISO)',
            example: '2024-01-01',
          },
          {
            name: 'to',
            in: 'query',
            type: 'string',
            description: 'End date (ISO)',
            example: '2024-12-31',
          },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          {
            name: 'type',
            in: 'query',
            type: 'string',
            enum: ['QURAN', 'READING'],
            example: 'QURAN',
          },
        ],
      },
      {
        method: 'GET',
        path: '/v1/activity-days/estimate-reading-time',
        summary: 'Estimate reading time',
        description: 'Estimate reading time for given ranges.',
        params: [
          {
            name: 'ranges',
            in: 'query',
            type: 'string',
            description: 'Verse ranges e.g. 1:1-1:7',
            example: '1:1-1:7',
          },
          { name: 'mushafId', in: 'query', type: 'integer', example: '4' },
        ],
      },
    ],
  },
  {
    name: 'Bookmarks',
    icon: 'bookmark',
    description: 'Save, list, retrieve, and remove user bookmarks for Quran content.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/bookmarks',
        summary: 'Add user bookmark',
        hasBody: true,
        bodyExample: JSON.stringify(
          { type: 'ayah', key: 1, verseNumber: 1, mushafId: 4, group: 'verses_6236' },
          null,
          2,
        ),
      },
      {
        method: 'GET',
        path: '/v1/bookmarks',
        summary: 'Get user bookmarks',
        params: [
          { name: 'type', in: 'query', type: 'string', example: 'ayah' },
          { name: 'group', in: 'query', type: 'string', example: 'verses_6236' },
          { name: 'first', in: 'query', type: 'integer', example: '10' },
          { name: 'after', in: 'query', type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/bookmarks/by-range',
        summary: 'Get bookmarks within a range of Ayahs',
        params: [
          { name: 'from', in: 'query', type: 'string', required: true, example: '1:1' },
          { name: 'to', in: 'query', type: 'string', required: true, example: '2:286' },
          { name: 'mushafId', in: 'query', type: 'integer', example: '4' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/bookmarks/bookmark',
        summary: 'Get bookmark',
        params: [
          { name: 'type', in: 'query', type: 'string', required: true, example: 'ayah' },
          { name: 'key', in: 'query', type: 'integer', required: true, example: '1' },
          { name: 'verseNumber', in: 'query', type: 'integer', example: '1' },
          { name: 'mushafId', in: 'query', type: 'integer', example: '4' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/bookmarks/collections',
        summary: 'Get bookmark collections',
        params: [
          { name: 'type', in: 'query', type: 'string', required: true, example: 'ayah' },
          { name: 'key', in: 'query', type: 'integer', required: true, example: '1' },
        ],
      },
      {
        method: 'DELETE',
        path: '/v1/bookmarks/{bookmarkId}',
        summary: 'Delete Bookmark',
        params: [{ name: 'bookmarkId', in: 'path', required: true, type: 'string' }],
      },
    ],
  },
  {
    name: 'Collections',
    icon: 'folder_special',
    description: 'Organize bookmarks into user-managed collections.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/collections',
        summary: 'Add collection',
        hasBody: true,
        bodyExample: JSON.stringify({ name: 'My Collection' }, null, 2),
      },
      {
        method: 'GET',
        path: '/v1/collections',
        summary: 'Get all collections',
        params: [
          {
            name: 'sortBy',
            in: 'query',
            type: 'string',
            enum: ['recentlyUpdated', 'alphabetical'],
          },
          { name: 'first', in: 'query', type: 'integer', example: '10' },
          { name: 'after', in: 'query', type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/collections/all',
        summary: 'Get all collection items',
        params: [
          { name: 'first', in: 'query', type: 'integer', example: '20' },
          { name: 'after', in: 'query', type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/collections/{collectionId}',
        summary: 'Get collection items by id',
        params: [
          { name: 'collectionId', in: 'path', required: true, type: 'string' },
          { name: 'first', in: 'query', type: 'integer', example: '10' },
        ],
      },
      {
        method: 'POST',
        path: '/v1/collections/{collectionId}',
        summary: 'Update collection',
        params: [{ name: 'collectionId', in: 'path', required: true, type: 'string' }],
        hasBody: true,
        bodyExample: JSON.stringify({ name: 'Updated Name' }, null, 2),
      },
      {
        method: 'DELETE',
        path: '/v1/collections/{collectionId}',
        summary: 'Delete collection',
        params: [{ name: 'collectionId', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'POST',
        path: '/v1/collections/{collectionId}/bookmarks',
        summary: 'Add collection Bookmark',
        params: [{ name: 'collectionId', in: 'path', required: true, type: 'string' }],
        hasBody: true,
        bodyExample: JSON.stringify({ bookmarkId: '' }, null, 2),
      },
      {
        method: 'DELETE',
        path: '/v1/collections/{collectionId}/bookmarks',
        summary: 'Delete collection bookmark by details',
        params: [
          { name: 'collectionId', in: 'path', required: true, type: 'string' },
          { name: 'type', in: 'query', type: 'string', example: 'ayah' },
          { name: 'key', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'DELETE',
        path: '/v1/collections/{collectionId}/bookmarks/{bookmarkId}',
        summary: 'Delete collection bookmark by id',
        params: [
          { name: 'collectionId', in: 'path', required: true, type: 'string' },
          { name: 'bookmarkId', in: 'path', required: true, type: 'string' },
        ],
      },
    ],
  },
  {
    name: 'Comments',
    icon: 'chat_bubble',
    description: 'Create, list, like, and delete Quran Reflect post comments.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/comments',
        summary: 'Create a new comment',
        hasBody: true,
        bodyExample: JSON.stringify(
          { comment: { body: 'This is a thoughtful comment', postId: 123, isPrivate: false } },
          null,
          2,
        ),
      },
      {
        method: 'GET',
        path: '/v1/comments/{id}/replies',
        summary: 'Get replies to a comment',
        params: [
          { name: 'id', in: 'path', required: true, type: 'number' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'POST',
        path: '/v1/comments/{id}/toggle-like',
        summary: 'Toggle like/unlike a comment',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'GET',
        path: '/v1/comments/{id}/delete',
        summary: 'Delete a comment',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
    ],
  },
  {
    name: 'Goals',
    icon: 'flag',
    description: 'Create, update, delete, and estimate Quran reading goals.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/goals',
        summary: 'Create a goal',
        hasBody: true,
        bodyExample: JSON.stringify(
          {
            type: 'pages',
            amount: 5,
            period: 'daily',
            mushafId: 4,
          },
          null,
          2,
        ),
      },
      {
        method: 'PUT',
        path: '/v1/goals/{id}',
        summary: 'Update a goal',
        params: [{ name: 'id', in: 'path', required: true, type: 'string' }],
        hasBody: true,
        bodyExample: JSON.stringify({ amount: 10, period: 'daily' }, null, 2),
      },
      {
        method: 'DELETE',
        path: '/v1/goals/{id}',
        summary: 'Delete a goal',
        params: [{ name: 'id', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'GET',
        path: '/v1/goals/estimate',
        summary: 'Generate timeline estimation',
        params: [
          { name: 'type', in: 'query', type: 'string', example: 'pages' },
          { name: 'amount', in: 'query', type: 'integer', example: '5' },
          { name: 'period', in: 'query', type: 'string', example: 'daily' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/goals/get-todays-plan',
        summary: "Get today's goal plan",
      },
    ],
  },
  {
    name: 'Notes',
    icon: 'edit_note',
    description: 'Create, retrieve, update, delete, and publish personal notes and reflections.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/notes',
        summary: 'Add note',
        hasBody: true,
        bodyExample: JSON.stringify(
          { body: 'My note about this ayah', verseKey: '1:1', saveToQR: false },
          null,
          2,
        ),
      },
      {
        method: 'GET',
        path: '/v1/notes',
        summary: 'Get all notes',
        params: [
          { name: 'first', in: 'query', type: 'integer', example: '10' },
          { name: 'after', in: 'query', type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/notes/{noteId}',
        summary: 'Get note by ID',
        params: [{ name: 'noteId', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'PATCH',
        path: '/v1/notes/{noteId}',
        summary: 'Update note by ID',
        params: [{ name: 'noteId', in: 'path', required: true, type: 'string' }],
        hasBody: true,
        bodyExample: JSON.stringify({ body: 'Updated note content' }, null, 2),
      },
      {
        method: 'DELETE',
        path: '/v1/notes/{noteId}',
        summary: 'Delete note by ID',
        params: [{ name: 'noteId', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'POST',
        path: '/v1/notes/{noteId}/publish',
        summary: 'Publish note',
        params: [{ name: 'noteId', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'GET',
        path: '/v1/notes/by-verse/{verseKey}',
        summary: 'Get notes by verse',
        params: [{ name: 'verseKey', in: 'path', required: true, type: 'string', example: '1:1' }],
      },
      {
        method: 'GET',
        path: '/v1/notes/by-range',
        summary: 'Get notes by verse range',
        params: [
          { name: 'from', in: 'query', type: 'string', required: true, example: '1:1' },
          { name: 'to', in: 'query', type: 'string', required: true, example: '2:286' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/notes/by-attached-entity',
        summary: 'Get notes by attached entity',
        params: [
          { name: 'entityType', in: 'query', type: 'string', required: true },
          { name: 'entityId', in: 'query', type: 'string', required: true },
        ],
      },
      {
        method: 'GET',
        path: '/v1/notes/count-within-range',
        summary: 'Get notes count within verse range',
        params: [
          { name: 'from', in: 'query', type: 'string', required: true, example: '1:1' },
          { name: 'to', in: 'query', type: 'string', required: true, example: '114:6' },
        ],
      },
    ],
  },
  {
    name: 'Posts',
    icon: 'article',
    description: 'Create, read, update, moderate, and interact with Quran Reflect posts.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/posts',
        summary: 'Create post',
        hasBody: true,
        bodyExample: JSON.stringify(
          {
            post: {
              body: 'A reflection on Surah Al-Fatiha',
              draft: false,
              references: [{ chapterId: 1, from: 1, to: 7 }],
              mentions: [],
              roomId: 0,
              roomPostStatus: 1,
              postAsAuthorId: '',
              publishedAt: new Date().toISOString(),
            },
          },
          null,
          2,
        ),
      },
      {
        method: 'GET',
        path: '/v1/posts/feed',
        summary: 'Get posts feed',
        params: [
          {
            name: 'sortBy',
            in: 'query',
            type: 'string',
            enum: ['popular', 'latest'],
            example: 'latest',
          },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
          { name: 'languages', in: 'query', type: 'string', example: 'en' },
          {
            name: 'postTypeIds',
            in: 'query',
            type: 'string',
            description: 'Comma-separated post type IDs',
          },
        ],
      },
      {
        method: 'GET',
        path: '/v1/posts/{id}',
        summary: 'Get post by ID',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'PATCH',
        path: '/v1/posts/{id}',
        summary: 'Edit post',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
        hasBody: true,
        bodyExample: JSON.stringify({ post: { body: 'Updated reflection text' } }, null, 2),
      },
      {
        method: 'DELETE',
        path: '/v1/posts/{id}',
        summary: 'Delete post',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'GET',
        path: '/v1/posts/my-posts',
        summary: 'Get current user posts',
        params: [
          { name: 'tab', in: 'query', type: 'string' },
          { name: 'sortBy', in: 'query', type: 'string', example: 'latest' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
          { name: 'postTypeIds', in: 'query', type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/posts/user-posts/{id}',
        summary: 'Get user posts',
        params: [
          { name: 'id', in: 'path', required: true, type: 'string' },
          { name: 'sortBy', in: 'query', type: 'string', example: 'latest' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/posts/by-verse/{verseKey}',
        summary: 'Get posts by verse',
        params: [
          { name: 'verseKey', in: 'path', required: true, type: 'string', example: '1:1' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/posts/count-within-range',
        summary: 'Get posts count within range',
        params: [
          { name: 'from', in: 'query', type: 'string', required: true, example: '1:1' },
          { name: 'to', in: 'query', type: 'string', required: true, example: '2:286' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/posts/{id}/comments',
        summary: 'Get post comments',
        params: [
          { name: 'id', in: 'path', required: true, type: 'number' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/posts/{id}/all-comments',
        summary: 'Get all post comments',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'GET',
        path: '/v1/posts/{id}/liked',
        summary: 'Get post liked state',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'POST',
        path: '/v1/posts/{id}/toggle-like',
        summary: 'Toggle post like',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'POST',
        path: '/v1/posts/{id}/toggle-save',
        summary: 'Toggle post save',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'GET',
        path: '/v1/posts/viewed/{id}',
        summary: 'Track post view',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'GET',
        path: '/v1/posts/{postId}/related',
        summary: 'Get related posts',
        params: [
          { name: 'postId', in: 'path', required: true, type: 'number' },
          { name: 'limit', in: 'query', type: 'integer', example: '5' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'POST',
        path: '/v1/posts/{id}/report',
        summary: 'Report post abuse',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
        hasBody: true,
        bodyExample: JSON.stringify({ report: { abuse: 'spam', comments: '' } }, null, 2),
      },
      {
        method: 'POST',
        path: '/v1/posts/export/pdf',
        summary: 'Export posts as PDF',
        hasBody: true,
        bodyExample: JSON.stringify({ ids: [1, 2, 3] }, null, 2),
      },
    ],
  },
  {
    name: 'Preferences',
    icon: 'tune',
    description: 'Store and retrieve user-specific app preferences.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/preferences',
        summary: 'Get user preferences',
      },
      {
        method: 'POST',
        path: '/v1/preferences',
        summary: 'Add or update preference',
        params: [{ name: 'mushafId', in: 'query', type: 'integer', example: '4' }],
        hasBody: true,
        bodyExample: JSON.stringify(
          { theme: { type: 'auto' }, language: { language: 'en' } },
          null,
          2,
        ),
      },
      {
        method: 'POST',
        path: '/v1/preferences/bulk',
        summary: 'Bulk add or update preferences',
        params: [{ name: 'mushafId', in: 'query', type: 'integer', example: '4' }],
        hasBody: true,
        bodyExample: JSON.stringify(
          [{ theme: { type: 'dark' } }, { language: { language: 'en' } }],
          null,
          2,
        ),
      },
    ],
  },
  {
    name: 'Reading Sessions',
    icon: 'menu_book',
    description: 'Record and retrieve user reading progress sessions.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/reading-sessions',
        summary: 'Add or update user reading session',
        hasBody: true,
        bodyExample: JSON.stringify({ chapterNumber: 1, verseNumber: 5 }, null, 2),
      },
      {
        method: 'GET',
        path: '/v1/reading-sessions',
        summary: 'Get user reading sessions',
        params: [
          { name: 'first', in: 'query', type: 'integer', example: '10' },
          { name: 'after', in: 'query', type: 'string' },
          { name: 'last', in: 'query', type: 'integer' },
          { name: 'before', in: 'query', type: 'string' },
        ],
      },
    ],
  },
  {
    name: 'Rooms',
    icon: 'groups',
    description: 'Manage Quran Reflect groups, pages, membership, invites, and room posts.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/rooms/groups',
        summary: 'Create a new group',
        hasBody: true,
        bodyExample: JSON.stringify(
          { name: 'Study Circle', url: 'study-circle', public: true },
          null,
          2,
        ),
      },
      {
        method: 'PATCH',
        path: '/v1/rooms/groups',
        summary: 'Update a group',
        hasBody: true,
        bodyExample: JSON.stringify({ id: 1, name: 'Updated Group Name' }, null, 2),
      },
      {
        method: 'POST',
        path: '/v1/rooms/pages',
        summary: 'Create a new page',
        hasBody: true,
        bodyExample: JSON.stringify(
          {
            name: 'My Org',
            jobTitle: 'Admin',
            contactNumber: '+1234567890',
            organizationName: 'Org Name',
            purpose: 'Teaching',
            url: 'my-org',
          },
          null,
          2,
        ),
      },
      {
        method: 'PATCH',
        path: '/v1/rooms/pages',
        summary: 'Update a page',
        hasBody: true,
        bodyExample: JSON.stringify({ id: 1, name: 'Updated Page' }, null, 2),
      },
      {
        method: 'GET',
        path: '/v1/rooms/{id}',
        summary: 'Get room profile by ID',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'GET',
        path: '/v1/rooms/group/{url}',
        summary: 'Get room profile by URL',
        params: [{ name: 'url', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'GET',
        path: '/v1/rooms/page/{subdomain}',
        summary: 'Get page profile by subdomain',
        params: [{ name: 'subdomain', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'GET',
        path: '/v1/rooms/joined-rooms',
        summary: 'Get joined rooms',
        params: [
          { name: 'query', in: 'query', type: 'string' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'sortBy', in: 'query', type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/rooms/managed-rooms',
        summary: 'Get managed rooms',
        params: [
          { name: 'query', in: 'query', type: 'string' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/rooms/search',
        summary: 'Search rooms',
        params: [
          { name: 'query', in: 'query', type: 'string', required: true },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'roomType', in: 'query', type: 'string', enum: ['group', 'page'] },
        ],
      },
      {
        method: 'GET',
        path: '/v1/rooms/{id}/members',
        summary: 'Get room members',
        params: [
          { name: 'id', in: 'path', required: true, type: 'number' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/rooms/{id}/posts',
        summary: 'Get room posts',
        params: [
          { name: 'id', in: 'path', required: true, type: 'number' },
          { name: 'sortBy', in: 'query', type: 'string', example: 'latest' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
          { name: 'tab', in: 'query', type: 'string' },
        ],
      },
      {
        method: 'POST',
        path: '/v1/rooms/{groupId}/join',
        summary: 'Join a group',
        params: [{ name: 'groupId', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'POST',
        path: '/v1/rooms/{groupId}/leave',
        summary: 'Leave a group',
        params: [{ name: 'groupId', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'POST',
        path: '/v1/rooms/{pageId}/follow',
        summary: 'Follow a page',
        params: [{ name: 'pageId', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'POST',
        path: '/v1/rooms/{pageId}/unfollow',
        summary: 'Unfollow a page',
        params: [{ name: 'pageId', in: 'path', required: true, type: 'number' }],
      },
      {
        method: 'POST',
        path: '/v1/rooms/{id}/invite',
        summary: 'Invite user to room',
        params: [{ name: 'id', in: 'path', required: true, type: 'number' }],
        hasBody: true,
        bodyExample: JSON.stringify({ userIds: [], emails: ['user@example.com'] }, null, 2),
      },
      {
        method: 'GET',
        path: '/v1/rooms/{id}/accept-invite',
        summary: 'Accept room invite',
        params: [
          { name: 'id', in: 'path', required: true, type: 'number' },
          { name: 'token', in: 'query', required: true, type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/rooms/{id}/reject-invite',
        summary: 'Reject room invite',
        params: [
          { name: 'id', in: 'path', required: true, type: 'number' },
          { name: 'token', in: 'query', required: true, type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/rooms/group/{url}/accept/{token}',
        summary: 'Accept room invite by private token (group)',
        params: [
          { name: 'url', in: 'path', required: true, type: 'string' },
          { name: 'token', in: 'path', required: true, type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/rooms/page/{subdomain}/accept/{token}',
        summary: 'Accept room invite by private token (page)',
        params: [
          { name: 'subdomain', in: 'path', required: true, type: 'string' },
          { name: 'token', in: 'path', required: true, type: 'string' },
        ],
      },
      {
        method: 'POST',
        path: '/v1/rooms/admins-access',
        summary: 'Update room admin access',
        hasBody: true,
        bodyExample: JSON.stringify({ roomId: 1, userId: '', admin: true }, null, 2),
      },
      {
        method: 'DELETE',
        path: '/v1/rooms/{id}/members/{userId}',
        summary: 'Remove member from room',
        params: [
          { name: 'id', in: 'path', required: true, type: 'number' },
          { name: 'userId', in: 'path', required: true, type: 'string' },
        ],
      },
      {
        method: 'PATCH',
        path: '/v1/rooms/{roomId}/posts/{postId}/privacy',
        summary: 'Update post privacy in room',
        params: [
          { name: 'roomId', in: 'path', required: true, type: 'number' },
          { name: 'postId', in: 'path', required: true, type: 'number' },
        ],
        hasBody: true,
        bodyExample: JSON.stringify({ isPublic: true }, null, 2),
      },
    ],
  },
  {
    name: 'Streaks',
    icon: 'local_fire_department',
    description: 'Retrieve user streak summaries and current active streak progress.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/streaks',
        summary: 'Get streaks',
        params: [
          {
            name: 'from',
            in: 'query',
            type: 'string',
            description: 'Start date',
            example: '2024-01-01',
          },
          {
            name: 'to',
            in: 'query',
            type: 'string',
            description: 'End date',
            example: '2024-12-31',
          },
          { name: 'type', in: 'query', type: 'string', enum: ['QURAN', 'READING'] },
          { name: 'sortOrder', in: 'query', type: 'string', enum: ['asc', 'desc'] },
          { name: 'first', in: 'query', type: 'integer', example: '10' },
          { name: 'after', in: 'query', type: 'string' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/streaks/current-streak-days',
        summary: 'Get current streak days',
        params: [
          {
            name: 'type',
            in: 'query',
            type: 'string',
            enum: ['QURAN', 'READING'],
            example: 'QURAN',
          },
          {
            name: 'x-timezone',
            in: 'header',
            type: 'string',
            description: 'Timezone e.g. America/New_York',
          },
        ],
      },
    ],
  },
  {
    name: 'Sync',
    icon: 'sync',
    description: 'Get and sync local mutations for offline-first data management.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/sync',
        summary: 'Get mutations',
        params: [
          {
            name: 'mutationsSince',
            in: 'query',
            type: 'string',
            description: 'Unix timestamp (ms)',
          },
          {
            name: 'resources',
            in: 'query',
            type: 'string',
            description: 'Comma-separated resources',
          },
          { name: 'metadataOnly', in: 'query', type: 'string', enum: ['true', 'false'] },
          { name: 'limit', in: 'query', type: 'integer', example: '50' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'POST',
        path: '/v1/sync',
        summary: 'Sync local mutations',
        params: [
          {
            name: 'lastMutationAt',
            in: 'query',
            type: 'string',
            description: 'Unix timestamp (ms)',
          },
        ],
        hasBody: true,
        bodyExample: JSON.stringify({ mutations: [] }, null, 2),
      },
    ],
  },
  {
    name: 'Tags',
    icon: 'label',
    description: 'Search and retrieve Quran Reflect tags.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/tags',
        summary: 'Search and retrieve tags',
        params: [
          { name: 'query', in: 'query', type: 'string', example: 'patience' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
    ],
  },
  {
    name: 'Users',
    icon: 'person',
    description: 'Manage profiles, following relationships, rooms, followers, and account actions.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/users/profile',
        summary: 'Get user profile',
        params: [
          {
            name: 'qdc',
            in: 'query',
            type: 'string',
            enum: ['true', 'false'],
            description: 'Include Quran.com connected account data',
          },
        ],
      },
      {
        method: 'PATCH',
        path: '/v1/users/profile',
        summary: 'Edit user profile (QR settings)',
        hasBody: true,
        bodyExample: JSON.stringify({ languageId: 1, customized: true }, null, 2),
      },
      {
        method: 'PUT',
        path: '/v1/users/profile',
        summary: 'Update user profile (name/bio/avatar)',
        hasBody: true,
        bodyExample: JSON.stringify(
          { user: { firstName: 'Muhammad', lastName: 'Ali', bio: 'Student of the Quran' } },
          null,
          2,
        ),
      },
      {
        method: 'GET',
        path: '/v1/users/{id}',
        summary: 'Get user profile by id or username',
        params: [{ name: 'id', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'GET',
        path: '/v1/users/{username}/profile',
        summary: 'Get user profile by username',
        params: [{ name: 'username', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'GET',
        path: '/v1/users/search',
        summary: 'Search for users',
        params: [
          { name: 'q', in: 'query', type: 'string', required: true, description: 'Search query' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/users/{id}/followers',
        summary: 'Get user followers',
        params: [
          { name: 'id', in: 'path', required: true, type: 'string' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/users/{id}/following',
        summary: 'Get users followed by user',
        params: [
          { name: 'id', in: 'path', required: true, type: 'string' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
        ],
      },
      {
        method: 'POST',
        path: '/v1/users/{followeeId}/toggle-follow',
        summary: 'Toggle follow/unfollow a user',
        params: [{ name: 'followeeId', in: 'path', required: true, type: 'string' }],
        hasBody: true,
        bodyExample: JSON.stringify({ action: 'follow' }, null, 2),
      },
      {
        method: 'POST',
        path: '/v1/users/{followerId}/remove-follower',
        summary: 'Remove a follower',
        params: [{ name: 'followerId', in: 'path', required: true, type: 'string' }],
      },
      {
        method: 'GET',
        path: '/v1/users/my-rooms',
        summary: 'Get logged-in user rooms',
        params: [
          { name: 'name', in: 'query', type: 'string' },
          { name: 'page', in: 'query', type: 'integer', example: '1' },
          { name: 'limit', in: 'query', type: 'integer', example: '10' },
        ],
      },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  Method badge colour mapping
 * ──────────────────────────────────────────────────────────────────── */
const METHOD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  GET: { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669', border: 'rgba(16, 185, 129, 0.3)' },
  POST: { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.3)' },
  PUT: { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706', border: 'rgba(245, 158, 11, 0.3)' },
  PATCH: { bg: 'rgba(168, 85, 247, 0.12)', text: '#7c3aed', border: 'rgba(168, 85, 247, 0.3)' },
  DELETE: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' },
};

const STATUS_COLORS: Record<string, string> = {
  '2': '#059669', // 2xx
  '3': '#2563eb', // 3xx
  '4': '#d97706', // 4xx
  '5': '#dc2626', // 5xx
};

/* ──────────────────────────────────────────────────────────────────────
 *  Response state
 * ──────────────────────────────────────────────────────────────────── */
interface ApiResponse {
  status: number;
  statusText: string;
  elapsed: number;
  url: string;
  headers: Record<string, string>;
  body: unknown;
}

/* ──────────────────────────────────────────────────────────────────────
 *  EndpointCard component
 * ──────────────────────────────────────────────────────────────────── */
function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [isOpen, setIsOpen] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValue, setBodyValue] = useState(endpoint.bodyExample ?? '');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHeaders, setShowHeaders] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const mc = METHOD_COLORS[endpoint.method] ?? METHOD_COLORS.GET;

  const sendRequest = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    // Build path with path params substituted
    let { path } = endpoint;
    const queryParams: Record<string, string> = {};
    const headerParams: Record<string, string> = {};

    for (const p of endpoint.params ?? []) {
      const val = paramValues[p.name] ?? '';
      if (p.in === 'path') {
        path = path.replace(`{${p.name}}`, encodeURIComponent(val));
      } else if (p.in === 'query' && val) {
        queryParams[p.name] = val;
      } else if (p.in === 'header' && val) {
        headerParams[p.name] = val;
      }
    }

    let parsedBody: unknown;
    if (endpoint.hasBody && bodyValue.trim()) {
      try {
        parsedBody = JSON.parse(bodyValue);
      } catch {
        setError('Invalid JSON in request body');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: endpoint.method,
          path,
          query: queryParams,
          body: parsedBody,
          headers: headerParams,
        }),
      });

      const data = (await res.json()) as ApiResponse;
      setResponse(data);

      // Scroll to response
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }, [endpoint, paramValues, bodyValue]);

  const statusColor = response
    ? (STATUS_COLORS[String(response.status)[0]] ?? '#6b7280')
    : '#6b7280';

  return (
    <div
      className="group"
      style={{
        border: '1px solid var(--color-outline-variant)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        ...(isOpen ? { borderColor: mc.border } : {}),
      }}
    >
      {/* Header */}
      <button
        id={`endpoint-${endpoint.method}-${endpoint.path.replaceAll(/[^a-zA-Z0-9]/g, '-')}`}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: isOpen ? mc.bg : 'transparent',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
      >
        {/* Method badge */}
        <span
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            background: mc.bg,
            color: mc.text,
            border: `1px solid ${mc.border}`,
            minWidth: '62px',
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          {endpoint.method}
        </span>

        {/* Path */}
        <code
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '13px',
            color: 'var(--color-on-surface)',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {endpoint.path}
        </code>

        {/* Summary */}
        <span
          style={{
            fontSize: '13px',
            color: 'var(--color-on-surface-variant)',
            flexShrink: 0,
            maxWidth: '280px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {endpoint.summary}
        </span>

        {/* Chevron */}
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '20px',
            color: 'var(--color-on-surface-variant)',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          expand_more
        </span>
      </button>

      {/* Expanded form */}
      {isOpen && (
        <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${mc.border}` }}>
          {endpoint.description && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-on-surface-variant)',
                margin: '14px 0 6px',
                lineHeight: 1.5,
              }}
            >
              {endpoint.description}
            </p>
          )}

          {/* Parameters */}
          {endpoint.params && endpoint.params.length > 0 && (
            <div style={{ marginTop: '14px' }}>
              <h4
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '10px',
                }}
              >
                Parameters
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {endpoint.params.map((p) => (
                  <div
                    key={p.name}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '140px 1fr',
                      gap: '10px',
                      alignItems: 'center',
                    }}
                  >
                    <label
                      style={{
                        fontSize: '13px',
                        fontFamily: 'var(--font-geist-mono)',
                        color: p.required
                          ? 'var(--color-on-surface)'
                          : 'var(--color-on-surface-variant)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {p.name}
                      {p.required && (
                        <span style={{ color: 'var(--color-error)', fontSize: '10px' }}>●</span>
                      )}
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: 'var(--color-surface-container)',
                          color: 'var(--color-on-surface-variant)',
                        }}
                      >
                        {p.in}
                      </span>
                    </label>
                    {p.enum ? (
                      <select
                        value={paramValues[p.name] ?? ''}
                        onChange={(e) =>
                          setParamValues((prev) => ({ ...prev, [p.name]: e.target.value }))
                        }
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--color-outline)',
                          background: 'var(--color-surface-container-lowest)',
                          color: 'var(--color-on-surface)',
                          fontSize: '13px',
                          fontFamily: 'var(--font-geist-mono)',
                        }}
                      >
                        <option value="">— select —</option>
                        {p.enum.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={p.example ?? p.description ?? p.type ?? ''}
                        value={paramValues[p.name] ?? ''}
                        onChange={(e) =>
                          setParamValues((prev) => ({ ...prev, [p.name]: e.target.value }))
                        }
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--color-outline)',
                          background: 'var(--color-surface-container-lowest)',
                          color: 'var(--color-on-surface)',
                          fontSize: '13px',
                          fontFamily: 'var(--font-geist-mono)',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request body */}
          {endpoint.hasBody && (
            <div style={{ marginTop: '14px' }}>
              <h4
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '10px',
                }}
              >
                Request Body (JSON)
              </h4>
              <textarea
                value={bodyValue}
                onChange={(e) => setBodyValue(e.target.value)}
                rows={Math.min(bodyValue.split('\n').length + 1, 16)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-outline)',
                  background: 'var(--color-surface-container-lowest)',
                  color: 'var(--color-on-surface)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-geist-mono)',
                  lineHeight: 1.6,
                  resize: 'vertical',
                }}
              />
            </div>
          )}

          {/* Send button */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={sendRequest}
              disabled={loading}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                background: loading ? 'var(--color-surface-container-high)' : mc.text,
                color: loading ? 'var(--color-on-surface-variant)' : '#fff',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              {loading && (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}
                >
                  progress_activity
                </span>
              )}
              {loading ? 'Sending...' : 'Send Request'}
            </button>

            {response && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: statusColor,
                    fontFamily: 'var(--font-geist-mono)',
                  }}
                >
                  {response.status} {response.statusText}
                </span>
                <span style={{ opacity: 0.6 }}>•</span>
                <span style={{ fontFamily: 'var(--font-geist-mono)' }}>{response.elapsed}ms</span>
              </span>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--color-error-container)',
                color: 'var(--color-on-error-container)',
                fontSize: '13px',
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Response display */}
          {response && (
            <div ref={responseRef} style={{ marginTop: '16px' }}>
              {/* Response header bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <h4
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-on-surface-variant)',
                  }}
                >
                  Response
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowHeaders(!showHeaders)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-outline)',
                      background: showHeaders
                        ? 'var(--color-surface-container-high)'
                        : 'transparent',
                      color: 'var(--color-on-surface-variant)',
                      cursor: 'pointer',
                    }}
                  >
                    Headers
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        typeof response.body === 'string'
                          ? response.body
                          : JSON.stringify(response.body, null, 2),
                      );
                    }}
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-outline)',
                      background: 'transparent',
                      color: 'var(--color-on-surface-variant)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                      content_copy
                    </span>
                    Copy
                  </button>
                </div>
              </div>

              {/* Response URL */}
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-on-surface-variant)',
                  fontFamily: 'var(--font-geist-mono)',
                  marginBottom: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {response.url}
              </div>

              {/* Response headers */}
              {showHeaders && (
                <pre
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--color-surface-container)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-geist-mono)',
                    lineHeight: 1.6,
                    overflow: 'auto',
                    maxHeight: '200px',
                    marginBottom: '8px',
                    color: 'var(--color-on-surface-variant)',
                  }}
                >
                  {Object.entries(response.headers)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('\n')}
                </pre>
              )}

              {/* Response body */}
              <pre
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'var(--color-surface-container)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-geist-mono)',
                  lineHeight: 1.6,
                  overflow: 'auto',
                  maxHeight: '500px',
                  color: 'var(--color-on-surface)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {typeof response.body === 'string'
                  ? response.body
                  : JSON.stringify(response.body, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 *  CategorySection component
 * ──────────────────────────────────────────────────────────────────── */
function CategorySection({
  category,
  isExpanded,
  onToggle,
}: {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <section id={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
      <button
        onClick={onToggle}
        className="w-full text-left"
        style={{
          padding: '20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          borderBottom: '1px solid var(--color-outline-variant)',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '28px',
            color: 'var(--color-primary)',
            background: 'var(--color-primary-container)',
            padding: '10px',
            borderRadius: '12px',
          }}
        >
          {category.icon}
        </span>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--color-on-surface)',
              lineHeight: 1.3,
            }}
          >
            {category.name}
            <span
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--color-on-surface-variant)',
                marginLeft: '10px',
                fontFamily: 'var(--font-geist-mono)',
              }}
            >
              {category.endpoints.length} endpoint{category.endpoints.length > 1 ? 's' : ''}
            </span>
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-on-surface-variant)',
              marginTop: '2px',
            }}
          >
            {category.description}
          </p>
        </div>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '24px',
            color: 'var(--color-on-surface-variant)',
            transition: 'transform 0.2s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          expand_more
        </span>
      </button>

      {isExpanded && (
        <div style={{ padding: '16px 0', display: 'grid', gap: '8px' }}>
          {category.endpoints.map((ep, i) => (
            <EndpointCard key={`${ep.method}-${ep.path}-${i}`} endpoint={ep} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 *  Main Playground Page
 * ──────────────────────────────────────────────────────────────────── */
export default function PlaygroundPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const searchRef = useRef<HTMLInputElement>(null);

  // Count totals
  const totalEndpoints = API_CATEGORIES.reduce((sum, c) => sum + c.endpoints.length, 0);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Filtered categories
  const filteredCategories = API_CATEGORIES.map((category) => ({
    ...category,
    endpoints: category.endpoints.filter((ep) => {
      const matchesSearch =
        !searchQuery ||
        ep.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMethod = methodFilter === 'ALL' || ep.method === methodFilter;
      return matchesSearch && matchesMethod;
    }),
  })).filter((c) => c.endpoints.length > 0);

  const toggleCategory = useCallback((name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCategories(new Set(API_CATEGORIES.map((c) => c.name)));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* Spin animation for loading spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Gradient header */}
      <header
        style={{
          background:
            'linear-gradient(135deg, var(--color-surface-container-low) 0%, var(--color-surface-container-high) 100%)',
          borderBottom: '1px solid var(--color-outline-variant)',
          padding: '40px 24px 32px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Back link */}
          <a
            href="/"
            style={{
              fontSize: '13px',
              color: 'var(--color-on-surface-variant)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '20px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_back
            </span>
            Home
          </a>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: 'var(--color-on-surface)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                API Playground
              </h1>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-on-surface-variant)',
                  marginTop: '8px',
                  maxWidth: '520px',
                  lineHeight: 1.5,
                }}
              >
                Test all {totalEndpoints} Quran Foundation User-Related APIs (pre-live). Requests
                are proxied through your server session — no tokens exposed in the browser.
              </p>
            </div>

            {/* Stats badges */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-geist-mono)',
                  }}
                >
                  {totalEndpoints}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-on-surface-variant)',
                    marginTop: '2px',
                  }}
                >
                  Endpoints
                </div>
              </div>
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-geist-mono)',
                  }}
                >
                  {API_CATEGORIES.length}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-on-surface-variant)',
                    marginTop: '2px',
                  }}
                >
                  Categories
                </div>
              </div>
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#d97706',
                    fontFamily: 'var(--font-geist-mono)',
                    marginTop: '4px',
                  }}
                >
                  PRE-LIVE
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-on-surface-variant)',
                    marginTop: '4px',
                  }}
                >
                  Environment
                </div>
              </div>
            </div>
          </div>

          {/* Search + filters bar */}
          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* Search */}
            <div
              style={{
                position: 'relative',
                flex: '1 1 300px',
                maxWidth: '500px',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '20px',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                search
              </span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search endpoints… (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-outline)',
                  background: 'var(--color-surface-container-lowest)',
                  color: 'var(--color-on-surface)',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Method filter */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => {
                const isActive = methodFilter === m;
                const color = m === 'ALL' ? null : METHOD_COLORS[m];
                return (
                  <button
                    key={m}
                    onClick={() => setMethodFilter(m)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-geist-mono)',
                      letterSpacing: '0.05em',
                      border: `1px solid ${isActive ? (color?.border ?? 'var(--color-primary)') : 'var(--color-outline)'}`,
                      background: isActive
                        ? (color?.bg ?? 'var(--color-primary-container)')
                        : 'transparent',
                      color: isActive
                        ? (color?.text ?? 'var(--color-primary)')
                        : 'var(--color-on-surface-variant)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            {/* Expand/Collapse */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={expandAll}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  border: '1px solid var(--color-outline)',
                  background: 'transparent',
                  color: 'var(--color-on-surface-variant)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  unfold_more
                </span>
                Expand All
              </button>
              <button
                onClick={collapseAll}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  border: '1px solid var(--color-outline)',
                  background: 'transparent',
                  color: 'var(--color-on-surface-variant)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  unfold_less
                </span>
                Collapse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category nav sidebar + main content */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '32px 24px 80px',
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '40px',
        }}
      >
        {/* Sidebar nav */}
        <nav
          style={{
            position: 'sticky',
            top: '24px',
            alignSelf: 'start',
            maxHeight: 'calc(100vh - 48px)',
            overflowY: 'auto',
          }}
        >
          <h3
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-on-surface-variant)',
              marginBottom: '12px',
            }}
          >
            Categories
          </h3>
          <div style={{ display: 'grid', gap: '2px' }}>
            {filteredCategories.map((c) => (
              <a
                key={c.name}
                href={`#category-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(
                    `category-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
                  );
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  if (!expandedCategories.has(c.name)) {
                    toggleCategory(c.name);
                  }
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: expandedCategories.has(c.name)
                    ? 'var(--color-primary)'
                    : 'var(--color-on-surface-variant)',
                  background: expandedCategories.has(c.name)
                    ? 'var(--color-primary-container)'
                    : 'transparent',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {c.icon}
                </span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-geist-mono)',
                    opacity: 0.6,
                  }}
                >
                  {c.endpoints.length}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main style={{ minWidth: 0 }}>
          {filteredCategories.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '48px', opacity: 0.4, display: 'block', marginBottom: '12px' }}
              >
                search_off
              </span>
              <p style={{ fontSize: '15px' }}>
                No endpoints match your search. Try a different query.
              </p>
            </div>
          )}

          {filteredCategories.map((category) => (
            <CategorySection
              key={category.name}
              category={category}
              isExpanded={expandedCategories.has(category.name)}
              onToggle={() => toggleCategory(category.name)}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
