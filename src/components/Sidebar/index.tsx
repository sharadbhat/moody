import { IconPlus } from "@tabler/icons-react";
import "./index.css";
import { Button, ScrollArea, Stack, Text } from "@mantine/core";
import { useStorage } from "../../hooks/useStorage";
import { useEffect, useState } from "react";
import { CONSTANTS } from "../../utils/constants";
import { useMoodyStore } from "../../utils/store";
import { BoardButton } from "./BoardButton";

const Sidebar = () => {
  const [boards, setBoards] = useState([]);
  const { getAllBoards, saveBoard } = useStorage();
  const { resetStore } = useMoodyStore();

  useEffect(() => {
    getAllBoards().then((boards) => {
      setBoards(boards);
    });

    const interval = setInterval(() => {
      getAllBoards().then((boards) => {
        setBoards(boards);
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleCreateNewBoard = () => {
    saveBoard()
      .then(() => {
        resetStore();
      })
      .then(() => {
        saveBoard(true).then(() => {
          getAllBoards().then((boards) => {
            setBoards(boards);
          });
        });
      });
  };

  const handleBoardDeleted = () => {
    getAllBoards().then((boards) => {
      setBoards(boards);
    });
  };

  const renderBoardButtons = () => {
    return boards.map((board) => (
      <BoardButton
        key={board.id}
        board={board}
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
            <IconPlus size={30} stroke={1.5} color="black" />
            <Text size="md" c="black">
              Create new board
            </Text>
          </Stack>
        </Button>
        {renderBoardButtons()}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
