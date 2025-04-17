import { IconPlus } from "@tabler/icons-react";
import "./index.css";
import { Button, Stack, Text } from "@mantine/core";
import { useStorage } from "../../hooks/useStorage";
import { useEffect, useState } from "react";
import { CONSTANTS } from "../../utils/constants";
import { useMoodyStore } from "../../utils/store";

const Sidebar = () => {
  const [boards, setBoards] = useState([]);
  const { getAllBoards, loadBoard } = useStorage();
  const { boardId } = useMoodyStore();

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

  const renderBoardButtons = () => {
    return boards.map((board) => (
      <Button
        key={board.id}
        variant={board.id === boardId ? "light" : "default"}
        h={"fit-content"}
        w={"100%"}
        radius={10}
        style={{
          cursor: CONSTANTS.CURSOR_POINTER,
        }}
        onClick={() => loadBoard(board.id)}
      >
        <Stack m={20} gap={5} align="center" justify="center">
          <Text size="md" c="black">
            {board.boardName}
          </Text>
        </Stack>
      </Button>
    ));
  };

  return (
    <div className="sidebar">
      <Stack align="center" justify="flex-start" h="100%" p={10} gap={10}>
        <Button
          variant="default"
          h={"fit-content"}
          w={"100%"}
          radius={10}
          style={{
            cursor: CONSTANTS.CURSOR_POINTER,
          }}
        >
          <Stack m={20} gap={5} align="center" justify="center">
            <IconPlus size={30} stroke={1.5} color="black" />
            <Text size="md" c="black">
              Create new board
            </Text>
          </Stack>
        </Button>
        {renderBoardButtons()}
      </Stack>
    </div>
  );
};

export default Sidebar;
