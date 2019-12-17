import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { ImageViewerComponent } from "./image-viewer.component";
import { ImageViewerConfig } from "./image-viewer.model";

@NgModule({
  imports: [CommonModule],
  declarations: [ImageViewerComponent],
  exports: [ImageViewerComponent]
})
export class ImageViewerModule {
  static forRoot(config?: ImageViewerConfig): ModuleWithProviders {
    return {
      ngModule: ImageViewerModule,
      providers: [{ provide: "config", useValue: config }]
    };
  }
}
