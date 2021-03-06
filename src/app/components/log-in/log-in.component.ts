import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {RequestService, ErrorShowService} from '../../services/index';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-log-in',
  templateUrl: 'log-in.component.html',
  styleUrls: ['log-in.component.scss']
})
export class LogInComponent implements OnInit {

  error: any;
  emailMistake: string;
  passwordMistake: string;
  buttonDisabled: boolean;
  oldEmailValue: string = '';
  oldPasswordValue: string = '';
  emailFieldState: boolean = true;
  passwordFieldState: boolean = true;

  email: string = '';
  password: string = '';

  WRONG_E_FORMAT: string;
  PASSWORD_LENGTH: string;
  WRONG_DATA: string;

  constructor(private requestService : RequestService,
              private errorService: ErrorShowService,
              private router: Router,
              private translate: TranslateService) { }

  @ViewChild("inputEmail")
  inputEmail: ElementRef;

  @ViewChild("inputPassword")
  inputPassword: ElementRef;

  ngOnInit() {

    this.translate.get('LOGIN_AND_REGISTER.WRONG_E_FORMAT').subscribe(
        value => {
         this.WRONG_E_FORMAT = value;
          this.emailMistake = this.WRONG_E_FORMAT
        }
    );
    this.translate.get('LOGIN_AND_REGISTER.PASSWORD_LENGTH').subscribe(
        value => {
         this.PASSWORD_LENGTH = value;
          this.passwordMistake = this.PASSWORD_LENGTH
        }
    );
    this.translate.get('LOGIN_AND_REGISTER.WRONG_DATA').subscribe(
        value => {
         this.WRONG_DATA = value;
        }
    );


    this.buttonDisabled = false;
  }



  sendLogInData(regForm: NgForm, event:Event): void {

    event.preventDefault();

    this.requestService.logIn(regForm.value).subscribe(
        data=>{
          this.router.navigateByUrl('/explore');
        },
        error => {
          this.error = error.json();
          console.log(this.error);
          this.handleErrors(this.error)
        }
    )

  }

  handleErrors(error): void {

    this.emailMistake = this.WRONG_DATA;
    this.passwordMistake = this.WRONG_DATA;
    this.errorService.errorShow(this.inputEmail);
    this.errorService.errorShow(this.inputPassword);
    this.emailFieldState = false;
    this.passwordFieldState = false;
    this.buttonDisabled = true;
  }

  changeState(field: string, data: string): void {
    if (this.buttonDisabled){
      if (field === 'email' && data.trim() !== this.oldEmailValue){
        this.oldEmailValue = data;
        this.errorService.errorHide(this.inputEmail);
        this.emailMistake = this.WRONG_E_FORMAT;
        this.emailFieldState = true;
      }

      if (field === 'password' && data.trim() !== this.oldPasswordValue){
        this.oldPasswordValue = data;
        this.errorService.errorHide(this.inputPassword);
        this.passwordMistake = this.PASSWORD_LENGTH;
        this.passwordFieldState = true;
      }
      this.emailFieldState && this.passwordFieldState ? this.buttonDisabled = false : this.buttonDisabled = true;
    }

  }

}
