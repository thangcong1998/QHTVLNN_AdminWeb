import React, { useMemo, useEffect } from 'react';
import Forms from '../../../components/Admin/form/Form';
import { useFormik } from 'formik';
import {
    Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Skeleton } from '@material-ui/lab';
import { useHistory, useParams } from 'react-router-dom';
import { useFetch, useAPI } from '../../../api/api';

export default function OtherSupportForm(props) {
    const api = useAPI();
    const classes = useStyle();
    const history = useHistory();
    const params = useParams();
    const formik = useFormik({
        initialValues: {},
    })
    const { data: user } = useFetch(['get', '/admin/me']);
    const { data: otherSupport, loading: loading } = useFetch(params?.id && ['get', '/admin/laborSupport/' + params?.id]);

    const inputs = useMemo(() => [
        [
            {
                component: () => (
                    loading ?
                        <Skeleton />
                        :
                        < div className={classes.text} >
                            <span className={classes.title}>Đơn vị:&nbsp;</span>
                            {
                                params?.id ?
                                    <span className={classes.value}>
                                        {otherSupport?.company && otherSupport.company?.name}
                                        {otherSupport?.labor_countriesdepartment && otherSupport?.labor_department?.name}
                                    </span>
                                    :
                                    <span className={classes.value}>
                                        {user?.company && user.company?.name}
                                        {user?.labor_countriesdepartment && user?.labor_department?.name}
                                    </span>
                            }
                        </div >
                ),
                grid: { xs: 12, sm: 6, md: 6 },
            },
            {
                field: 'reason',
                type: 'textarea',
                label: 'Lý do',
                value: formik.values?.reason,
                handleChange: (e) => formik.setFieldValue('reason', e),
                error: api.error?.reason,
                grid: { xs: 12, sm: 12, md: 12 }
            }
        ]
    ], [user, otherSupport, formik])

    return (
        <Paper>
            <Forms inputs={inputs} />
        </Paper>
    )
}

const useStyle = makeStyles((theme) => ({
    root: {
        padding: 20
    },
    text: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        fontSize: '1rem'
    },
    title: {

    },
    value: {
        fontWeight: 600
    }
}));