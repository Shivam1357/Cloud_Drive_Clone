import { SpeedDial, SpeedDialAction, SpeedDialIcon  } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import ModalDialog from "../ModalDialog";
import SnackbarDisplay from "../Snackbar";
import FolderIcon from '@mui/icons-material/Folder';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadProgressDisplay from "./UploadProgressDisplay";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";


export default function BottomFunctionButtons({pathNameOfUrl}){
    

    const storage = getStorage();

    const [createNewFolderDialogOpen, setCreateNewFolderDialogOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    const uploadInputRef = useRef();

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarText, setSnackBarText] = useState("");
    const [snackBarType, setSnackBarType] = useState("");

    const [monitorUploadOpen, setMonitorUploadOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [noOfFilesToUpload, setNoOfFilesToUpload] = useState(null);
    const [indexOfFileUploading, setIndexOfFileUploading] = useState(null);


    const [fileLoc, setFileLoc] = useState([]);

    function createNewFolderClicked(){
        AddDoc({type:"folder", name:newFolderName})
        .then(() =>{
            setCreateNewFolderDialogOpen(false);
            setNewFolderName("");
            setSnackBarText("Folder Successfully Created");
            setSnackBarType("success");
            setSnackBarOpen(true);
        })
        .catch((e) =>{
            setSnackBarText("Some Error Occured");
            setSnackBarType("error");
            setSnackBarOpen(true);
        })
    }
    async function AddDoc({type,name}){
        await addDoc(collection(db, pathNameOfUrl), {
            type:type,
            name:name
        });
    }

    useEffect(() => {
        if (fileLoc.length !== 0){
            setMonitorUploadOpen(true);
            setNoOfFilesToUpload(fileLoc.length);

            var i = 0;
            var b = fileLoc.length;
            while (i < b){
                setIndexOfFileUploading(i + 1)
                UploadFiles(fileLoc[i]);
                i = i + 1
            }
        }
    },[fileLoc]);


    function UploadFiles(file){
    
        const storageRef = ref(storage, `${pathNameOfUrl}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                //const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //setUploadProgress(((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (progress>95){
                    setUploadProgress(Math.round(progress-1));
                }
                else{
                    setUploadProgress(Math.round(progress));
                }

                //console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                default: case 'running':
                    console.log('Upload is running');
                    break;
                }
            }, 
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                default:case 'storage/canceled':
                    // User canceled the upload
                    break;
                // ...
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
            }, 
            () => {
                AddDoc({type: "file" , name: file.name})
                    .then(() =>{
                        if (indexOfFileUploading === noOfFilesToUpload){
                            //console.log('qqqq');
                            setMonitorUploadOpen(false);
                            setFileLoc([]);
                            setSnackBarText("Files Successfully Uploaded");
                            setSnackBarType("success");
                            setSnackBarOpen(true);
                        }
                    })
                    .catch(() => {

                    })
                // Upload completed successfully, now we can get the download URL
                // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                // console.log('File available at', downloadURL);
                // });
            }
        );
    }

    return(
        <div>
            {snackBarOpen &&
                <SnackbarDisplay 
                    open={snackBarOpen}
                    onClose={() => setSnackBarOpen(false)}
                    message={snackBarText}
                    type={snackBarType}
                    autoHideDuration={4000}/>
            }
            {monitorUploadOpen &&
                <UploadProgressDisplay
                    uploadProgress={uploadProgress}
                    setMonitorUploadOpen={setMonitorUploadOpen}
                    noOfFilesToUpload={noOfFilesToUpload}
                    indexOfFileUploading={indexOfFileUploading}
                    />
            }
            


            {createNewFolderDialogOpen &&
                <ModalDialog
                    title={"Create New Folder"}
                    dialogOnClose={() => setCreateNewFolderDialogOpen(false)}
                    inputDisplay={true}
                    inputText={newFolderName}
                    setInputText={setNewFolderName}
                    firstButtonText={"Create"}
                    firstButtonAutoFocus={true}
                    firstButtonOnClick={createNewFolderClicked}
                    secondButtonText={"Close"}
                    secondButtonAutoFocus={false}
                    secondButtonOnClick={() => {setNewFolderName("");setCreateNewFolderDialogOpen(false)}}
                    />
            }
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />} >
                    <SpeedDialAction
                        key={'newFolder'}
                        icon={<FolderIcon/>}
                        tooltipTitle={"Create New Folder"}
                        onClick={() => setCreateNewFolderDialogOpen(true)}
                        />

                    <SpeedDialAction
                        key={'uploadFile'}
                        icon={<FileUploadIcon/>}
                        tooltipTitle={"Upload File"}
                        onClick={() => {setFileLoc([]); uploadInputRef.current.click()}}>
                    </SpeedDialAction>
            </SpeedDial>
            <input 
                //multiple={true}
                type="file" 
                ref={uploadInputRef} 
                style={{display:'none'}}
                onChange={(e) => {setFileLoc(e.target.files)}}/>
        </div>
    )
}
