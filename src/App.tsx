import { AppShell, MantineProvider, createTheme } from "@mantine/core";
import ColorSchemeContext from "./utils/colorSchemeContext";
import InfiniteCanvas from "./components/InfiniteCanvas";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

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
        <AppShell>
          <Navbar />
          <Sidebar />
          <AppShell.Main style={{ paddingTop: 0 }}>
            <InfiniteCanvas />
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </ColorSchemeContext.Provider>
  );
}

export default App;
