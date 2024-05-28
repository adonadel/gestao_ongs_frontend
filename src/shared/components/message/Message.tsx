import { Alert, AlertColor, Snackbar } from "@mui/material";
import React from "react";

type messageProps = {
    message: string,
    type: string,
    open: boolean
}

export const Message: React.FC<messageProps> = ({ message, type = "success", open }) => {

    return (
        <Snackbar open={open} autoHideDuration={500} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert
                severity={type as AlertColor}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}
