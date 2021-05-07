export interface IDialogService {
  confirm(message: string): boolean;
}

export default class DialogService implements IDialogService {
  public confirm = (message: string): boolean => window.confirm(message);
}
