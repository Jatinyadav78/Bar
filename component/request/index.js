'use client'
import React, { useEffect, useState } from 'react';
import Styles from './index.module.css'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import RequestDesign from '../../public/requestPage.svg';
import Image from 'next/image';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import Request from './request.js';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import Response from '../Response/index.js'
import Paginator from '../ui/paginator/paginator.js';
import Button from '@mui/material/Button';
import Modal from '../ui/modal/filterModal.js'
import { getLocalStorage } from '../../helperFunction/localStorage';
import RequestSkeleton from './requestSkeleton.js'
import { Suspense } from 'react'
import NotFound from '../error/notFound.js';
import { formatDate } from '../../helperFunction/dateTimeFormat';
// const requestData = [
//   {
//     "permitNumber": 6663558215866,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-09T12:39:15.821Z",
//     "updatedAt": "2024-04-09T12:39:15.821Z",
//     "status": "approved",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 6436682993124,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-09T06:21:08.298Z",
//     "updatedAt": "2024-04-09T06:21:08.298Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 6433033471317,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-09T06:15:03.347Z",
//     "updatedAt": "2024-04-09T06:15:03.347Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 6431461327145,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-09T06:12:26.132Z",
//     "updatedAt": "2024-04-09T06:12:26.132Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 6428140236104,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-09T06:06:54.022Z",
//     "updatedAt": "2024-04-09T06:06:54.022Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 6422491495983,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-09T05:57:29.148Z",
//     "updatedAt": "2024-04-09T05:57:29.148Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 6419061838623,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-09T05:51:46.183Z",
//     "updatedAt": "2024-04-09T05:51:46.183Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 5770258298300,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-08T11:50:25.829Z",
//     "updatedAt": "2024-04-08T11:50:25.829Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 5766170577699,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-08T11:43:37.057Z",
//     "updatedAt": "2024-04-08T11:43:37.057Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 5762125886313,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-08T11:36:52.588Z",
//     "updatedAt": "2024-04-08T11:36:52.588Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 5641604117667,
//     "vendorDetail": {
//       "_id": "6613a7c0040da652d00e16ad",
//       "name": "Naman",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308605"
//     },
//     "createdAt": "2024-04-08T08:16:00.411Z",
//     "updatedAt": "2024-04-08T08:16:00.411Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 5640895248036,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-08T08:14:49.524Z",
//     "updatedAt": "2024-04-08T08:14:49.524Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   },
//   {
//     "permitNumber": 5608419365035,
//     "vendorDetail": {
//       "_id": "660f81f7387af92bc4fb347a",
//       "name": "Naman Agawal",
//       "email": "naman.agarwal@jbmgroup.com",
//       "phone": "9829308602"
//     },
//     "createdAt": "2024-04-08T07:20:41.936Z",
//     "updatedAt": "2024-04-08T07:20:41.936Z",
//     "status": "pending",
//     "formDetail": {
//       "formId": "660515ba0b107057f8c36c3a",
//       "formName": "Fire Work Permit ",
//       "formDescription": "Permit Requied for fire works"
//     }
//   }
// ]

