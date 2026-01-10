export type MailAttachment = {
  fileName: string;
  content?: Buffer | string;
  contentType?: string;
  path?: string;
};

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: MailAttachment[];
  senderName?: string;
  senderEmail?: string;
}
