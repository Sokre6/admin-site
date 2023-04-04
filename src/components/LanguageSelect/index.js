import { createStyles, Image, Menu, UnstyledButton } from "@mantine/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ChevronDown } from "tabler-icons-react";
import images from "../../assets/images/index";
import { changeLanguage } from "../../store/slices/settings";

const useStyles = createStyles((theme, { opened }) => ({
  control: {
    width: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background-color 150ms ease",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[opened ? 5 : 6]
        : opened
          ? theme.colors.gray[0]
          : theme.white,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  label: {
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
  },

  icon: {
    transition: "transform 150ms ease",
    transform: opened ? "rotate(180deg)" : "rotate(0deg)",
  },
}));

const LanguageSelect = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles({ opened });
  const data = [
    { label: t("language.lblEnglish"), image: images.english, code: "en" },
  ];
  const [selected, setSelected] = useState(data[0]);

  const items = data.map((item) => (
    <Menu.Item
      icon={<Image src={item.image} width={18} height={18} />}
      onClick={() => {
        dispatch(changeLanguage({ language: item.code }));
        setSelected(item);
      }}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      transition="pop"
      transitionDuration={150}
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      control={
        <UnstyledButton className={classes.control}>
          <Image src={selected.image} width={22} height={22} />
          <ChevronDown size={16} className={classes.icon} />
        </UnstyledButton>
      }
    >
      {items}
    </Menu>
  );
};
export default LanguageSelect;
