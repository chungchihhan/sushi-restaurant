import { useState } from "react";

import { Paper } from "@mui/material";

// import CardDialog from "./CardDialog";

export type CardProps = {
  title: string;
};

export default function Card({ title }: CardProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open); // 切換 open 狀態
  };

  return (
    <>
      <button onClick={handleClickOpen} className="text-start">
        <Paper className="flex w-full flex-col p-2" elevation={6}>
          {title}
        </Paper>
      </button>
    </>
  );
}
