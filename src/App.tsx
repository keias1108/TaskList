import { ThemeProvider } from "styled-components";
import Router from "./Router";

const theme = {
  baseColor: "black",
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
