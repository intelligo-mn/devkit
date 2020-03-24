import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DevStepperModule } from "projects/stepper/src/public-api";
import { ImageViewerModule } from "./../../projects/image-viewer/src/public-api";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { StepperComponent } from "./stepper/stepper.component";
import { ImageViewerComponent } from './image-viewer/image-viewer.component';

@NgModule({
   declarations: [
      AppComponent,
      StepperComponent,
      ImageViewerComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      DevStepperModule,
      ImageViewerModule.forRoot()
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {}
