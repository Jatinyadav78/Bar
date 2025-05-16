"use client";
import Login from "../../component/login/login.js";
import { useSearchParams,useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const search = useSearchParams();
  const returnUrl=search.get('returnUrl')
  return (
    // <main className={styles.main}>
    <>
      <Login router={router} returnUrl={returnUrl}/>
     
    </>
    // </main>
  )
}
