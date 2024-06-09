import { Avatar, Stack, TextField } from "@mui/material";
import useAuthStore from "../../../shared/store/authStore";
import { Logout } from "../../logout/Logout";

export const UserManagement = () => {
    const { userData } = useAuthStore((state) => ({
        userData: state.userData,
    }));

    return (
        <Stack spacing={2}>
            <Avatar src={`https://drive.google.com/thumbnail?id=${userData?.person.profile_picture?.filename_id}`} />
            <TextField label="Email" value={userData?.person.email} disabled />
            <TextField label="Nome" value={userData?.person.name} />
            <Logout />
        </Stack>
    )
}