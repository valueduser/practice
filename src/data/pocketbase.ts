import PocketBase from 'pocketbase'
import type {
  TypedPocketBase,
  WorkoutActivityResponse,
  ActivitiesResponse,
  WorkoutsResponse,
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
      id: workoutActivity.id,
      name: activity.name,
      reps: workoutActivity.reps,
      sets: workoutActivity.sets,
      duration: workoutActivity.duration,
      order: workoutActivity.order,
      side: workoutActivity.side
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
      id: workoutActivity.id,
      name: activity.name,
      reps: workoutActivity.reps,
      sets: workoutActivity.sets,
      duration: workoutActivity.duration,
      order: order,
      side: workoutActivity.side
    }
  })

  return warmupActivities.concat(activities)
}

export async function getActivity(pb: any, id: string) {
  const activity = await pb.collection('activities').getOne(id)
  return activity;
}

export function processImages(pb: TypedPocketBase, activity: ActivitiesResponse) {
  type ImageItem = {
    name: string
    url: string
    // url_larger: string
  }

  const image: ImageItem = {
    name: activity.image,
    url: pb.files.getUrl(activity, activity.image, {
      thumb: '0x800',
    })
  }

  // activity.image?.map((img: string) => {
  //   image.push({
  //     name: image,
  //     url: pb.files.getUrl(activity, img, {
  //       thumb: '0x800',
  //     }),
  //     // url_larger: pb.files.getUrl(activity, image, {
  //     //   thumb: '0x800',
  //     // }),
  //   })
  // })

  return image
}

// TODO: CRUD on workouts and activities