import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import { Draggable } from "@hello-pangea/dnd";
import formatRupiah from "../utils/currencyFormatter";
import { useAppDispatch } from "../../../store/hooks";
import { deleteFile, uploadFile } from "../../../store/kanbanSlice";
import type { CardPreviewProps } from "../../../store/kanbanTypes";

const createdAtFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function CardPreview({
  task,
  index,
  onClick,
  onDelete,
}: CardPreviewProps) {
  const dispatch = useAppDispatch();
  const attachmentCount = task.files?.length ?? 0;
  const [uploadingFileName, setUploadingFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deletingFileId, setDeletingFileId] = useState("");
  const formattedCreatedAt = task.createdAt
    ? createdAtFormatter.format(new Date(task.createdAt))
    : "";

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    taskId: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFileName(file.name);
    setUploadStatus(null);

    try {
      await dispatch(uploadFile({ taskId, file })).unwrap();
      setUploadStatus({
        type: "success",
        text: `${file.name} uploaded successfully.`,
      });
    } catch (error) {
      console.error(
        `Failed to upload file ${file.name} for task ${taskId}`,
        error,
      );
      setUploadStatus({
        type: "error",
        text: `Failed to upload ${file.name}.`,
      });
    } finally {
      setUploadingFileName("");
      e.target.value = "";
    }
  };

  const handleFileDelete = async (fileId: string, fileName: string) => {
    setDeletingFileId(fileId);
    setUploadStatus(null);

    try {
      await dispatch(deleteFile({ taskId: task.id, fileId })).unwrap();
      setUploadStatus({
        type: "success",
        text: `${fileName} deleted successfully.`,
      });
    } catch (error) {
      console.error(
        `Failed to delete file ${fileName} for task ${task.id}`,
        error,
      );
      setUploadStatus({
        type: "error",
        text: `Failed to delete ${fileName}.`,
      });
    } finally {
      setDeletingFileId("");
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          sx={{
            mb: 2,
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ pb: "12px !important" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ mb: 0.5, minWidth: 0, flex: 1, overflowWrap: "anywhere" }}
              >
                {task.cardCode} — {task.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  minWidth: 40,
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    color: "error",
                    opacity: 0.7,
                    "&:hover": { opacity: 1 },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Delete this card?")) {
                      onDelete(task.id);
                    }
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {formatRupiah(Number(task.value))}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {formattedCreatedAt}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {task.customerName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {task.owner}
              </Typography>
            </Box>
            <Box sx={{ m: 1 }}></Box>
            <Accordion
              elevation={0}
              sx={{
                mt: 1,
                bgcolor: "transparent",
                "&:before": { display: "none" },
              }}
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking accordion
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 0,
                  minHeight: "unset",
                  "& .MuiAccordionSummary-content": { margin: 0 },
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Attachments ({attachmentCount})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                {task.files?.map((f) => (
                  <Box
                    key={f.id}
                    sx={{
                      mt: 0.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      component="a"
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      onClick={(e) => e.stopPropagation()}
                    >
                      {f.name}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      disabled={deletingFileId === f.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete attachment "${f.name}"?`)) {
                          void handleFileDelete(f.id, f.name);
                        }
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {uploadingFileName && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Uploading: {uploadingFileName}
                  </Typography>
                )}
                {uploadStatus && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      color:
                        uploadStatus.type === "success"
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {uploadStatus.text}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  component="label"
                  fullWidth
                  disabled={Boolean(uploadingFileName)}
                  sx={{ mt: 1 }}
                  onClick={(e) => e.stopPropagation()} // Prevent card click when clicking button
                >
                  {uploadingFileName ? "Uploading..." : "Upload File"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => void handleFileUpload(e, task.id)}
                  />
                </Button>
                <Typography variant="caption" color="#da0a0a">
                  *max upload size: 40MB **max total upload: 20 files per card
                </Typography>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
