import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Service } from '../../../service';
import { Router } from '@angular/router';

export type AuthMode = 'login' | 'register';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const isRegister = group.get('mode')?.value === 'register';
  if (!isRegister) return null;

  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;


  if (!password || !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  imports: [CommonModule, ReactiveFormsModule,],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(Service)

  private readonly router = inject(Router);
  mode = signal<AuthMode>('login');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  submitting = signal(false);
  statusMessage = signal<string | null>(null);
  isError = signal(false);

  isRegister = computed(() => this.mode() === 'register');

  authForm = this.fb.group(
    {
      mode: ['login' as AuthMode],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: [''],
      language: ["", [Validators.required]],
      rememberMe: [true],
    },
    { validators: passwordMatchValidator }
  );

  constructor() {
    this.applyModeValidators(this.mode());
  }

  switchMode(nextMode: AuthMode): void {
    this.mode.set(nextMode);
    this.authForm.controls.mode.setValue(nextMode);
    this.statusMessage.set(null);
    this.isError.set(false);
    this.showPassword.set(false);
    this.showConfirmPassword.set(false);
    this.applyModeValidators(nextMode);
  }

  private applyModeValidators(currentMode: AuthMode): void {
    const confirmPassCtrl = this.authForm.controls.confirmPassword;

    if (currentMode === 'register') {
      confirmPassCtrl.setValidators([Validators.required]);
    } else {
      confirmPassCtrl.clearValidators();
      confirmPassCtrl.setValue('');
    }

    confirmPassCtrl.updateValueAndValidity({ emitEvent: false });
    this.authForm.updateValueAndValidity({ emitEvent: false });
  }

  // onSubmit(): void {
  //   this.statusMessage.set(null);
  //   this.isError.set(false);

  //   if (this.authForm.invalid) {
  //     this.authForm.markAllAsTouched();
  //     this.isError.set(true);
  //     this.statusMessage.set('Please enter a valid 10-digit mobile number and password.');
  //     return;
  //   }

  //   this.submitting.set(true);
  //   const raw = this.authForm.getRawValue();
  //   const cleanMobile = (raw.mobile || '').trim();

  //   const payload = this.isRegister()
  //     ? {
  //         action: 'register',
  //         mobile: cleanMobile,
  //         password: raw.password,
  //       }
  //     : {
  //         action: 'login',
  //         mobile: cleanMobile,
  //         password: raw.password,
  //         rememberMe: raw.rememberMe,
  //       };

  //   // Replace this simulated timeout with your AuthService HTTP call
  //   setTimeout(() => {
  //     this.submitting.set(false);
  //     this.isError.set(false);
  //     this.statusMessage.set(
  //       this.isRegister()
  //         ? `Account registered for +91 ${cleanMobile}.`
  //         : `Signed in with +91 ${cleanMobile}.`
  //     );
  //     console.log('Auth payload:', payload);
  //   }, 600);
  // }

  onSubmit(): void {
    this.statusMessage.set(null);
    this.isError.set(false);

    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      this.isError.set(true);
      this.statusMessage.set('Please enter a valid 10-digit mobile number and password.');
      return;
    }

    this.submitting.set(true);
    console.log("this.authForm.getRawValue()", this.authForm.getRawValue())
    const { mobile, password, language, rememberMe } = this.authForm.getRawValue();
    const cleanMobile = (mobile || '').trim();
    const cleanPassword = password || '';

    const request$ = this.isRegister()
      ? this.service.register(cleanMobile, cleanPassword, language)
      : this.service.login(cleanMobile, cleanPassword, Boolean(rememberMe));

    request$.subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.isError.set(false);
        this.statusMessage.set(
          res.message ||
          (this.isRegister()
            ? `Account registered for +91 ${cleanMobile}.`
            : `Signed in with +91 ${cleanMobile}.`)
        );
        this.authForm.patchValue({ password: '', confirmPassword: '' });
        this.authForm.markAsPristine();
        this.authForm.markAsUntouched();
        // this.authenticated.emit(res);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.isError.set(true);
        this.statusMessage.set(
          err?.error?.message ||
          (this.isRegister()
            ? 'Unable to complete registration. Please try again.'
            : 'Invalid mobile number or password.')
        );
      },
    });
  }
}
