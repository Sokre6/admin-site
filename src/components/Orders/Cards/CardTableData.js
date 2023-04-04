import {
  Box,
  Button,
  createStyles,
  Divider,
  Group,
  Table,
  Title,
  Tooltip,
} from "@mantine/core";
import axios from "../../../http/axios";
import { useTranslation } from "react-i18next";
import { Download, Mail } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import QuestionBanner from "../QuestionBanner";

const useStyles = createStyles((theme) => ({
  insertButton: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.colorDarkGray,
    "&:hover": {
      backgroundColor: theme.colors.colorBlack,
    },
  },
  tableHeaders: {
    position: "sticky",
    zIndex: 100,
    top: 0,
    background: "white",
  },
  mainContainer: {
    width: "25vw",
    height: "30vh",
    borderRadius: 12,
    borderStyle: "outset",
    display: "flex",
    flexDirection: "column",

    padding: 20,
    border: "1px solid #c9c9c9",
  },
}));

export const CardTableData = (props) => {
  const { documentList, orderId } = props;
  const { classes } = useStyles();
  const { t } = useTranslation();

  const [questionBanner, setQuestionBanner] = useState(false);
  const [documentId, setDocumentId] = useState("");

  const download = async (fileId, name) =>
    await axios
      .get(`aurodomus-file/api/v1/files/${fileId}`, {
        responseType: "blob",
      })
      .then((res) => {
        console.log(res);

        const data = res.data;
        const objectUrl = URL.createObjectURL(data);

        const link = document.createElement("a");

        link.setAttribute("href", objectUrl);
        link.setAttribute("download", name);
        link.style.display = "none";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        showNotification({
          message: t("ordersDetailsTable.downloadSuccessfully"),
          color: "green",
        });
      })
      .catch(() => {
        showNotification({
          message: t("ordersDetailsTable.downloadError"),
          color: "red",
        });
      });

  return (
    <>
      <Box className={classes.mainContainer}>
        <Title order={5} align={"center"}>
          {t("cardTableData.documents")}
        </Title>
        <Divider size={"md"} spacing={5} />
        <Box style={{ overflowY: "auto" }}>
          <Table>
            <thead className={classes.tableHeaders}>
              <tr>
                <th>{t("cardTableData.documentType")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {documentList?.map((item, index) => (
                <tr key={index}>
                  <td>{item.type}</td>
                  <td>
                    <Group position="right">
                      <Tooltip label={t("ordersDetailsTable.downloadFile")}>
                        <Button
                          className={classes.insertButton}
                          compact
                          onClick={() => download(item.fileId, item.name)}
                        >
                          <Download />{" "}
                        </Button>
                      </Tooltip>
                      <Tooltip
                        label={t("ordersDetailsTable.tooltipCustomerMail")}
                      >
                        <Button
                          className={classes.insertButton}
                          compact
                          onClick={() => {
                            setQuestionBanner(true);
                            setDocumentId(item.id);
                          }}
                        >
                          <Mail />{" "}
                        </Button>
                      </Tooltip>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </Box>
      <QuestionBanner
        show={questionBanner}
        orderId={orderId}
        documentId={documentId}
        onClose={() => setQuestionBanner(false)}
      />
    </>
  );
};