const Index = ({ status, pn }) => {
  const router = useRouter();
  const user = getLocalStorage('user')
  const Id = user?._id;
  const orgId = user?.organizationId;
  const [breadCrumbsStatus, setBreadCrumbsStatus] = useState(status)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [permitNumber, setPermitNumber] = useState(pn)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchRequest = async () => {
    try {
      // throw new Error('hi')
      const response = await axios.get(`v1/work-permit/response?orgId=${orgId}&userId=${Id}&status=${status}&departmentId=${user?.departmentId}`);
      setData(response?.data)
      setFilteredData(response?.data)
      setLoading(false)
    } catch (error) {
      // setData(requestData)
      // setFilteredData(requestData)
      console.error("error in fetching requests data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllRequest = async () => {
    try {
      // throw new Error('hi')
      const response = await axios.get(`v1/work-permit/response?orgId=${orgId}&userId=${Id}&departmentId=${user?.departmentId}`);
      setData(response?.data)
      setFilteredData(response?.data)
    } catch (error) {
      // setData(requestData)
      // setFilteredData(requestData)
      console.error("error in fetching requests data:", error)
    } finally {
      setLoading(false)

    }
  }

  const handleResponseClick = (permitNumber, formStatus) => {
    setPermitNumber(permitNumber)
    // setStatusMsg(formStatus)
  }
  //change breadCrumbsStatus according to response status of the form.
  const changeBreadCrumbsStatus = (rspStatus) => {
    setBreadCrumbsStatus(rspStatus)
  }

  const handleChangePage = (event) => {
    setPage(event)
  };
   
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event)
    setPage(1)
  };

  const handleAddImage = (permitNumber) => {
    router.push(`/image/${permitNumber}`)
  }

  const handleCancelBtn = async () => {
    if (pn) {
      router.push('/dashboard')
    } else {
      setPermitNumber(null);
    }
  }

  const changeFormStatus = () => {
    if (pn) {
      router.push('/dashboard')
    }
    // toast.success(response.data.message)
    if (status === 'request') {
      // setLoading(true)
      fetchAllRequest();
      setPermitNumber(null);
      return
    }
    setFilteredData(prev => prev?.filter((data) => permitNumber !== data?.permitNumber))
    setPermitNumber(null);
  };

  const handleSearch = (event) => {
    const search = event.target.value
    setSearchTerm(search)
    const searchItem = data?.filter((item) => {
      return item?.permitNumber.toString().includes(search) || item?.vendorDetail?.name.toLowerCase().replace(/\s/g, '').includes(search.toLowerCase().replace(/\s/g, '')) || item?.formDetail?.formName.toLowerCase().replace(/\s/g, '').includes(search.toLowerCase().replace(/\s/g, ''))
    })
    setFilteredData(searchItem)
  }

  const handleRemoveFilter = () => {
    setFilteredData(data);
  }

  const handleFilter = async (filterData) => {
    setLoading(true);
    const formattedDates = filterData?.dateFilter?.map(dateString => {
      const date = new Date(dateString);
      const formattedDate = formatDate(date);
      return `${formattedDate.year}-${formattedDate.month}-${formattedDate.day}`;
    });

    try {

      if (status === 'request') {
        const response = await axios.get(`v1/work-permit/response?orgId=${orgId}&userId=${Id}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}&departmentId=${user?.departmentId}`)
        setFilteredData(response?.data)
        return
      }
      const response = await axios.get(`v1/work-permit/response?orgId=${orgId}&userId=${Id}&startDate=${formattedDates[0]}&endDate=${formattedDates[1]}T23:59:59.999Z&status=${status}&departmentId=${user?.departmentId}`)
      setFilteredData(response?.data)
    } catch (error) {
      console.error("error in fetching filtered data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'request') {
      fetchAllRequest();
      return
    }
    if (!permitNumber) {
      fetchRequest();
    }

  }, [])

  return (
    <div className={Styles.requestPage}>
      <div className={Styles.searchBoxContainer}>
        <div className={Styles.requestName}>
          <Image
            priority
            src={RequestDesign}
            width={20}
            alt="icon"
            style={{ cursor: 'pointer' }}
            onClick={() => status && router.push('/dashboard')}
          />
          {status && <KeyboardArrowRightOutlinedIcon fontSize='medium' sx={{ color: "#ADADAD99" }} />}
          <div style={{ cursor: 'pointer' }} onClick={handleCancelBtn}>{breadCrumbsStatus}</div>
          {permitNumber && <KeyboardArrowRightOutlinedIcon fontSize='medium' sx={{ color: "#ADADAD99" }} />}
          <div>{permitNumber}</div>
        </div>
        {!permitNumber && <div className={Styles.search}>
          <TextField
            style={{ width: "48%" }}
            id="outlined-basic"
            placeholder="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size='small' sx={{ color: '#595A5B99' }} />
                </InputAdornment>
              ),
            }}
          />
          {/*filter button */}
          <div style={{ width: '48%', position: 'relative' }}>
            {<Modal handleFilter={handleFilter} handleRemoveFilter={handleRemoveFilter} />}
          </div>
        </div>}
      </div>
      <div className={Styles.request}>
        {/*list of forms request for approval */}
        {!permitNumber && (loading ? <RequestSkeleton /> : filteredData.length === 0 ? (<div style={{ height: '70vh' }}><NotFound /></div>) : filteredData.map((data, index) => {
          if (((page - 1) * rowsPerPage) <= index && index < (page * rowsPerPage)) {
            return (<Request key={index} data={data} handleOnClick={handleResponseClick} handleAddImage={handleAddImage} />)
          }
        }))}

        {permitNumber && <Response permitNumber={permitNumber} Id={Id} changeFormStatus={changeFormStatus} handleCancelBtn={handleCancelBtn} changeBreadCrumbsStatus={changeBreadCrumbsStatus} status={status} handleAddImage={handleAddImage} />}
      </div>
      {/*pages and no. of rows for showing data */}
      {!permitNumber && filteredData.length !== 0 && <div style={{ margin: '30px' }}>
        <Paginator
          total={filteredData.length}
          dataLimit={rowsPerPage}
          page={page}
          limitOptions={[10, 20, 30]}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage} />
      </div>}
    </div>

  )
}

export default Index;