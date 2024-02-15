import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BabylonJsService } from './BabylonJs.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'Shirt3dViewer';
  
  colorHex:string = '#262626'; 
  
  @ViewChild('canvas3d', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  @HostListener('window:resize')

  SetShirtColor(){
    this.babylonJsService.ChangeShirtColor(this.colorHex);
  }
  
  onResize() {
    const canvas = this.canvas.nativeElement;
    canvas.setAttribute('width', `${window.innerWidth}`);
    canvas.setAttribute('height', `100%`);
  }

  constructor(private babylonJsService: BabylonJsService) {}

  ngAfterViewInit(): void {
    if (this.babylonJsService.flgReady) return;
    this.onResize();
    this.babylonJsService.Init3dCanvas(this.canvas.nativeElement);
  }
}
