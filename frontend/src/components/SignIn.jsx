import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { z } from 'zod';

const signInSchema = z.object({
    identifier: z.string().min(1, "Username or email is required"),
    password: z.string().min(1, "Password is required")
});

function SignInForm() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userDetails, setUserDetails] = useState({
        identifier: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const onChange = (e) => {
        setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Zod validation
        const result = signInSchema.safeParse(userDetails);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            setLoading(false);
            return;
        }

        // reset errors
        setErrors({});

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/auth/login`, {
                identifier: userDetails.identifier,
                password: userDetails.password
            });
    
            // Handle success response
            console.log('Success:', response.data.msg);
            // Do something with the response, e.g., redirect the user

            localStorage.setItem('username', JSON.stringify(response.data.user.username))
            localStorage.setItem('avatar', JSON.stringify(response.data.user.avatar))
            localStorage.setItem('token', JSON.stringify(response.data.token))
            response.data.user.isVerified && localStorage.setItem('verified', response.data.user.isVerified)
    
            setUserDetails({
                identifier: "",
                password: ""
            });

            navigate('/')
        } catch (error) {
            // Handle error response
            console.error('Error:', error.response ? error.response.data : error.message);
            // Optionally set an error state to show feedback to the user
        } finally {
            setLoading(false);
        }

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setUserDetails({
                identifier: "",
                password: ""
            });
        }, 3000);
    }

    return (
        <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
                Sign In
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter your details to login.
            </Typography>
            <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Enter username or email
                    </Typography>
                    <Input
                        name="identifier"
                        value={userDetails.identifier}
                        onChange={onChange}
                        size="lg"
                        label="Username or Email"
                        placeholder="johnny or name@mail.com"
                        // className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                        variant="outlined"
                        // required
                    />
                    {errors.identifier && <Typography className="-mt-6" color="red">{errors.identifier}</Typography>}
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Password
                    </Typography>
                    <Input
                        variant="outlined"
                        name="password"
                        value={userDetails.password}
                        onChange={onChange}
                        type={showPassword ? "text" : "password"}
                        size="lg"
                        label="Password"
                        placeholder="********"
                        // className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                        // required
                        icon={
                            !showPassword ?
                                <svg onClick={() => setShowPassword(prev => !prev)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                :
                                <svg onClick={() => setShowPassword(prev => !prev)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                        }
                    />
                    {errors.password && <Typography className="-mt-6" color="red">{errors.password}</Typography>}
                </div>
                <Button type={loading ? "button" : "submit"} className="mt-6" fullWidth>
                    {loading ? "Processing..." : "Sign In"}
                </Button>
                {!loading &&
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Don't have an account?{" "}
                        <Link to={"/signup"} className="font-medium text-gray-900">
                            Sign Up
                        </Link>
                    </Typography>
                }
            </form>
        </Card>
    );
}
const SignIn = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <SignInForm />
        </div>
    )
}

export default SignIn