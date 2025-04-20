import { IconPlus } from "@tabler/icons-react";
import "./index.css";
import { Button, ScrollArea, Stack, Text } from "@mantine/core";
import { useStorage } from "../../hooks/useStorage";
import { useEffect } from "react";
import { CONSTANTS } from "../../utils/constants";
import { useMoodyStore } from "../../utils/store";
import { BoardButton } from "./BoardButton";

const Sidebar = () => {
  const { saveBoard, loadAllBoardsIntoStore, saveAndLoadAllBoardsIntoStore } =
    useStorage();
  const { boardList, resetStore, setBoardLoading } = useMoodyStore();

  useEffect(() => {
    loadAllBoardsIntoStore();

    const interval = setInterval(() => {
      loadAllBoardsIntoStore();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleCreateNewBoard = async () => {
    setBoardLoading(true);
    await saveBoard();
    resetStore();
    await saveAndLoadAllBoardsIntoStore(true);
    setBoardLoading(false);
  };

  const handleBoardDeleted = () => {
    loadAllBoardsIntoStore();
  };

  const renderBoardButtons = () => {
    return boardList.map((board) => (
      <BoardButton
        key={board.id}
        boardId={board.id}
        boardName={board.boardName}
        onBoardDelete={handleBoardDeleted}
      />
    ));
  };

  return (
    <div className="sidebar">
      <ScrollArea h={"100%"} p={10}>
        <Button
          variant="default"
          h={"fit-content"}
          fullWidth
          radius={10}
          style={{
            cursor: CONSTANTS.CURSOR_POINTER,
          }}
          onClick={handleCreateNewBoard}
        >
          <Stack m={20} gap={5} align="center" justify="center">
            <IconPlus size={30} stroke={1.5} />
            <Text size="md">Create new board</Text>
          </Stack>
        </Button>
        {renderBoardButtons()}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
