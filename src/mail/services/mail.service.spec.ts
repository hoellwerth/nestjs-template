import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { mockUser } from '../../user/services/user.service.spec';

export class MailServiceMock {
  static sendUserConfirmation = jest.fn().mockResolvedValue(true);
  static sendUserInformation = jest.fn().mockResolvedValue(true);
  static sendForgetPassword = jest.fn().mockResolvedValue(true);
  static sendPasswordInfo = jest.fn().mockResolvedValue(true);
}

describe('UserService', () => {
  let mailService: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  it('should be defined', () => {
    expect(mailerService).toBeDefined();
  });

  it('should send a userConfirmation', async () => {
    const mail = jest.spyOn(mailService, 'sendUserConfirmation');
    const spy = jest.spyOn(mailerService, 'sendMail');

    await mailService.sendUserConfirmation(mockUser());

    expect(mail).toBeCalled();

    expect(spy).toBeCalled();
  });

  it('should send a userInformation', async () => {
    const mail = jest.spyOn(mailService, 'sendUserInformation');
    const spy = jest.spyOn(mailerService, 'sendMail');

    await mailService.sendUserInformation(mockUser());

    expect(mail).toBeCalled();

    expect(spy).toBeCalled();
  });

  it('should send a forgot password mail', async () => {
    const mail = jest.spyOn(mailService, 'sendForgetPassword');
    const spy = jest.spyOn(mailerService, 'sendMail');

    await mailService.sendForgetPassword(mockUser(), 'token');

    expect(mail).toBeCalled();

    expect(spy).toBeCalled();
  });

  it('should send a forgot password info', async () => {
    const mail = jest.spyOn(mailService, 'sendPasswordInfo');
    const spy = jest.spyOn(mailerService, 'sendMail');

    await mailService.sendPasswordInfo(mockUser());

    expect(mail).toBeCalled();

    expect(spy).toBeCalled();
  });
});
