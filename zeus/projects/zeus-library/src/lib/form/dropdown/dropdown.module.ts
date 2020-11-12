import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { DropdownListComponent } from './dropdown/dropdown-list.component';
import { MultipleSelectComponent } from './multiple-select/multiple-select.component';
import { DropListCustomDirective } from './drop-down.directive';
import { DirectFilterDropdownComponent } from './direct-filter-dropdown/direct-filter-dropdown.component';

@NgModule({
  declarations: [
    DropdownListComponent,
    MultipleSelectComponent,
    DropListCustomDirective,
    DirectFilterDropdownComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule, OverlayPanelModule],
  exports: [DropdownListComponent, MultipleSelectComponent, DropListCustomDirective, DirectFilterDropdownComponent]
})
export class DropdownModule {}
