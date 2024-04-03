import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import axios from "axios";

const data = [
  {
    id: 1,
    name: "7v2BtawYfJcEazTR6VtgN7NJcDXKEjsgEiEbGYB3Nuaf",
    email: "johndoe@example.com",
  },
  { id: 2, name: "Jane Doe", email: "janedoe@example.com" },
  { id: 3, name: "John Doe", email: "johndoe@example.com" },
  { id: 4, name: "Jane Doe", email: "janedoe@example.com" },
  { id: 5, name: "John Doe", email: "johndoe@example.com" },
  { id: 6, name: "Jane Doe", email: "janedoe@example.com" },
  { id: 7, name: "John Doe", email: "johndoe@example.com" },
  { id: 8, name: "Jane Doe", email: "janedoe@example.com" },
  { id: 9, name: "John Doe", email: "johndoe@example.com" },
  { id: 10, name: "Jane Doe", email: "janedoe@example.com" },
  { id: 11, name: "John Doe", email: "johndoe@example.com" },
  { id: 12, name: "Jane Doe", email: "janedoe@example.com" },
  { id: 13, name: "John Doe", email: "johndoe@example.com" },
  { id: 14, name: "Jane Doe", email: "janedoe@example.com" },
  { id: 15, name: "John Doe", email: "johndoe@example.com" },
  { id: 16, name: "Jane Doe", email: "janedoe@example.com" },
  { id: 17, name: "John Doe", email: "johndoe@example.com" },
  { id: 18, name: "Jane Doe", email: "janedoe@example.com" },
  // Add more data here
];

const TablePagination = () => {
  const API_URL = "http://localhost:8080/";
  const [tableData, setTableData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handlePaginationClick = (page) => {
    setCurrentPage(page);
  };

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}load`);
    setTableData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Wallet Address</th>
            <th>SOL Amount</th>
            <th>Token Amount</th>
            <th>PNL</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td>{row.wallet_address}</td>
              <td>{`${row.sol_amount} SOL`}</td>
              <td>{row.token_amount}</td>
              <td>{row.pnl}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.First onClick={() => handlePaginationClick(1)} />
        <Pagination.Prev
          onClick={() => handlePaginationClick(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {/* {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePaginationClick(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))} */}
        <Pagination.Next
          onClick={() => handlePaginationClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last onClick={() => handlePaginationClick(totalPages)} />
      </Pagination>
    </div>
  );
};

export default TablePagination;
