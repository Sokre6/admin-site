import { Tooltip } from "@mantine/core";
const TableCell = (content) => {
  content = String(content);
  if (content.length <= 50) {
    return <td style={{ wordBreak: "break-all" }}>{content}</td>;
  } else {
    return (
      <td style={{ wordBreak: "break-all" }}>
        <Tooltip label={content} position="bottom" placement="end" gutter={10}>
          {content.slice(0, 50) + "..."}
        </Tooltip>
      </td>
    );
  }
};

export default TableCell;
