import PocketBase from 'pocketbase'
import type {
  TypedPocketBase,
  WorkoutActivityResponse,
  ActivitiesResponse,
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
  const workout = await pb.collection('workouts').getOne(id)

  return workout
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

      // TODO: return 'id' and 'name' instead of 'activityId'
      return {
        activityId: activity.id,
        activityName: activity.name,
        activityReps: workoutActivity.reps,
        activitySets: workoutActivity.sets,
        activityDuration: workoutActivity.duration
      }
    })


    return activities
}

export async function getActivity(pb: any, id: string) {
  const activity = await pb.collection('activities').getOne(id)
  return activity;
}

export async function getActivityIdByOrder(pb: any, workout_id: string, order: number) {
  const records = await pb.collection('workout_activity').getList(1, 1, {
    filter: `workout_id = "${workout_id}" && order = ${order}`,
    expand: 'workout_id,activity_id'
  });

  // Return null if no matching records found
  if (records.items.length === 0) {
    return null;
  }

  return records.items[0].activity_id;
}

export async function getFullActivity(pb: any, workout_id: string, activity_id: string) {
  const options = {
    expand: 'workout_id,activity_id',
    filter: `workout_id = "${workout_id}" && activity_id = "${activity_id}"`,
  }

  const workoutActivities = await pb
    .collection('workout_activity')
    .getFullList(options)

  // Return the first (and should be only) matching activity
  const workoutActivity = workoutActivities[0]
  const activity = workoutActivity.expand.activity_id
    
  return {
    id: activity.id,
    name: activity.name,
    order: workoutActivity.order,
    instructions: activity.instructions,
    isActive: activity.isActive,
    plane: activity.plane,
    image: pb.files.getUrl(activity, activity.image),
    reps: workoutActivity.reps,
    sets: workoutActivity.sets,
    weight: workoutActivity.weight,
    weightUnits: workoutActivity.weight_units,
    duration: workoutActivity.duration,
    durationUnits: workoutActivity.duration_units,
    side: workoutActivity.side,
  }
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