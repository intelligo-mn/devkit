import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StepperComponent } from "./stepper/stepper.component";
import { ImageViewerComponent } from "./image-viewer/image-viewer.component";

const routes: Routes = [
  { path: "stepper", component: StepperComponent },
  { path: "image-viewer", component: ImageViewerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
