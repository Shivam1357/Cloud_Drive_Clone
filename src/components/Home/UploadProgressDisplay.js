import { Box, CircularProgress, Dialog, DialogContent, Typography } from '@mui/material'
import React from 'react'



export default function UploadProgressDisplay({uploadProgress, setMonitorUploadOpen,
     noOfFilesToUpload, indexOfFileUploading}) {

    return (
        <Dialog open={true}>  
            <DialogContent>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        style={{
                            height:100,
                            width:100,
                        }}
                        variant="determinate" 
                        value={uploadProgress} />
                    <Box
                        sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        }}
                    >
                        <Typography style={{fontSize:17}} variant="caption" component="div" color="text.secondary">
                        {`${uploadProgress}%`}
                        </Typography>
                    </Box>
                </Box>
                <br/>
                <div style={{textAlign:'center', marginTop:10}}>
                    Uploading {indexOfFileUploading}/{noOfFilesToUpload}
                </div>
            </DialogContent>
        </Dialog>
    )
}
