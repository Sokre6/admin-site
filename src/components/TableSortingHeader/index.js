import React from "react";
import {
    createStyles,
    UnstyledButton,
    Group,
    Text,
    Center,
} from "@mantine/core";
import { Selector, ChevronDown, ChevronUp } from "tabler-icons-react";

const useStyles = createStyles(theme => ({
    th: {
        padding: "0 !important"
    },

    control: {
        width: "100%",
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0]
        }
    },

    icon: {
        width: 21,
        height: 21,
        borderRadius: 21
    }
}))

const Th = ({ children, reversed, sorted, onSort }) => {
    const { classes } = useStyles()
    const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector
    return (
        <th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group position="apart">
                    <Text weight={500} size="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size={14} />
                    </Center>
                </Group>
            </UnstyledButton>
        </th>
    )
}

export default Th;