import { vi, expect, describe, test, beforeEach } from 'vitest'
import { getActivitiesForWorkout } from '../src/data/pocketbase'

describe('getActivitiesForWorkout', () => {
  const mockPb = {
    collection: vi.fn().mockReturnThis(),
    getFullList: vi.fn(),
    getOne: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should return combined warmup and main activities in correct order', async () => {
    // Mock workout data
    mockPb.getOne.mockResolvedValueOnce({
      id: 'workout1',
      warmup: 'warmup1',
    })

    // Mock warmup activities
    mockPb.getFullList.mockResolvedValueOnce([
      {
        id: 'wa1',
        reps: 10,
        sets: 2,
        duration: 30,
        order: 0,
        side: 'both',
        expand: {
          workout_id: { id: 'warmup1' },
          activity_id: { 
            id: 'act1',
            name: 'Warmup Exercise'
          }
        }
      }
    ])

    // Mock main workout activities
    mockPb.getFullList.mockResolvedValueOnce([
      {
        id: 'wa2',
        reps: 12,
        sets: 3,
        duration: 45,
        order: 0,
        side: 'left',
        expand: {
          workout_id: { id: 'workout1' },
          activity_id: {
            id: 'act2',
            name: 'Main Exercise'
          }
        }
      }
    ])

    const result = await getActivitiesForWorkout(mockPb, 'workout1')

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      id: 'wa1',
      name: 'Warmup Exercise',
      reps: 10,
      sets: 2,
      duration: 30,
      order: 0,
      side: 'both'
    })
    expect(result[1]).toEqual({
      id: 'wa2',
      name: 'Main Exercise',
      reps: 12,
      sets: 3,
      duration: 45,
      order: 1,
      side: 'left'
    })
  })

  test('should handle workout without warmup activities', async () => {
    mockPb.getOne.mockResolvedValueOnce({
      id: 'workout1',
      warmup: '', // Empty warmup
    })

    mockPb.getFullList
      .mockResolvedValueOnce([]) // Empty warmup activities
      .mockResolvedValueOnce([{  // Main workout activities
        id: 'wa1',
        reps: 12,
        sets: 3,
        duration: 45,
        order: 0,
        side: 'right',
        expand: {
          workout_id: { id: 'workout1' },
          activity_id: {
            id: 'act1',
            name: 'Main Exercise'
          }
        }
      }])

    const result = await getActivitiesForWorkout(mockPb, 'workout1')

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 'wa1',
      name: 'Main Exercise',
      reps: 12,
      sets: 3,
      duration: 45,
      order: 0,
      side: 'right'
    })
  })

  test('should handle errors gracefully', async () => {
    mockPb.getOne.mockRejectedValue(new Error('Failed to fetch workout'))

    await expect(getActivitiesForWorkout(mockPb, 'workout1'))
      .rejects
      .toThrow('Failed to fetch workout')
  })
})