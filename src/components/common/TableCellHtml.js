import { Tooltip } from "@mantine/core";
const TableCellHtml = (content) => {
  const parse = require("html-react-parser");
  content = String(content);

  if (content.length <= 50) {
    return <td style={{ wordBreak: "break-all" }}>{parse(content)}</td>;
  } else {
    var parsed = parse(content);
    var cellContent = "";
    if (Array.isArray(parsed)) {
      cellContent = parsed[0].props.children;
    } else {
      cellContent = parsed.props.children;
    }
    if (typeof cellContent === "string")
      cellContent = cellContent.substring(0, 50);
    return (
      <td style={{ wordBreak: "break-all" }}>
        <Tooltip
          label={parse(content)}
          position="bottom"
          placement="end"
          gutter={10}
        >
          {cellContent}...
        </Tooltip>
      </td>
    );
  }
};

export default TableCellHtml;
