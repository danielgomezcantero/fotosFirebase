import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item.models';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES= 'img';

    constructor(  private firestore: AngularFirestore  ) {}

    private guardarImagen( imagen: { nombre:string, url:string }){

      this.firestore.collection(`/${this.CARPETA_IMAGENES}`).add( imagen);    

   }



   cargarImagenesFirebase( imagen: FileItem[] ){
     console.log(imagen);

   }




}
