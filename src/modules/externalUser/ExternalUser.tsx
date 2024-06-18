import { Avatar, Box, Grid, Paper, TextField } from "@mui/material";
import useAuthStore from "../../shared/store/authStore";
import { Logout } from "../logout/Logout";

export const ExternalUser = () => {
    const { userData } = useAuthStore((state) => ({
        userData: state.userData,
    }));

    return (
        <Grid container justifyContent="center" alignItems="center" >
            <Grid item xs={10} sm={8} md={6} lg={4} >
                <Paper elevation={3} sx={{ padding: '40px', borderRadius: '20px' }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Grid item xs={12} >
                            <Avatar src={`https://drive.google.com/thumbnail?id=${userData?.person.profile_picture?.filename_id}`} sx={{ width: '180px', height: '180px', marginBottom: '48px' }} />
                        </Grid>
                        <Grid item sx={{ width: '100%' }} >
                            <TextField
                                label="Email"
                                value={userData?.person.email}
                                disabled
                                fullWidth
                                margin="normal"
                                sx={{
                                    'fieldset': { borderRadius: '6px' },
                                }}
                            />
                        </Grid>
                        <Grid item sx={{ width: '100%' }}>
                            <TextField
                                label="Nome"
                                value={userData?.person.name}
                                fullWidth
                                margin="normal"
                                sx={{
                                    'fieldset': { borderRadius: '6px' },
                                }}
                            />
                        </Grid>
                        <Logout />
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}