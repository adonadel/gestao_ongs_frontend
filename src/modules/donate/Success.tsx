import { ChevronLeft } from "@mui/icons-material";
import { Container, Grid, Typography, Button, Box } from "@mui/material";

function Success() {
  return (
    <Container>
      <Grid container justifyContent={"center"}>
        <Grid xs={12} md={8} justifyContent={"center"}>

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "4rem"
          }}>
            
            <Typography variant="body1" color="initial" sx={{
              fontSize: "1rem",
              fontWeight: "400",
              marginBottom: "1rem"
            }}>Doação confirmada!</Typography>

            <img src="/congratulation-donate.svg" alt="Imagem de agradecimento da doação" style={{
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
              display: "block"
            }} />
            <Typography variant="h2" color="initial" sx={{
              fontSize: {xs: "1rem", md: "1.2rem"},
              fontWeight: "400",
              marginBottom: "1rem"
            }}>Obrigado! agradeçemos sua ajuda!</Typography>

            <Button href="/" size="large" variant="outlined" color="secondary" startIcon={<ChevronLeft />}>
              Voltar ao início
            </Button>
          </Box>



        </Grid>
      </Grid>
    </Container>

  )
}

export default Success;