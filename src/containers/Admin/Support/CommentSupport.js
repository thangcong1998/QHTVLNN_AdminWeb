import React from "react";
import {
    TextField
} from "@material-ui/core";

export default function CommentSupport({label, formik}) {
    return (
        <div>
            <TextField
                label={label}
                variant={'outlined'}
                value={formik.values?.agreement_comment}
                onChange={e => formik.setFieldValue('agreement_comment',e.target.value)}
                fullWidth
            />
        </div>
    )
}
