import React, { useState } from 'react'
import { Pagination, Toggle, SelectPicker, TagPicker, InputNumber } from 'rsuite';

const CustomPaginator = ({total, dataLimit, page, limitOptions, handleChangePage, handleChangeRowsPerPage}) => {
    const [activePage, setActivePage] = useState(page);
    const [limit, setLimit] = useState(dataLimit);

    const handlePageChange = (event)=>{
        setActivePage(event)
        handleChangePage(event)
    }

    const handleChangeLimit = (event)=>{
        setLimit(event)
        setActivePage(1)
        handleChangeRowsPerPage(event)
    }

    return (
        <>
            <Pagination
                layout={['total', '-','|', 'pager', '|', 'limit']}
                size='sm'
                prev
                next
                ellipsis
                boundaryLinks
                total={total}
                limit={limit}
                limitOptions={limitOptions}
                maxButtons={3}
                activePage={activePage}
                onChangePage={handlePageChange}
                onChangeLimit={handleChangeLimit}
            />
        </>
    );
};

export default CustomPaginator;
