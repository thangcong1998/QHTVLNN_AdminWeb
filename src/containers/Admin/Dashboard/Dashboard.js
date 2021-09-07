import React, {useContext} from "react";
import InfoSettlement from "./InfoSettlement";
import AddButton from "./AddButton";
import Chart from "./Chart";
import {AuthContext} from "../../../common/AuthProvider";

const Dashboard = React.memo((props) => {
    const { admin } = useContext(AuthContext);
  return (admin?.user_type === 1 && (
      <div>
        <InfoSettlement />
        <br />
        <Chart />
        <br />
          <div style={{ position: "fixed", right: '20px', bottom: '20px'}}>
              <AddButton />
          </div>
      </div>
      )
  );
});

export default Dashboard;
