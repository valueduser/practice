import PocketBase from 'pocketbase'
import type {
  TypedPocketBase,
  WorkoutActivityResponse,
  ActivitiesResponse,
  WorkoutsResponse,
  ActivitiesRecord,
} from '@src/data/pocketbase-types' // TODO: move to types folder
import type { WorkoutActivity } from  '../types/workoutActivityType'

export const pb = new PocketBase(import.meta.env.POCKETBASE_URL || process.env.POCKETBASE_URL) as TypedPocketBase
pb.autoCancellation(false)

export async function getAllWorkouts(pb: TypedPocketBase): Promise<(WorkoutsResponse & { exercises: number, duration: number })[]> {
  const workouts = await pb.collection('workouts').getFullList()
  const workoutActivities = await pb.collection('workout_activity').getFullList()
  
  return workouts.map(workout => {
    const activities = workoutActivities.filter(activity => activity.workout_id === workout.id)
    const totalDuration = activities.reduce((sum, activity) => {
      if (activity.duration_units === "'minutes'") {
        return sum + (activity.duration || 0)
      } else if (activity.duration_units === "'seconds'") {
        return sum + ((activity.duration || 0) / 60)
      } else if (activity.duration_units === "'hours'") {
        return sum + ((activity.duration || 0) * 60)
      }
      return sum
    }, 0)
    
    return {
      ...workout,
      exercises: activities.length,
      duration: Math.round(totalDuration)
    }
  })
}

export async function getWorkout(pb: any, id: string) {
  const workout = await pb.collection('workouts').getOne(id)

  return workout
}

export async function getActivitiesForWorkout(pb: any, workout_id: string): Promise<WorkoutActivity[]> {
  let activities, warmupActivities, cooldownActivities: WorkoutActivity[] = []
  const workout = await getWorkout(pb, workout_id)

  warmupActivities = (await pb
  .collection('workout_activity')
  .getFullList({
    expand: 'workout_id,activity_id',
    filter: `workout_id = "${workout.warmup}"`,
  })).map((workoutActivity: WorkoutActivityResponse) => {
    const workout: WorkoutsResponse = (workoutActivity.expand as { workout_id: any }).workout_id
    const activity: ActivitiesResponse = (workoutActivity.expand as { activity_id: any}).activity_id
    return {
      id: activity.id,
      workout_activity_id: workoutActivity.id,
      name: activity.name,
      reps: workoutActivity.reps,
      sets: workoutActivity.sets,
      duration: workoutActivity.duration,
      order: workoutActivity.order,
      side: workoutActivity.side,
      image: activity.image
    }
  })

  activities = (await pb
  .collection('workout_activity')
  .getFullList({
    expand: 'workout_id,activity_id',
    filter: `workout_id = "${workout.id}"`,
  })).map((workoutActivity: WorkoutActivityResponse) => {
    const workout: WorkoutsResponse = (workoutActivity.expand as { workout_id: any }).workout_id
    const activity: ActivitiesResponse = (workoutActivity.expand as { activity_id: any}).activity_id
    const order: number = workoutActivity.order + warmupActivities.length

    return {
      id: activity.id,
      workout_activity_id: workoutActivity.id,
      name: activity.name,
      reps: workoutActivity.reps,
      sets: workoutActivity.sets,
      duration: workoutActivity.duration,
      order: order,
      side: workoutActivity.side,
      image: activity.image
    }
  })

  return warmupActivities.concat(activities)
}

export async function getActivity(pb: any, id: string) {
  console.warn(`Fetching activity with ID: ${id}`)
  const activity = await pb.collection('activities').getOne(id)
  return activity;
}

export function processImage(pb: any, activity: ActivitiesRecord) {
  type ImageItem = {
    name: string
    url: string
  }

  const image: ImageItem = {
    name: activity.name || 'default.png',
    url: pb.files.getUrl(activity, activity.image
    //   , {
    //   thumb: '0x800',
    // }
  )
  }
  // image.name = activity.name || 'default.png'
  // image.url = pb.files.getUrl(activity, activity.image)

  return image
}

// TODO: CRUD on workouts and activities