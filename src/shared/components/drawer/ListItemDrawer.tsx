import { Box, ButtonBase, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface IListItemProps {
    open?: boolean;
    to?: string;
    selected?: boolean;
    icon: React.ReactNode;
    text: string;
    onClick?: () => void;
}

export const ListItemDrawer = (props: IListItemProps) => {
    return (
        <ListItemButton
            component={props.to ? Link : ListItemButton}
            to={props.to}
            selected={props.selected}
            onClick={props.onClick}
            disableRipple={!props.open}
            sx={{
                width: "95%",
                height: 54,
                borderRadius: '10px',
                marginLeft: "5px",
                marginBottom: "16px",
                '&.Mui-selected': {
                    backgroundColor: props.open ? 'secondary.main' : 'transparent',
                },
                '&.Mui-selected:hover': {
                    backgroundColor: props.open ? 'secondary.main' : 'transparent',
                },
            }}
        >
            <ListItemIcon
                aria-label="open drawer"
                sx={{
                    color: props.selected ? 'primary.main' : 'secondary.main',
                }}
            >
                <ButtonBase disableRipple={props.open ? true : false}>
                    <Box sx={{
                        padding: '10px',
                        backgroundColor: props.selected ? 'secondary.main' : 'transparent',
                        display: 'flex',
                        borderRadius: '10px',
                    }}>
                        {props.icon}
                    </Box>
                </ButtonBase>
            </ListItemIcon>
            <ListItemText
                primary={
                    <Typography
                        sx={{
                            marginLeft: '5px',
                            fontSize: '1.125rem',
                            fontWeight: "500",
                            color: props.selected ? 'primary.main' : 'secondary.main'
                        }}>
                        {props.text}
                    </Typography>}
            />
        </ListItemButton>
    );
}