import { Avatar, Box, Typography } from "@mui/material"


export const HeaderBanner = () => {
    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: { xs: 'flex-end', md: 'center' },
            gap: '1rem',
            height: '400px',
            maxHeight: '400px',
            width: '100%',            
            backgroundColor: 'background.default',
            color: 'text.primary',
        }}>


            <Typography variant="h5" component="h2" gutterBottom sx={{
                zIndex: 1,
                color: { xs: 'primary.main', md: 'primary.main' },
                fontWeight: 800,
                fontSize: { xs: '1.2rem', md: '2rem' },
                marginLeft: { xs: '0rem', md: '4rem' },
                width: 'fit-content',
                padding: { xs: '1rem 1.5rem', md: '0rem' },
                borderRadius: '1rem',

                backgroundColor: { xs: '#32bfba25', md: 'transparent' },
                backdropFilter: { xs: 'blur(10px)', md: 'none' },
                boxShadow: { xs: '0 0 10px 0 rgb(255 255 255 / 42%)', md: 'none' },
            }}

            >
                "Amor pela vida, <br /> amor por amparar."
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: { xs: '0rem', md: '4rem' },
                zIndex: 1,
            }}>
                <Typography variant="h1" component="h1" sx={{
                    color: 'primary.main',
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    marginBottom: { xs: '4rem', md: '0rem' },
                    alignItems: 'center',
                    borderRadius: '1rem',
                    padding: { xs: '1rem 1.5rem', md: '1rem' },
                    backgroundColor: { xs: 'primary.main', md: 'transparent' },
                }}>

                    <Avatar src='public\logoPatinhas.svg' sx={{
                        width: { xs: '3rem', md: '4rem' },
                        height: { xs: '3rem', md: '4rem' },
                    }} />

                    <Typography variant="h2" component="h3">
                        <Typography variant="h5" component="h3" sx={{
                            fontWeight: 800,
                            color: { xs: 'secondary.main', md: 'primary.main' },
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
                        }}>
                            Patinhas Carentes
                        </Typography>

                        <Typography sx={{
                            fontWeight: 500,
                            color: { xs: 'secondary.main', md: 'primary.main' },
                        }}>
                            Braço do Norte - SC
                        </Typography>

                    </Typography>

                </Typography>

            </Box>

            <picture style={{
                position: 'absolute',
                marginBottom: '32px',
                width: '100%',
                height: '100%',
                userSelect: 'none',
            }}>
                <source media="(max-width: 600px)" srcSet="public\background-header-mobile.png" />
                <source media="(max-width: 1200px)" srcSet="public\background-header-tablet.png" />
                <img
                    src="public/background-header.jpg"
                    alt="Banner"
                    style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        maxHeight: '400px',
                        maxWidth: '100vw',

                    }}

                />
            </picture>


        </Box>
    )
}