import { Input, Title } from "@mantine/core";
import { useMoodyStore } from "../../utils/store";
import { useEffect, useState } from "react";
import { CONSTANTS } from "../../utils/constants";
import { useStorage } from "../../hooks/useStorage";

const BoardName = () => {
  const { setBoardName, boardName } = useMoodyStore((state) => state);
  const { saveAndLoadAllBoardsIntoStore } = useStorage();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(boardName);
  const [isError, setIsError] = useState(false);

  const handleSubmit = () => {
    if (newName.trim() === "") {
      setIsError(true);
    } else {
      setBoardName(newName);
      setIsEditing(false);
      setIsError(false);
      saveAndLoadAllBoardsIntoStore();
    }
  };

  useEffect(() => {
    setNewName(boardName);
  }, [boardName]);

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{
        cursor: CONSTANTS.CURSOR_TYPING,
      }}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          setIsEditing(true);
        }
      }}
    >
      {isEditing ? (
        <Input
          value={newName}
          placeholder={isError ? "Name cannot be empty" : ""}
          variant={isError ? "filled" : "unstyled"}
          radius={"xl"}
          style={{
            height: 35,
          }}
          width={"100%"}
          styles={{
            input: {
              textAlign: "center",
              fontSize: 25,
              cursor: CONSTANTS.CURSOR_TYPING,
            },
          }}
          error={isError}
          onChange={(event) => setNewName(event.currentTarget.value)}
          onBlur={handleSubmit}
          autoFocus
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === "Enter") {
              handleSubmit();
            } else if (event.key === "Escape") {
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <Title
          order={2}
          pl={10}
          pr={10}
          styles={{
            root: {
              border: "2px solid lightgray",
              borderRadius: "5px",
            },
          }}
        >
          {boardName}
        </Title>
      )}
    </div>
  );
};

export default BoardName;
