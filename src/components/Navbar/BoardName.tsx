import { Input, Title } from "@mantine/core";
import { useMoodyStore } from "../../utils/store";
import { useState } from "react";

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
    <div onClick={() => setIsEditing(true)}>
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
            },
          }}
          // size="lg"
          error={isError}
          onChange={(event) => setNewName(event.currentTarget.value)}
          onBlur={handleSubmit}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
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
