import { Input, Title } from "@mantine/core";
import { useMoodyStore } from "../../utils/store";
import { useState } from "react";
import { CONSTANTS } from "../../utils/constants";

const BoardName = ({ name }: { name: string }) => {
  const { setBoardName } = useMoodyStore((state) => state);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [isError, setIsError] = useState(false);

  const handleSubmit = () => {
    if (newName.trim() === "") {
      setIsError(true);
    } else {
      setBoardName(newName);
      setIsEditing(false);
      setIsError(false);
    }
  };

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{
        cursor: CONSTANTS.CURSOR_TYPING,
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
            if (event.key === "Enter") {
              handleSubmit();
            } else if (event.key === "Escape") {
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <Title order={2}>{name}</Title>
      )}
    </div>
  );
};

export default BoardName;
