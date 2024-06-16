import React from 'react';
import { Box } from '@mui/material';

interface TagTitleProps {
    backgroundColor: string;
    icon: React.ElementType;
    iconColor: string;
}

const TagTitle = ({ backgroundColor, icon: Icon, iconColor }: TagTitleProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: backgroundColor,
                padding: '1rem',                
                borderRadius: '20%',
            }}
        >
            {Icon && <Icon sx={{ color: iconColor}} />}

        </Box>
    );
};

export default TagTitle;
