'use client'
import React, { useEffect, useState } from 'react';
import Styles from './dashboardHome.module.css';
import Image from 'next/image';
import DashboardDesign from '../../public/dashboardDesign.svg';
import Card from '../ui/card/card.js';
import Graph from '../ui/graph/graph.js';
import Request from '../request/request.js';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Modal from '../ui/modal/modal.js'
import { SelectPicker } from 'rsuite';
import InputAdornment from '@mui/material/InputAdornment';
import { ContentCopy } from "@mui/icons-material";
import Box from '@mui/material/Box';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import BusinessIcon from '@mui/icons-material/Business';
import IconButton from "@mui/material/IconButton";
import { getLocalStorage, removeItemLocalStorage } from '../../helperFunction/localStorage.js';
import { useForm } from "react-hook-form";
import FormHelperText from '@mui/material/FormHelperText';
import { toast } from "react-toastify";
import RequestSkeleton from '../request/requestSkeleton';
import CardSkeleton from '../ui/card/cardSkeleton.js';
import NotFound from '../error/notFound.js'
import copy from 'copy-to-clipboard';

const DashboardHome = () => {
  const router = useRouter();
  const user = getLocalStorage('user');
  const isAdmin = user?.role === 'admin';
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [permitForm, setPermitForm] = useState([])
  const [selectValue, setSelectValue] = useState();
  const [sendViaEmail, setSendViaEmail] = useState(false)
  const [requestData, setRequestData] = useState([])
  const [graphXdata, setGraphXdata] = useState(null)
  const [graphActive, setGraphActive] = useState(null)
  const [graphClosed, setGraphClosed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cardObj, setCardObj] = useState([
    { status: 'request', count: 0 },
    { status: 'pending', count: 0 },
    { status: 'approved', count: 0 },
    { status: 'rejected', count: 0 },
    { status: 'closed', count: 0 },
  ])

  const { register, handleSubmit, setError, setValue, trigger, formState: { errors }, reset } = useForm();

  const handleAddImage = (permitNumber) => {
    router.push(`/image/${permitNumber}`)
  }

  const handleCard = async (title) => {
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push(`/status/${title}`);
  }

  const handleOnClick = (permitNumber, status) => {
    router.push(`/status/${status}/${permitNumber}`)
  }

  const handleSelectChange = (event) => {
    setValue('selectForm', event)
    setSelectValue(event)
    trigger('selectForm')
  }

  const handleModalClose = () => {
    setSendViaEmail(false)
    setIsModalOpen(false)
    setSelectValue(null);
  }

  const handleDepartments = () => {
    router.push('/departments');
  }

  const onSubmit = (data) => {
    sendEmail(data.email)
    handleModalClose();
  }

  const sendEmail = async (email) => {
    const reqBody = {
      email: email,
      link: selectValue
    }
    try {
      const response = await axios.post(`v1/work-permit/sendLink`, reqBody)
      toast.success('e-mail sent')
    } catch (error) {
      console.error("error in sending emal", error)
      toast.error('e-mail is not sent')
    }
  }

  useEffect(() => {
    const fetchPermitForm = async () => {
      const token = await getLocalStorage('token')
      const orgId = await getLocalStorage("user")?.organizationId;
      const config = {
        headers: {
          'Authorization': `Bearer ${token.access.token}`,
          'Content-Type': 'application/json'
        }
      };
      try {
        const response = await axios.get(`v1/work-permit/form?orgId=${orgId}`, config)
        const form = response?.data?.form?.map((obj) => ({ label: obj.name, value: obj.link }))
        setPermitForm(form)
      } catch (error) {
        console.error("error in fetching permit Form:", error)
      }
    }
    if (isModalOpen) {
      fetchPermitForm()
    }
    reset()
  }, [isModalOpen])

  useEffect(() => {
    const fetchData = async () => {
      const Id = await getLocalStorage("user")?._id;
      const orgId = await getLocalStorage("user")?.organizationId;
      try {
        const graphResponse = await axios.get(`v1/work-permit/form-response-counts?orgId=${orgId}&departmentId=${user?.departmentId}`);
        const cardResponse = await axios.get(`v1/work-permit/response?orgId=${orgId}&userId=${Id}&groupBy=status&departmentId=${user?.departmentId}`);
        const sumOfCounts = cardResponse.data.reduce((total, obj) => total + obj.count, 0);
        cardResponse.data.unshift({ status: 'request', count: sumOfCounts })
        const requestResponse = await axios.get(`v1/work-permit/response?orgId=${orgId}&userId=${Id}&departmentId=${user?.departmentId}`);
        setRequestData(requestResponse?.data?.slice(0, 10))
        setCardObj(cardResponse?.data);
        setGraphXdata(graphResponse?.data?.map(obj => obj?.formName));
        setGraphActive(graphResponse?.data?.map(obj => obj?.active))
        setGraphClosed(graphResponse?.data?.map(obj => obj?.closed))
        setLoading(false)
      } catch (error) {
        console.error("error in fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
      <div className={Styles.dashboardContainer}>
        <Image
          className={Styles.dashboardImage}
          priority
          src={DashboardDesign}
          alt="submitted"
        />
        <div className={Styles.main}>
          <div className={Styles.header}>
            <div className={Styles.title}></div>
            <div className='d-flex'>
              <div style={{ color: 'black', marginRight: '10px' }}>
                <IconButton aria-label="qrScanner" style={{color:'black',position:'relative', bottom:'8px'}} onClick={()=> router.push('/scanner')}>
                  <QrCodeScannerIcon fontSize='large'/>
                </IconButton>
              </div>
              {isAdmin && (
                <div style={{ marginRight: '10px' }}>
                  <Button
                    variant='contained'
                    style={{ backgroundColor: '#0073FF' }}
                    startIcon={<BusinessIcon />}
                    onClick={handleDepartments}
                  >
                    Departments
                  </Button>
                </div>
              )}
              <div>
                <Button
                  variant='contained'
                  style={{ backgroundColor: '#0073FF' }}
                  startIcon={<AddIcon />}
                  onClick={() => setIsModalOpen(prev => !prev)}
                >permit Form</Button>
                <Modal isOpen={isModalOpen} onClose={handleModalClose} heading={'Permit Form'} >
                  <Box sx={{ width: "100%" }} >
                    <form className={Styles.form} onSubmit={handleSubmit(onSubmit)}>
                      <div>
                        <label htmlFor='selectForm'>Select Form</label>
                        <SelectPicker
                          id='form'
                          {...register("selectForm", { required: 'please select an option' })}
                          value={selectValue}
                          onChange={handleSelectChange}
                          data={permitForm}
                          searchable={false}
                          style={{ width: "100%" }}
                        />
                        {errors.selectForm && <FormHelperText error>{errors.selectForm.message}</FormHelperText>}
                      </div>
                      <label>Link
                        <TextField
                          disabled
                          defaultValue={selectValue}
                          size='small'
                          InputProps={{
                            endAdornment: <InputAdornment position="end">
                              <IconButton
                                onClick={() => {
                                  if (selectValue) {
                                    try {
                                      copy(selectValue)
                                      toast('link copied!')
                                    } catch (error) {
                                      toast('Copy failed try manually')
                                    }
                                    return
                                  }
                                  setError('selectForm', { message: 'please select an option' })
                                }}
                                style={{
                                  borderRadius: 50,
                                }}
                                color="primary"
                              >
                                <ContentCopy />
                              </IconButton>
                            </InputAdornment>,
                          }}
                          fullWidth
                        /></label>
                      {sendViaEmail && <>
                        <label>Email Id</label>
                        <TextField
                          type='email'
                          {...register("email", { required: 'email is required' })}
                          placeholder='Email'
                          size='small'
                          fullWidth
                          error={errors?.email ? true : false}
                          helperText={errors.email && errors?.email?.message}
                        />
                      </>
                      }
                      <div className={Styles.buttonCont} >
                        <Button
                          style={{ height: '34px' }}
                          variant='outlined'
                          onClick={handleModalClose}>
                          close
                        </Button>
                        <div className={Styles.copyBtn}>
                          <Button
                            style={{ marginRight: '3px' }}
                            variant='contained'
                            onClick={() => {
                              if (selectValue) {
                                try {
                                  copy(selectValue)
                                  toast('link copied!')
                                } catch (error) {
                                  toast('Copy failed try manually')
                                }
                                return
                              }
                              setError('selectForm', { message: 'please select an option' })
                            }}>
                            copy Link
                          </Button>
                          {!sendViaEmail && <Button
                            variant='contained'
                            onClick={() => setSendViaEmail(true)}
                          >
                            send via email
                          </Button>}
                          {sendViaEmail && <Button
                            type='submit'
                            variant='contained'
                            onClick={() => setSendViaEmail(true)}
                          >
                            send
                          </Button>}
                        </div>
                      </div>
                    </form>
                  </Box>
                </Modal>
              </div>
            </div>
          </div>
          <div className={`${Styles.card} row-gap-3 mt-2`}>
            {loading ? cardObj.map((card, index) => (<CardSkeleton key={index} />)) : cardObj.map((card, index) => {
              return <Card key={index} title={card.status} number={card.count} handleClick={handleCard} />
            })}
          </div>
          <div className='row gap-5 mt-4 justify-content-center'>
            <div className={`${Styles.graph} ${Styles.border} col-lg-6`}>
              <div className={Styles.graphTitle}>Work Permit Issued</div>
              <div>
                <Graph activeYData={graphActive} closedYData={graphClosed} xdata={graphXdata} />
              </div>
            </div>
            <div className={`${Styles.recentRequest} ${Styles.border} col-lg-5`}>
              <div className='w-100'>
                <div className={Styles.recentReqTitle}>Recent Request</div>
                <div className={Styles.request}>
                  {loading ? <RequestSkeleton /> : requestData.length === 0 ? <NotFound /> : requestData.map((data, index) => (<Request key={index} data={data} handleOnClick={handleOnClick} handleAddImage={handleAddImage} />))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default DashboardHome