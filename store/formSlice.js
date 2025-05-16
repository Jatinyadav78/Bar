import { createSlice, current } from "@reduxjs/toolkit";

const initialState = [];

const formSlice = createSlice({
  name: 'fieldState',
  initialState,
  reducers: {
    updateInitialState: (state, action) => {
      return action?.payload?.flatMap(section => ({
        sectionName: section?.sectionName,
        responses: section?.fields.flatMap((field) => {
          const inputLength = field?.input.length;
          if (inputLength === 1) {
            return ({
              responseType: field?.input[0]?.responseType,
              question: field?.input[0]?.label,
              answer: ''
            })
          }
          const matrixResponses = [];
          for (let i = 0; i < field?.matrixFieldCount; i++) {
            matrixResponses.push({
              responseType: 'Matrix',
              question: field?.name + i,
              answer: field?.input.map(input => ({
                responseType: input?.responseType,
                question: input?.label,
                answer: ''
              }))
            });
          }
          return matrixResponses;
        })
      }));
    },
    updateField: (state, action) => {
      return state.map(section => {
        if (section?.sectionName === action?.payload?.sectionName) {
          return {
            ...section,
            responses: section?.responses.map(field =>
              field?.question === action?.payload?.question
                ? { ...field, answer: action?.payload?.answer }
                : field
            )
          };
        }

        return section;
      });
    },
    updateMatrixField: (state, action) => {
      return state.map(section => {
        if (section?.sectionName === action?.payload?.sectionName) {
          return {
            ...section,
            responses: section?.responses.map(field => {
              if (field?.question === action?.payload?.name) {
                return {
                  ...field,
                  answer: field?.answer.map(ans =>
                    ans?.question === action?.payload?.question
                      ? { ...ans, answer: action?.payload?.answer }
                      : ans)
                };
              }
              return field
            })
          };
        }
        return section;
      });

    },
    createNewMatrix: (state, action) => {
      const section = state.find(section => section.sectionName === action?.payload?.sectionName);
      if (section) {
        const field = section.responses.find(field => field.question === action?.payload?.prevMatrixName);
        if (field) {
          section.responses.push({
            responseType: 'Matrix',
            question: action?.payload?.newMatrixName,
            answer: field?.answer?.map(input => ({
              ...input,
              answer: ''
            }))
          })
        } else {
          section.responses.push({
            responseType: 'Matrix',
            question: action?.payload?.newMatrixName,
            answer: action?.payload?.input?.map(input => ({
              responseType: input?.responseType,
              question: input?.label,
              answer: ''
            }))
          })
        }
      }
    },
    deleteMatrix: (state, action) => {
      const section = state.find(section => section.sectionName === action?.payload?.sectionName);
      if (section) {
        // Filter out the item to delete
        section.responses = section.responses.filter(field => field.question !== action.payload.matrixNameToDelete);
        const regex = new RegExp(`${action?.payload?.matrixName}(\\d+)`);
        
        // Shift the subsequent Person
        section.responses.forEach(field => {
          const match = field.question.match(regex);
          if (match && Number(match[1]) > action?.payload?.matrixIndex) {
            field.question = `Person${Number(match[1]) - 1}`;
          }
        });
      }
    }
  }
});

export const formAction = formSlice.actions;
export default formSlice.reducer;