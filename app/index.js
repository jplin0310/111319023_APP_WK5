import { useEffect, useState } from "react";
import { Alert, Button, Image, Platform, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Page() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (mediaStatus !== "granted" || cameraStatus !== "granted") {
          Alert.alert("權限需求", "請允許存取相機與相簿，才能拍照和上傳照片。");
        }
      }
    })();
  }, []);

  const ensurePermissions = async (forCamera) => {
    if (Platform.OS === "web") return true;

    if (forCamera) {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert("權限不足", "請允許相機與相簿存取權限，才能使用拍照功能。");
        return false;
      }
      return true;
    }

    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaStatus !== "granted") {
      Alert.alert("權限不足", "請允許相簿存取權限，才能選擇照片。");
      return false;
    }

    return true;
  };

  const pickImage = async () => {
    if (!(await ensurePermissions(false))) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!(await ensurePermissions(true))) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>上傳照片 / 拍照範例</Text>
        <Text style={styles.description}>你可以從相簿選擇一張照片，或直接使用相機拍照。</Text>

        <View style={styles.buttons}>
          <View style={styles.buttonWrapper}>
            <Button title="從相簿上傳照片" onPress={pickImage} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="使用相機拍照" onPress={takePhoto} />
          </View>
        </View>

        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>尚未選取照片</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    color: "#475569",
  },
  buttons: {
    marginBottom: 24,
  },
  buttonWrapper: {
    marginBottom: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
    marginTop: 8,
  },
  placeholder: {
    color: "#475569",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});
