/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Activities = "activities",
	ActivityEquipment = "activity_equipment",
	Equipment = "equipment",
	Groups = "groups",
	Tags = "tags",
	Users = "users",
	WorkoutActivity = "workout_activity",
	WorkoutGroup = "workout_group",
	Workouts = "workouts",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum ActivitiesPlaneOptions {
	"'sagital'" = "'sagital'",
	"'coronal'" = "'coronal'",
	"'transverse'" = "'transverse'",
}
export type ActivitiesRecord = {
	image?: string
	instructions?: string
	is_active?: boolean
	name?: string
	notes?: string
	plane?: ActivitiesPlaneOptions
}

export type ActivityEquipmentRecord = {
	activity_id?: RecordIdString
	equipment_id?: RecordIdString
}

export type EquipmentRecord = {
	name?: string
}

export type GroupsRecord = {
	name?: string
}

export type TagsRecord = {
	name?: string
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

export enum WorkoutActivityWeightUnitsOptions {
	"'grams'" = "'grams'",
	"'kilograms'" = "'kilograms'",
	"'ounces'" = "'ounces'",
	"'pounds'" = "'pounds'",
}

export enum WorkoutActivityDurationUnitsOptions {
	"'seconds'" = "'seconds'",
	"'minutes'" = "'minutes'",
	"'hours'" = "'hours'",
}

export enum WorkoutActivitySideOptions {
	"'left'" = "'left'",
	"'right'" = "'right'",
	"'front'" = "'front'",
	"'back'" = "'back'",
}
export type WorkoutActivityRecord = {
	activity_id?: RecordIdString
	duration?: number
	duration_units?: WorkoutActivityDurationUnitsOptions
	order?: number
	reps?: number
	sets?: number
	side?: WorkoutActivitySideOptions
	weight?: number
	weight_units?: WorkoutActivityWeightUnitsOptions
	workout_id?: RecordIdString,
	image?: string
}

export type WorkoutGroupRecord = {
	group_id?: RecordIdString
	workout_id?: RecordIdString
}

export type WorkoutsRecord = {
	cooldown?: RecordIdString
	is_active?: boolean
	name?: string
	notes?: string
	visible?: boolean
	warmup?: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type ActivitiesResponse<Texpand = unknown> = Required<ActivitiesRecord> & BaseSystemFields<Texpand>
export type ActivityEquipmentResponse<Texpand = unknown> = Required<ActivityEquipmentRecord> & BaseSystemFields<Texpand>
export type EquipmentResponse<Texpand = unknown> = Required<EquipmentRecord> & BaseSystemFields<Texpand>
export type GroupsResponse<Texpand = unknown> = Required<GroupsRecord> & BaseSystemFields<Texpand>
export type TagsResponse<Texpand = unknown> = Required<TagsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type WorkoutActivityResponse<Texpand = unknown> = Required<WorkoutActivityRecord> & BaseSystemFields<Texpand>
export type WorkoutGroupResponse<Texpand = unknown> = Required<WorkoutGroupRecord> & BaseSystemFields<Texpand>
export type WorkoutsResponse<Texpand = unknown> = Required<WorkoutsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	activities: ActivitiesRecord
	activity_equipment: ActivityEquipmentRecord
	equipment: EquipmentRecord
	groups: GroupsRecord
	tags: TagsRecord
	users: UsersRecord
	workout_activity: WorkoutActivityRecord
	workout_group: WorkoutGroupRecord
	workouts: WorkoutsRecord
}

export type CollectionResponses = {
	activities: ActivitiesResponse
	activity_equipment: ActivityEquipmentResponse
	equipment: EquipmentResponse
	groups: GroupsResponse
	tags: TagsResponse
	users: UsersResponse
	workout_activity: WorkoutActivityResponse
	workout_group: WorkoutGroupResponse
	workouts: WorkoutsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'activities'): RecordService<ActivitiesResponse>
	collection(idOrName: 'activity_equipment'): RecordService<ActivityEquipmentResponse>
	collection(idOrName: 'equipment'): RecordService<EquipmentResponse>
	collection(idOrName: 'groups'): RecordService<GroupsResponse>
	collection(idOrName: 'tags'): RecordService<TagsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'workout_activity'): RecordService<WorkoutActivityResponse>
	collection(idOrName: 'workout_group'): RecordService<WorkoutGroupResponse>
	collection(idOrName: 'workouts'): RecordService<WorkoutsResponse>
}
