import { redirect } from 'next/navigation';

export default function RootPage() {
  // This triggers an immediate server-side redirect
  redirect('/register');
  
  // This part will never be reached or rendered
  return null;
}
