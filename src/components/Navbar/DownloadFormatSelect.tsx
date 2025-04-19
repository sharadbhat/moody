import React, { useState } from "react";
import { Combobox, Group, InputBase, Text, useCombobox } from "@mantine/core";
import { IconFileTypeJpg, IconFileTypePng } from "@tabler/icons-react";

interface Item {
  icon: React.ReactNode;
  value: string;
  description: string;
}

const imageTypes: Item[] = [
  {
    icon: <IconFileTypeJpg color="gray" />,
    value: "JPEG",
    description: "Lossy, high-quality image format",
  },
  {
    icon: <IconFileTypePng color="gray" />,
    value: "PNG",
    description: "Lossless format. Supports transparency.",
  },
];

function SelectOption({ icon, value, description }: Item) {
  return (
    <Group>
      {icon}
      <div>
        <Text fz="sm" fw={500} c={"gray"}>
          {value}
        </Text>
        <Text fz="xs" c={"gray"}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

export const DownloadFormatSelect = ({
  defaultFormat,
  handleDownloadFormatChange,
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string>(defaultFormat);
  const selectedOption = imageTypes.find((item) => item.value === value);

  const options = imageTypes.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        handleDownloadFormatChange(val);
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          <SelectOption {...selectedOption} description="" />
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
