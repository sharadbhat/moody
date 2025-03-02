import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import InfiniteCanvas from "./components/InfiniteCanvas";
import ColorSchemeContext from "./utils/colorSchemeContext";
import { useState } from "react";
import Navbar from "./components/Navbar";

const theme = createTheme({
  colors: {},
});

function App() {
  const [colorScheme, setColorScheme] = useState("light");

  return (
    <ColorSchemeContext.Provider
      value={{ colorScheme, onChange: setColorScheme }}
    >
      <MantineProvider theme={theme}>
        <AppShell
          header={{
            height: 60,
          }}
        >
          <AppShell.Header>
            <Navbar />
          </AppShell.Header>
          <AppShell.Main style={{ paddingTop: 0 }}>
            <InfiniteCanvas />
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </ColorSchemeContext.Provider>
  );
}

export default App;
