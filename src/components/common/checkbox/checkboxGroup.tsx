import { FC, useCallback, useState } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import FormLabel, { FormLabelProps } from "@material-ui/core/FormLabel";
import FormGroup, { FormGroupProps } from "@material-ui/core/FormGroup";
import FormControlLabel, {
  FormControlLabelProps,
} from "@material-ui/core/FormControlLabel";
import FormControl, { FormControlProps } from "@material-ui/core/FormControl";
import { CheckboxProps } from "@material-ui/core/Checkbox";
import { Checkbox } from "components/styledComponent/checkbox";
import Grid, { GridProps } from "@material-ui/core/Grid";
import FormHelperText, {
  FormHelperTextProps,
} from "@material-ui/core/FormHelperText";
import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Merge, OptionsProps, dependentOptionsFn } from "../types";
import { getLabelFromValues, useOptionsFetcher } from "../utils";

interface extendedFiledProps extends UseFieldHookProps {
  options: OptionsProps[] | dependentOptionsFn;
  label: string;
}

type MyCheckboxMixedProps = Merge<CheckboxProps, extendedFiledProps>;

interface MyCheckboxExtendedProps {
  FormLabelProps?: FormLabelProps;
  FormGroupProps?: FormGroupProps;
  FormControlLabelProps?: FormControlLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  GridProps?: GridProps;
  enableGrid: boolean;
  CircularProgressProps?: CircularProgressProps;
}

export type MyCheckboxGroupAllProps = Merge<
  MyCheckboxMixedProps,
  MyCheckboxExtendedProps
>;

const valueExists = (myValue: any[] | any, value: any) => {
  return Array.isArray(myValue) && myValue.indexOf(value) > -1;
};

const MyCheckboxGroup: FC<MyCheckboxGroupAllProps> = ({
  name: fieldName,
  validate,
  validationRun,
  shouldExclude,
  isReadOnly,
  postValidationSetCrossFieldValues,
  runPostValidationHookAlways,
  dependentFields,
  fieldKey: fieldID,
  label,
  options,
  FormControlProps,
  FormLabelProps,
  FormGroupProps,
  FormHelperTextProps,
  FormControlLabelProps,
  GridProps,
  enableGrid,
  runValidationOnDependentFieldsChange,
  CircularProgressProps,
  ...others
}) => {
  const {
    formState,
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    isSubmitting,
    fieldKey,
    name,
    excluded,
    readOnly,
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    validate,
    validationRun,
    runPostValidationHookAlways,
    postValidationSetCrossFieldValues,
    isReadOnly,
    shouldExclude,
    runValidationOnDependentFieldsChange,
  });
  const [_options, setOptions] = useState<OptionsProps[]>([]);

  const getLabelFromValuesForOptions = useCallback(
    (values) => getLabelFromValues(_options)(values),
    [_options]
  );

  const handleChangeInterceptor = useCallback(
    (e) => {
      const value = typeof e === "object" ? e?.target?.value ?? "" : e;
      let result = getLabelFromValuesForOptions(value);
      handleChange(e, result[0] as any);
    },
    [handleChange, getLabelFromValuesForOptions]
  );
  const { loadingOptions } = useOptionsFetcher(
    formState,
    options,
    setOptions,
    handleChangeInterceptor,
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation
  );

  if (excluded) {
    return null;
  }
  const isError = touched && (error ?? "") !== "";
  const checkboxes = _options.map((checkbox) => (
    <FormControlLabel
      {...FormControlLabelProps}
      control={
        <Checkbox
          {...others}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
        />
      }
      key={checkbox.value}
      name={name}
      onChange={handleChangeInterceptor}
      label={checkbox.label}
      value={checkbox.value}
      checked={valueExists(value, checkbox.value)}
    />
  ));
  const result = (
    // @ts-ignore
    <FormControl
      {...FormControlProps}
      key={fieldKey}
      component="fieldset"
      disabled={isSubmitting}
      error={isError}
      onBlur={handleBlur}
    >
      <FormLabel {...FormLabelProps} component="label">
        {label}
      </FormLabel>
      <FormGroup {...FormGroupProps}>
        {loadingOptions ? (
          <InputAdornment position="end">
            <CircularProgress
              color="primary"
              variant="indeterminate"
              {...CircularProgressProps}
            />
          </InputAdornment>
        ) : (
          checkboxes
        )}
      </FormGroup>
      {isError ? (
        <FormHelperText {...FormHelperTextProps}>{error}</FormHelperText>
      ) : null}
    </FormControl>
  );

  if (Boolean(enableGrid)) {
    return (
      <Grid {...GridProps} key={fieldKey}>
        {result}
      </Grid>
    );
  } else {
    return result;
  }
};

export default MyCheckboxGroup;
