import React, { useMemo, useState } from "react";
import { useFetch } from "../../../api/api";
import { useParams } from "react-router-dom";
import SchoolFeeSupportForm1 from "./SchoolFeeSupportForm1";
import SchoolFeeSupportForm2 from "./SchoolFeeSupportForm2";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  Paper,
  Card,
  Stepper,
  Step,
  StepLabel,
  ButtonGroup,
  Radio,
  StepConnector,
  FormControlLabel,
} from "@material-ui/core";

const SettlementEdit = React.memo((props) => {
  const params = useParams();
  const classes = useStyle();
  const [hidden, setHidden] = useState(params?.id ? true : false);
  const dataForm = useFetch([
    params.id ? "get" : null,
    "/admin/schoolFeeSupport/" + params.id,
  ]);
  const [type, setType] = useState();
  const steps = [
    "Danh sách yêu cầu hỗ trợ học phí",
    "Thêm mới danh sách yêu cầu hỗ trợ học phí",
  ];
  const [activeStep, setActiveStep] = useState(0);
  const test = async (type1) => {
    setHidden(true);
    setType(type1);
    setActiveStep(1);
  };
  function handleBack() {
    if (activeStep > 0) {
      setActiveStep(0);
      setHidden(false);
      setType(0);
    }
  }
  const SettlementRender = useMemo(() => {
    return (
      <div>
        {!params?.id && (
          <Card className="settlement-form-layout">
            <ButtonGroup
              style={{ paddingTop: 20, paddingBottom: 20, marginBottom: 10 }}
            >
              {activeStep === 1 && (
                <Button variant="contained" onClick={handleBack}>
                  Quay lại
                </Button>
              )}
            </ButtonGroup>
            <div>
              <div>
                <Stepper
                  style={{ justifyContent: "center" }}
                  connector={<StepConnector style={{ maxWidth: 200 }} />}
                  activeStep={activeStep}
                >
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel
                          className={classes.steplabel}
                          {...labelProps}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </div>
            </div>
            {hidden === false && activeStep === 0 && (
              <div style={{ display: "grid" }}>
                <FormControlLabel
                  className={classes.FormControlLabel}
                  style={{ fontSize: 16 }}
                  variant="contained"
                  control={<Radio />}
                  color="primary"
                  label={
                    <span style={{ fontSize: 17 }}>
                      Danh sách người lao động đề nghị hỗ trợ học phí
                    </span>
                  }
                  onClick={() => test(1)}
                />
                <FormControlLabel
                  variant="contained"
                  color="secondary"
                  control={<Radio />}
                  onClick={() => test(2)}
                  label="Danh sách người lao động đề nghị hỗ trợ học phí(theo trương trình thí điểm)"
                />
              </div>
            )}
          </Card>
        )}
        <div>
          {type === 1 && <SchoolFeeSupportForm1 />}
          {type === 2 && <SchoolFeeSupportForm2 />}
        </div>
        {dataForm?.data?.school_fee_support[0]?.certificate_code && (
          <SchoolFeeSupportForm1 />
        )}
        {!dataForm?.data?.school_fee_support[0]?.certificate_code &&
          params?.id && <SchoolFeeSupportForm2 />}
      </div>
    );
  });
  return SettlementRender;
});

const useStyle = makeStyles((theme) => ({
  LaborsTable: {
    "& td": {
      verticalAlign: "top",
    },
  },
  headerList: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  input: {
    display: "none",
  },
  formExcelBtn: {
    backgroundColor: "#24ba00",
    color: "#FFF",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#219106",
    },
  },
  steplabel: {
    "& span": {
      fontSize: "1rem",
      "& span": {
        fontSize: 21,
      },
    },
  },
  input1: {
    "& input": {
      padding: 4,
      textAlign: "right",
    },
    "& p": {
      fontSize: 13,
      marginBottom: 8,
    },
  },
}));
export default SettlementEdit;
