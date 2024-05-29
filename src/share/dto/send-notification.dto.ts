export class SendEmailDto {
  NotificationType: string;
  SendType: string;
  Recipients: EmailDto[];
  Parameters: any;
}

export class EmailDto {
  Name: string;
  Email?: string;
  UserCompanyID?: string;
  UserID?: string;
}
