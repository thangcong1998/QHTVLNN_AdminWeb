import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import { Button } from '@material-ui/core';
import { useAPI } from '../../../api/api';
import Forms from '../../../components/Admin/form/Form';

const ChangeStatus = React.memo((props) => {
    const { status, handleClose, id, refetch, type } = props;
    const api = useAPI()
    const formik = useFormik({
        initialValues: {}
    })
    const inputs = useMemo(() => [
        [
            {
                field: "note",
                label: "Ý kiến của cán bộ thẩm định",
                value: formik.values?.note,
                handleChange: (e) => {
                    formik.setFieldValue('note', e)
                },
                error: api.error?.note,
                variant: "standard",
                type: "textarea",
                grid: { xs: 12, sm: 12, md: 12 }
            }
        ]
    ], [formik])

    const ChangeStatusRequest = async () => {
        try {
            const res = await api.fetcher('put', '/admin/changeStatusLaborSupport/' + id, { status: status, note: formik.values?.note });
            handleClose();
            refetch();
        } catch (e) {

        }
    }

    return (
        <div>
            {type === 1 ? <Forms inputs={inputs} loading={api.loading} /> : ''}
            <Button color="primary" variant="contained" onClick={ChangeStatusRequest} >Xác nhận</Button>
        </div>
    )
})

export default ChangeStatus;
