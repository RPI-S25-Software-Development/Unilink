import { View, Text, Alert } from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import MedButton from "@/components/MedButton";
import TextField from "@/components/TextField";
import HeaderText from "@/components/HeaderText";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:3000/auth/login", {
                email,
                password
            });
            const { access_token, user_id } = response.data;
            console.log(email)

            // Store token in AsyncStorage
            await AsyncStorage.setItem('access_token', access_token);
            await AsyncStorage.setItem('user_id', user_id);
            const savedToken = await AsyncStorage.getItem("access_token");
            const userID = await AsyncStorage.getItem("user_id");
            console.log("Saved token:", savedToken);
            console.log("User id:", userID)
            router.navigate("/home"); // Navigate on successful signup
        } catch (error) {
            console.error("Login error:", error);
            // Alert.alert("Error", error.response?.data?.error || "Signup failed. Please try again.");
        }
    };

    return (
        <View className="flex-1 items-center justify-center">
            <View className="flex items-center justify-center gap-8">
            <HeaderText children={'Login'} fontSize={30}/>
            <View>
                <TextField 
                    label={'Email'} 
                    scale={1.5} 
                    secureTextEntry={false} 
                    onChangeText={setEmail} 
                    value={email} 
                />
                <TextField 
                    label={'Password'} 
                    scale={1.5} 
                    secureTextEntry={true} 
                    onChangeText={setPassword} 
                    value={password} 
                />
            </View>
            <MedButton label="Login" backgroundColor="#B61601" textColor="white"scale={1} onPress={handleLogin}/>
            <Link className='underline' href='/signup'>New user? Click here to sign up.</Link>
            <Link className='underline' href='/login'>Forgot password? Click here to reset.</Link>
            </View>
        </View>

    )
}