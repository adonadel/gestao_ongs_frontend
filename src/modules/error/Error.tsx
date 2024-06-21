import { Home } from "@mui/icons-material";
import { Container, Grid, Typography, Button, CardMedia, Card, CardContent, CardActions } from "@mui/material";

function ErrorPage() {
  return (
    <Container>
      <Grid container justifyContent={"center"}>
        <Grid xs={12} md={8} justifyContent={"center"}>

          <Card sx={{
            marginTop: "2rem",
            borderRadius: "1rem",
            backgroundColor: "primary",
            border: "1px solid #f5f5f5",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 10%), 0 2px 4px 0 rgb(0 0 0 / 10%)",                                              
          }}>
            <CardMedia
              sx={{ height: 425 }}
              image="/background-header-mobile.png"
              title="404 image"
            />
            <CardContent>
              <Typography variant="h2" color="secondary" sx={{
                fontSize: "2rem",
                fontWeight: "600"
              }}>Ops! Parece que você se perdeu</Typography>
              <Typography variant="body1" color="initial" mt={2}>
                Podemos te ajudar?
              </Typography>
            </CardContent>
            <CardActions sx={{
               display: "flex",
               flexDirection: "column",
               justifyContent: "center", 
            }}>
              <Button href="/" size="large" variant="outlined" color="secondary" startIcon={<Home />}>
                Voltar ao início
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>

  )
}

export default ErrorPage;