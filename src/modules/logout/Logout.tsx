import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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

  const handleLogout = () => {
    logout();
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