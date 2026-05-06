/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as caseStudies from "../caseStudies.js";
import type * as chat from "../chat.js";
import type * as comments from "../comments.js";
import type * as content from "../content.js";
import type * as jobs from "../jobs.js";
import type * as leads from "../leads.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as seo from "../seo.js";
import type * as subscribers from "../subscribers.js";
import type * as upload from "../upload.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  caseStudies: typeof caseStudies;
  chat: typeof chat;
  comments: typeof comments;
  content: typeof content;
  jobs: typeof jobs;
  leads: typeof leads;
  projects: typeof projects;
  seed: typeof seed;
  seo: typeof seo;
  subscribers: typeof subscribers;
  upload: typeof upload;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
