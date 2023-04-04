import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { questionApi } from "../../http/services";

const initialState = {
  tableData: [],
  questionData: [],
};

export const fetchQuestionsDataThunk = createAsyncThunk(
  "questions/getQuestion",
  async () => {
    return await questionApi.getQuestions();
  }
);

export const fetchQuestionByIdThunk = createAsyncThunk(
  "question/getQuestionById",
  async (args) => {
    return await questionApi.getQuestionById(args);
  }
);

export const insertNewQuestionThunk = createAsyncThunk(
  "questions/insert",
  async (args) => {
    return await questionApi.createQuestion(args);
  }
);

export const deleteQuestionThunk = createAsyncThunk(
  "questions/delete",
  async (args) => {
    return await questionApi.deleteQuestion(args.id);
  }
);

export const updateQuestionThunk = createAsyncThunk(
  "questsions/update",
  async (args) => {
    return await questionApi.updateQuestion(
      args.updateData.id,
      args.updateObject
    );
  }
);

export const updateQuestionActivityThunk = createAsyncThunk(
  "question/updateActivity",
  async (args) => {
    return await questionApi.updateQuestionActivity(args.id, args.activity);
  }
);

const prepareDataForLocalization = (data) => {
  var tableData = [];
  data.answers.sort((a, b) => a.locale.localeCompare(b.locale));
  data.questions.sort((a, b) => a.locale.localeCompare(b.locale));
  let length =
    data.answers.length > data.questions.length
      ? data.answers.length
      : data.questions.length;
  for (var i = 0; i < length; i++) {
    var object = {
      id: data.id,
      locale:
        data.answers.length - 1 < i
          ? data.questions[i].locale
          : data.answers[i].locale,
      question: data.questions.length - 1 < i ? "" : data.questions[i].value,
      answer: data.answers.length - 1 < i ? "" : data.answers[i].value,
    };
    tableData = [...tableData, object];
  }
  return tableData;
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchQuestionsDataThunk.fulfilled, (state, action) => {
      return { ...state, tableData: action.payload };
    });
    builder.addCase(fetchQuestionByIdThunk.fulfilled, (state, action) => {
      return {
        ...state,
        questionData: prepareDataForLocalization(action.payload),
      };
    });
    builder.addCase(fetchQuestionByIdThunk.rejected, (state, action) => {
      return { ...state, questionData: [] };
    });
  },
});

const { reducer } = questionSlice;
export { reducer as questionReducer };
