import { BehaviorSubject } from 'rxjs';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Directive,
  ContentChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';

type State = 'Edit' | 'Read';

@Directive({ selector: '[poReadonly]' })
export class ReadOnlyElementDirective {}

@Directive({ selector: '[poControl]' })
export class ControlDirective {}

@Component({
  selector: 'zeus-inplace',
  templateUrl: './inplace-control.component.html',
  styleUrls: ['./inplace-control.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InplaceControlComponent {
  @ContentChild(ReadOnlyElementDirective, { read: TemplateRef, static: false })
  public readTemplate;

  @ContentChild(ControlDirective, { read: TemplateRef, static: false })
  public controlTemplate;
  public state$ = new BehaviorSubject<string>('Read');
  public onLoading$ = new BehaviorSubject<boolean>(false);

  @Input() public name: string;
  @Input() public index: number;
  @Input() public onConfirmFn: (...vas: any) => Promise<any>;
  @Input() public editButtonTitle = 'Edit';
  @Input() public vAlign: boolean;
  @Input() public allowEdit = true;

  @Output() public dismiss = new EventEmitter();

  public constructor(private elementRef: ElementRef) {}

  public changeMode(mode: State, dismiss?: boolean): void {
    this.state$.next(mode);

    dismiss && this.dismiss.emit();
  }

  public confirm(): void {
    this.onLoading$.next(true);
    this.state$.next('Read');
    this.onConfirmFn(this.index).then((result) => {
      this.onLoading$.next(false);
    });
  }
}
