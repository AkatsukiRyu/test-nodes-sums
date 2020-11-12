import { SequenceDiagramComponent } from './sequence-diagram/sequence-diagram.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SequenceDiagramComponent],
  imports: [CommonModule],
  exports: [SequenceDiagramComponent],
})
export class GraphModule {}
