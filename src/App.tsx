import {
  AppShell,
  DEFAULT_THEME,
  LoadingOverlay,
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
import { useMoodyStore } from "./utils/store";

const overrides = createTheme({});

const theme = mergeMantineTheme(DEFAULT_THEME, overrides);

function App() {
  const { loadBoard, saveBoard } = useStorage();
  const { boardLoading } = useMoodyStore();

  useEffect(() => {
    loadBoard();

    const handleBeforeUnload = () => {
      saveBoard();
    };

    const interval = setInterval(() => {
      saveBoard();
    }, 15000);

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
          <LoadingOverlay
            visible
            zIndex={301}
            style={{
              visibility: boardLoading ? "visible" : "hidden",
            }}
            styles={{
              loader: {
                opacity: boardLoading ? 1 : 0,
                transition: "opacity 500ms ease-in-out 100ms",
              },
              overlay: {
                opacity: boardLoading ? 1 : 0,
                transition: "opacity 0s 100ms",
              },
            }}
            loaderProps={{
              size: "72",
            }}
            overlayProps={{
              blur: 5,
            }}
          />
          <InfiniteCanvas />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
