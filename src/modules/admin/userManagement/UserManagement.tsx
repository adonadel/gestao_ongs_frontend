import { Avatar, Stack, TextField } from "@mui/material";
import { useUserStore } from "../../../shared/store/authStore";
import { Logout } from "../../logout/Logout";

export const UserManagement = () => {
    const { authenticated, nameStored, emailStored } = useUserStore();

    return authenticated && (
        <Stack spacing={2}>
            <Avatar />
            <TextField label="Email" value={emailStored} disabled />
            <TextField label="Nome" value={nameStored} />
            <Logout />
        </Stack>
    )
}