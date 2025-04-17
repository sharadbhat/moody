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
import { useStorage } from "./hooks/useStorage";
import { useEffect } from "react";

const overrides = createTheme({});

const theme = mergeMantineTheme(DEFAULT_THEME, overrides);

function App() {
  const { loadBoard, saveBoard } = useStorage();

  useEffect(() => {
    loadBoard();

    const handleBeforeUnload = () => {
      saveBoard();
    };

    const interval = setInterval(() => {
      saveBoard();
    }, 5000);

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
