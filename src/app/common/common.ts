import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export const patternWithMessageValidator = (
  regExpPattern: RegExp,
  errorType: string
): ValidatorFn => {
  return (formControl: AbstractControl): ValidationErrors | null => {
    const patternFn = Validators.pattern(regExpPattern);
    const matchResult = patternFn ? patternFn(formControl) : null;
    return matchResult === null
      ? null
      : { [errorType]: { value: formControl.value } };
  };
};

export const validatorWithMessageValidator = (
  fn: Function,
  errorType: string
): ValidatorFn => {
  return (formControl: AbstractControl): ValidationErrors | null => {
    return fn(formControl.value)
      ? null
      : { [errorType]: { value: formControl.value } };
  };
};
