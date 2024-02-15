import {  AfterViewInit,  ElementRef,  Injectable,  OnInit,  ViewChild,} from '@angular/core';
import * as B from 'babylonjs';
import 'babylonjs-loaders';
import { OBJFileLoader } from 'babylonjs-loaders';


@Injectable({
  providedIn: 'root',
})
export class BabylonJsService {
  canvas?: HTMLCanvasElement;

  engine?: B.Engine;
  scene?: B.Scene;

  shirtMesh?: B.AbstractMesh;
  colorHex:string = '';

  flgReady: boolean = false;

  cameraMain?: B.ArcRotateCamera;

  constructor() { }

  async Init3dCanvas(canvas: HTMLCanvasElement) {
    if (this.flgReady) return;
    this.canvas = canvas;
    this.engine = new B.Engine(this.canvas, true);
    this.scene = await this.CreateScene();
    this.flgReady = true;

    this.RenderScene();
  }

  LoadShirt = (scene:B.Scene) => {
    const shirtPath:string = 'assets/meshes/shirt1/'
    const shirtTextures: {mesh:string, baseColor: string, normal: string, roughness: string } = { 
      mesh: "shirt.obj",
      baseColor: "shirt_Base_color.png" ,
      normal: "shirt_Normal.png",
      roughness: "shirt_Roughness.png"
    }
    
    OBJFileLoader.OPTIMIZE_WITH_UV = true;
    let shirtMesh: B.AbstractMesh; // Define shirtMesh
    B.SceneLoader.Append(shirtPath, shirtTextures.mesh, scene, function(scene){
      shirtMesh = scene.meshes[scene.meshes.length - 1]; // Assign the last loaded mesh to shirtMesh
      const shirtMaterial = new B.PBRMaterial("shirtMaterial", scene);
      //shirtMaterial.albedoTexture = new B.Texture(shirtPath + shirtTextures.baseColor, scene);
      shirtMaterial.albedoColor = B.Color3.FromHexString('#262626')
      
      shirtMaterial.bumpTexture = new B.Texture(shirtPath + shirtTextures.normal, scene);
      shirtMaterial.metallicTexture = new B.Texture(shirtPath + shirtTextures.roughness, scene);
      shirtMesh.material = shirtMaterial;

      shirtMesh.name = 'shirt'
    })
  
  }

  ChangeShirtColor(color:string){
    const shirtMaterial = this.scene?.getMaterialByName('shirtMaterial');
    if(shirtMaterial)
      (shirtMaterial as B.PBRMaterial).albedoColor = B.Color3.FromHexString(color);
      
  }
  
  RenderScene() {
    if (!this.flgReady) return;
    this.engine!.runRenderLoop(() => this.scene?.render());
    this.scene?.registerBeforeRender(() => {
      var shirt = this.scene?.getMeshByName('shirt');
      if(shirt)
        shirt.rotation.y += 0.01;
    })
  }

  async CreateScene() {
    var scene = new B.Scene(this.engine!);

    var camera = new B.FreeCamera(
      'mainCamera',
      new B.Vector3(0, -7, -180),
      this.scene
    );

    scene.clearColor = new BABYLON.Color4(0, 1, 0, 0);


    this.LoadShirt(scene);

    var light = new B.HemisphericLight('mylight', new B.Vector3(1, 1, 0), this.scene);

    
    return scene;
  }
}
