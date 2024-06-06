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
import { toast } from "react-toastify";
import { z } from 'zod';

// Define the Zod schema for form validation
const signUpSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirm_password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    name: z.string().optional()
});

function SignUpForm() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [checkboxChecked, setCheckboxChecked] = useState(false)
    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        name: "",
        profile_pic_file: null
    })
    const [errors, setErrors] = useState({});
    const onChange = (e) => {
        setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const result = signUpSchema.safeParse(userDetails);
    
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            if(checkboxChecked === false){
                fieldErrors.checkbox =  "You must agree to the terms and conditions";
            }
            setErrors(fieldErrors);
            return;
        }
        let fieldErrors = {};
        if(checkboxChecked === false){
            fieldErrors.checkbox =  "You must agree to the terms and conditions";
            setErrors(fieldErrors);
            return;
        }
        // console.log(userDetails.password, userDetails.confirm_password)
        if(userDetails.password !== userDetails.confirm_password){
            // console.log('hihdhdh')
            setErrors({confirm_password: "Passwords don't match"})
            return;
        }
    
        try {
            // Perform Axios POST request
            setLoading(true);
        
            // Create a new FormData object
            const formData = new FormData();
        
            // Append each key-value pair from userDetails to the formData object
            Object.entries(userDetails).forEach(([key, value]) => {
                if(key === "profile_pic_file"){
                    formData.append('avatar', value);
                } else {
                    formData.append(key, value);
                }
            });
    
            console.log('Request Data:', userDetails);
    
            // Retrieve the token (assuming it's stored in localStorage or any other storage)
            const token = localStorage.getItem('token'); // Replace with your token retrieval logic
        
            // Make the Axios POST request using the formData object
            const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/auth/register`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // Handle successful response
            console.log('Response:', response.data);
    
            // Reset form fields and checkbox after successful submission
            setUserDetails({
                username: "",
                email: "",
                password: "",
                confirm_password: "",
                name: "",
                profile_pic_file: null
            });
            setCheckboxChecked(false);
            
    
            navigate('/signin');
        } catch (error) {
            // Handle errors
            console.log('Error:', error.message);
            toast.error('Failed to Register \nTry again', {
                position: 'bottom-left',
                autoClose: 5000,
                theme: "dark",
            })
        } finally {
            setLoading(false);
        }

        setUserDetails({
            username: "",
            email: "",
            password: "",
            confirm_password: "",
            name: "",
            profile_pic_file: null
        });
        setCheckboxChecked(false)
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const fileName = file?.name;
        if (!(fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png'))) {
            console.log('Only image files (jpg, jpeg, png) are allowed!');
            return;
        }
        setUserDetails({
            ...userDetails,
            profile_pic_file: file
        })
    }
    return (
        <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
                Sign Up
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter your details to login.
            </Typography>
            <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-3">
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        {"Enter username (should be unique)"}
                    </Typography>
                    <Input
                        name="username"
                        value={userDetails.username}
                        onChange={onChange}
                        size="md"
                        placeholder="jhonny"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        //   label="Enter username or email"
                        labelProps={{
                            className: "before:content-none after:content-none flex gap-2 px-4 justify-end",
                        }}
                        // required
                    />
                    {errors.username && <Typography className="-mt-3" color="red">{errors.username}</Typography>}
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                    {"Enter email (should be unique)"}
                    </Typography>
                    <Input
                        name="email"
                        value={userDetails.email}
                        onChange={onChange}
                        size="md"
                        placeholder="name@mail.com"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        //   label="Enter username or email"
                        labelProps={{
                            className: "before:content-none after:content-none flex gap-2 px-4 justify-end",
                        }}
                        // required
                    />
                    {errors.email && <Typography className="-mt-3" color="red">{errors.email}</Typography>}
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Password
                    </Typography>
                    <Input
                        name="password"
                        value={userDetails.password}
                        onChange={onChange}
                        type={showPassword ? "text" : "password"}
                        size="md"
                        placeholder="********"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none flex gap-2 px-4 justify-end",
                        }}
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
                        // required
                    />
                    {errors.password && <Typography className="-mt-3" color="red">{errors.password}</Typography>}
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Confirm Password
                    </Typography>
                    <Input
                        name="confirm_password"
                        type="password"
                        value={userDetails.confirm_password}
                        onChange={onChange}
                        size="md"
                        placeholder="*******"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none flex gap-2 px-4 justify-end",
                        }}
                        // required
                    />
                    {errors.confirm_password && <Typography className="-mt-3" color="red">{errors.confirm_password}</Typography>}
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        {"Enter name (Optional)"}
                    </Typography>
                    <Input
                        name="name"
                        value={userDetails.name}
                        onChange={onChange}
                        size="md"
                        placeholder="name@mail.com"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none flex gap-2 px-4 justify-end",
                        }}
                    />
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        {"Upload Profile Pic (Optional)"}
                    </Typography>
                    <Input
                        variant="standard"
                        type="file"
                        name="profile_pic_file"
                        onChange={handleFileChange}
                    />
                </div>
                <Checkbox
                    name="checkbox"
                    ripple={false}
                    label={
                        <Typography
                            variant="small"
                            color="gray"
                            className="flex items-center font-normal"
                        >
                            I agree the
                                &nbsp;Terms and Conditions
                        </Typography>
                    }
                    containerProps={{ className: "-ml-2.5" }}
                    checked={checkboxChecked}
                    onChange={()=>setCheckboxChecked(prev=>!prev)}
                    // required
                />
                {errors.checkbox && <Typography className="-mt-3" color="red">{errors.checkbox}</Typography>}
                <Button type={loading ? "button" : "submit"} className="mt-6" fullWidth>
                    {loading ? "Processing..." : "Sign Up"}
                </Button>
                {
                    !loading &&
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Already have an account?{" "}
                        <Link to={"/signin"} className="font-medium text-gray-900">
                            Sign In
                        </Link>
                    </Typography>
                }

            </form>
        </Card>
    );
}

const SignUp = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <SignUpForm />
        </div>
    )
}

export default SignUp