import React, {useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import {useAPI} from "../../../api/api";

export default function ResetPassword() {
    const api = useAPI();
    const params = useParams();
    const history = useHistory();
    useEffect(() => {
        try {
            let res = api.fetcher(
                'post',
                '/admin/setBackPassword',
                {
                    'password': params?.id ? params.id : '',
                    'username': params?.name ? params?.name : '',
                }
            )
            if(res) {
                history.push('/quanly');
            }
        } catch (e) {}
    },[params])

    return (
        <div />
    )
}
