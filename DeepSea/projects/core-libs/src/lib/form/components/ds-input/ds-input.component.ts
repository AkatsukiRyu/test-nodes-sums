import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

const CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DsInputComponent),
  multi: true
};

@Component({
  selector: 'deepSea-input',
  templateUrl: './ds-input.component.html',
  styleUrls: ['./ds-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsInputComponent implements ControlValueAccessor {
  @ViewChild('dsTyping', { static: false })
  public inputElement: ElementRef;

  @Input('value') public set _val(_v) {
    this._value = _v;
  }
  @Input() public type: 'text' | 'password' | 'number';
  @Input() public label: string;

  @Output() public valueChanges = new EventEmitter();

  public onChange: any = (value: any) => { };
  public onTouched: any = () => { };

  private _value: string;

  public get value() {
    return this._value;
  }

  public set value(_val: string) {
    this._value = _val;

    this.valueChanges.emit(_val);
    this.onChange(_val);
    this.onTouched();
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @HostListener('window:keyup', ['$event'])
  public onKeyDown(keyboard: KeyboardEvent) {
    this.value = this.inputElement.nativeElement.value;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

}
