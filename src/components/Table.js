import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import LoaderIcon from "react-loader-icon";
import axios from "axios";

const TablePagination = (props) => {
  const API_URL = "http://localhost:8080/";

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}load`, {
      params: {
        token_address: props.tokenaddress,
      },
    });
    props.setTableData(res.data);
  };

  const handleClose = async (param) => {};

  useEffect(() => {
    console.log("props.fetchCount", props.fetchCount);
    fetchData();
  }, [props.fetchCount]);

  return props.tableData.length == 0 ? (
    <LoaderIcon type={"spokes"} style={{ marginTop: "5em" }} />
  ) : (
    <div className="container mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Wallet Address</th>
            <th>SOL Amount</th>
            <th>Token Amount</th>
            <th>PNL</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          {props.tableData.map((row, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                <a
                  href={`https://solscan.io/account/${row.wallet_address}`}
                  style={{ textDecoration: "none", color: "#000000" }}
                  target="_blank"
                >
                  {row.wallet_address}
                </a>
              </td>
              <td>{`${row.sol_amount.toFixed(4)} SOL`}</td>
              <td>{row.token_amount.toFixed(4)}</td>
              <td>{row.pnl.toFixed(6)}</td>
              <td>
                {
                  <Button
                    style={{
                      marginTop: "0",
                      fontSize: "15px",
                      backgroundColor: "red",
                      borderColor: "red",
                      fontWeight: "600",
                    }}
                    size="sm"
                    onClick={() =>
                      handleClose({
                        wallet_address: row.wallet_address,
                        token_amount: row.token_amount,
                        index: index,
                      })
                    }
                  >
                    Close Wallet
                  </Button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablePagination;
