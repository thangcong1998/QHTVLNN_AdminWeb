import React, { useMemo } from 'react';
import { useFetch } from '../../../api/api';
import { useParams } from 'react-router-dom';
import SettlementEdit1 from './SettlementEdit1';
import SettlementEdit2 from './SettlementEdit2';
import Loading from '../../../components/Admin/layout/Loading';

export default function SettlementEdit(props) {
    const params = useParams();
    const dataForm = useFetch(['get', '/admin/settlement/' + params.id,]);
    const { data: settlement } = useFetch(['get', '/admin/settlementInfo']);
    const { data: perm } = useFetch(['get', '/admin/permissions']);
    const SettlementRender = useMemo(() => {
        return (
            <div>
                {
                    dataForm?.loading ? <Loading /> : <>
                        {dataForm?.data?.type == 1 && <SettlementEdit1 dataForm={dataForm?.data} refetch={dataForm.revalidate} data={settlement} perm={perm} />}
                        {dataForm?.data?.type == 2 && <SettlementEdit2 dataForm={dataForm?.data} refetch={dataForm.revalidate} perm={perm} />}
                    </>
                }

            </div>
        )
    }, [dataForm?.data]);
    return (
        SettlementRender
    )
}
