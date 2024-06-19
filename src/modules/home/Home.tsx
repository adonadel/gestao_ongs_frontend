import React from 'react';
import { HeaderBanner } from '../../shared/headerBanner/HeaderBanner';
import { Grid, Container } from '@mui/material';
import { CardTransparency } from '../../shared/components/card/CardTransparency';
import { CardAdoption } from '../../shared/components/card/CardAdoption';
import { CardDonate } from '../../shared/components/card/CardDonate';
import { EventsCarousel } from '../../shared/components/carousel/EventsCarousel';
import { GridAnimalsForAdoption } from '../../shared/components/animals/GridAnimalsForAdoption';

const Home: React.FC = () => {        
    return (
        <>
            <HeaderBanner></HeaderBanner>
            <Container maxWidth="lg">

                <Grid container spacing={4} justifyContent={'center'} alignItems={'strech'}>
                    <Grid item xs={12} sm={8} md={4} lg={3}>
                        <CardAdoption />
                    </Grid>

                    <Grid item xs={12} sm={8} md={4} lg={3}>
                        <CardDonate />
                    </Grid>

                    <Grid item xs={12} sm={8} md={4} lg={3}>
                        <CardTransparency />
                    </Grid>
                </Grid>


                <Grid container sx={{
                    paddingY: 10,
                }}>
                    <Grid item xs={12} >
                        <EventsCarousel />
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <GridAnimalsForAdoption />
                    </Grid>
                </Grid>


                <br /><br /><br /><br /><br /><br /><br /><br />
            </Container>

        </>
    );
};

export default Home;