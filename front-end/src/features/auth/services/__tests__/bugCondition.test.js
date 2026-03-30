/**
 * Bug Condition Exploration Tests
 *
 * These tests encode EXPECTED behavior and are designed to FAIL on unfixed code.
 * Failure = proof the bugs exist.
 * They will PASS after the fix is applied.
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import authService from '../authService';
import faceService from '../faceService';

// Mock apiClient module
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
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Test A: authService.login() - missing `id` field in saved user object
// ---------------------------------------------------------------------------
describe('Test A - authService missing id (Bug Condition 1.3)', () => {
  it('should save id field to localStorage user object when login response contains id', async () => {
    /**
     * **Validates: Requirements 1.3**
     *
     * Bug: authService.login() builds user object manually but omits the `id` field.
     * Expected: user object in localStorage MUST have `id === 5`.
     * FAILS on unfixed code because `id` is not mapped.
     */
    const mockLoginResponse = {
      data: {
        token: 'abc',
        id: 5,
        userName: 'user1',
        email: 'test@test.com',
        roles: ['USER'],
      },
    };

    apiClient.post.mockResolvedValueOnce(mockLoginResponse);

    await authService.login({ userName: 'user1', password: 'pass' });

    const savedUser = JSON.parse(localStorage.getItem('user'));

    // This assertion FAILS on unfixed code - authService does not map `id`
    expect(savedUser.id).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// Test B: faceService.registerFace() - sends FormData instead of JSON
// ---------------------------------------------------------------------------
describe('Test B - registerFace sends FormData instead of JSON (Bug Condition 1.4)', () => {
  it('should send JSON body with image field instead of multipart/form-data', async () => {
    /**
     * **Validates: Requirements 1.4**
     *
     * Bug: registerFace() forwards FormData directly to apiClient.post,
     * resulting in multipart/form-data instead of JSON.
     * Expected: request body is a plain object (JSON) with field `image`.
     * FAILS on unfixed code because FormData is sent.
     */
    const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgAB';

    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('pose', 'Front');
    formData.append('userId', '42');

    let capturedBody = null;
    let capturedConfig = null;

    apiClient.post.mockImplementationOnce((_url, body, config) => {
      capturedBody = body;
      capturedConfig = config;
      return Promise.resolve({ data: { success: true } });
    });

    await faceService.registerFace(formData);

    // These assertions FAIL on unfixed code - body is FormData, not JSON object
    expect(capturedBody).not.toBeInstanceOf(FormData);
    expect(typeof capturedBody).toBe('object');
    expect(capturedBody).toHaveProperty('image');
    expect(typeof capturedBody.image).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// Test C: faceService.verifyFace() - sends FormData instead of JSON
// ---------------------------------------------------------------------------
describe('Test C - verifyFace sends FormData instead of JSON (Bug Condition 1.4)', () => {
  it('should send JSON body with image field instead of multipart/form-data', async () => {
    /**
     * **Validates: Requirements 1.4**
     *
     * Bug: verifyFace() forwards FormData directly to apiClient.post,
     * resulting in multipart/form-data instead of JSON.
     * Expected: request body is a plain object (JSON) with field `image`.
     * FAILS on unfixed code because FormData is sent.
     */
    const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgAB';

    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('userId', '42');

    let capturedBody = null;

    apiClient.post.mockImplementationOnce((_url, body, _config) => {
      capturedBody = body;
      return Promise.resolve({ data: { verified: true } });
    });

    await faceService.verifyFace(formData);

    // These assertions FAIL on unfixed code - body is FormData, not JSON object
    expect(capturedBody).not.toBeInstanceOf(FormData);
    expect(typeof capturedBody).toBe('object');
    expect(capturedBody).toHaveProperty('image');
    expect(typeof capturedBody.image).toBe('string');
  });
});
