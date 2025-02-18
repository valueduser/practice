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

export async function getActivitiesForWorkout(pb: any, workout_id: string): Promise<WorkoutActivity[]> {
  let activities: WorkoutActivity[] = []
  const options = {
    expand: 'workout_id,activity_id',
    filter: `workout_id = "${workout_id}"`,
  }

  const workout = await getWorkout(pb, workout_id)

  let warmupActivities: WorkoutActivity[] = []
  if (workout.warmup.length > 0) {
    warmupActivities = await getActivitiesForWorkout(pb, workout.warmup)
  }

// TODO: cooldown

  const workoutActivities = await pb
    .collection('workout_activity')
    .getFullList(options)

    activities = warmupActivities.concat(
      workoutActivities.flatMap((workoutActivity: WorkoutActivityResponse) => {
  
      const workout = (workoutActivity.expand as { workout_id: any }).workout_id
      const activity = workoutActivity.expand.activity_id

      let order: number = workoutActivity.order + warmupActivities.length

      return {
        id: activity.id,
        name: activity.name,
        reps: workoutActivity.reps,
        sets: workoutActivity.sets,
        duration: workoutActivity.duration,
        order: order
    }})
  )// TODO: cooldown
  console.warn(JSON.stringify(activities))
  return activities
}

export async function getActivitiesForWorkout2(pb: any, workout_id: string): Promise<WorkoutActivity[]> {
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

// console.warn(JSON.stringify(warmupActivities.concat(activities)))
  return warmupActivities.concat(activities)
}

export async function getActivity(pb: any, id: string) {
  const activity = await pb.collection('activities').getOne(id)
  return activity;
}

// export async function getFullActivity(pb: any, workout_id: string, activity_id: string) {
//   const options = {
//     expand: 'workout_id,activity_id',
//     filter: `workout_id = "${workout_id}" && activity_id = "${activity_id}"`,
//   }

//   const workoutActivities = await pb
//     .collection('workout_activity')
//     .getFullList(options)

//   // Return the first (and should be only) matching activity
//   const workoutActivity = workoutActivities[0]
//   const activity = workoutActivity.expand.activity_id
    
//   return {
//     id: activity.id,
//     name: activity.name,
//     order: workoutActivity.order,
//     instructions: activity.instructions,
//     isActive: activity.isActive,
//     plane: activity.plane,
//     image: pb.files.getUrl(activity, activity.image),
//     reps: workoutActivity.reps,
//     sets: workoutActivity.sets,
//     weight: workoutActivity.weight,
//     weightUnits: workoutActivity.weight_units,
//     duration: workoutActivity.duration,
//     durationUnits: workoutActivity.duration_units,
//     side: workoutActivity.side,
//   }
// }

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