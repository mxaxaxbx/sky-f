export interface NotificationI {
  id: string;
  type: string;
  color: string;
  title: string;
  message: string;
  closeIn: number;
  seconds: number;
}

export interface NotificationStateI {
  notifications: NotificationI[];
}

export const state: NotificationStateI = {
  notifications: [
    // {
    //   id: '1',
    //   type: 'success',
    //   color: 'green',
    //   title: 'Success',
    //   message: 'This is a success notification.',
    //   closeIn: 3600,
    //   seconds: 0,
    // },
    // {
    //   id: '1',
    //   type: 'warning',
    //   color: 'yellow',
    //   title: 'Warning',
    //   message: 'This is a warning notification.',
    //   closeIn: 3600,
    //   seconds: 0,
    // },
    // {
    //   id: '1',
    //   type: 'error',
    //   color: 'red',
    //   title: 'Error',
    //   message: 'This is a warning notification.',
    //   closeIn: 3600,
    //   seconds: 0,
    // },
    // {
    //   id: '1',
    //   type: 'info',
    //   color: 'blue',
    //   title: 'info',
    //   message: 'This is a warning notification.',
    //   closeIn: 3600,
    //   seconds: 0,
    // },
    // {
    //   id: '1',
    //   type: 'default',
    //   color: 'white',
    //   title: 'default',
    //   message: 'This is a warning notification.',
    //   closeIn: 3600,
    //   seconds: 0,
    // },
  ],
};
