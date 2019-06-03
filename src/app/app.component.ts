import { Component, OnInit, ViewChild } from '@angular/core';
import { Bubble } from './bubble.component';
import { Line } from './line.component';
import {ch_name, ch_positions, value, value1} from '../app/assets/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Scattor';
  value;
  Viewbubble1: Bubble;
  Viewbubble2: Bubble;
  ViewLine: Line;


  @ViewChild('viewbubble1') viewbubble1;
  @ViewChild('viewbubble2') viewbubble2;
  @ViewChild('viewline') viewline;

  ngOnInit() {
    const values = [];
    value.forEach(ele => {
      values.push(Math.abs(ele));
    });
    this.Viewbubble1 = new Bubble(this.viewbubble1.nativeElement, ch_name, ch_positions, values);
     this.Viewbubble1.render();
     this.Viewbubble2 = new Bubble(this.viewbubble2.nativeElement, ch_name, ch_positions, value1);
     this.Viewbubble2.render();
     this.ViewLine = new Line(this.viewline.nativeElement, ch_name, ch_positions, value);
     this.ViewLine.render();
     // console.log(ch_name, ch_positions);
  }
}
