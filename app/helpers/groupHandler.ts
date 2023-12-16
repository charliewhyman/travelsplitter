import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { AuthSession } from "@supabase/supabase-js";
import { router } from "expo-router";
import { Dispatch, SetStateAction } from "react";


export async function fetchSession(): Promise<AuthSession | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      if (data && data.session) {
        return data.session;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      return null;
    }
}

interface Groups {
  id: string;
  name: string;
  slug: string;
}

export async function getGroups(
    sessionData: AuthSession | null,
    setUserGroups: Dispatch<SetStateAction<Groups[]>>,
    setLoading: Dispatch<SetStateAction<boolean>>
  ): Promise<void> {
    try {
      setLoading(true);
      if (!sessionData?.user) {
        router.replace('/(auth)/login');
        throw new Error('No user on the session!');
      }
  
      let { data, error, status } = await supabase
        .from('group_members')
        .select(`
        groups (
          id,
          name,
          slug
        )`)
        .eq('member_id', sessionData.user.id);
  
      if (error && status !== 406) {
        throw error;
      }
  
      if (data) {
        const groupNamesArray: Groups[] = [];
  
        data.forEach((item, index) => {
          if (!item.groups) {
            throw new Error(`Groups is null at index ${index}`);
          }
          groupNamesArray.push(item.groups);
        });
  
        setUserGroups(groupNamesArray);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  
  export async function addGroup(
    sessionData: AuthSession | null,
    newGroupName: string,
    setLoading: Dispatch<SetStateAction<boolean>>
  ) {
    try {
      setLoading(true);
      if (!sessionData?.user) {
        router.replace('/(auth)/login');
        throw new Error('No user on the session!');
      }
  
      let slug = newGroupName.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
  
      let { data: group_data, error: group_error, status: group_status } = await supabase
        .from('groups')
        .insert([
          { name: newGroupName, slug: slug },
        ])
        .select();
  
      if (group_data) {
        let { data: group_members_data, error: group_members_error, status: group_members_status } = await supabase
          .from('group_members')
          .insert([
            { group_id: group_data[0].id, member_id: sessionData.user.id },
          ])
          .select();
      } else {
        throw new Error('Group not created!');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
      Alert.alert(`Group ${newGroupName} successfully added.`);
      router.replace('/');
    }
  }
