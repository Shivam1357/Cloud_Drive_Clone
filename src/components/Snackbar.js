import { Alert, Snackbar } from '@mui/material'
import React from 'react'

export default function SnackbarDisplay({
    open,
    onClose,
    message,
    type,
    autoHideDuration,
}) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose} >
                <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
                    {message}
                </Alert>
        </Snackbar>
  )
}
