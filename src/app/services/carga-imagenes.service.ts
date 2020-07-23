import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item.models';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor(private firestore: AngularFirestore) { }

  private guardarImagen(imagen: { nombre: string, url: string }) {

    this.firestore.collection(`/${this.CARPETA_IMAGENES}`).add(imagen);

  }



  cargarImagenesFirebase(imagenes: FileItem[]) {

    const storageRef = firebase.storage().ref();

    for (const item of imagenes) {

      item.estaSubiendo = true;
      if (item.progreso >= 0) {
        continue;
      }

      const uploadTask: firebase.storage.UploadTask =
        storageRef.child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
          .put(item.archivo);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,

        (error) => console.log('Error al subir el archio', error),
        
        () => {
          console.log('Imagen cargada correctamente');
          item.url = uploadTask.snapshot.downloadURL;
          item.estaSubiendo = false;
          this.guardarImagen({
            nombre: item.nombreArchivo,
            url: item.url
          });

        })


    }
  }




}
