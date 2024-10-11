import { Routes } from '@angular/router';
import {AuthorizationComponent} from "./authorization/authorization.component";
import {RegistrationComponent} from "./registration/registration.component";
import {
  PasswordRecoveryComponent
} from "./password-recovery/password-recovery.component";
import {MainComponent} from "./main/main.component";
import {
  RegistrationEmailConfirmationComponent
} from "./registration-email-confirmation/registration-email-confirmation.component";
import {
  PasswordRecoveryEmailVerificationComponent
} from "./password-recovery-email-verification/password-recovery-email-verification.component";
import {PersonalAccountComponent} from "./personal-account/personal-account.component";

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'authorization', component: AuthorizationComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  { path: 'registration/email-verification', component:RegistrationEmailConfirmationComponent },
  { path: 'password-recovery/email-verification', component:PasswordRecoveryEmailVerificationComponent },
  { path: 'personal-account', component:PersonalAccountComponent },
];
