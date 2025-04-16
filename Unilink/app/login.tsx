import { View } from "react-native";
import { useState, useContext } from "react";
import { Link, useRouter, Router } from "expo-router";
import MedButton from "@/components/MedButton";
import TextField from "@/components/TextField";
import HeaderText from "@/components/HeaderText";
import { postAPI, loginContext, saveToStorage } from "./_layout";
import { Href } from "expo-router";

async function handleLogin(email: string, password: string, router: Router, navigateToOnSuccess: Href) {
    try {
        const loginResponse = await postAPI("/auth/login", {
            email,
            password
        });

        if(loginResponse) {
            const { access_token, user_id } = loginResponse.data;

            console.log(email);

            // Store token in AsyncStorage
            const savedToken = await saveToStorage("access_token", access_token, true);
            const userId = await saveToStorage("user_id", user_id, true);

            console.log("Saved token:", savedToken);
            console.log("User ID:", userId)
            if(savedToken && userId) router.navigate(navigateToOnSuccess); // Navigate on successful signup
        }
    } catch (error) {
        console.error("Login error:", error);
        // Alert.alert("Error", error.response?.data?.error || "Signup failed. Please try again.");
    }
}

export default function Login() {
    // const host = process.env.ENV === 'Prod' ? process.env.HOST : 'localhost';
    const host = 'localhost';
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [savedToken, setSavedToken] = useState<string>();
    const [userId, setUserId] = useState<string>();

    const loginNavigateTo = useContext(loginContext).value;

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
            <MedButton label="Login" backgroundColor="#B61601" textColor="white"scale={1}
            onPress={() => {handleLogin(email, password, router, loginNavigateTo)}}/>
            <Link className='underline' href='/signup'>New user? Click here to sign up.</Link>
            <Link className='underline' href='/login'>Forgot password? Click here to reset.</Link>
            </View>
        </View>

    )
}