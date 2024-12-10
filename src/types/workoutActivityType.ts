import type { WorkoutActivityResponse } from '@src/data/pocketbase-types'


export interface WorkoutActivity extends WorkoutActivityResponse {
  workoutId: string;
  activityId: string;
  name: string;
  instructions: string;
  isActive: boolean;
  plane: string;
  image: string;
}