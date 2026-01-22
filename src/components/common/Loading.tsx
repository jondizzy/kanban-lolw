import { Box, CircularProgress } from "@mui/material";

//add when props are needed
interface LoadingProps {
  fullHeight?: boolean;
}

const Loading = (props: LoadingProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: props.fullHeight ? "100vh" : "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
