/**
 * This module for collecting all kind of controls in form
 * and make the core of thess controls
 *
 *  BE AWARENESS: this kind module in core to public and use for crossing application.
 */

import { NgModule } from '@angular/core';
import { DSFormModule } from './form';

@NgModule({
  declarations: [],
  imports: [DSFormModule],
  exports: [DSFormModule],
})
export class CoreLibsModule { }
