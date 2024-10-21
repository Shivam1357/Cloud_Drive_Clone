import FolderIcon from '@mui/icons-material/Folder';
import { Button, Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SkeletonDisplay from './SkeletonDisplay';
import { getStorage, ref,  getDownloadURL , deleteObject} from "firebase/storage";
import { Close, Delete } from '@mui/icons-material';
import "./FileDisplay.css";
import ModalDialog from '../ModalDialog';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';


export default function Files({pathNameOfUrl, folderData, dataLoaded,
    setSnackBarOpen, setSnackBarText, setSnackBarType}) {

    const [nameOfFileToOpen, setNameOfFileToOpen] = useState("");
    const [idOfOpenedFile, setIdOfOpenedFile] = useState("");
    const [urlOfOpenedFile, setUrlOfOpenedFile] = useState("");

    const [fileNotFound, setFileNotFound] = useState(false);

    const storage = getStorage();


    useEffect(() => {
        if (nameOfFileToOpen){
            getDownloadURL(ref(storage, `${pathNameOfUrl}/${nameOfFileToOpen}`))
            .then((url) => {
                setUrlOfOpenedFile(url);
            })
            .catch((error) => {
                if (error.code === "storage/object-not-found"){
                    setFileNotFound(true);
                    setSnackBarText(`File not Found, Delete the Icon`)
                    setSnackBarType("error");
                    setSnackBarOpen(true);
                }
                else{
                    setSnackBarText(`Some Error Occurred`)
                    setSnackBarType("error");
                    setSnackBarOpen(true);
                }
                
            }
            )
        }
    }, [nameOfFileToOpen])

    function DeleteFileClicked(){
        if (fileNotFound){
            DeleteDocOfFile()
        }
        else{
            DeleteFileOfFile()
        }
    }


    function DeleteFileOfFile() {
        // Delete the file
        deleteObject(ref(storage, `${pathNameOfUrl}/${nameOfFileToOpen}`))
        .then(() => {
            // File deleted successfully
            DeleteDocOfFile();
        })
        .catch((error) => {
            setSnackBarText(`Some Error Occurred`)
            setSnackBarType("error");
            setSnackBarOpen(true);
            // Uh-oh, an error occurred!
        });
    }
    function DeleteDocOfFile(){
        DeleteDoc({location:`${pathNameOfUrl}/${idOfOpenedFile}`})
        .then(() =>{
            setSnackBarText(`Successfully Deleted ${nameOfFileToOpen} ${fileNotFound ? "icon" : "file" }`)
            setSnackBarType("success");
            setSnackBarOpen(true);
            setFileNotFound(false);
            setNameOfFileToOpen("");
            setUrlOfOpenedFile("");
        })
        .catch(() =>{
            setSnackBarText(`Some Error Occurred`)
            setSnackBarType("error");
            setSnackBarOpen(true);
        })
    }


    async function DeleteDoc({location}){
        await deleteDoc(doc(db, location));
    }
    
    return (
        <div>
            {nameOfFileToOpen &&
                <FileDisplay 
                    url={urlOfOpenedFile}
                    nameOfFileToOpen={nameOfFileToOpen}
                    setNameOfFileToOpen={setNameOfFileToOpen}
                    setUrlOfOpenedFile={setUrlOfOpenedFile}
                    DeleteFileClicked={DeleteFileClicked}
                    fileNotFound={fileNotFound}
                    setFileNotFound={setFileNotFound}
                    />
            }


             {folderData.length !== 0
                ? 
                <div>
                    {folderData
                    .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
                    .filter(f=> f.type === "file").map((f) =>
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
                            icon={CheckFileIsImage(f.name) ? <ImageIcon/> : <UploadFileIcon/>}
                            variant="outlined" 
                            onClick={() =>{ setNameOfFileToOpen(f.name);setIdOfOpenedFile(f.id)}}/>
                    )}
                </div>
            : 
                !dataLoaded && <SkeletonDisplay/>
            }
        </div>
    )
}


function FileDisplay({url, nameOfFileToOpen, setNameOfFileToOpen, setUrlOfOpenedFile,
                     DeleteFileClicked,fileNotFound, setFileNotFound
                     }){

    CheckFileIsImage(nameOfFileToOpen);


    const [deleteDialogAlert, setDeleteDialogAlert] = useState(false);




    return(
        <div style={{
            height:"100%",
            width:"100%",
            position:'fixed',
            zIndex:1,
            top:0,
            left:0,
            display:'flex',
            justifyContent:'center',
        }}>
            {deleteDialogAlert &&
                <ModalDialog
                    
                    title={"Alert"}
                    message=
                    {`Are You Sure to Delete \`${nameOfFileToOpen}\` file?`}
                    firstButtonAutoFocus={false}
                    firstButtonText={"Yes"}
                    firstButtonOnClick={DeleteFileClicked}
                    secondButtonAutoFocus={true}
                    secondButtonOnClick={() =>setDeleteDialogAlert(false)}
                    dialogOnClose={() => setDeleteDialogAlert(false)}
                    secondButtonText={"No"}/>
            }
            <div 
                className='secondDiv'
                style={{
                    backgroundColor:"white",
                    marginTop:100,
                    marginBottom:50,
                    padding:10,
                    display:"flex",
                    flexDirection:'column',
                    justifyContent:"flex-start",
                    borderWidth:1,
                    borderStyle:'groove',
                    marginLeft:2,
                    marginRight:2,
                    borderRadius:10
                }}>
                    <div style={{display:'flex',justifyContent:"space-between"}}>
                        <div style={{
                            width:200,
                            overflowX:"auto",
                            whiteSpace:'nowrap',
                        }}>
                            {nameOfFileToOpen}
                        </div>
                        <Button 
                            onClick={() => {setUrlOfOpenedFile("");setNameOfFileToOpen("");setFileNotFound(false)}}
                            >
                            <Close/>
                        </Button>
                    </div>

                    {/* <iframe
                     */}
                    {CheckFileIsImage(nameOfFileToOpen) 
                    ?
                    <img
                        alt= {fileNotFound ? "File Not Found" : "Loading..."} 
                        style={{
                            maxWidth: "100%",
                            maxHeight: "82%",
                            width: "auto",
                            height: "auto",
                            borderWidth:2,
                            borderStyle:'groove',
                            marginLeft:2,
                            marginRight:2
                        }}
                        src={url}
                    />
                    :
                    <iframe 
                        title='fileDisplay'
                        style={{
                            width: "auto",
                            height: "90%",
                            borderWidth:2,
                            borderStyle:'groove',
                            marginLeft:2,
                            marginRight:2
                        }}
                        src={url}
                    />
                    }

                    <div 
                        style={{
                            display:'flex',
                            flexDirection:'row',
                            justifyContent:"flex-start"
                    }}>
                        <Button 
                            onClick={() => setDeleteDialogAlert(true)}>
                            <Delete/>
                        </Button>
                    </div>

            </div>

        </div>
    )
}

function CheckFileIsImage(name){
    var a = name.slice(name.lastIndexOf(".") , name.length);
    if (a === ".jpg" || a === ".jpeg" || a === ".png" ){
        return true
    }
    else{
        return false
    }
}