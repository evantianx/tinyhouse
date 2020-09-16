import React from "react";
import { Skeleton } from "antd";

export const PageSkeleton = () => {
  const skeletionParagraph = (
    <Skeleton
      active
      paragraph={{ rows: 4 }}
      className="page-skeleton__paragraph"
    />
  );

  return (
    <>
      {skeletionParagraph}
      {skeletionParagraph}
      {skeletionParagraph}
    </>
  );
};
