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

export interface Group {
  id: string;
  name: string;
  slug: string;
}

export async function getGroups(
    sessionData: AuthSession | null,
    setUserGroups: Dispatch<SetStateAction<Group[]>>,
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
        const groupNamesArray: Group[] = [];
  
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

  export async function checkUserExists(username: string, setLoading: Dispatch<SetStateAction<boolean>>): Promise<{ exists: boolean | null; userId?: string | null }> {
    try {
      setLoading(true);
  
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`
        id
        `)
        .eq('username', username);
  
      if (error && status !== 406) {
        throw error;
      }
  
      // check if username already exists in group
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
  
  export async function checkUserInGroup(username: string, selectedGroup: string | string[], setLoading: Dispatch<SetStateAction<boolean>>): Promise<boolean | null> {
    try {
      setLoading(true);
  
      let { data, error, status } = await supabase
        .from('group_members')
        .select(`
        profiles (username)
        `)
        .eq('profiles.username', username)
        .eq('group_id', selectedGroup);
  
      if (error && status !== 406) {
        throw error;
      }
  
      // check if username already exists in group
      if (data && data[1].profiles?.username) {
        Alert.alert('User already in group!');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }
  
  export async function addUserToGroup(userId: string, groupId: string, setLoading: Dispatch<SetStateAction<boolean>>): Promise<void> {
    try {
      setLoading(true);
  
      let { data, error, status } = await supabase
        .from('group_members')
        .insert([
          { group_id: groupId, member_id: userId },
        ])
        .select();
  
      Alert.alert('User added!');
  
      if (error && status !== 406) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }


  export interface User {
    id: string;
    username: string;
    email: string;
  }

  export async function getGroupMembers(
    sessionData: AuthSession | null,
    groupId: string,
    setGroupMembers: Dispatch<SetStateAction<User[]>>,
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
        profiles (
          id,
          username,
          email
        )`)
        .eq('group_id', groupId);
  
      if (error && status !== 406) {
        throw error;
      }
  
      if (data) {
        const userArray: User[] = [];
  
        data.forEach((item, index) => {
          if (!item.profiles) {
            throw new Error(`Users is null at index ${index}`);
          }
          userArray.push(item.profiles);
        });
  
        setGroupMembers(userArray);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }