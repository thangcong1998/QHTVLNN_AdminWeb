import React, { useMemo } from "react";
import { useFormik } from "formik";
import { Button } from "@material-ui/core";
import Moment from "moment";
import {useAPI} from "../../api/api";
import loading from "../../assets/image/103.gif";

const LoadingCallApi = React.memo((props) => {
    const { row, close, refetch } = props;
    const api = useAPI();

    return (
        <div style={{ width: '100%', height: '100%'}}>
            <img src={loading} style={{ position: "fixed", left: '45%', right: '45%', top: '40%'}} />
        </div>
    );
});

export default LoadingCallApi;
