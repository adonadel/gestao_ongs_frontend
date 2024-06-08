import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from "../../shared/store/authStore";

interface ILogoutModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const LogoutModal = (props: ILogoutModalProps) => {
  const navigate = useNavigate();
  const deauthenticate = useUserStore((state) => state.deauthenticate);

  const handleLogout = () => {
    localStorage.removeItem('token');
    deauthenticate();
    props.setOpen(false);
    navigate('/');
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle>Sair?</DialogTitle>
      <DialogContent>Você quer sair da conta?</DialogContent>
      <DialogActions>
        <Button color="warning" onClick={handleLogout}>Sim</Button>
        <Button color="success" onClick={() => props.setOpen(false)}>Não</Button>
      </DialogActions>
    </Dialog>
  );
}

export const Logout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" color="error" onClick={() => setOpen(true)}>Sair</Button>
      <LogoutModal open={open} setOpen={setOpen} />
    </>
  );
}