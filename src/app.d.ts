import type { Database } from '$lib/database.types';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';
import streamReservationsUsersItems from '$lib/db-calls/streamReservationsUsersItems';
import streamBorrowersUsersItems from '$lib/db-calls/streamBorrowersUsersItems';
import streamReturnedItemUser from '$lib/db-calls/streamReturnedItemUser';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>;
      supabaseAdmin: SupabaseClient<Database>;
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
      session: Session | null;
      user: User | null;
    }
    interface PageData {
      session: Session | null;
      supabase?: SupabaseClient<Database>;
      user?: User | null;
      getReservations?: ReturnType<typeof streamReservationsUsersItems>;
      getBorrowers?: ReturnType<typeof streamBorrowersUsersItems>;
      getReturnees?: ReturnType<typeof streamReturnedItemUser>;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
