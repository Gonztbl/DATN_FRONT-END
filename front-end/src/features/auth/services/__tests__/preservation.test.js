/**
 * Preservation Property Tests
 *
 * These tests verify behaviors that are currently working correctly
 * and MUST NOT be broken by the fix.
 *
 * All tests MUST PASS on unfixed code (baseline confirmation).
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import faceService from '../faceService';

// Mock apiClient module (same pattern as bugCondition.test.js)
vi.mock('../../../../api/apiClient', () => {
  const mockPost = vi.fn();
  const mockGet = vi.fn();
  const mockDelete = vi.fn();
  return {
    default: {
      post: mockPost,
      get: mockGet,
      delete: mockDelete,
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

import apiClient from '../../../../api/apiClient';

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Property 1: Valid userId passthrough - _getUserId returns same value, no /api/me call
// ---------------------------------------------------------------------------
describe('Property 1 - Valid userId passthrough (Preservation 3.1)', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * For all valid userId values, _getUserId(userId) MUST return the same userId
   * directly without calling /api/me.
   * PASSES on unfixed code - this behavior already works correctly.
   */
  const validUserIds = [1, 42, 100, 999];

  for (const userId of validUserIds) {
    it(`should return userId=${userId} directly without calling /api/me`, async () => {
      const result = await faceService._getUserId(userId);

      expect(result).toBe(userId);
      expect(apiClient.get).not.toHaveBeenCalledWith('/api/me');
    });
  }
});

// ---------------------------------------------------------------------------
// Property 2: deleteEmbedding calls correct endpoint
// ---------------------------------------------------------------------------
describe('Property 2 - deleteEmbedding calls correct endpoint (Preservation 3.2)', () => {
  /**
   * **Validates: Requirements 3.2**
   *
   * For all embeddingId values, deleteEmbedding(id) MUST call
   * DELETE /api/face/{id} exactly once.
   * PASSES on unfixed code - this behavior already works correctly.
   */
  const embeddingIds = [1, 5, 123];

  for (const id of embeddingIds) {
    it(`should call DELETE /api/face/${id} exactly once for embeddingId=${id}`, async () => {
      apiClient.delete.mockResolvedValueOnce({ data: { success: true } });

      await faceService.deleteEmbedding(id);

      expect(apiClient.delete).toHaveBeenCalledTimes(1);
      expect(apiClient.delete).toHaveBeenCalledWith(`/api/face/${id}`);
    });
  }
});

// ---------------------------------------------------------------------------
// Property 3: generateEmbedding sends FormData
// ---------------------------------------------------------------------------
describe('Property 3 - generateEmbedding sends FormData (Preservation 3.3)', () => {
  /**
   * **Validates: Requirements 3.3**
   *
   * generateEmbedding(file) MUST call apiClient.post with /api/face/embedding
   * and a FormData body containing the file.
   * PASSES on unfixed code - this behavior already works correctly.
   */
  it('should call POST /api/face/embedding with FormData body', async () => {
    const mockFile = new File(['dummy content'], 'face.jpg', { type: 'image/jpeg' });

    let capturedBody = null;
    apiClient.post.mockImplementationOnce((_url, body) => {
      capturedBody = body;
      return Promise.resolve({ data: { embedding: [0.1, 0.2, 0.3] } });
    });

    await faceService.generateEmbedding(mockFile);

    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post.mock.calls[0][0]).toBe('/api/face/embedding');
    expect(capturedBody).toBeInstanceOf(FormData);
    expect(capturedBody.get('file')).toBe(mockFile);
  });
});

// ---------------------------------------------------------------------------
// Property 4: compareFaces sends FormData
// ---------------------------------------------------------------------------
describe('Property 4 - compareFaces sends FormData (Preservation 3.4)', () => {
  /**
   * **Validates: Requirements 3.4**
   *
   * compareFaces(img1, img2) MUST call apiClient.post with /api/face/compare
   * and a FormData body containing both images.
   * PASSES on unfixed code - this behavior already works correctly.
   */
  it('should call POST /api/face/compare with FormData body containing both images', async () => {
    const img1 = new File(['img1 content'], 'face1.jpg', { type: 'image/jpeg' });
    const img2 = new File(['img2 content'], 'face2.jpg', { type: 'image/jpeg' });

    let capturedBody = null;
    apiClient.post.mockImplementationOnce((_url, body) => {
      capturedBody = body;
      return Promise.resolve({ data: { similarity: 0.95 } });
    });

    await faceService.compareFaces(img1, img2);

    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post.mock.calls[0][0]).toBe('/api/face/compare');
    expect(capturedBody).toBeInstanceOf(FormData);
    expect(capturedBody.get('img1')).toBe(img1);
    expect(capturedBody.get('img2')).toBe(img2);
  });
});
