import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import LoaderIcon from "react-loader-icon";
import axios from "axios";

const TablePagination = () => {
  const API_URL = "http://localhost:8080/";
  const [tableData, setTableData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}load`);
    setTableData(res.data);
  };

  const handleSellsALL = async (param) => {
    console.log(param);
    try {
      const res = await axios.get(`${API_URL}sells`, {
        params: {
          wallet_address: param.wallet_address,
          token_amount: param.token_amount,
          index: param.index,
        },
      });
      console.log(res.data);
    } catch (err) {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return tableData.length == 0 ? (
    <LoaderIcon type={"spokes"} style={{ marginTop: "5em" }} />
  ) : (
    <div className="container mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Wallet Address</th>
            <th>Action</th>
            <th>SOL Amount</th>
            <th>Token Amount</th>
            <th>PNL</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                {row.wallet_address}
              </td>
              <td>
                {
                  <Button
                    variant="secondary"
                    style={{
                      marginTop: "0",
                      fontSize: "15px",
                    }}
                    size="sm"
                    onClick={() =>
                      handleSellsALL({
                        wallet_address: row.wallet_address,
                        token_amount: row.token_amount,
                        index: index,
                      })
                    }
                  >
                    Sells All
                  </Button>
                }
              </td>
              <td>{`${row.sol_amount.toFixed(4)} SOL`}</td>
              <td>{row.token_amount.toFixed(4)}</td>
              <td>{row.pnl.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablePagination;
