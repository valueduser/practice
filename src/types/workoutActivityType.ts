import type { WorkoutActivityResponse } from '@src/data/pocketbase-types'


export interface WorkoutActivity extends WorkoutActivityResponse {
  workoutId: string;
  activityId: string;
  workout_activity_id: string;
  name: string;
  instructions: string;
  notes: string;
  isActive: boolean;
  plane: string;
  image: string;
}