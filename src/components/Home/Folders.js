import React, { useEffect, useState  } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import {db} from "../../firebase";
import { Button, Chip, Divider} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import FolderIcon from '@mui/icons-material/Folder';
import { Delete, Home } from '@mui/icons-material';
import ModalDialog from '../ModalDialog';
import SnackbarDisplay from '../Snackbar';
import Files from './Files';
import SkeletonDisplay from './SkeletonDisplay';
import { async } from '@firebase/util';


export default function Folders({userUid, pathNameOfUrl, history, folderStructure}) {
    var n = folderStructure ? folderStructure.slice(folderStructure.lastIndexOf("/") + 1 , folderStructure.length) : "";
    const [nameOfFolder, setNameOfFolder] = useState(n);

    document.title = folderStructure ? nameOfFolder : "Home";

    const [deleteDialogAlert, setDeleteDialogAlert] = useState(false);

    const [dataLoaded, setDataLoaded] = useState(false);

	const [folderData, setFolderData] = useState([]);

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarText, setSnackBarText] = useState("");
    const [snackBarType, setSnackBarType] = useState("");

    const [renameFolderNameOpen, setRenameFolderNameOpen] = useState(false);
    const [tempNameOfFolder, setTempNameOfFolder] = useState(n);

    
    useEffect(() => {
        const q = query(collection(db, pathNameOfUrl) );
        onSnapshot(q, (querySnapshot) => {
            setDataLoaded(true);
            const cities = [];
            querySnapshot.forEach((doc) => {
                var a = doc.data();
                a['id'] = doc.id;
                cities.push(a);
            });
            setFolderData(cities);
            });
            
    }, [pathNameOfUrl])
    

    function DeleteFolderClicked(){
        deleteDocFolder({docPath: pathNameOfUrl.slice(0,pathNameOfUrl.lastIndexOf("/"))})
        .then(() =>{
            setSnackBarOpen(true);
            setSnackBarText("Successfully Deleted folder");
            setSnackBarType("success");
            setDeleteDialogAlert(false);
            setTimeout(() => {
                history.push("/cloudFiles/" + userUid + "/AllFiles")
            }, 500);
        })
        .catch((e) => {
            setSnackBarOpen(true);
            setSnackBarText("Some Error Occurred");
            setSnackBarType("error");
            setDeleteDialogAlert(false);
            console.log(e)
        })        
    }

    async function deleteDocFolder({docPath}){
        await deleteDoc(doc(db, docPath));
    }


    function RenameFolderName(){
        //console.log();
        RenameFolder({path:pathNameOfUrl.slice(0,pathNameOfUrl.lastIndexOf("/"))})
        .then(() => {
            setNameOfFolder(tempNameOfFolder);
            setRenameFolderNameOpen(false);
        })
        .catch(() => {
            setSnackBarOpen(true);
            setSnackBarType("error");
            setSnackBarText("Some Error Occurred")
        })
    }
    async function RenameFolder({path}){
        const Ref = doc(db, path);
        // Set the "capital" field of the city 'DC'
        await updateDoc(Ref, {
            name : tempNameOfFolder
        });

    }


	return (
		<div>
            {deleteDialogAlert &&
                <ModalDialog 
                    
                    title={"Alert"}
                    message=
                    {`Are You Sure to Delete \`${nameOfFolder}\` folder?`}
                    
                    // message={"Are You Sure to Delete this " 
                    // + "`" + folderStructure.slice(folderStructure.lastIndexOf("/") + 1 , folderStructure.length) 
                    // + "`" + " folder?" }
                    firstButtonAutoFocus={false}
                    firstButtonText={"Yes"}
                    firstButtonOnClick={DeleteFolderClicked}
                    secondButtonAutoFocus={true}
                    secondButtonOnClick={() => {setDeleteDialogAlert(false)}}
                    dialogOnClose={() => {setDeleteDialogAlert(false)}}
                    secondButtonText={"No"}/>
            }
            {renameFolderNameOpen &&
                <ModalDialog 
                    title={"Rename"}
                    inputDisplay={true}
                    inputText={tempNameOfFolder}
                    setInputText={setTempNameOfFolder}
                    firstButtonAutoFocus={false}
                    firstButtonText={"Done"}
                    firstButtonOnClick={RenameFolderName}
                    secondButtonAutoFocus={false}
                    secondButtonOnClick={() => {setRenameFolderNameOpen(false);;setTempNameOfFolder(nameOfFolder)}}
                    dialogOnClose={() => {setRenameFolderNameOpen(false);setTempNameOfFolder(nameOfFolder)}}
                    secondButtonText={"Cancel"}/>
            }
            {snackBarOpen &&
                <SnackbarDisplay
                    open={snackBarOpen}
                    onClose={() => setSnackBarOpen(false)}
                    message={snackBarText}
                    type={snackBarType}
                    autoHideDuration={4000}/>
            }


            {folderStructure 
                    ?
                    <div>
            <Button
                style={{
                    marginLeft:-5,
                    marginTop:-20,
                    borderStyle:"groove",
                    borderWidth:0,
                    paddingLeft:0,
                    padding:0
                }}
                onClick={() => {
                    history.push("/cloudFiles/" + userUid + "/AllFiles")
                    // history.goBack();
                    // setTimeout(() => {
                    //     history.push(window.location.pathname);
                    // }, 200);
                    // 
                }}
                >
                    <Home style={{margin:0}}/> 
            </Button>
            <span 
                style={{
                    fontSize:20,
                    fontWeight:"bold",
                    marginBottom:5
                }}>
                    {folderStructure.slice(0 ,folderStructure.lastIndexOf("/") + 1) + nameOfFolder}
                    {/* {folderStructure} */}
            </span>
            </div>
            :
            <span 
                style={{
                    fontSize:20,
                    fontWeight:"bold"
                }}>Home</span>
            }
                    

            <Divider/>   
            <br/> 

            <div style={{
                display:"flex",
                flexDirection:'row',
                justifyContent:'space-between',

            }}>
                <div style={{
                    fontSize:20,
                    fontWeight:"500",
                }}>
                    Folders
                </div>
                {folderStructure &&
                    <div>
                        <Button
                            onClick={() => setRenameFolderNameOpen(true)}
                            >
                            <CreateIcon/>
                        </Button>
                        <Button 
                            onClick={() => setDeleteDialogAlert(true)}>
                            <Delete/>
                        </Button>
                    </div>
                }
            </div>
            
            <Divider/>
            {folderData.length !== 0
                ? 
                <div>
                    {folderData
                    .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
                    .filter(f=> f.type === "folder").map((f) =>
                        <Chip 
                            key={f.id}
                            style={{
                                height:50,
                                marginLeft:5,
                                marginRight:5,
                                marginTop:5,
                                marginBottom:5,
                                fontSize:15,
                                justifyContent:"flex-start",
                                paddingLeft:8,
                                paddingRight:8
                            }}
                            label={f.name}
                            icon={<FolderIcon/>}
                            //onClick={() => console.log("anaakj")}
                            onClick={() => 
                                {
                                    if (folderStructure){ 
                                        history.push(`${pathNameOfUrl}/${f.id}/AllFiles?n=${folderStructure.slice(0 ,folderStructure.lastIndexOf("/") + 1) + nameOfFolder}/${f.name}`) 
                                        //history.push(pathNameOfUrl + "/" + f.id + "/AllFiles" + "?n=" + folderStructure + "/" + f.name)
                                    }
                                    else{
                                        history.push(`${pathNameOfUrl}/${f.id}/AllFiles?n=Home/${f.name}`)
                                        //history.push(pathNameOfUrl + "/" + f.id + "/AllFiles" + "?n=" + "Home/" + f.name)
                                    }
                                }
                            }
                            variant="outlined" />
                    )}
                </div>
            : 
                !dataLoaded && <SkeletonDisplay/>
            }

            <Divider/>

            <br/>
            <br/>
        
			<span style={{
                fontSize:20,
                fontWeight:"500"
            }}>
                Files
            </span>
            <Divider/>
            

            <Files 
                pathNameOfUrl={pathNameOfUrl}
                folderData={folderData}
                dataLoaded={dataLoaded}
                setSnackBarOpen={setSnackBarOpen}
                setSnackBarText={setSnackBarText}
                setSnackBarType={setSnackBarType} /> 
            <Divider/>



		</div>
	)
}
