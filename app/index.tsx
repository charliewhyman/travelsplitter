import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";

export default function IndexPage() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(tabs)/home')
      } else {
        console.log('no user')
        router.replace('/(auth)/login')
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
            router.replace('/(tabs)/home');
        } else {
            router.replace('/(auth)/login');
        }

    })
  }, [])
};