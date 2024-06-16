import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAuthStore from "../../shared/store/authStore";

interface ILogoutModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const LogoutModal = (props: ILogoutModalProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.setLogout);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    props.setOpen(false);
    navigate('/');
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle>Sair?</DialogTitle>
      <DialogContent>
        <Typography>
          Você quer sair da conta?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button color="error" disabled={loggingOut} onClick={handleLogout}>
          {loggingOut ? <CircularProgress size={20} /> : "Confirmar"}
        </Button>
        <Button color="success" disabled={loggingOut} onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const Logout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button fullWidth variant="contained" color="error" onClick={() => setOpen(true)}>
        Sair
      </Button>
      <LogoutModal open={open} setOpen={setOpen} />
    </>
  );
}