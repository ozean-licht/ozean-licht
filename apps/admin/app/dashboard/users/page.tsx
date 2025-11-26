import { redirect } from 'next/navigation';

/**
 * Redirect /dashboard/users to /dashboard/access/users
 */
export default function UsersRedirect() {
  redirect('/dashboard/access/users');
}
