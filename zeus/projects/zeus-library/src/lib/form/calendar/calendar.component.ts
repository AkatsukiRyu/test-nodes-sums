import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Directive,
  ContentChild,
  TemplateRef,
  forwardRef,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Calendar } from 'primeng/calendar';

const CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true
};

@Directive({ selector: '[pDateTemplate]' })
export class PDateTemplateDirective { }

@Component({
  selector: 'poseidon-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass'],
  providers: [CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements ControlValueAccessor, AfterViewInit {
  @Input() public showTime = false;
  @Input() public hourFormat = 24;
  @Input() public min: Date;
  @Input() public max: Date;
  @Input() public yearRange = '1980:2050';
  @Input() public appendTo: string;
  @Input() public set disabled(d: boolean) {
    this.disabled$.next(d);
  }
  @Input() public set value(val: Date) {
    this.writeValue(val);
  }

  @Output() public dateChange = new EventEmitter<Date>();

  public disabled$ = new BehaviorSubject<boolean>(false);

  @ContentChild(PDateTemplateDirective, { static: true, read: TemplateRef })
  public poseidonDateTemplate;

  @ViewChild('primeCalendar', { static: false })
  public primeCalendar: Calendar;

  private _date: Date;

  public onchange = (value: Date) => { };
  public onTouched = () => { };

  public constructor() { }

  public ngAfterViewInit(): void {
    this.primeCalendar.value = this.date;
    this.primeCalendar.updateInputfield();
  }

  public get date(): Date {
    return this._date;
  }

  public set date(date: Date) {
    if (this._date && date && date.getTime() - this._date.getTime() !== 0) {
      this.dateChange.emit(this._date);
    }

    this._date = date;
    this.onchange(date);
    this.onTouched();
  }

  public onSelectDate(date: Date): void {
    this.date = date;
  }

  public writeValue(value: Date): void {
    if (this.primeCalendar) {
      this.primeCalendar.value = value;
      this.primeCalendar.updateInputfield();
    }

    this.date = value;
  }

  public registerOnChange(fn: () => void): void {
    this.onchange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public toggleCalendar(): void {
    this.primeCalendar.toggle();
  }
}
