import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { FcGoogle } from "react-icons/fc";

const LandingPage = () => {

    const onGoogleSuccess = async (tokenResponse) => {
        const { access_token } = tokenResponse;
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const user = res.data;
        console.log(user.email);
        console.log(user.email_verified);
        console.log(user.given_name);
        console.log(user.family_name);
        console.log(user.name);
        console.log(user.picture);
    }

    const login = useGoogleLogin({
        onSuccess: onGoogleSuccess,
        onError: () => console.log("Login Failed"),
    });


    return (
        <div>
            {/* <button>Continue with google</button><br /> */}
            <button onClick={login}>Continue with google</button><br /><br />

            <button>Continue with Phone</button>
            <div>OR</div><br />
            <div>
                <label htmlFor="Email">Email:</label><br />
                <input type="text" placeholder='Enter your email' />
            </div>
            <br />
            <button>Continue</button>
        </div>
    )
}

export default LandingPage