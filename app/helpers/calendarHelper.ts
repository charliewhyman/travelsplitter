import { Moment } from "moment";
import { Dispatch, SetStateAction } from "react";
import { supabase } from "../lib/supabase";
import { AuthSession } from "@supabase/supabase-js";
import { router } from "expo-router";
import { Alert } from "react-native";

export async function getTripDates(
    sessionData: AuthSession | null,
    tripId: string,
    setStartDate: Dispatch<SetStateAction<Date | null>>,
    setEndDate: Dispatch<SetStateAction<Date | null>>,
    setLoading: Dispatch<SetStateAction<boolean>>): Promise<void> {
        try {
            setLoading(true);
            if (!sessionData?.user) {
              router.replace('/(auth)/login');
              throw new Error('No user on the session!');
            }
        
            let { data, error, status } = await supabase
              .from('trips')
              .select('start_datetime, end_datetime')
              .eq('id', tripId)
              .single()
        
            if (error && status !== 406) {
              throw error;
            }
        
            if (data) {
                setStartDate(new Date(data.start_datetime))
                setEndDate(new Date(data.end_datetime))

                console.log(data)
            }
          } catch (error) {
            if (error instanceof Error) {
              Alert.alert(error.message);
            }
          } finally {
            setLoading(false);
          }
    }