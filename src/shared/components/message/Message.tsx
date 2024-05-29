import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { useEffect } from "react";

type messageProps = {
    message: string,
    type?: string,
    open: boolean,
    onClose: () => void
}

export const Message: React.FC<messageProps> = ({ message, type = "success", open, onClose }) => {

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    return (
        <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={onClose}>
            <Alert
                severity={type as AlertColor}
                variant="filled"
                sx={{ width: '100%' }}
                onClose={onClose}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}
