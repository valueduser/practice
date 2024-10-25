import PocketBase from 'pocketbase'
import type {
  TypedPocketBase,
  WorkoutActivityResponse
} from '@src/data/pocketbase-types'
// import { getUserObjectFromDb } from '@lib/auth'

export const pb = new PocketBase(import.meta.env.POCKETBASE_URL || process.env.POCKETBASE_URL) as TypedPocketBase

pb.autoCancellation(false)

export async function getAllWorkouts(pb: any) {
  const workouts = await pb
    .collection('workouts')
    .getFullList()
  return workouts
}

export async function getWorkout(pb: any, id: string) {
  const project = await pb.collection('workouts').getOne(id)

  return project
}

export async function getActivitiesForWorkout(pb: any, workout_id: string) {
  
  const options = {
    expand: 'workout_id,activity_id',
    filter: `workout_id = "${workout_id}"`,
  }

  const workoutActivities = await pb
    .collection('workout_activity')
    .getFullList(options)


    const activities = workoutActivities.map((workoutActivity: WorkoutActivityResponse) => {
      const workout = workoutActivity.expand.workout_id
      const activity = workoutActivity.expand.activity_id

      return {
        activityName: activity.name,
        activityReps: workoutActivity.reps,
        activitySets: workoutActivity.sets,
      }
    })


    return activities
}

// getAllWorkouts
// getActivitesForWorkout