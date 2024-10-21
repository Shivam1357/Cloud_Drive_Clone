import React, { useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Input } from '@mui/material';
import "./Login.css";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    document.body.style.backgroundColor = 'rgb(254, 206, 168)';
    document.title = "Login";

    const [loginInProgress, setLoginInProgress] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertType, setAlertType] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const auth = getAuth();
    const history = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        var chkLogout = urlParams.get('logoutSuccess');
        if (chkLogout){
            setAlertText("Successfully Logged out");
            setAlertType("success");
        }
        var chkContinue = urlParams.get("continue");
        if (chkContinue !== "/" && chkContinue){
            setAlertText("Login to Continue");
            setAlertType("error");
        }
    }, [])

    
	onAuthStateChanged(auth, (user) => {
        if (user) {
            var chkContinue = urlParams.get("continue");
            if (chkContinue){
                history.push(chkContinue);
            }
            else{
                history.push("/");
            }
        }
	});


    function FormSubmit(e){
        e.preventDefault();
        setLoginInProgress(true);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                //const user = userCredential.user;
                setAlertText("Successfully Logged in");
                setAlertType("success");
                setLoginInProgress(false);
                // ...
            })
            .catch((error) => {
                setAlertText(error.message.slice(22,error.message.length - 2).toUpperCase());
                setAlertType("error");
                setLoginInProgress(false);
            });
    }


    return (
        <div style={{
            display:"flex",
            flex:1,
            justifyContent:'center',
            alignSelf:'center',
            alignItems:'center',
            paddingTop:150,
            flexDirection:'column'
        }}>
            <form onSubmit={FormSubmit}>
                <div className='LoginBox' style={{
                    borderWidth:0,
                    borderStyle:"groove",
                    display:'flex',
                    flexDirection:'column',
                    width:300,
                    paddingTop:5,
                    paddingLeft:15,
                    paddingRight:15,
                    paddingBottom:5,
                    justifyContent:"space-evenly",
                    alignItems:'center',
                    height:alertText ? 300 : 250,
                    alignSelf:'center',
                    borderRadius:0,
                    backgroundColor:'white'
                }}>
                    <span 
                        style={{
                            fontSize:25
                    }}>Login
                    </span>
                    {alertText && 
                        <Alert severity={alertType}>{alertText}</Alert>
                    }
                    <Input  
                        style={{
                            width:270
                        }}
                        required={true}
                        placeholder='Email'
                        value={email}
                        onFocus={() => setAlertText("")}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" />
                    <Input 
                        style={{
                            width:270
                        }}
                        placeholder='Password'
                        required={true}
                        type="password"
                        value={password}
                        onFocus={() => setAlertText("")}
                        onChange={(e) => setPassword(e.target.value)} />
                    <Button
                        style={{
                            backgroundColor:'black',
                            color:'white',
                            borderRadius:2,
                        }}
                        variant="contained"
                        type="submit"
                        >
                        {loginInProgress ? <CircularProgress style={{color:'white'}} size={25} /> : "Login"}
                    </Button>
                </div>
            </form>
            <span 
                style={{
                    fontSize:13,
                    fontWeight:"bold",
                    textAlign:'center',
                    marginBottom:20,
                    marginTop:50
                }}>
                Designed and Developed by<br/>Shivam Jaiswal
            </span>
        </div>
    )
}
