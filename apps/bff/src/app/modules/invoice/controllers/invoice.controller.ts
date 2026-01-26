import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInvoiceRequestDto, InvoiceResponseDto } from '@common/interfaces/gateway/invoice';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import {
  CreateInvoiceTcpRequest,
  InvoiceTcpResponse,
  type SendInvoiceTcpRequest,
} from '@common/interfaces/tcp/invoice';
import { ProcessId } from '@common/decorators/processId.decorator';
import { map } from 'rxjs';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { Permissions } from '@common/decorators/permission.decorator';
import { PERMISSION } from '@common/constants/enum/role.enum';
import { UserData } from '@common/decorators/user-data.decorator';
import type { AuthorizedMetadata } from '@common/interfaces/tcp/authorizer';
@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_CREATE])
  create(@Body() body: CreateInvoiceRequestDto, @ProcessId() processId: string) {
    return this.invoiceClient
      .send<InvoiceTcpResponse, CreateInvoiceTcpRequest>(TCP_REQUEST_MESSAGE.INVOICE.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Post(':id/send')
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Send invoice by id' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_SEND])
  send(@Param('id') id: string, @ProcessId() processId: string, @UserData() userData: AuthorizedMetadata) {
    return this.invoiceClient
      .send<string, SendInvoiceTcpRequest>(TCP_REQUEST_MESSAGE.INVOICE.SEND, {
        data: { invoiceId: id, userId: userData.userId },
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get()
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'get all invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_GET_ALL])
  getAll(@ProcessId() processId: string) {
    return this.invoiceClient
      .send<string>(TCP_REQUEST_MESSAGE.INVOICE.GET_ALL, {
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
