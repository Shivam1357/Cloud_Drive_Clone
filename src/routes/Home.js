import { AppBar, Avatar, Button, CircularProgress,  Divider,  MenuItem, Popover, Toolbar, Typography } from '@mui/material'
import { deepOrange } from '@mui/material/colors'
import React, {  useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

import Folders from '../components/Home/Folders';
import BottomFunctionButtons from '../components/Home/BottomFunctionButtons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';




export default function Home() {
    document.body.style.backgroundColor = 'white';
    document.title = "All Files";

    const urlParams = new URLSearchParams(window.location.search);
    const [userUid, setUserUid] = useState("");

    const auth = getAuth();
    const history = useNavigate();
    const pathNameOfUrl = window.location.pathname;
    const folderStructure =urlParams.get('n');

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsLoggedIn(true);
            setUserUid(user.uid);
            if (pathNameOfUrl === "/"){
                history.push("/cloudFiles/" + auth.currentUser.uid + "/AllFiles");
            }
        }
        else{
            setIsLoggedIn(false);
            setTimeout(() => {
                var b = `/login?continue=${pathNameOfUrl}`;
                history.push(b);
            }, 500);
        }
	});

    return(
        <div>
            <TopBar 
                history={history} 
                userUid={userUid}  />
            <BottomFunctionButtons 
                pathNameOfUrl={pathNameOfUrl}
                 />

            {isLoggedIn ?
                <div 
                    style={{
                        marginTop:20,
                        marginLeft:10,
                        marginRight:20,
                        marginBottom:20,
                }}>
                    <Folders 
                        userUid={auth.currentUser.uid} 
                        pathNameOfUrl={pathNameOfUrl}
                        history={history}
                        folderStructure={folderStructure} />
                </div>
            :
            <div style={{
                display:'flex',
                flexDirection:'column',
                justifyContent:"center",
                paddingTop:20
            }}>
            <CircularProgress 
                style={{
                    alignSelf:'center'
                }} />    
            </div>
        }
        <div 
            style={{
                display:'flex',
                justifyContent:'center',
                paddingTop:30
            }}>
            <span 
                style={{
                    fontSize:13,
                    fontWeight:"bold",
                    textAlign:'center',
                    marginBottom:20
                }}>
                Designed and Developed by<br/>Shivam Jaiswal
            </span>
        </div>

        </div>
    )
}

function TopBar({history, userUid}){

    const [profilePicturePopOverOpen, setProfilePicturePopOverOpen] = useState(false);

    const [nameOfUser, setNameOfUser] = useState("");

    const auth = getAuth();

    useEffect(() => {
        if (userUid){
            GetDoc()
            .then((data) =>{
                setNameOfUser(data.nameOfUser)
            })
            .catch((e) =>{
                console.log("err")
            })
        }
    }, [userUid])

    async function GetDoc(){
        const docRef = doc(db, "cloudFiles", userUid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
                return docSnap.data();
        }
    }
    
    function LogoutClicked(){
        signOut(auth)
        .then(() => {
            var b = "/login?logoutSuccess=true";
            history.replace(b);
        })
        .catch((error) => {

        });
    }

    return(
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Your Files
                </Typography>
                
                <Button 
                    color="inherit"
                    onClick={() => setProfilePicturePopOverOpen(true)} >
                    <Avatar sx={{ bgcolor: deepOrange[500] }}>
                        {nameOfUser ? nameOfUser.charAt(0) : "S"}
                    </Avatar>
                </Button>
                <Popover
                    open={profilePicturePopOverOpen}
                    onClose={() => setProfilePicturePopOverOpen(false)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    style={{
                        top:40,
                    }}
                    >
                        <div>
                            {nameOfUser &&
                                <div style={{
                                    width:150,
                                    display:'flex',
                                    justifyContent:'center',
                                    paddingTop:10,
                                    alignItems:'center',
                                    flexDirection:'column'
                                }}>
                                    <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                        {nameOfUser && nameOfUser.charAt(0)}
                                    </Avatar>
                                    <span style={{
                                        marginTop:5,
                                        marginBottom:5
                                    }}>
                                        {nameOfUser}
                                    </span>
                                </div>
                            }
                            <Divider/>
                            <MenuItem 
                                onClick={LogoutClicked} >
                                Logout
                            </MenuItem>
                        </div>
                </Popover>
            </Toolbar>
        </AppBar>
    )
}
