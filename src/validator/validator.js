import Ajv from 'ajv';
import error_messages from './errorMessages';
import { config } from '../api/callApi';

const ajv = new Ajv({
  removeAdditional: 'all',
  validateSchema: false,
  additionalProperties: false,
  jsonPointers: true,
  messages: false,
  $data: true,
  allErrors: true,
});

const validation = (service, action, data = {}) => {
  const conf = config.value;
  const configArray = Object.entries(conf);

  const [id, settings] = configArray.find((element) => {
    // eslint-disable-next-line no-unused-vars
    const [key, properties] = element;
    return properties.service === service && properties.action === action;
  }) || [];

  if (!settings) {
    throw new Error('Endpoint doesn\'t exist   ' + service + '-' + action);
  }

  const { validator } = settings;
  const is_error = !ajv.validate(validator, data);
  const { errors } = ajv;

  // console.log(validator)


  const error_list = (errors || []).map((error) => ({
    keyword: error.keyword,
    message: error_messages[error.keyword] || 'Wrong value',
    field: error.params.missingProperty || (error.dataPath || []).split('/')[1]
  }));

  return {
    is_err: is_error,
    error_list
  };
};

const getErrors = (field, validation) => {
  if (validation) {
    const current = validation.find((i) => i.field === field);
    if(current?.field === 'password' || current?.field === 'password_confirm') {
      return error_messages.password
    } else return current?.message;
  }
  return null;
};

import { ref, watch } from 'vue';

const useValidator = (body = {}, service, action) => {

  const is_error = ref(true);
  const error = ref({});
  const server_error = ref(false);

  const validateNow = () => (validate(false, true));

  const validate = (one_field = false, last_validate = false) => {
    const {
      is_err,
      error_list
    } = validation(
      service,
      action,
      body.value
    );

    is_error.value = is_err;
    if (one_field) {
      error.value[one_field] = getErrors(one_field, error_list);
    } else {
      Object.keys(last_validate ? body.value : error.value)
        .forEach((key) => {
          error.value[key] = getErrors(key, error_list);
        });
    }
    return is_error;
  };

  watch(
    () => body.value,
    () => {
      validate(false);
    },
    { deep: true }
  );

  return {
    is_error,
    error,
    server_error,
    validateNow,
    validate,
  };
};


export default useValidator;
