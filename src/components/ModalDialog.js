import { Button, DialogActions, DialogContent, DialogTitle, Dialog, DialogContentText, Input } from "@mui/material";


export default function ModalDialog ({
    dialogOnClose,
    title,
    titleColor,
    message,
    inputDisplay,
    inputText,
    setInputText,
    firstButtonText,
    firstButtonTextColor,
    firstButtonOnClick,
    firstButtonAutoFocus,
    secondButtonText,
    secondButtonTextColor,
    secondButtonOnClick,
    secondButtonAutoFocus,
    thirdButtonText,
    thirdButtonTextColor,
    thirdButtonOnClick,
    thirdButtonAutoFocus
    }){
        

return (
    <Dialog
        open={true} 
        onClose={() => dialogOnClose()}>
        <DialogTitle style={{color:titleColor}}>{title}</DialogTitle>
        <DialogContent>
            {message &&
                <DialogContentText>
                    {message}
                </DialogContentText>
            }
            {inputDisplay &&
                <Input
                    value={inputText}
                    autoFocus={true}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={"Folder name"}
                />
            }
        </DialogContent>
        <DialogActions>
            {firstButtonText &&
                <Button onClick={firstButtonOnClick} color={firstButtonTextColor} autoFocus={firstButtonAutoFocus}>
                    {firstButtonText}
                </Button>    
            }
            {secondButtonText &&
                <Button onClick={secondButtonOnClick} color={secondButtonTextColor} autoFocus={secondButtonAutoFocus}>
                    {secondButtonText}
                </Button>
            }
            {thirdButtonText &&
                <Button onClick={thirdButtonOnClick} color={thirdButtonTextColor} autoFocus={thirdButtonAutoFocus}>
                    {thirdButtonText}
                </Button>
            }
        </DialogActions>
    </Dialog>
)
}
