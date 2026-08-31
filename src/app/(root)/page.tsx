import { redirect } from 'next/navigation';

export default function RootPage() {
  // Cuando se utiliza output: export, Next.js generará 
  // un archivo index.html con un <meta http-equiv="refresh" content="0; url=/es" />
  redirect('/es');
}
