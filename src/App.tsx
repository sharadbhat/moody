import {
  AppShell,
  DEFAULT_THEME,
  MantineProvider,
  createTheme,
  mergeMantineTheme,
} from "@mantine/core";
import InfiniteCanvas from "./components/InfiniteCanvas";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./App.css";

const overrides = createTheme({});

const theme = mergeMantineTheme(DEFAULT_THEME, overrides);

function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell>
        <Navbar />
        <Sidebar />
        <AppShell.Main style={{ paddingTop: 0 }}>
          <InfiniteCanvas />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
