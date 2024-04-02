import React from "react";
import Pagination from "rc-pagination";
import styled from "styled-components";

interface ControlsProps {
  currentPage: number;
  handlePageChange: (page: number, pageSize?: number) => void;
  totalPages: number;
  limit: number;
  loading: boolean;
}

const ControlsContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  background-color: white;
  border-top: 1px solid #ddd;
  padding: 2rem 0;
  border-radius: 0 0 1rem 1rem;
`;

const Controls: React.FC<ControlsProps> = ({
  currentPage,
  handlePageChange,
  totalPages,
  limit,
  loading,
}) => {
  return (
    <ControlsContainer>
      <Pagination
        current={currentPage}
        onChange={handlePageChange}
        total={totalPages * limit}
        pageSize={limit}
        showTitle={false}
        showLessItems={true}
        prevIcon={"<"}
        nextIcon={">"}
        jumpPrevIcon={"<<"}
        jumpNextIcon={">>"}
        disabled={loading}
      />
    </ControlsContainer>
  );
};

export default Controls;
