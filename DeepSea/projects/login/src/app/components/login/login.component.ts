import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbleUnsubscribe, untilDestroyed } from '@app/cores';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'deepSea-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@AbleUnsubscribe()
export class LoginFormComponent implements OnInit {

  public loginForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

}
