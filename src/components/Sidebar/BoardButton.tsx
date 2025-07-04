import { ActionIcon, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { CONSTANTS } from "../../utils/constants";
import { IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useStorage } from "../../hooks/useStorage";
import { useMoodyStore } from "../../utils/store";

export const BoardButton = ({ boardId, boardName, onBoardDelete }) => {
  const { boardId: currentBoardId, resetStore } = useMoodyStore();
  const [opened, { open, close }] = useDisclosure(false);
  const { deleteBoard, saveAndLoadBoard, loadAllBoardsIntoStore } =
    useStorage();

  const handleSelectBoard = (boardId: string) => {
    saveAndLoadBoard(boardId);
  };

  const handleDeleteButtonClick = () => {
    open();
  };

  const handleCancelDelete = () => {
    close();
  };

  const handleDeleteConfirm = () => {
    deleteBoard(boardId).then(resetStore).then(loadAllBoardsIntoStore);
    close();
    onBoardDelete();
  };

  return (
    <>
      <Button
        key={boardId}
        variant={boardId === currentBoardId ? "light" : "default"}
        h={"fit-content"}
        fullWidth
        radius={10}
        style={{
          cursor: CONSTANTS.CURSOR_POINTER,
        }}
        onClick={
          boardId === currentBoardId ? null : () => handleSelectBoard(boardId)
        }
        className="board-button"
        mt={10}
      >
        <div className="delete-button">
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteButtonClick();
            }}
            color="red"
            style={{
              cursor: CONSTANTS.CURSOR_POINTER,
            }}
            component="span"
          >
            <IconTrash color="red" stroke={1.5} size={20} />
          </ActionIcon>
        </div>
        <Stack m={30} gap={5} align="center" justify="center">
          <Text size="md" truncate={"end"}>
            {boardName}
          </Text>
        </Stack>
      </Button>
      <Modal
        opened={opened}
        onClose={handleCancelDelete}
        title={
          <Text size="lg" fw={600}>
            Delete board?
          </Text>
        }
        centered
      >
        <Modal.Body p={0} mt={10}>
          <Text>
            This will delete the board <strong>{boardName}</strong>.
          </Text>
          <Group justify="end" mt={40}>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="filled" color="red" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </Group>
        </Modal.Body>
      </Modal>
    </>
  );
};
