import { Box, Container, Typography } from "@mui/material";
import React from "react";

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "primary.main", color: "white", mt: 5, py: 2 }}>
      <Container maxWidth="lg">
        <Typography variant="body1">
          © Poznań, 2023. В случае возникновения ошибок или для предложения идей,
          пожалуйста, обращайтесь по емайлу:
          <a href="mailto:quizyeasyapp@gmail.com" style={{ color: 'white' }}>quizyeasyapp@gmail.com</a>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
