import * as ImagePicker from 'expo-image-picker';
import { Button, Image, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../app/lib/supabase';
import { View } from './Themed';

interface Props {
  size: number
  url: string 
  onUpload: (filePath: string) => void
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarSize = { height: size, width: size }

  useEffect(() => {
    // if a url exists for the avatar, download the image
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
        
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }
  const uploadAvatar = async () => {
    
    try {
      setUploading(true)
      // supabase base project is set up with one folder per user id, with INSERT/DELETE/UPDATE access only for the authenticated user
      const { data, error } = await supabase.auth.getSession()
        if (error) {
          throw error
        } if (data.session) {
            const userId = data.session.user.id
        
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1
      });

      // if the user backs out of the image picker, do nothing
      if(!result.canceled) {
        // regex removes string up to filename
        const filename = result.assets[0].uri.replace(/^.*[\\\/]/, "");      
        const url = result.assets[0].uri;
        const ext = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf(".") + 1);
      
        // create a FormData object to eventually send uploaded image data
        let formData = new FormData()
        formData.append('file', JSON.parse(JSON.stringify({
          name: filename,
          type: result.assets[0].type ? `image/${ext}` : '',
          uri: url
        })));
      
        // create random fileId to store avatar
        const fileId = `${Math.random()}.${ext}`;
        // get the full filepath (using the userId as the folder path)
        const filePath = `${userId}/${fileId}`
        
        let { error } = await supabase.storage.from('avatars').upload(filePath, formData);

        if(error) {
          throw error
        }

        onUpload(filePath)
      }
    }} catch (error) {
      throw error
    
    } finally {
      setUploading(false);
    }

	
  }
  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View style={styles.uploadBtn}>
        <Button
          title={uploading ? 'Uploading ...' : 'Upload'}
          onPress={uploadAvatar}
          disabled={uploading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#333',
    border: '1px solid rgb(200, 200, 200)',
    borderRadius: 5,
  },
  uploadBtn: {
    alignItems: 'center',
    marginTop: 15
  }
})