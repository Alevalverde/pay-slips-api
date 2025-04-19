export const errors = {
  general: {
    date: {
      invalid: {
        key: 'general.date.invalid',
        message: 'La fecha es inválida.',
        message_eng: 'Date is not valid.',
        status: 400,
      },
    },
    time: {
      invalid: {
        key: 'general.time.invalid',
        message: 'La hora es inválida.',
        message_eng: 'Time is not valid.',
        status: 400,
      },
    },
    item: {
      already_exist: {
        key: 'general.item.already_exist',
        message: 'El ítem ya existe.',
        message_eng: 'This item already exists.',
        status: 400,
      },
      not_exist: {
        key: 'general.item.not_exist',
        message: 'El ítem no existe.',
        message_eng: 'This item does not exist.',
        status: 404,
      },
    },
  },
  pay_slip: {
    not_exist: {
      key: 'pay_slip.not_exist',
      message: 'El bono de sueldo solicitado no existe.',
      message_eng: 'This pay slip does not exist.',
      status: 404,
    },
    invalid_url: {
      key: 'pay_slip.invalid_url',
      message: 'La URL del bono de sueldo es inválida.',
      message_eng: 'The pay slip URL is not valid.',
      status: 400,
    },
  },
  document_upload: {
    invalid_document_type: {
      key: 'document_upload.invalid_document_type',
      message: 'El tipo de documento no es válido.',
      message_eng: 'Document types not valid.',
      status: 400,
    },
    invalid_document_size: {
      key: 'document_upload.invalid_document_size',
      message: 'El tamaño del documento es mayor al permitido.',
      message_eng: 'Document size exceeds the maximum allowed.',
      status: 400,
    },
    invalid: {
      key: 'document_upload.invalid',
      message: 'No hay archivos para subir.',
      message_eng: 'No files were uploaded.',
      status: 400,
    },
  },
  user: {
    not_found: {
      key: 'user.not_found',
      message: 'El usuario no existe.',
      message_eng: 'User not found.',
      status: 404,
    },
    duplicate: {
      key: 'user.duplicate',
      message: 'El cuil que intenta ingresar ya existe.',
      message_eng: 'The cuil you are trying to enter already exists.',
      status: 400,
    },
  },
  login: {
    accounts: {
      unauthorized: {
        key: 'login.accounts.unauthorized',
        message: 'Credenciales inválidas.',
        message_eng: 'Invalid credentials.',
        status: 401,
      },
      invalidInput: {
        key: 'login.accounts.invalidInput',
        message: 'CUIL o contraseña no proporcionados.',
        message_eng: 'CUIL or password not provided.',
        status: 400,
      },
      passwordTooLong: {
        key: 'login.accounts.passwordTooLong',
        message: 'La contraseña excede la longitud máxima permitida.',
        message_eng: 'Password exceeds maximum allowed length.',
        status: 400,
      },
      userNotFound: {
        key: 'login.accounts.userNotFound',
        message: 'Usuario no encontrado.',
        message_eng: 'User not found.',
        status: 404,
      },
    },
  },
};
