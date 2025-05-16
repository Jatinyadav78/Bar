import React, { useState, useEffect } from "react";
import Styles from "./formPlayground.module.css";
import Layout from "../layout/layout";
import Form from "../form/form";
import Stepper from "../stepper/stepper.js";
import Permit from "../permit/permit.js";
import Status from "../status/status.js";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { formAction } from "../../store/formSlice.js";
import registration from "./registration.json";
import moment from 'moment'
import Modal from "../ui/modal/modal.js";
import { getLocalStorage } from "../../helperFunction/localStorage.js";
import { api } from "../../utils";

const data = {
  "_id": "660515ba0b107057f8c36c3a",
  "name": "Static Fire Work Permit ",
  "description": "Permit Requied for fire works",
  "sections": [
    {
      "_id": "660509d7887a6c955cc2cd49",
      "sectionName": "Registration",
      "instruction": [],
      "fields": [
        {
          "_id": "660509d7887a6c955cc2cd4a",
          "name": "Contractor",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd4b",
              "label": "Contractor",
              "responseType": "text",
              "placeholder": "Enter you name",
              "displayOrder": 1,
              "minLength": null,
              "maxLength": null
            }
          ]
        }, {
          "_id": "660509d7887a6c955cc2cd4a",
          "name": "Contractor",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd4b",
              "label": "Date",
              "responseType": "date",
              "placeholder": null,
              "displayOrder": 1,
              "minLength": null,
              "maxLength": null
            }
          ]
        }, {
          "_id": "660509d7887a6c955cc2cd4a",
          "name": "Contractor",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd4b",
              "label": "time",
              "responseType": "time",
              "placeholder": null,
              "displayOrder": 1,
              "minLength": null,
              "maxLength": null
            }
          ]
        },
        {
          "_id": "660509d7887a6c955cc2cd4c",
          "name": "Contactor ESI No.",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": false,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd4d",
              "label": "Contractor ESI No.",
              "responseType": "text",
              "placeholder": "",
              "displayOrder": 2,
              "minLength": null,
              "maxLength": null
            }
          ]
        },
        {
          "_id": "660509d7887a6c955cc2cd4e",
          "name": "Department",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": false,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd4f",
              "label": "Department",
              "responseType": "text",
              "placeholder": "",
              "displayOrder": 3,
              "minLength": null,
              "maxLength": null
            }
          ]
        },
        {
          "_id": "660509d7887a6c955cc2cd50",
          "name": "Location",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [{
                "check": [{
                  "label": 'Work by',
                  "value": 'Internal'
                }],
                "options": [
                  "qwerty",
                  "asdf",
                  "uiop",
                  "ghkl",
                ]
              }, {
                "check": [{
                  "label": 'Date',
                  "value": '2024-05-09'
                }],
                "options": [
                  "dsfsdfs",
                  "sdfsdfsdf"
                ]
              }, {
                "check": [{
                  "label": 'Date',
                  "value": '2024-05-08'
                }, {
                  "label": 'Work by',
                  "value": 'External'
                }],
                "options": [
                  "abhishek",
                  "naman"
                ]
              }],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": false,
              "isDisabled": false,
              "options": [
                "NI",
                "J1",
                "J2"
              ],

              "_id": "660509d7887a6c955cc2cd51",
              "label": "Location",
              "responseType": "select",
              "displayOrder": 4,
              "minLength": null,
              "maxLength": null
            }
          ]
        },
        {
          "_id": "660509d7887a6c955cc2cd52",
          "name": "Work by",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [
                "External",
                "Internal"
              ],
              "_id": "660509d7887a6c955cc2cd53",
              "label": "Work by",
              "responseType": "radio",
              "displayOrder": 5,
              "minLength": null,
              "maxLength": null
            }
          ]
        },
        {
          "_id": "660509d7887a6c955cc2cd54",
          "name": "Valid",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [{
                // "sectionName":"Registration",
                "label": "Location",
                "value": "J1"
              }, {
                "label": 'Work by',
                "value": "External"
              }],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd55",
              "label": "Valid(HH:MM)",
              "responseType": "dateRange",
              "displayOrder": 6,
              "minLength": null,
              "maxLength": null
            }
          ]
        },
        {
          "_id": "660509d7887a6c955cc2cd54",
          "name": "Person",
          "matrixFieldCount": 0,
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd55",
              "label": "Name",
              "responseType": "text",
              "displayOrder": 7,
              "minLength": null,
              "maxLength": null
            },
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd55",
              "label": "ESI number",
              "responseType": "text",
              "displayOrder": 7,
              "minLength": null,
              "maxLength": null
            },
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": false,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd55",
              "label": "contact",
              "responseType": "number",
              "displayOrder": 7,
              "minLength": null,
              "maxLength": null
            },
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": false,
              "isDisabled": false,
              "options": [],
              "_id": "660509d7887a6c955cc2cd55",
              "label": "address",
              "responseType": "text",
              "displayOrder": 7,
              "minLength": null,
              "maxLength": null
            }
          ]
        }
      ]
    },
    {
      "_id": "66050c9e887a6c955cc2cd59",
      "sectionName": "Area ",
      "instruction": [],
      "fields": [
        {
          "_id": "66050c9e887a6c955cc2cd5a",
          "name": "Permit Type",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [
                "Hot Work Permit",
                "Electrical Work Permit",
                "General Work Permit"
              ],
              "_id": "66050c9e887a6c955cc2cd5b",
              "label": "Permit Type",
              "responseType": "select",
              "displayOrder": 1,
              "minLength": null,
              "maxLength": null
            }
          ]
        },
        {
          "_id": "66050c9e887a6c955cc2cd5c",
          "name": "Plant layout of working area",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "66050c9e887a6c955cc2cd5d",
              "responseType": "image",
              "displayOrder": 2,
              "label": "Plant Layout",
              "minLength": null,
              "maxLength": null
            }
          ]
        },
        {
          "_id": "66050c9e887a6c955cc2cd5e",
          "name": "Select working portion area",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [
                "Area 1",
                "Area 2",
                "Area 3",
                "Area 3"
              ],
              "_id": "66050c9e887a6c955cc2cd5f",
              "label": "Select work area",
              "responseType": "multiSelect",
              "displayOrder": 3,
              "minLength": null,
              "maxLength": null
            }
          ]
        }
      ]
    },
    {
      "_id": "6605138a0b107057f8c36c0c",
      "sectionName": "Inspection",
      "instruction": [],
      "fields": [
        {
          "_id": "660515630b107057f8c36c16",
          "name": "IS the electrical /panel transformer is de-energize before doin the work",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": false,
              "isDisabled": false,
              "options": [
                "Yes",
                "No",
                "N/A"
              ],
              "_id": "660515630b107057f8c36c17",
              "label": "IS the electrical /panel transformer is de-energize before doin the work",
              "minLength": 0,
              "maxLength": 0,
              "displayOrder": 1,
              "responseType": "inspection"
            }
          ]
        },
        {
          "_id": "660515630b107057f8c36c18",
          "name": "Is work area and surrounding is cleared and barricaded with caution sign",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [
                "Yes",
                "No",
                "N/A"
              ],
              "_id": "660515630b107057f8c36c19",
              "label": "Is work area and surrounding is cleared and barricaded with caution sign",
              "displayOrder": 2,
              "minLength": 0,
              "maxLength": 0,
              "responseType": "inspection"
            }
          ]
        },
        {
          "_id": "660515630b107057f8c36c1a",
          "name": "Is workmen is competent & wearing HT/LT gloves, goggles and safety shoes and PPE's are in good condition. (Competent - Person holding the certificate/ diploma /degree)",
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [
                "Yes",
                "No",
                "N/A"
              ],
              "_id": "660515630b107057f8c36c1b",
              "label": "Is workmen is competent & wearing HT/LT gloves, goggles and safety shoes and PPE's are in good condition. (Competent - Person holding the certificate/ diploma /degree)",
              "displayOrder": 3,
              "minLength": 0,
              "maxLength": 0,
              "responseType": "inspection"
            }
          ]
        }
      ]
    },
    {
      "_id": "660513450b107057f8c36bfb",
      "sectionName": "Atmospheric Test",
      "instruction": [],
      "fields": [
        {
          "_id": "660513450b107057f8c36bfc",
          "name": "Oxygen",
          "matrixFieldCount": 0,
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": "matirx",
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660513450b107057f8c36bfd",
              "label": "Level",
              "responseType": "number",
              "displayOrder": 1,
              "minLength": 0,
              "maxLength": 0
            },
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660513450b107057f8c36bfe",
              "label": "Time",
              "responseType": "dateRange",
              "placeholder": "",
              "displayOrder": 1,
              "minLength": 0,
              "maxLength": 0
            },
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [
                "Yes",
                "No",
                "NA"
              ],
              "_id": "660517930b107057f8c36c75",
              "label": "Yes/No/NA",
              "responseType": "radio",
              "displayOrder": 1,
              "minLength": 0,
              "maxLength": 0
            }
          ]
        },
        {
          "_id": "660513450b107057f8c36c01",
          "name": "carbon monoxide",
          "matrixFieldCount": 1,
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660513450b107057f8c36c02",
              "label": "Level",
              "responseType": "number",
              "displayOrder": 2,
              "minLength": 0,
              "maxLength": 0
            },
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660513450b107057f8c36c03",
              "label": "Time",
              "responseType": "dateRange",
              "displayOrder": 2,
              "minLength": 0,
              "maxLength": 0
            },
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [
                "Yes",
                "No",
                "N/A"
              ],
              "_id": "660513450b107057f8c36c04",
              "label": "Yes/No/NA",
              "responseType": "radio",
              "displayOrder": 2,
              "minLength": 0,
              "maxLength": 0
            }
          ]
        },
        {
          "_id": "660513450b107057f8c36c05",
          "name": "Flamability",
          "matrixFieldCount": 1,
          "input": [
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660513450b107057f8c36c06",
              "label": "Level",
              "responseType": "number",
              "displayOrder": 3,
              "minLength": 0,
              "maxLength": 0
            },
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [],
              "_id": "660513450b107057f8c36c07",
              "label": "Time",
              "responseType": "dateRange",
              "displayOrder": 3,
              "minLength": 0,
              "maxLength": 0
            },
            {
              "icon": null,
              "conditionalOptions": [],
              "actionType": null,
              "guard": null,
              "errorMessage": null,
              "visibleIf": [],
              "isRequired": true,
              "isDisabled": false,
              "options": [
                "Yes",
                "No",
                "NA"
              ],
              "_id": "660513450b107057f8c36c08",
              "label": "Yes/No/NA",
              "responseType": "radio",
              "displayOrder": 3,
              "minLength": 0,
              "maxLength": 0
            }
          ]
        }
      ]
    }
  ]
}
const FormPlayground = ({ id, orgId, validTill }) => {
  const user = getLocalStorage('user');

  const [resData, setResData] = useState([])
  const [permit, setPermit] = useState();
  const [sectionLength, setSectionLength] = useState(0)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [sectionNames, setSectionNames] = useState([])
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [linkExpired, setLinkExpired] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [formName, setFormName] = useState(null)
  const [warningModal, setWarningModal] = useState(false)
  const [warningAcknowledged, setWarningAcknowledged] = useState(false)
  const [departments, setDepartments] = useState([])
  const dispatch = useDispatch();

  const department = useSelector((state) => {
    const section = state.form?.find(obj => obj.sectionName === "Registration");
    const questionObj = section?.responses?.find(obj => obj.question === "Department");
    return questionObj?.answer;
  },shallowEqual)

  const fetchData = async () => {
    try {
      // throw new Error('hi')
      const response = await axios.get(`v1/smart-form/form-templates/${id}`)
      const depResponse = await axios.get(`v1/departments/?organizationId=${orgId}`)
      setDepartments(depResponse?.data)
      response.data.sections.unshift(registration)
      changeFormName(response?.data?.name)
      dispatch(formAction.updateInitialState(response.data.sections))
      setResData([{ "sectionName": "Important Terms" }, ...response.data.sections, { "sectionName": "permit" }])
    } catch (error) {
      console.error("error in getting form data:", error)
      changeFormName(data?.name)
      dispatch(formAction.updateInitialState(data.sections))
      setResData([...data.sections, { "sectionName": "permit" }])
    }
  }

  const fetchImage = async () => {
    try {
      const response = await axios.get(`v1/work-permit/organizations/${orgId}`)
      const url = api + response?.data?.image;
      console.log("url::",url)
      setImageUrl(url);
    } catch (error) {
      console.error("error while fetching image::", error)
    }
  }

  const changeFormName = (name) => {
    setFormName(name);
  }

  const nextSection = (data=[]) => {
    // e.preventDefault();
    const esiNumberRegex = /ESI\s*number/i;
    const hasInvalidESINumber = Object.keys(data).some((key) =>
      esiNumberRegex.test(key) && !data[key]
    );
    if (!warningAcknowledged) {
      setWarningModal(hasInvalidESINumber);
    }
    if (!hasInvalidESINumber || warningAcknowledged) {
      setSectionIndex(sectionIndex + 1)
      setWarningAcknowledged(false)
    }
  }
  const prevSection = () => {
      setSectionIndex(sectionIndex - 1)
  }

  const increaseMatrixFieldCount = (sectionName, matrixName, matrixIndex, input) => {
    let matrixFieldNumber;
    const updatedFormData = resData.map((obj) => {
      if (obj.sectionName === sectionName) {
        obj.fields.map((field) => {
          if (field.name === matrixName) {
            matrixFieldNumber = field.matrixFieldCount;
            field.matrixFieldCount = field.matrixFieldCount + 1;
          }
          return field
        })
      }
      return obj;
    })
    const newMatrixName = matrixName + matrixFieldNumber;
    const prevMatrixName = matrixName + matrixIndex
    setResData(updatedFormData);
    dispatch(formAction.createNewMatrix({ sectionName, prevMatrixName, newMatrixName, input }))
  }

  const decreaseMatrixFieldCount = (sectionName, matrixName, matrixIndex) => {
    let matrixFieldNumber;
    const updatedFormData = resData.map((obj) => {
      if (obj.sectionName === sectionName) {
        obj.fields.map((field) => {
          if (field.name === matrixName) {
            matrixFieldNumber = field.matrixFieldCount;
            field.matrixFieldCount = field.matrixFieldCount - 1;
          }
          return field
        })
      }
      return obj;
    })
    const matrixNameToDelete = matrixName + matrixIndex
    setResData(updatedFormData);
    dispatch(formAction.deleteMatrix({ sectionName, matrixNameToDelete, matrixName, matrixIndex }))
  }

   const updateFieldOptions = (sectionName, label, options) => {
    if (!resData || resData?.length === 0) {
      return;
    }
    const newFormData = resData?.map(obj => {
      if (obj?.sectionName === sectionName) {
        obj?.fields?.map(field => {
          if (field?.name === label) {
            field.input[0].options = options ? options : [];
            return field;
          }
          return field;
        })
      }
      return obj;
    })
    setResData(newFormData)
  }

  const handleSubmit = async (response) => {
    const vendorState = {};
    const filterDepartment = departments?.find(dep => dep?.name === department);
    response[0]?.responses?.forEach(item => {
      if (item.question && item.answer) {
        vendorState[item.question.toLowerCase()] = item.answer;
      }
    });
    
    const reqBody = {
      vendorDetail: vendorState,
      orgId: orgId,
      departmentId:filterDepartment?._id,
      formId: id,
      formName: formName,
      response: response,
      timestamp: moment()
    }
    try {
      const response = await axios.post(`v1/work-permit/response`, reqBody)
      if (response.status === 201) {
        setSectionIndex(sectionIndex + 1);
        setPermit(response.data.permitNumber);
      }
    } catch (error) {
      console.error("error while submitting form:", error)
      setError(true);
      setErrorMsg("form is not valid")
    }
  }

  useEffect(() => {
    const currentTime = new Date();
    const linkValidationTime = new Date(decodeURIComponent(validTill));
    // console.log("linktime::", linkValidationTime)
    if (!validTill || currentTime > linkValidationTime) {
      setLinkExpired(true);

      return;
    }
    fetchData();
    fetchImage();
  }, [])

  useEffect(() => {
    setSectionNames(resData.map((section) => (section.sectionName)))
    setSectionLength(resData.length)
  }, [resData])

  useEffect(()=>{
    if(resData?.length){
      const options = departments?.map(option => option?.name);
      updateFieldOptions('Registration','Department',options)
    }
  },[departments])

  return (
    <>
      <Layout formName={formName}>
        <div id='home' className={Styles.main}>
          <div className={Styles.exitBtnContainer}>
            {/* <button className={Styles.exitBtn}>Exit</button> */}
          </div>
          {linkExpired ?
            <h1 className={Styles.error}>
              Form Link Is Expired, Contact In Plant
            </h1> :
            <>
              <div className={Styles.stepper}>
                <Stepper titles={sectionNames} activeStep={sectionIndex} />
              </div>
              <div id='mainContent' className={Styles.mainContent}>
                {resData.map((section, index) => {
                  if (index === sectionIndex) {
                    if (section.sectionName === "permit") {
                      return (
                        <Permit
                          key={index}
                          permitNumber={permit}
                          heading={`Permit Id Request-${permit}`}
                          title={`your request has be done`}
                        />
                      );
                    }
                    if (section.sectionName === 'status') {
                      return (section.data.map(({ title, details, status }) => {
                        return (<Status key={index} title={title} details={details} status={status} />)
                      }))
                    }
                    return (<Form
                      key={index}
                      index={index}
                      sectionName={section.sectionName}
                      fields={section.fields}
                      sectionLength={sectionLength}
                      imageUrl={imageUrl}
                      increaseMatrixFieldCount={increaseMatrixFieldCount}
                      decreaseMatrixFieldCount={decreaseMatrixFieldCount}
                      nextSection={nextSection}
                      prevSection={prevSection}
                      onSubmit={handleSubmit}
                      error={error}
                      formErrorMsg={errorMsg}
                    />)
                  }
                })
                }

                <Modal isOpen={warningModal} heading={'Warning'} onClose={() => { setWarningModal(false); setWarningAcknowledged(true) }}>
                  <p><strong>Please be advised that if the ESI (Employee State Insurance) number is not provided for each worker, the contractor will be solely responsible for any health-related expenses incurred due to worker injuries during construction work. The company will not assume any responsibility for such costs.</strong></p>
                  <p><strong>It is crucial to ensure that all workers are covered under ESI to avoid any liability issues.</strong></p>
                </Modal>
              </div>
            </>}
        </div>
      </Layout>
    </>
  )
}
export default FormPlayground;
