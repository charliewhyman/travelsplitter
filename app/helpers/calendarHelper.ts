import { Moment } from "moment";
import { Dispatch, SetStateAction } from "react";
import { supabase } from "../lib/supabase";


export async function getEventDetails(eventId: string, setLoading: Dispatch<SetStateAction<boolean>>): Promise<Moment[] | null> {
    try {
        setLoading(true);
    
        let { data, error, status } = await supabase
          .from('trips')
          .select(`
          id,
          start_datetime,
          end_datetime,
          name
          `)
          .eq('username', username);
    
        if (error && status !== 406) {
          throw error;
        }
    
        // check if username already exists in trip
        if (data && data.length === 0 || data == null) {
          return { exists: false, userId: null };
        } else {
          const userId = data[0].id;
          return { exists: true, userId };
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
        return { exists: null };
      } finally {
        setLoading(false);
      }
}