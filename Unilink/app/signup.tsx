import { View, Alert } from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import MedButton from "@/components/MedButton";
import TextField from "@/components/TextField";
import HeaderText from "@/components/HeaderText";

export default function SignUp() {
    const host = process.env.ENV === 'Prod' ? process.env.HOST : 'localhost';
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            const response = await axios.post(`http://${host}:3000/auth/usersignup`, {
                email,
                password
            });

            Alert.alert("Success", "Account created successfully!");
            router.navigate("/preferences"); // Navigate on successful signup
        } catch (error) {
            console.error("Signup error:", error);
            // Alert.alert("Error", error.response?.data?.error || "Signup failed. Please try again.");
        }
    };

    return (
        <View className="flex-1 items-center justify-center">
            <View className="flex items-center justify-center gap-8">
                <HeaderText children={'Signup'} fontSize={30}/>
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
                <MedButton label="Signup" backgroundColor="#B61601" textColor="white" scale={1} onPress={handleSignup} />
                <Link className='underline' href='/login'>Already have an account? Click here to login.</Link>
            </View>
        </View>
    );
}
