import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Directive,
  ContentChild,
  TemplateRef,
} from '@angular/core';

@Directive({ selector: '[poSectionHeader]' })
export class PoHeaderDirective {}

@Component({
  selector: 'zeus-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSectionComponent {
  @Input() public sectionHeader = '';
  @Input() public backgroundColor = '#FFFFFF';
  @Input() public style: any;
  @Input() public contentStyle: any;
  @ContentChild(PoHeaderDirective, { read: TemplateRef, static: false })
  poHeaderTemplate;
}
