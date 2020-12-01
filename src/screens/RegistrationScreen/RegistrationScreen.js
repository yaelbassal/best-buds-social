import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { firebase } from "../../firebase/config";
// import { Dropdown } from 'react-native-material-dropdown';

export default function RegistrationScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //Newly added userBio input
  const [userBio, setUserBio] = useState("");
  //Newly added dog information
  const [dogName, setDogName] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [dogGender, setDogGender] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogTemperament, setDogTemperament] = useState("");

  const onFooterLinkPress = () => {
    navigation.navigate("Login");
  };

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    //It creates a new account that will show up in Firebase Console -> Authentication table.
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          email,
          fullName,
          //Newly add field
          userBio,
        };
        const dogData = {
          dogName,
          dogSize,
          dogGender,
          dogBreed,
          dogTemperament,
        }
        //If the account registration was successful, we also store the user data in Firebase Firestore. This is necessary for storing extra user information, such as full name, profile photo URL, and so on, which cannot be stored in the Authentication table.
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            //creating sub collection dogs with fields
            firebase.firestore().collection("users").doc(uid).collection("dogs").add(dogData);
            navigation.navigate("Home", { user: data });
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image
          style={styles.logo}
          source={require("../../../assets/icon.png")}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          textContentType={'oneTimeCode'}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          textContentType={'oneTimeCode'}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          textContentType={'oneTimeCode'}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          textContentType={'oneTimeCode'}
        />
        <TextInput
        //Newly Added UserBioSection
          style={styles.input}
          placeholder="bio"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setUserBio(text)}
          value={userBio}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          textContentType={'oneTimeCode'}
        />
        <TextInput
        //Newly Added Dog Section - Name
          style={styles.input}
          placeholder="dog name"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setDogName(text)}
          value={dogName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          textContentType={'oneTimeCode'}
        />
        <TextInput
        //Newly Added Dog Section - Size
          style={styles.input}
          placeholder="dog size"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setDogSize(text)}
          value={dogSize}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          textContentType={'oneTimeCode'}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}
        >
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
